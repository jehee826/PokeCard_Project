
package com.example.back.DTO;

import com.example.back.Entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuthRequest {

    private String email;
    private String loginId;
    private String password;
    private String nickname;
    private String profileImgUrl;

    public UserEntity toEntity() {
        return UserEntity.builder()
                .email(this.email)
                .loginId(this.loginId)
                .password(this.password) // 암호화된 비밀번호를 넣어야 함
                .nickname(this.nickname)
                .profileImgUrl(this.profileImgUrl)
                .build();
    }

}