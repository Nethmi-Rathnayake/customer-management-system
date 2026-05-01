package com.cms.repository;

import com.cms.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    @Modifying
    @Query("DELETE FROM Address a WHERE a.customer.id = :customerId")
    void deleteByCustomerId(@Param("customerId") Long customerId);
}
