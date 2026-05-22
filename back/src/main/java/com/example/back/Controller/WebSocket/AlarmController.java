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

            String destination = "/sub/notice/" + request.getReceiver();

            template.convertAndSend(destination, request);

            return ResponseEntity.ok("대화 요청 및 알림 발송 완료");
        }
    }

