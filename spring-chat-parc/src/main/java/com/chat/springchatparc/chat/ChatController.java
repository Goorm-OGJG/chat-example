package com.chat.springchatparc.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(ChatMessage message) {
        System.out.println(message.getSender());
        System.out.println(message.getContent());
        simpMessagingTemplate.convertAndSend("/topic/message", message);
    }
}
