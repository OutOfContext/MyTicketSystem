package com.ticketsystem.controller;

import com.ticketsystem.dto.TicketRequest;
import com.ticketsystem.dto.TicketResponse;
import com.ticketsystem.entity.Priority;
import com.ticketsystem.entity.TicketStatus;
import com.ticketsystem.entity.User;
import com.ticketsystem.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tickets", description = "Ticket management APIs")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @PostMapping
    @Operation(summary = "Create a new ticket")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal User user) {
        TicketResponse response = ticketService.createTicket(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    @Operation(summary = "Get all tickets")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get ticket by ID")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a ticket")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request, user));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @Operation(summary = "Update ticket status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a ticket")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search tickets")
    public ResponseEntity<List<TicketResponse>> searchTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority) {
        return ResponseEntity.ok(ticketService.searchTickets(search, status, priority));
    }
    
    @GetMapping("/my-tickets")
    @Operation(summary = "Get tickets created by current user")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getMyTickets(user));
    }
    
    @GetMapping("/assigned-to-me")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @Operation(summary = "Get tickets assigned to current user")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(user));
    }
}
