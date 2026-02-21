package com.airbnb.chatbot.controller;

import com.airbnb.chatbot.service.SearchService;
import com.airbnb.chatbot.model.entity.Listing;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public List<Listing> searchByLocation(@RequestParam String location) {
        System.out.println("SEARCH CONTROLLER CALLED: " + location);

        return searchService.searchByLocation(location);
    }    

    @GetMapping("/all")
    public List<Listing> findAllListings() {
        List<Listing> listings = searchService.findAllListings();
        System.out.println("ALL LISTINGS SIZE: " + listings.size());
        System.out.println("ALL LISTINGS: " + listings);
        return listings;
    }
}