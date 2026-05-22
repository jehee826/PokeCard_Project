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
    private final SimpMessagingTemplate template;

    @Autowired
    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }


    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, @RequestBody ChatMessageDto chatMessageDto) {
        log.info("Message to room {}: {}", roomId, chatMessageDto.getContent());
        template.convertAndSend("/sub/chat/" + roomId, chatMessageDto);

    }

}