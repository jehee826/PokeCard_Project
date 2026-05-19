package com.example.back.Controller.WebSocket;

import com.example.back.DTO.WebSocket.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


    @RestController
    @RequestMapping("/api/chat")
    @RequiredArgsConstructor
    public class AlarmController {

        private final SimpMessagingTemplate template;

        @PostMapping("/request")
        public ResponseEntity<String> requestChat(@RequestBody ChatMessageDto request) {
            // 1. 필요하다면 여기서 DB에 방을 생성하거나 첫 메시지를 저장하는 로직 수행

            // 2. 받는 사람(상대방)의 개인 알림 채널 주소 정의
            // (주의: roomId가 아니라 receiverId를 기반으로 상시 채널을 타겟팅합니다)
            String destination = "/sub/notice/" + request.getSender();

            // 3. 상대방의 TopBar가 읽을 수 있도록 웹소켓으로 알림 데이터 전송
            template.convertAndSend(destination, request);

            return ResponseEntity.ok("대화 요청 및 알림 발송 완료");
        }
    }

