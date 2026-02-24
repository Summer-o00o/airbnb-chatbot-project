package com.airbnb.chatbot.service;

import com.airbnb.chatbot.model.dto.AIFilter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${openai.api.key}")
    private String openAIApiKey;

    public AIFilter askAI(String userQuery) {
        if (openAIApiKey == null || openAIApiKey.isBlank()) {
            throw new IllegalStateException(
                "OpenAI API key is not set. For Docker: set OPENAI_API_KEY in docker/.env or run: OPENAI_API_KEY=your-key docker compose up");
        }
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content",
        """
        Extract search filters from this Airbnb query:
        
        "%s"
        
        First, decide if the query is about searching for a place to stay (listing search). If NOT, set invalidQuery: true and invalidMessage to a short friendly sentence asking the user to try again with something like location, bedrooms, bathrooms, price, or quiet. Examples of INVALID: greetings ("hello", "hi"), unrelated questions ("weather", "recipe"), gibberish, empty or random text. Examples of VALID: "quiet place in Seattle", "2 bedrooms with backyard", "Seattle", "cheap place", "under 200 per night", "100 to 150".
        If the query IS about listing search, set invalidQuery: false and invalidMessage: null. Then extract filters below.
        
        Rules for bedrooms:
        - DEFAULT: Treat as EXACT number. "2 bedrooms", "with 2 bedrooms", "3 bedrooms" -> bedrooms: N, exactBedrooms: true (return only listings with exactly that many).
        - Set exactBedrooms: false when user asks for minimum: "at least 1", "1+", "1+ bedrooms", "at least 2", "2+ bedrooms", "minimum 2", "2 or more", "不少于两间" -> bedrooms: N, exactBedrooms: false (return listings with >= N).
        - If no bedroom requirement, set bedrooms: null, exactBedrooms: null.
        
        Rules for bathrooms:
        - DEFAULT: Treat as EXACT number. "2 bathrooms", "with 2 bathrooms", "1 bathroom" -> bathrooms: N, exactBathrooms: true (return only listings with exactly that many).
        - Set exactBathrooms: false when user asks for minimum: "at least 1 bathroom", "1+", "1+ bathrooms", "at least 2 bathrooms", "2+ bathrooms", "minimum 2 bathrooms", "2 or more bathrooms" -> bathrooms: N, exactBathrooms: false (return listings with >= N).
        - If no bathroom requirement, set bathrooms: null, exactBathrooms: null.
        
        Rules for quiet:
        
        - if user mentions "quiet", set minQuietScore = 8
        - if user mentions "very quiet", set minQuietScore = 9
        - if user mentions "extremely quiet", set minQuietScore = 10
        - if no quiet mentioned, set minQuietScore = null
        
        Rules for price:
        - All prices are in US dollars (USD) per night. Treat any number the user gives as USD (e.g. "200" means 200 USD). Typical range in data ~50-500 USD.
        - Budget / single max: "under 200", "max 150", "budget 100", "no more than 300" -> maxPrice: that number, minPrice: null.
        - Range: "100 to 200", "between 50 and 150", "150-300" -> minPrice: lower, maxPrice: higher.
        - Adjectives: "cheap", "budget", "affordable" -> maxPrice: 100, minPrice: null. "standard", "mid-range", "moderate" -> minPrice: 80, maxPrice: 250. "luxury", "expensive", "high-end" -> minPrice: 200, maxPrice: null.
        - If no price mentioned, set minPrice: null, maxPrice: null.
        
        Return ONLY JSON in this format:
        
        {
         "location": "...",
         "bedrooms": number or null,
         "exactBedrooms": true or false or null,
         "bathrooms": number or null,
         "exactBathrooms": true or false or null,
         "hasBackyard": true/false or null,
         "minQuietScore": number or null,
         "minPrice": number or null,
         "maxPrice": number or null,
         "invalidQuery": true or false,
         "invalidMessage": "string or null"
        }
        
        Do not include explanation.
        """
        .formatted(userQuery)
        );
        messages.add(userMessage);

        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        try {
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);

            String content = root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

            return objectMapper.readValue(content, AIFilter.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response into AIFilter", e);
        }
    }

    public double generateQuietScore(String reviewText) {
        if (openAIApiKey == null || openAIApiKey.isBlank()) {
            throw new IllegalStateException(
                "OpenAI API key is not set. For Docker: set OPENAI_API_KEY in docker/.env or run: OPENAI_API_KEY=your-key docker compose up");
        }
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content",
        """
        Rate the quietness from 0 to 10 based on this review. Only return number.
        
        "%s"
        """
        .formatted(reviewText)
        );
        messages.add(userMessage);

        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        try {
            String responseBody = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);

            String content = root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText()
                    .trim();

            return Double.parseDouble(content);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response for quiet score", e);
        }
    }
}