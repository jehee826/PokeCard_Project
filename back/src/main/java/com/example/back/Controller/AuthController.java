package com.example.back.Controller;


import com.example.back.DTO.AuthRequest;
import com.example.back.DTO.AuthResponse;
import com.example.back.Entity.UserEntity;
import com.example.back.Repository.UserRepository;
import com.example.back.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor // 아래 final변수 두개 생성자 자동주입
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    // 회원가입 컨트롤러
    @PostMapping("/signup")
    public ResponseEntity<?> join(@RequestBody AuthRequest request) {
        //중복검사
        if (userRepository.findByLoginId(request.getLoginId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("이미 사용 중인 이메일입니다.");
        }

        UserEntity newUser = request.toEntity();
        try {
            userRepository.save(newUser);
            AuthResponse response = new AuthResponse(null, "회원가입이 완료되었습니다.", null);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // DB 제약조건 위반 등 예외 발생 시
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원가입 중 오류가 발생했습니다.");
        }
    }

    // 로그인 컨트롤러
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // [수정] 대문자 UserRepository -> 소문자 userRepository (객체 참조)
        return userRepository.findByLoginId(request.getLoginId())
                .map(user -> {
                    if (user.getPassword().equals(request.getPassword())) {

                        // 로그인 성공 시 토큰 생성
                        String token = tokenProvider.generateToken(user.getEmail());

                        return ResponseEntity.ok(new AuthResponse(token, "로그인 성공", user.getId().toString()));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 틀렸습니다.");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 사용자입니다."));
    }
}