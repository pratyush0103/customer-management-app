package com.pratyush.demo_backend.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class CustomerResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val dateOfBirth: LocalDate,
    val countryCode: String,
    val countryName: String,
    val phoneNumber: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
