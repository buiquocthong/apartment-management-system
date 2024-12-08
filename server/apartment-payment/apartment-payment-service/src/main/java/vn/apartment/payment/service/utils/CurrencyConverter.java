package vn.apartment.payment.service.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

public class CurrencyConverter {
    private static final String API_URL = "https://api.apilayer.com/currency_data/convert";
    private static final String API_KEY = "l1rPS6PItXwb5EzU0bMREmuT8CaIGwFF";

    public static Double convertVNDToUSD(double amount) throws IOException {
        OkHttpClient client = new OkHttpClient();

        String url = String.format("%s?to=USD&from=VND&amount=%.0f", API_URL, amount);
        Request request = new Request.Builder()
                .url(url)
                .addHeader("apikey", API_KEY)
                .method("GET", null)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            String responseBody = response.body().string();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            return jsonNode.get("result").asDouble();
        }
    }
}
