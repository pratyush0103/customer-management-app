package com.pratyush.demo_backend.config

import com.pratyush.demo_backend.entity.Customer
import com.pratyush.demo_backend.repository.CustomerRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Profile
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import tools.jackson.databind.ObjectMapper
import tools.jackson.databind.node.ArrayNode
import java.time.LocalDate

@Component
@Profile("seed")
class DataSeeder(private val repository: CustomerRepository) : CommandLineRunner {

    override fun run(vararg args: String) {
        if (repository.count() > 0) {
            println(">>> DataSeeder: DB already has data, skipping seed.")
            return
        }

        try {
            val resource = ClassPathResource("customers-seed.json")
            val mapper = ObjectMapper()
            val tree = mapper.readTree(resource.inputStream) as ArrayNode

            tree.forEach { node ->
                repository.save(
                    Customer(
                        firstName = node.get("firstName").asText(),
                        lastName = node.get("lastName").asText(),
                        dateOfBirth = LocalDate.parse(node.get("dateOfBirth").asText()),
                        countryCode = node.get("countryCode").asText(),
                        countryName = node.get("countryName").asText(),
                        phoneNumber = node.get("phoneNumber").asText()
                    )
                )
            }
            println(">>> DataSeeder: Seeded ${tree.size()} customers.")
        } catch (e: Exception) {
            println(">>> DataSeeder: Error seeding data: ${e.message}")
        }
    }
}
