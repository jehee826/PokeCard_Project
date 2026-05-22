package com.example.back.Controller;


import com.example.back.DTO.AuthRequest;
import com.example.back.DTO.AuthResponse;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.Entity.MarketPlaceImageEntity;
import com.example.back.Entity.UsersEntity;
import com.example.back.Repository.UsersRepository;
import com.example.back.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j //로그찍기
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor // 아래 final변수 두개 생성자 자동주입
public class AuthController {

    private final UsersRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    // 회원가입 컨트롤러
    @PostMapping("/signup")
    public ResponseEntity<?> join   (@RequestBody AuthRequest request) {
        //중복검사
        if (userRepository.findByLoginId(request.getLoginId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("이미 사용 중인 이메일입니다.");
        }
        //Entity 변환
        UsersEntity newUser = request.toEntity();
        try {
            userRepository.save(newUser);
            AuthResponse response = new AuthResponse(null, "회원가입이 완료되었습니다.", null);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // DB 제약조건 위반 등 예외 발생 시 오류뱉음
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원가입 중 오류가 발생했습니다.");
        }
    }

    // 로그인 컨트롤러
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        // LoginId를 통해 DB에 등록된 유저인지 확인
        return userRepository.findByLoginId(request.getLoginId())
                .map(user -> {
                    if (user.getPassword().equals(request.getPassword())) {

                        // 로그인 성공 시 토큰 생성
                        String token = jwtTokenProvider.generateToken(user.getLoginId());
                        AuthResponse response = new AuthResponse(token, "로그인 성공", user.getLoginId());
                        log.info("로그인 응답 데이터: {}", response.toString());
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 혹은 비밀번호가 틀렸습니다.");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 사용자입니다."));
    }
    /** 내 페이지 컨트롤러 */
    @PostMapping("/mypage")
    public ResponseEntity<?> myPage(@RequestHeader("Authorization") String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false); // 토큰 없으면 당연히 찜 아님
        }
        String token = authHeader.substring(7);

        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        UsersEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("인증된 유저를 찾을 수 없습니다."));
        log.info("보낸 유저 정보: {}", user);
        return ResponseEntity.ok(user);
    }

    @Transactional
    @PostMapping("/updatemypage")
    public ResponseEntity<?> updateMyPage(@RequestHeader("Authorization") String authHeader, @ModelAttribute AuthRequest userDTO){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false); // 토큰 없으면 당연히 찜 아님
        }
        String token = authHeader.substring(7);
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        UsersEntity originUser = userRepository.findByLoginId(loginId)
                                                .orElseThrow(() -> new RuntimeException("인증된 유저를 찾을 수 없습니다."));
        originUser.setEmail(userDTO.getEmail());
        originUser.setPassword(userDTO.getPassword());
        originUser.setNickname(userDTO.getNickname());

        // 💡 기존 장터 로직: editDTO.getImages() != null && !editDTO.getImages().isEmpty()
        // 유저 프로필도 DTO 안에 묶여서 들어오는 파일 객체(images 또는 profileImage)의 존재 여부를 검증합니다.
        if (userDTO.getImages() != null && !userDTO.getImages().isEmpty()) {
            String uploadDir = "C:/pokemon/";

            // 💡 기존 로직의 로컬 파일 삭제 흐름 그대로 반영
            // 유저 프로필은 단일 문자열이므로 리스트 루프 대신 if문으로 바로 처리합니다.
            if (originUser.getProfileImgUrl() != null && !originUser.getProfileImgUrl().isEmpty()) {
                File oldFile = new File(uploadDir + originUser.getProfileImgUrl());
                if (oldFile.exists()) {
                    oldFile.delete(); // 기존 로컬 파일 삭제
                }
                // 유저 프로필은 이미지 테이블이 따로 없고 Users 테이블의 컬럼이므로 레포지토리 delete는 하지 않습니다.
            }

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // 💡 기존 장터 로직의 파일 저장 및 데이터 매핑 흐름 그대로 반영
            // 프로필은 단일 파일이므로 기존 List<MultipartFile> 대신 단일 MultipartFile로 다룹니다.
            MultipartFile file = userDTO.getImages();
            String originalFileName = file.getOriginalFilename();
            String savedFileName = "userProfile/" + UUID.randomUUID().toString() + "_" + originalFileName;

            try {
                // 로컬 디렉토리에 파일 물리 저장 (기존 코드와 동일)
                file.transferTo(new File(uploadDir + savedFileName));

                // 💡 기존 장터 로직에서는 새 엔티티를 빌더로 만들어 save() 했지만,
                // 유저 프로필은 영속 상태인 originUser의 필드 값만 세터로 변경하면 자동으로 DB에 반영(더티 체킹)됩니다.
                originUser.setProfileImgUrl(savedFileName);

            } catch (IOException e) {
                throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
            }
        }

        return ResponseEntity.ok("유저정보 업데이트 완료.");
    }
}