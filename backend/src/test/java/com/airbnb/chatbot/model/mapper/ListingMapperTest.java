package com.airbnb.chatbot.model.mapper;

import com.airbnb.chatbot.model.dto.ListingDTO;
import com.airbnb.chatbot.model.entity.Listing;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ListingMapperTest {

    private final ListingMapper listingMapper = new ListingMapper();

    @Test
    void toDTOMapsEverySupportedField() {
        Listing listing = new Listing();
        listing.setId(42L);
        listing.setTitle("Quiet Cottage");
        listing.setLocation("Seattle");
        listing.setBedrooms(2);
        listing.setBathrooms(1);
        listing.setPrice(180.0);
        listing.setHasBackyard(true);
        listing.setQuietScore(9.4);
        listing.setReviewCount(16);

        ListingDTO dto = listingMapper.toDTO(listing);

        assertAll(
                () -> assertEquals(42L, dto.getId()),
                () -> assertEquals("Quiet Cottage", dto.getTitle()),
                () -> assertEquals("Seattle", dto.getLocation()),
                () -> assertEquals(2, dto.getBedrooms()),
                () -> assertEquals(1, dto.getBathrooms()),
                () -> assertEquals(180.0, dto.getPrice()),
                () -> assertTrue(dto.isHasBackyard()),
                () -> assertEquals(9.4, dto.getQuietScore()),
                () -> assertEquals(16, dto.getReviewCount())
        );
    }

    @Test
    void toDTOReturnsNullWhenListingIsNull() {
        assertNull(listingMapper.toDTO(null));
    }
}
