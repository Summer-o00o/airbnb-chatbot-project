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
    /** When true: filter bedrooms == N. When false or null: filter bedrooms >= N. */
    private Boolean exactBedrooms;
    private Boolean hasBackyard;
    private Double minQuietScore;
    /** When true: filter bathrooms == N. When false or null: filter bathrooms >= N. */
    private Integer bathrooms;
    private Boolean exactBathrooms;
    /** Inclusive. Filter listing.price >= minPrice when non-null. */
    private Double minPrice;
    /** Inclusive. Filter listing.price <= maxPrice when non-null. */
    private Double maxPrice;
    /** When true, the query is not about listing search; show invalidMessage to user. */
    private Boolean invalidQuery;
    private String invalidMessage;
}