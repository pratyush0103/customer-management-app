package com.pratyush.demo_backend.exception

import com.pratyush.demo_backend.service.CustomerNotFoundException
import com.pratyush.demo_backend.service.DuplicatePhoneException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice(basePackages = ["com.pratyush.demo_backend.controller"])
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val errors = ex.bindingResult.fieldErrors.associate { it.field to (it.defaultMessage ?: "Invalid") }
        return ResponseEntity.badRequest().body(ErrorResponse("Validation failed", errors))
    }

    @ExceptionHandler(CustomerNotFoundException::class)
    fun handleNotFound(ex: CustomerNotFoundException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(ex.message ?: "Not found"))
    }

    @ExceptionHandler(DuplicatePhoneException::class)
    fun handleDuplicate(ex: DuplicatePhoneException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ErrorResponse(ex.message ?: "Duplicate entry"))
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse("Something went wrong"))
    }
}

data class ErrorResponse(
    val message: String,
    val errors: Map<String, String>? = null
)
