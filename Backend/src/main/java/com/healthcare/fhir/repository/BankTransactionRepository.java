package com.healthcare.fhir.repository;

import com.healthcare.fhir.model.BankTransaction;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BankTransactionRepository
        extends JpaRepository<BankTransaction, Long> {

    List<BankTransaction> findByTxnDateBetween(
            LocalDate start,
            LocalDate end
    );

    @Query("""
SELECT COUNT(t)
FROM BankTransaction t
WHERE t.txnDate BETWEEN :start AND :end
AND t.debit > 0
""")
    Long countTransactions(LocalDate start, LocalDate end);


    @Query("""
SELECT 
  COALESCE(SUM(t.debit),0),
  COALESCE(SUM(t.credit),0)
FROM BankTransaction t
WHERE t.txnDate BETWEEN :start AND :end
""")
    List<Object[]> getMonthlyTotals(LocalDate start, LocalDate end);

    @Query("""
SELECT t
FROM BankTransaction t
WHERE t.debit IS NOT NULL
  AND t.txnDate BETWEEN :start AND :end
ORDER BY t.debit DESC
LIMIT 20
""")
    List<BankTransaction> findTopExpenses(LocalDate start, LocalDate end, Pageable pageable);

}
