package com.healthcare.fhir.service;

import com.healthcare.fhir.model.BankTransaction;
import com.healthcare.fhir.repository.BankTransactionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class TransactionService {
    public record MonthlySummary(
            BigDecimal totalSpent,
            BigDecimal totalReceived,
            Long cnt
    ) {}
    public record ExpenseItem(
            String description,
            BigDecimal amount,
            LocalDate date
    ) {}


    private final BankTransactionRepository repo;

    public TransactionService(BankTransactionRepository repo) {
        this.repo = repo;
    }

    public MonthlySummary getMonthlySummary(LocalDate start, LocalDate end) {

        List<Object[]> rows = repo.getMonthlyTotals(start, end);
        Object[] row = rows.get(0);
        BigDecimal spent = (BigDecimal) row[0];
        BigDecimal received = (BigDecimal) row[1];
        Long count = repo.countTransactions(start, end);
        return new MonthlySummary(spent, received, count);
    }

    public List<ExpenseItem> getTopExpenses(LocalDate start, LocalDate end) {
        List<BankTransaction> txns =
                repo.findTopExpenses(start, end, PageRequest.of(0, 5));

        return txns.stream()
                .map(t -> new ExpenseItem(
                        t.getDescription(),
                        t.getDebit(),
                        t.getTxnDate()
                ))
                .toList();
    }


}
