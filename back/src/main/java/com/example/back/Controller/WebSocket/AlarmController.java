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
            // 1. 받는 사람(상대방)의 개인 알림 채널 주소 정의
            String destination = "/sub/notice/" + request.getReceiver();

            // 2. 상대방의 TopBar가 읽을 수 있도록 웹소켓으로 알림 데이터 전송
            template.convertAndSend(destination, request);

            return ResponseEntity.ok("대화 요청 및 알림 발송 완료");
        }
    }

