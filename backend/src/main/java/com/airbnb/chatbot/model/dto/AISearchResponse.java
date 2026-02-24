package com.airbnb.chatbot.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AISearchResponse {
    private List<ListingDTO> listings;
    /** When true, the query was not about listing search; show message to user. */
    private Boolean invalidQuery;
    private String message;
    /** When true, user mentioned quiet/安静; show Quiet Score on listing cards. */
    private Boolean showQuietScore;
    /** The exact filters interpreted from the user's natural language query. */
    private AIFilter filters;
}
