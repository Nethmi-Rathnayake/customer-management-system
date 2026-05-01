package com.cms.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_nic_number", columnList = "nic_number", unique = true),
    @Index(name = "idx_customer_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @NotBlank
    @Column(name = "nic_number", nullable = false, unique = true, length = 20)
    private String nicNumber;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MobileNumber> mobileNumbers = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Address> addresses = new ArrayList<>();

    // Self-referencing: a customer can have multiple family members (also customers)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "customer_family_members",
        joinColumns = @JoinColumn(name = "customer_id"),
        inverseJoinColumns = @JoinColumn(name = "family_member_id")
    )
    private Set<Customer> familyMembers = new HashSet<>();

    @ManyToMany(mappedBy = "familyMembers", fetch = FetchType.LAZY)
    private Set<Customer> memberOf = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods
    public void addMobileNumber(MobileNumber mobileNumber) {
        mobileNumbers.add(mobileNumber);
        mobileNumber.setCustomer(this);
    }

    public void removeMobileNumber(MobileNumber mobileNumber) {
        mobileNumbers.remove(mobileNumber);
        mobileNumber.setCustomer(null);
    }

    public void addAddress(Address address) {
        addresses.add(address);
        address.setCustomer(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setCustomer(null);
    }
}
