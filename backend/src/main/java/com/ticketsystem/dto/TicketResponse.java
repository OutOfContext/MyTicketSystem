package com.ticketsystem.dto;

import com.ticketsystem.entity.Priority;
import com.ticketsystem.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private UserDTO createdBy;
    private UserDTO assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int commentCount;
}
