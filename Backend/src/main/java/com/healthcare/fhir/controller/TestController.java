package com.healthcare.fhir.controller;

import com.healthcare.fhir.service.IntentService;
import com.healthcare.fhir.service.TransactionService;
import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {


    private final TransactionService service;

    public TestController(TransactionService service, IntentService intentService) {
        this.service = service;
        this.intentService = intentService;
    }


//    @GetMapping("/montly")
//    public BigDecimal monthly(){
//        return service.getMonthlySpending(LocalDate.of(2025,2,1),LocalDate.of(2025,4,1));
//    }

    private final IntentService intentService;

    @GetMapping("/intent")
    public IntentService.IntentResult testIntent(@RequestParam String query) {
        return intentService.detectIntent(query);
    }

    @GetMapping("/temp")
    public String temp(){
        return "yoo due this is epic!!!!";
    }

    @PostMapping("/query")
    public Object handleQuery(@RequestBody IntentRequest request) {

        return switch (request.getIntent()) {
            case "MONTHLY_SUMMARY" -> service.getMonthlySummary(
                    request.getStartDate(),
                    request.getEndDate()
            );
            case "TOP_EXPENSES" -> service.getTopExpenses(
                    request.getStartDate(),
                    request.getEndDate()
            );
            default -> Map.of("message", "Intent not supported yet");
        };
    }


}
class IntentRequest {
    private String intent;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer limit;

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }
// getters and setters
}

