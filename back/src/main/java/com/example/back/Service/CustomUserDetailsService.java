package com.example.back.Service;


import com.example.back.Repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service // 👈 이제 스프링 시큐리티가 이 서비스를 정상적으로 인식합니다!
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        log.info("로그인 시도 아이디: {}", loginId);

        // DB에서 loginId 컬럼으로 유저를 찾음
        return usersRepository.findByLoginId(loginId)
                .map(user -> User.builder()
                        .username(user.getLoginId())
                        .password(user.getPassword())
                        .roles("USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + loginId));
    }
}