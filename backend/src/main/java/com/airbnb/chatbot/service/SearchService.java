package com.airbnb.chatbot.service;

import com.airbnb.chatbot.repository.ListingRepository;
import com.airbnb.chatbot.model.entity.Listing;
import org.springframework.stereotype.Service;

import java.util.List;

import com.airbnb.chatbot.model.dto.ListingDTO;
import com.airbnb.chatbot.model.mapper.ListingMapper;

@Service
public class SearchService {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;

    public SearchService(ListingRepository listingRepository, ListingMapper listingMapper) {
        this.listingRepository = listingRepository;
        this.listingMapper = listingMapper;
    }

    public List<ListingDTO> searchByLocation(String location) {
        return listingRepository.findByLocationIgnoreCase(location)
                .stream()
                .map(listingMapper::toDTO)
                .toList();
    }

    public List<ListingDTO> findAllListings() {
        return listingRepository.findAll()
                .stream()
                .map(listingMapper::toDTO)
                .toList();
    }

    public List<ListingDTO> searchWithFilters(
            String location,
            Integer bedrooms,
            Boolean hasBackyard,
            Double minQuietScore
    ) {
        return listingRepository.findAll().stream()
                .map(listingMapper::toDTO)
                .filter(dto -> location == null ||
                        (dto.getLocation() != null && dto.getLocation().equalsIgnoreCase(location)))
                .filter(dto -> bedrooms == null || dto.getBedrooms() == bedrooms)
                .filter(dto -> hasBackyard == null || dto.isHasBackyard() == hasBackyard)
                .filter(dto -> minQuietScore == null ||
                        (dto.getQuietScore() != null && dto.getQuietScore() >= minQuietScore))
                .toList();
    }
}