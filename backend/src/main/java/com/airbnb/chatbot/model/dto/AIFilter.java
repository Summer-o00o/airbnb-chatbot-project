package com.airbnb.chatbot.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIFilter {
    private String location;
    private Integer bedrooms;
    private Boolean hasBackyard;
    private Double minQuietScore;
}