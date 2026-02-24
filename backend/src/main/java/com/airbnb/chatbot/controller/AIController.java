package com.airbnb.chatbot.controller;

import com.airbnb.chatbot.model.dto.AIFilter;
import com.airbnb.chatbot.model.dto.AIQueryRequest;
import com.airbnb.chatbot.model.dto.AISearchResponse;
import com.airbnb.chatbot.model.dto.ListingDTO;
import com.airbnb.chatbot.service.AIService;
import com.airbnb.chatbot.service.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AIController {

    private final AIService aiService;
    private final SearchService searchService;

    public AIController(AIService aiService, SearchService searchService) {
        this.aiService = aiService;
        this.searchService = searchService;
    }

    @PostMapping("/search")
    public AISearchResponse aiSearch(@RequestBody AIQueryRequest request) {
        AIFilter filter = aiService.askAI(request.getQuery());

        if (Boolean.TRUE.equals(filter.getInvalidQuery())) {
            return AISearchResponse.builder()
                    .listings(List.of())
                    .invalidQuery(true)
                    .message(filter.getInvalidMessage() != null ? filter.getInvalidMessage() : "Your input doesn't seem related to listing search. Please try again with a search about location, bedrooms, or other listing criteria.")
                    .showQuietScore(false)
                    .filters(filter)
                    .build();
        }

        List<ListingDTO> listings = searchService.searchWithFilters(
                filter.getLocation(),
                filter.getBedrooms(),
                filter.getExactBedrooms(),
                filter.getBathrooms(),
                filter.getExactBathrooms(),
                filter.getHasBackyard(),
                filter.getMinQuietScore(),
                filter.getMinPrice(),
                filter.getMaxPrice()
        );
        boolean showQuietScore = filter.getMinQuietScore() != null;
        return AISearchResponse.builder()
                .listings(listings)
                .invalidQuery(false)
                .message(null)
                .showQuietScore(showQuietScore)
                .filters(filter)
                .build();
    }
}
