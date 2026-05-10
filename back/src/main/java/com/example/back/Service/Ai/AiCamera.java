package com.example.back.Service.Ai;

import com.example.back.Repository.UsersRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AiCamera {

    public class CustomUserDetailsService implements UserDetailsService {

        private final UsersRepository usersRepository;

        public CustomUserDetailsService(UsersRepository usersRepository) {
            this.usersRepository = usersRepository;
        }

        @Override
        public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
            // DB에서 loginId 컬럼으로 유저를 찾음
            log.info("로그인 시도 아이디: {}", loginId);
            return usersRepository.findByLoginId(loginId)
                    .map(user -> User.builder()
                            .username(user.getLoginId()) // Security가 알 수 있게 ID 세팅
                            .password(user.getPassword()) // 암호화된 PW 세팅
                            .roles("USER")                // 권한 세팅
                            .build())
                    .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + loginId));


        }
    }
}
