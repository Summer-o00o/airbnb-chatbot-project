package com.airbnb.chatbot.service;

import com.airbnb.chatbot.repository.ListingRepository;
import com.airbnb.chatbot.model.entity.Listing;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final ListingRepository listingRepository;

    public SearchService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public List<Listing> searchByLocation(String location) {
        return listingRepository.findByLocationIgnoreCase(location);
    }

    public List<Listing> findAllListings() {
        return listingRepository.findAll();
    }

public List<Listing> searchWithFilters(
        String location,
        Integer bedrooms,
        Boolean hasBackyard,
        Double minQuietScore
) {
    return listingRepository.findAll().stream()
            .filter(listing -> location == null || 
                    (listing.getLocation() != null && listing.getLocation().equalsIgnoreCase(location)))
            .filter(listing -> bedrooms == null || listing.getBedrooms() == bedrooms)
            .filter(listing -> hasBackyard == null || listing.isHasBackyard() == hasBackyard)
            .filter(listing -> minQuietScore == null || listing.getQuietScore() >= minQuietScore)
            .toList();
}
}