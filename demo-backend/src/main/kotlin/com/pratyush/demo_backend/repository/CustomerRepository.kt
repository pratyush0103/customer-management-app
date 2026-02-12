package com.pratyush.demo_backend.repository

import com.pratyush.demo_backend.entity.Customer
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface CustomerRepository : JpaRepository<Customer, Long> {

    @Query("SELECT c FROM Customer c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    fun searchByName(name: String, pageable: Pageable): Page<Customer>

    fun findByPhoneNumberStartingWith(phone: String, pageable: Pageable): Page<Customer>

    fun findByCountryCode(countryCode: String, pageable: Pageable): Page<Customer>

    fun existsByPhoneNumber(phoneNumber: String): Boolean

    fun existsByPhoneNumberAndIdNot(phoneNumber: String, id: Long): Boolean
}
