package com.cms.repository;

import com.cms.entity.MobileNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MobileNumberRepository extends JpaRepository<MobileNumber, Long> {

    @Modifying
    @Query("DELETE FROM MobileNumber m WHERE m.customer.id = :customerId")
    void deleteByCustomerId(@Param("customerId") Long customerId);
}
