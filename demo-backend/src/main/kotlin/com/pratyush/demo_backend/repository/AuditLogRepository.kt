package com.pratyush.demo_backend.repository

import com.pratyush.demo_backend.entity.AuditLog
import org.springframework.data.jpa.repository.JpaRepository

interface AuditLogRepository : JpaRepository<AuditLog, Long>
