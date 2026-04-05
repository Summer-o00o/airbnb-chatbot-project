package com.airbnb.chatbot.service;

import com.airbnb.chatbot.model.dto.ListingDTO;
import com.airbnb.chatbot.model.entity.Listing;
import com.airbnb.chatbot.model.mapper.ListingMapper;
import com.airbnb.chatbot.repository.ListingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock
    private ListingRepository listingRepository;

    private SearchService searchService;

    @BeforeEach
    void setUp() {
        searchService = new SearchService(listingRepository, new ListingMapper());
    }

    @Test
    void searchByLocationMapsRepositoryResults() {
        when(listingRepository.findByLocationIgnoreCase("Seattle")).thenReturn(List.of(
                listing(1L, "Quiet Cottage", "Seattle", 2, 1, 180.0, true, 9.5, 12)
        ));

        List<ListingDTO> results = searchService.searchByLocation("Seattle");

        assertEquals(1, results.size());
        assertEquals("Quiet Cottage", results.get(0).getTitle());
        assertTrue(results.get(0).isHasBackyard());
        verify(listingRepository).findByLocationIgnoreCase("Seattle");
    }

    @Test
    void findAllListingsMapsAllListings() {
        when(listingRepository.findAll()).thenReturn(List.of(
                listing(1L, "Quiet Cottage", "Seattle", 2, 1, 180.0, true, 9.5, 12),
                listing(2L, "City Apartment", "Seattle", 1, 1, 95.0, false, 6.1, 7)
        ));

        List<ListingDTO> results = searchService.findAllListings();

        assertEquals(2, results.size());
        assertEquals("City Apartment", results.get(1).getTitle());
        verify(listingRepository).findAll();
    }

    @Test
    void searchWithFiltersAppliesInclusiveFilters() {
        when(listingRepository.findAll()).thenReturn(List.of(
                listing(1L, "Quiet Cottage", "Seattle", 2, 1, 180.0, true, 9.1, 12),
                listing(2L, "Luxury Villa", "Seattle", 4, 3, 350.0, true, 9.8, 9),
                listing(3L, "Budget Apartment", "Seattle", 2, 1, 90.0, false, 8.5, 22),
                listing(4L, "Bellevue House", "Bellevue", 3, 2, 220.0, true, 9.3, 5),
                listing(5L, "Unrated Loft", "Seattle", 2, 1, 190.0, true, null, 0)
        ));

        List<ListingDTO> results = searchService.searchWithFilters(
                "Seattle",
                2,
                false,
                1,
                false,
                true,
                9.0,
                100.0,
                250.0
        );

        assertEquals(1, results.size());
        assertEquals("Quiet Cottage", results.get(0).getTitle());
    }

    @Test
    void searchWithFiltersSupportsExactBedroomAndBathroomMatching() {
        when(listingRepository.findAll()).thenReturn(List.of(
                listing(1L, "Exact Match", "Seattle", 2, 2, 210.0, true, 8.7, 10),
                listing(2L, "Too Many Bedrooms", "Seattle", 3, 2, 210.0, true, 8.7, 10),
                listing(3L, "Too Many Bathrooms", "Seattle", 2, 3, 210.0, true, 8.7, 10)
        ));

        List<ListingDTO> results = searchService.searchWithFilters(
                "Seattle",
                2,
                true,
                2,
                true,
                true,
                8.0,
                200.0,
                220.0
        );

        assertEquals(1, results.size());
        assertEquals("Exact Match", results.get(0).getTitle());
    }

    private static Listing listing(
            Long id,
            String title,
            String location,
            int bedrooms,
            int bathrooms,
            double price,
            boolean hasBackyard,
            Double quietScore,
            Integer reviewCount
    ) {
        Listing listing = new Listing();
        listing.setId(id);
        listing.setTitle(title);
        listing.setLocation(location);
        listing.setBedrooms(bedrooms);
        listing.setBathrooms(bathrooms);
        listing.setPrice(price);
        listing.setHasBackyard(hasBackyard);
        listing.setQuietScore(quietScore);
        listing.setReviewCount(reviewCount);
        return listing;
    }
}
