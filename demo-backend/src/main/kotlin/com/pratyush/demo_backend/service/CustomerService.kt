package com.pratyush.demo_backend.service

import com.pratyush.demo_backend.dto.CreateCustomerRequest
import com.pratyush.demo_backend.dto.CustomerResponse
import com.pratyush.demo_backend.dto.UpdateCustomerRequest
import com.pratyush.demo_backend.entity.AuditLog
import com.pratyush.demo_backend.entity.Customer
import com.pratyush.demo_backend.repository.AuditLogRepository
import com.pratyush.demo_backend.repository.CustomerRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class CustomerService(
    private val repository: CustomerRepository,
    private val auditLogRepository: AuditLogRepository
) {

    private val log = LoggerFactory.getLogger(CustomerService::class.java)

    fun create(request: CreateCustomerRequest): CustomerResponse {
        if (repository.existsByPhoneNumber(request.phoneNumber)) {
            throw DuplicatePhoneException("Phone number '${request.phoneNumber}' already exists")
        }
        val customer = repository.save(
            Customer(
                firstName = request.firstName.trim(),
                lastName = request.lastName.trim(),
                dateOfBirth = request.dateOfBirth,
                countryCode = request.countryCode.trim(),
                countryName = request.countryName.trim(),
                phoneNumber = request.phoneNumber.trim()
            )
        )
        auditLogRepository.save(
            AuditLog(
                entityName = "Customer",
                entityId = customer.id,
                action = "CREATE",
                changes = "Created customer: ${customer.firstName} ${customer.lastName}, phone: ${customer.phoneNumber}"
            )
        )
        return customer.toResponse()
    }

    fun update(id: Long, request: UpdateCustomerRequest): CustomerResponse {
        val existing = repository.findById(id)
            .orElseThrow { CustomerNotFoundException("Customer with id $id not found") }
        if (repository.existsByPhoneNumberAndIdNot(request.phoneNumber, id)) {
            throw DuplicatePhoneException("Phone number '${request.phoneNumber}' already exists")
        }

        val changes = mutableListOf<String>()
        if (existing.firstName != request.firstName.trim()) changes.add("firstName: '${existing.firstName}' -> '${request.firstName.trim()}'")
        if (existing.lastName != request.lastName.trim()) changes.add("lastName: '${existing.lastName}' -> '${request.lastName.trim()}'")
        if (existing.dateOfBirth != request.dateOfBirth) changes.add("dateOfBirth: '${existing.dateOfBirth}' -> '${request.dateOfBirth}'")
        if (existing.countryCode != request.countryCode.trim()) changes.add("countryCode: '${existing.countryCode}' -> '${request.countryCode.trim()}'")
        if (existing.countryName != request.countryName.trim()) changes.add("countryName: '${existing.countryName}' -> '${request.countryName.trim()}'")

        val updated = repository.save(
            existing.copy(
                firstName = request.firstName.trim(),
                lastName = request.lastName.trim(),
                dateOfBirth = request.dateOfBirth,
                countryCode = request.countryCode.trim(),
                countryName = request.countryName.trim(),
                phoneNumber = request.phoneNumber.trim()
            )
        )
        auditLogRepository.save(
            AuditLog(
                entityName = "Customer",
                entityId = id,
                action = "UPDATE",
                changes = if (changes.isEmpty()) "No changes" else changes.joinToString("; ")
            )
        )
        return updated.toResponse()
    }

    fun delete(id: Long) {
        val existing = repository.findById(id)
            .orElseThrow { CustomerNotFoundException("Customer with id $id not found") }
        repository.deleteById(id)
        auditLogRepository.save(
            AuditLog(
                entityName = "Customer",
                entityId = id,
                action = "DELETE",
                changes = "Deleted customer: ${existing.firstName} ${existing.lastName}, phone: ${existing.phoneNumber}"
            )
        )
    }

    fun getAll(page: Int, size: Int, name: String?, phone: String?, countryCode: String?, sortBy: String, sortDir: String): Page<CustomerResponse> {
        val direction = if (sortDir.equals("asc", ignoreCase = true)) Sort.Direction.ASC else Sort.Direction.DESC
        val sort = Sort.by(direction, sortBy)
        val pageable = PageRequest.of(page, size, sort)
        println(">>> Service getAll: sortBy=$sortBy, sortDir=$sortDir, direction=$direction, pageable.sort=${pageable.sort}")
        val result = when {
            !name.isNullOrBlank() -> repository.searchByName(name.trim(), pageable)
            !phone.isNullOrBlank() -> repository.findByPhoneNumberStartingWith(phone.trim(), pageable)
            !countryCode.isNullOrBlank() -> repository.findByCountryCode(countryCode.trim(), pageable)
            else -> repository.findAll(pageable)
        }
        return result.map { it.toResponse() }
    }

    fun getById(id: Long): CustomerResponse {
        val customer = repository.findById(id)
            .orElseThrow { CustomerNotFoundException("Customer with id $id not found") }
        return customer.toResponse()
    }

    fun getAllForExport(): List<CustomerResponse> {
        return repository.findAll(Sort.by("id").descending()).map { it.toResponse() }
    }

    private fun Customer.toResponse() = CustomerResponse(
        id = id,
        firstName = firstName,
        lastName = lastName,
        dateOfBirth = dateOfBirth,
        countryCode = countryCode,
        countryName = countryName,
        phoneNumber = phoneNumber,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

class CustomerNotFoundException(message: String) : RuntimeException(message)
class DuplicatePhoneException(message: String) : RuntimeException(message)
