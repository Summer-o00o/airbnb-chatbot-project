package com.airbnb.chatbot.model.mapper;

import com.airbnb.chatbot.model.entity.Listing;
import com.airbnb.chatbot.model.dto.ListingDTO;
import org.springframework.stereotype.Component;

@Component
public class ListingMapper {

    public ListingDTO toDTO(Listing listing) {
        if (listing == null) return null;

        return ListingDTO.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .location(listing.getLocation())
                .bedrooms(listing.getBedrooms())
                .bathrooms(listing.getBathrooms())
                .price(listing.getPrice())
                .hasBackyard(listing.isHasBackyard())
                .quietScore(listing.getQuietScore())
                .reviewCount(listing.getReviewCount())
                .build();
    }
}
