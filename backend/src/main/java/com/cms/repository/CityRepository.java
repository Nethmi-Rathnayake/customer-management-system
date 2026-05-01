package com.cms.repository;

import com.cms.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    @Query("SELECT c FROM City c JOIN FETCH c.country ORDER BY c.name")
    List<City> findAllWithCountry();
}
