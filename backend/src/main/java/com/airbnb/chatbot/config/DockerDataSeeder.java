package com.airbnb.chatbot.config;

import com.airbnb.chatbot.model.entity.Listing;
import com.airbnb.chatbot.repository.ListingRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.List;

/**
 * Seeds sample listings when running with Docker profile and the DB is empty.
 */
@Component
@Profile("docker")
public class DockerDataSeeder {

    private final ListingRepository listingRepository;

    public DockerDataSeeder(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    @PostConstruct
    public void seedIfEmpty() {
        if (listingRepository.count() > 0) return;

        List<Listing> samples = List.of(
                listing("Quiet House Seattle", "Peaceful and cozy home", "Seattle", 2, 1, 120, true, 47.6062, -122.3321, 9.166666666666666, 6),
                listing("Downtown Apartment Seattle", "Modern apartment downtown", "Seattle", 1, 1, 100, false, 47.6097, -122.3331, 6.5, 12),
                listing("Luxury Home Bellevue", "Large luxury home", "Bellevue", 4, 3, 350, true, 47.6101, -122.2015, 8.8, 7),
                listing("Capitol Hill Studio", "Small studio in busy area", "Seattle", 0, 1, 80, false, 47.6231, -122.32, 5, 20),
                listing("Green Lake House", "House near quiet lake", "Seattle", 3, 2, 200, true, 47.68, -122.327, 9.5, 4),
                listing("Modern Quiet Condo Seattle", "Very peaceful condo downtown", "Seattle", 1, 1, 150, false, 47.6097, -122.3331, 9.2, 12),
                listing("Family House with Backyard Seattle", "Perfect for families", "Seattle", 3, 2, 220, true, 47.6205, -122.3493, 8.5, 8),
                listing("Budget Apartment Seattle", "Affordable but noisy area", "Seattle", 1, 1, 80, false, 47.615, -122.32, 5.5, 15),
                listing("Luxury Villa Bellevue", "Extremely quiet luxury home", "Bellevue", 4, 3, 450, true, 47.6101, -122.2015, 9.8, 21),
                listing("Downtown Studio Seattle", "Close to everything", "Seattle", 0, 1, 110, false, 47.6067, -122.3325, 6.2, 6),
                listing("Quiet Cottage Seattle", "Hidden gem in nature", "Seattle", 2, 1, 180, true, 47.64, -122.3, 9.5, 10),
                listing("Redmond Tech Apartment", "Near Microsoft campus", "Redmond", 2, 1, 160, false, 47.673, -122.1215, 7.5, 9),
                listing("Luxury Penthouse Seattle", "Premium experience", "Seattle", 3, 2, 380, false, 47.608, -122.335, 8.8, 5),
                listing("Small Quiet Room Seattle", "Simple and peaceful", "Seattle", 1, 1, 90, false, 47.602, -122.33, 8, 18),
                listing("Suburban Family Home Bellevue", "Spacious and quiet neighborhood", "Bellevue", 4, 3, 300, true, 47.595, -122.15, 9.1, 14),
                listing("Cheap Shared Apartment Seattle", "Low cost shared unit", "Seattle", 1, 1, 60, false, 47.6, -122.31, 4.8, 20),
                listing("Lakeview Quiet House Seattle", "Amazing lake view and peaceful", "Seattle", 3, 2, 250, true, 47.63, -122.28, 9.6, 7),
                listing("Urban Apartment Seattle", "Busy area, some noise", "Seattle", 2, 1, 140, false, 47.61, -122.34, 6.8, 11),
                listing("Extremely Quiet Luxury Cabin", "Nature retreat", "Redmond", 2, 1, 275, true, 47.7, -122.1, 10, 4),
                listing("Backyard Guest House Seattle", "Private backyard unit", "Seattle", 1, 1, 130, true, 47.62, -122.31, 8.3, 13)
        );
        listingRepository.saveAll(samples);
    }

    private static Listing listing(String title, String description, String location,
                                   int bedrooms, int bathrooms, double price, boolean hasBackyard,
                                   double lat, double lon, double quietScore, int reviewCount) {
        Listing e = new Listing();
        e.setTitle(title);
        e.setDescription(description);
        e.setLocation(location);
        e.setBedrooms(bedrooms);
        e.setBathrooms(bathrooms);
        e.setPrice(price);
        e.setHasBackyard(hasBackyard);
        e.setLatitude(lat);
        e.setLongitude(lon);
        e.setQuietScore(quietScore);
        e.setReviewCount(reviewCount);
        return e;
    }
}
