package com.cms.service;

import com.cms.dto.MasterDataDTO;
import com.cms.dto.ReferenceDTO;
import com.cms.repository.CityRepository;
import com.cms.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MasterDataService {

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;

    @Cacheable("countries")
    @Transactional(readOnly = true)
    public List<ReferenceDTO> getAllCountries() {
        log.debug("Loading countries from DB");
        return countryRepository.findAllByOrderByNameAsc().stream()
            .map(c -> new ReferenceDTO(c.getId(), c.getName(), null))
            .collect(Collectors.toList());
    }

    @Cacheable("cities")
    @Transactional(readOnly = true)
    public List<ReferenceDTO> getAllCities() {
        log.debug("Loading cities from DB");
        return cityRepository.findAllWithCountry().stream()
            .map(c -> new ReferenceDTO(
                c.getId(),
                c.getName(),
                c.getCountry() != null ? c.getCountry().getId() : null
            ))
            .collect(Collectors.toList());
    }

    @Cacheable("masterData")
    @Transactional(readOnly = true)
    public MasterDataDTO getAllMasterData() {
        return new MasterDataDTO(getAllCountries(), getAllCities());
    }
}
