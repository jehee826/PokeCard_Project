
package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.management.relation.Role;
import java.time.LocalDateTime;

@Entity //엔티티 선언
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="UserEntity")
@Getter // private 된 함수들을 외부로 알아서 꺼내 쓸 수 있게 해줌
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 로그인 아이디로 사용

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호 저장

    @Column(nullable = false, length = 20)
    private String nickname; // 장터에서 활동할 이름

    @Column(length = 15)
    private String phoneNumber; // 연락처

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private Role role; // 권한 (USER, ADMIN 등)

    @Column(nullable = false)
    private LocalDateTime createdAt; // 가입일

    // --- 비즈니스 로직 (수정 메서드) ---

    // 유저 정보 수정 (더티 체킹 활용)
    public void updateProfile(String nickname, String phoneNumber) {
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
    }

    // 가입 시 생성 시간 자동 설정
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
