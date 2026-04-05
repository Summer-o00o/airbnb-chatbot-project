package com.airbnb.chatbot.config;

import com.airbnb.chatbot.model.entity.Listing;
import com.airbnb.chatbot.repository.ListingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DockerDataSeederTest {

    @Mock
    private ListingRepository listingRepository;

    @Test
    void seedIfEmptyDoesNothingWhenDataAlreadyExists() {
        when(listingRepository.count()).thenReturn(3L);

        DockerDataSeeder seeder = new DockerDataSeeder(listingRepository);
        seeder.seedIfEmpty();

        verify(listingRepository, never()).saveAll(org.mockito.ArgumentMatchers.anyList());
    }

    @Test
    @SuppressWarnings("unchecked")
    void seedIfEmptyLoadsSampleListingsWhenRepositoryIsEmpty() {
        when(listingRepository.count()).thenReturn(0L);
        ArgumentCaptor<List<Listing>> captor = ArgumentCaptor.forClass(List.class);

        DockerDataSeeder seeder = new DockerDataSeeder(listingRepository);
        seeder.seedIfEmpty();

        verify(listingRepository).saveAll(captor.capture());
        List<Listing> savedListings = captor.getValue();

        assertEquals(20, savedListings.size());
        assertAll(
                () -> assertEquals("Quiet House Seattle", savedListings.get(0).getTitle()),
                () -> assertEquals("Seattle", savedListings.get(0).getLocation()),
                () -> assertEquals("Backyard Guest House Seattle", savedListings.get(savedListings.size() - 1).getTitle()),
                () -> assertTrue(savedListings.stream().anyMatch(Listing::isHasBackyard)),
                () -> assertTrue(savedListings.stream().anyMatch(listing -> listing.getQuietScore() != null && listing.getQuietScore() >= 9.5))
        );
    }
}
