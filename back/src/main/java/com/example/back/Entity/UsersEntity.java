
package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity //엔티티 선언
@Table (name = "users")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="UserEntity")
@Getter // private 된 함수들을 외부로 알아서 꺼내 쓸 수 있게 해줌
public class UsersEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "login_id", nullable = false, unique = true, length = 100)
    private String loginId;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    @Column(name = "profile_img_url", length = 2048)
    private String profileImgUrl;

    @Column(length = 20)
    private String tier;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 유저 정보 수정 (더티 체킹 활용)
    public void updateProfile(String nickname, String profileImgUrl) {
        this.nickname = nickname;
        this.profileImgUrl = profileImgUrl;
    }

    // 가입 시 생성 시간 자동 설정
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.tier == null) this.tier = "BRONZE"; // 초기 등급 설정
    }
}
