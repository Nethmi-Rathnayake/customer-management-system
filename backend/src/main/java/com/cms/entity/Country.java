package com.cms.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "countries")
@Getter
@Setter
@NoArgsConstructor
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "code", length = 3)
    private String code;

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private List<City> cities = new ArrayList<>();

    public Country(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
