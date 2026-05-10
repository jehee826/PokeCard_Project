package com.example.back.Security;

import com.example.back.Repository.UsersRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;


    @Lazy
    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = getJwtFromRequest(request);

        // 토큰이 있고 유효한지 확인
        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {

            // 토큰에서 로그인 ID 추출
            String username = tokenProvider.getLoginIdFromToken(token);

            // 서비스 로직을 통해 DB에서 UserDetails(신분증) 가져오기
            // 이 과정이 있어야 컨트롤러의 @AuthenticationPrincipal이 채워짐

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails != null) {
                // 추출한 UserDetails를 담아 진짜 신분증(Authentication) 생성
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, // 문자열이 아닌 UserDetails 객체가 들어감
                        null,
                        userDetails.getAuthorities() // DB에 저장된 실제 권한 사용
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 5. 시큐리티 금고에 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}