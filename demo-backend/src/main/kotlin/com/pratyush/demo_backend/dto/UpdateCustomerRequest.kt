package com.pratyush.demo_backend.dto

import jakarta.validation.constraints.*
import java.time.LocalDate

data class UpdateCustomerRequest(
    @field:NotBlank(message = "First name is required")
    @field:Size(max = 50, message = "First name must be at most 50 characters")
    val firstName: String,

    @field:NotBlank(message = "Last name is required")
    @field:Size(max = 50, message = "Last name must be at most 50 characters")
    val lastName: String,

    @field:NotNull(message = "Date of birth is required")
    @field:PastOrPresent(message = "Date of birth must be today or in the past")
    val dateOfBirth: LocalDate,

    @field:NotBlank(message = "Country code is required")
    @field:Pattern(regexp = "^\\+[0-9]{1,4}$", message = "Country code must start with + followed by 1-4 digits")
    val countryCode: String,

    @field:NotBlank(message = "Country name is required")
    val countryName: String,

    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    val phoneNumber: String
)
