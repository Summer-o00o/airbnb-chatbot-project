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
}