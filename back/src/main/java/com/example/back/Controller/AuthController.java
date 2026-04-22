package com.example.back.Controller;


import com.example.back.DTO.AuthRequest;
import com.example.back.DTO.AuthResponse;
import com.example.back.Security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/api/public")
public class AuthController {

    private final JwtTokenProvider tokenProvider;

    // 가짜 DB 역할을 할 Map (서버 메모리에 임시 저장)
    // Key: 아이디(username), Value: 비밀번호(password)
    private static final Map<String, String> mockDatabase = new HashMap<>();

    public AuthController(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
        // 기존 로그인 테스트를 위해 미리 데이터 하나를 넣어둡니다.
        mockDatabase.put("123", "123");
    }

    // ==========================================
    // 1. 회원가입 테스트 API
    // ==========================================
    @PostMapping("/signup")
    public ResponseEntity<?> join(@RequestBody AuthRequest request) {
        String requestedId = request.getUsername();
        String requestedPw = request.getPassword();

        // [핵심 1] 유니크한 ID인지 판별 (가짜 DB 조회)
        if (mockDatabase.containsKey(requestedId)) {
            // 이미 존재하는 아이디라면 409 Conflict 에러 반환
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("이미 사용 중인 아이디입니다.");
        }

        // [핵심 2] 임의로 값을 할당하고 가짜 DB에 저장
        mockDatabase.put(requestedId, requestedPw);

        // (DB 저장을 흉내 내기 위해 임의의 데이터 생성)
        String mockUserNumber = UUID.randomUUID().toString(); // 임의의 고유 회원번호
        String mockRole = "ROLE_USER"; // 임의의 권한

        // [핵심 3] 회원가입 성공 즉시 기존 토큰 제공자를 호출하여 토큰 발행
        String token = tokenProvider.generateToken(requestedId);

        // 결과 반환 (React 프론트엔드에서 받아서 처리할 데이터)
        AuthResponse response = new AuthResponse(null, "회원가입이 완료되었습니다.", mockUserNumber);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 2. 로그인 테스트 API (가짜 DB 연동으로 수정)
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String requestedId = request.getUsername();
        String requestedPw = request.getPassword();

        // 가짜 DB에 아이디가 존재하고, 비밀번호가 일치하는지 확인
        if (mockDatabase.containsKey(requestedId) && mockDatabase.get(requestedId).equals(requestedPw)) {

            // 로그인 성공: 토큰 발행
            String token = tokenProvider.generateToken(requestedId);
            AuthResponse response = new AuthResponse(token, "로그인에 성공했습니다.", null);
            return ResponseEntity.ok(response);

        } else {
            // 로그인 실패: 401 Unauthorized 에러 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("아이디 또는 비밀번호가 틀렸습니다.");
        }
    }
}