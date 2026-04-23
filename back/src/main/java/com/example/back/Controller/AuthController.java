package com.example.back.Controller;


import com.example.back.DTO.AuthRequest;
import com.example.back.DTO.AuthResponse;
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

    // 가짜 DB
    private static final Map<String, String> mockDatabase = new HashMap<>();
    static {
        mockDatabase.put("123", "123");
    }

    // 1. 회원가입 테스트 API (기존 유지)
    @PostMapping("/signup")
    public ResponseEntity<?> join(@RequestBody AuthRequest request) {
        // ... 기존 코드와 동일 ...
        return ResponseEntity.ok(new AuthResponse(null, "가입 완료", UUID.randomUUID().toString()));
    }

    // 2. 로그인 API (실제 DB 연동으로 수정)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // [수정] 대문자 UserRepository -> 소문자 userRepository (객체 참조)
        return userRepository.findByEmail(request.getEmail())
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