package com.healthcare.fhir.service;
import org.springframework.stereotype.Service;

@Service
public class IntentService {
    public enum IntentType {
        MONTHLY_ANALYSIS,
        TOTAL_SPENDING,
        TOTAL_INCOME,
        TOP_EXPENSES,
        BALANCE_CHANGE,
        TRANSACTION_SEARCH,
        UNKNOWN
    }

    public record IntentResult(
            IntentType intent,
            Integer month,
            Integer year,
            String keyword
    ) {}

    public IntentResult detectIntent(String text) {

        text = text.toLowerCase();

        if (text.contains("analysis") || text.contains("analyse")) {
            return new IntentResult(IntentType.MONTHLY_ANALYSIS, 1, 2025, null);
        }

        if (text.contains("top") || text.contains("biggest")) {
            return new IntentResult(IntentType.TOP_EXPENSES, 1, 2025, null);
        }

        return new IntentResult(IntentType.UNKNOWN, null, null, null);
    }

}
