package com.healthcare.fhir.service;

import org.springframework.stereotype.Service;

@Service
public class QueryRouterService {

    private final TransactionService transactionService;

    public QueryRouterService(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

}
