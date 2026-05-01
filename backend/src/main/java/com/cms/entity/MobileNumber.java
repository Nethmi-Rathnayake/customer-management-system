package com.cms.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "mobile_numbers", indexes = {
    @Index(name = "idx_mobile_customer_id", columnList = "customer_id")
})
@Getter
@Setter
@NoArgsConstructor
public class MobileNumber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "number", nullable = false, length = 20)
    private String number;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    public MobileNumber(String number) {
        this.number = number;
    }
}
