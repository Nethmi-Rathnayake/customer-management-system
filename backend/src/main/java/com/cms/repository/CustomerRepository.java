package com.cms.repository;

import com.cms.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByNicNumber(String nicNumber);

    boolean existsByNicNumberAndIdNot(String nicNumber, Long id);

    Optional<Customer> findByNicNumber(String nicNumber);

    @Query("SELECT c FROM Customer c WHERE " +
           "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:nicNumber IS NULL OR c.nicNumber LIKE CONCAT('%', :nicNumber, '%'))")
    Page<Customer> findWithFilters(
        @Param("name") String name,
        @Param("nicNumber") String nicNumber,
        Pageable pageable
    );

    // Fixed: Removed multiple bag fetching - use findById and initialize lazily
    Optional<Customer> findById(Long id);
}