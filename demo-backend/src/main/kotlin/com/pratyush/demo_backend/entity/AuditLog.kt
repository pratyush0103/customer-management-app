package com.pratyush.demo_backend.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "audit_logs")
data class AuditLog(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val entityName: String,

    @Column(nullable = false)
    val entityId: Long,

    @Column(nullable = false)
    val action: String,   // CREATE, UPDATE, DELETE

    @Column(columnDefinition = "TEXT")
    val changes: String,  // JSON summary of what changed

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    val timestamp: LocalDateTime = LocalDateTime.now()
)
