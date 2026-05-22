package com.example.back.DTO.WebSocket;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class ChatMessageDto {
    private String content;
    private String sender;
    private String receiver;
    private String roomId;
    private String message;

    public ChatMessageDto() {}

    public ChatMessageDto(String content, String sender, String receiver, String roomId, String message) {
        this.content = content;
        this.sender = sender;
        this.receiver = receiver;
        this.roomId = roomId;
        this.message = message;
    }
}

