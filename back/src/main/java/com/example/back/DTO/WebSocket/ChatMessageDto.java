package com.example.back.DTO.WebSocket;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class ChatMessageDto {
        private String content;
        private String sender;
        private String roomId;

        public ChatMessageDto(String content, String sender, String roomId) {
            this.content = content;
            this.sender = sender;
            this.roomId = roomId;
        }
    }

