package com.airbnb.chatbot.repository;

import com.airbnb.chatbot.model.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByLocationIgnoreCase(String location);

    List<Listing> findByBedroomsGreaterThanEqual(int bedrooms);

    List<Listing> findByHasBackyardTrue();
}