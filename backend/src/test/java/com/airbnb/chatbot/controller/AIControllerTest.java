package com.airbnb.chatbot.controller;

import com.airbnb.chatbot.model.dto.AIFilter;
import com.airbnb.chatbot.model.dto.AIQueryRequest;
import com.airbnb.chatbot.model.dto.AISearchResponse;
import com.airbnb.chatbot.model.dto.ListingDTO;
import com.airbnb.chatbot.service.AIService;
import com.airbnb.chatbot.service.SearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AIControllerTest {

    @Mock
    private AIService aiService;

    @Mock
    private SearchService searchService;

    @Test
    void aiSearchReturnsFriendlyInvalidResponseWithoutSearching() {
        AIFilter invalidFilter = AIFilter.builder()
                .invalidQuery(true)
                .invalidMessage("Try a search with a city or price range.")
                .build();
        when(aiService.askAI("hello")).thenReturn(invalidFilter);

        AIController controller = new AIController(aiService, searchService);
        AISearchResponse response = controller.aiSearch(new AIQueryRequest("hello"));

        assertAll(
                () -> assertTrue(response.getInvalidQuery()),
                () -> assertEquals("Try a search with a city or price range.", response.getMessage()),
                () -> assertFalse(response.getShowQuietScore()),
                () -> assertTrue(response.getListings().isEmpty()),
                () -> assertSame(invalidFilter, response.getFilters())
        );
        verify(aiService).askAI("hello");
        verifyNoInteractions(searchService);
    }

    @Test
    void aiSearchUsesFallbackMessageWhenAiDoesNotProvideOne() {
        AIFilter invalidFilter = AIFilter.builder()
                .invalidQuery(true)
                .invalidMessage(null)
                .build();
        when(aiService.askAI("???")).thenReturn(invalidFilter);

        AIController controller = new AIController(aiService, searchService);
        AISearchResponse response = controller.aiSearch(new AIQueryRequest("???"));

        assertTrue(response.getInvalidQuery());
        assertEquals(
                "Your input doesn't seem related to listing search. Please try again with a search about location, bedrooms, or other listing criteria.",
                response.getMessage()
        );
        verifyNoInteractions(searchService);
    }

    @Test
    void aiSearchReturnsListingsAndQuietScoreFlagForValidQueries() {
        AIFilter validFilter = AIFilter.builder()
                .location("Seattle")
                .bedrooms(2)
                .exactBedrooms(false)
                .bathrooms(1)
                .exactBathrooms(false)
                .hasBackyard(true)
                .minQuietScore(8.0)
                .minPrice(150.0)
                .maxPrice(250.0)
                .invalidQuery(false)
                .build();
        List<ListingDTO> listings = List.of(
                ListingDTO.builder().id(1L).title("Quiet Cottage").build()
        );
        when(aiService.askAI("quiet place in Seattle")).thenReturn(validFilter);
        when(searchService.searchWithFilters("Seattle", 2, false, 1, false, true, 8.0, 150.0, 250.0))
                .thenReturn(listings);

        AIController controller = new AIController(aiService, searchService);
        AISearchResponse response = controller.aiSearch(new AIQueryRequest("quiet place in Seattle"));

        assertAll(
                () -> assertFalse(response.getInvalidQuery()),
                () -> assertNull(response.getMessage()),
                () -> assertTrue(response.getShowQuietScore()),
                () -> assertSame(listings, response.getListings()),
                () -> assertSame(validFilter, response.getFilters())
        );
        verify(searchService).searchWithFilters("Seattle", 2, false, 1, false, true, 8.0, 150.0, 250.0);
    }
}
