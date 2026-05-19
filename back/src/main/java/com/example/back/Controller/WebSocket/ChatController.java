package com.example.back.Controller.WebSocket;

import com.example.back.DTO.WebSocket.ChatMessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class ChatController {
    private final SimpMessagingTemplate template;       // 특정 사용자에게 메시지를 보내는데 사용되는 STOMP을 이용한 템플릿입니다.

    @Autowired
    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }

    /**
     * 특정 채팅방(/pub/chat/{roomId})으로 메시지를 보내면 해당 방을 구독하는 사용자들에게 전달합니다.
     */
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @RequestBody ChatMessageDto chatMessageDto) {
        log.info("Message to room {}: {}", roomId, chatMessageDto.getContent());
        template.convertAndSend("/sub/chat/" + roomId, chatMessageDto);

    }

}