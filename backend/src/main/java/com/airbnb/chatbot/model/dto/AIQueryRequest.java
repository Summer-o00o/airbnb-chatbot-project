package com.airbnb.chatbot.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AIQueryRequest {
    private String query;
}