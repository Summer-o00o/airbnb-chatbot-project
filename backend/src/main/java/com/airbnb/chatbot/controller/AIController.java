package com.airbnb.chatbot.controller;

import com.airbnb.chatbot.model.dto.AIFilter;
import com.airbnb.chatbot.model.dto.AIQueryRequest;
import com.airbnb.chatbot.model.dto.ListingDTO;
import com.airbnb.chatbot.model.entity.Listing;
import com.airbnb.chatbot.model.mapper.ListingMapper;
import com.airbnb.chatbot.service.AIService;
import com.airbnb.chatbot.service.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final AIService aiService;
    private final SearchService searchService;

    public AIController(AIService aiService, SearchService searchService) {
        this.aiService = aiService;
        this.searchService = searchService;
    }

    @PostMapping("/search")
    public List<ListingDTO> aiSearch(@RequestBody AIQueryRequest request) {
        AIFilter filter = aiService.askAI(request.getQuery());

        return searchService.searchWithFilters(
                filter.getLocation(),
                filter.getBedrooms(),
                filter.getHasBackyard(),
                filter.getMinQuietScore()
        );
    }

}
