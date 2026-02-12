package com.pratyush.demo_backend.controller

import com.pratyush.demo_backend.dto.CreateCustomerRequest
import com.pratyush.demo_backend.dto.CustomerResponse
import com.pratyush.demo_backend.dto.UpdateCustomerRequest
import com.pratyush.demo_backend.service.CustomerService
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:3001"])
class CustomerController(private val service: CustomerService) {

    private val log = LoggerFactory.getLogger(CustomerController::class.java)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: CreateCustomerRequest): CustomerResponse {
        return service.create(request)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: UpdateCustomerRequest): CustomerResponse {
        return service.update(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }

    @GetMapping
    fun getAll(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) phone: String?,
        @RequestParam(required = false) countryCode: String?,
        @RequestParam(defaultValue = "id") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): Page<CustomerResponse> {
        println(">>> getAll called: page=$page, size=$size, sortBy=$sortBy, sortDir=$sortDir, name=$name, phone=$phone, countryCode=$countryCode")
        return service.getAll(page, size, name, phone, countryCode, sortBy, sortDir)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): CustomerResponse {
        return service.getById(id)
    }

    @GetMapping("/export")
    fun exportCsv(response: HttpServletResponse) {
        val customers = service.getAllForExport()

        response.contentType = "text/csv"
        response.setHeader("Content-Disposition", "attachment; filename=customers.csv")

        val writer = response.writer
        if (customers.isEmpty()) {
            writer.println("No customer data available")
        } else {
            writer.println("ID,First Name,Last Name,Date of Birth,Country Code,Country Name,Phone Number,Created At,Updated At")
            customers.forEach { c ->
                writer.println("${c.id},${c.firstName},${c.lastName},${c.dateOfBirth},${c.countryCode},${c.countryName},${c.phoneNumber},${c.createdAt},${c.updatedAt}")
            }
        }
        writer.flush()
    }
}
