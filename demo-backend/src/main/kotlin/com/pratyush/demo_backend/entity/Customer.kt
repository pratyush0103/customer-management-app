package com.pratyush.demo_backend.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "customers")
data class Customer(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 50)
    val firstName: String,

    @Column(nullable = false, length = 50)
    val lastName: String,

    @Column(nullable = false)
    val dateOfBirth: LocalDate,

    @Column(nullable = false, length = 5)
    val countryCode: String,

    @Column(nullable = false, length = 100)
    val countryName: String,

    @Column(nullable = false, unique = true)
    val phoneNumber: String,

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @UpdateTimestamp
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
