package com.example.back.DTO.WebSocket;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class ChatMessageDto {
        private String content;
        private String sender;
        private String roomId;
        private String message;


        public ChatMessageDto(String content, String sender, String roomId, String message) {
            this.content = content;
            this.sender = sender;
            this.roomId = roomId;
            this.message = message;
        }
    }

