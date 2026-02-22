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
        
        Rules for quiet:
        
        - if user mentions "quiet", set minQuietScore = 8
        - if user mentions "very quiet", set minQuietScore = 9
        - if user mentions "extremely quiet", set minQuietScore = 10
        - if no quiet mentioned, set minQuietScore = null
        
        Return ONLY JSON in this format:
        
        {
         "location": "...",
         "bedrooms": number or null,
         "hasBackyard": true/false or null,
         "minQuietScore": number or null
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
}