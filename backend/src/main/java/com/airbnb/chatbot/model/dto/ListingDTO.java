package com.airbnb.chatbot.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ListingDTO {
    private Long id;
    private String title;
    private String location;
    private int bedrooms;
    private int bathrooms;
    private double price;
    private boolean hasBackyard;
    private Double quietScore;
    private Integer reviewCount;
}