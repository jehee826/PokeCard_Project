package com.example.back.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 이 클래스가 설정 파일임을 스프링에 알림
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 브라우저에서 /upload/images/ 로 시작하는 주소로 요청하면
        registry.addResourceHandler("/upload/images/**")
                // 로컬 하드디스크의 C:/upload/pokemon/ 폴더에서 파일을 찾아줌
                .addResourceLocations("file:///C:/upload/pokemon/");
    }
}