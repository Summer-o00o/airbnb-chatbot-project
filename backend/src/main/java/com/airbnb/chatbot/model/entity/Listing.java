package com.airbnb.chatbot.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "listing")
@NoArgsConstructor
@Getter
@Setter
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String location;

    private int bedrooms;

    private int bathrooms;

    private double price;

    private boolean hasBackyard;

    private double latitude;

    private double longitude;

    /** Prefilled review count (stored in DB). */
    private Integer reviewCount;

    /** Prefilled average quiet score 0–10 (stored in DB). */
    private Double quietScore;
}