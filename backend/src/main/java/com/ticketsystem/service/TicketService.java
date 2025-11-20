package com.ticketsystem.service;

import com.ticketsystem.dto.TicketRequest;
import com.ticketsystem.dto.TicketResponse;
import com.ticketsystem.dto.UserDTO;
import com.ticketsystem.entity.*;
import com.ticketsystem.exception.ResourceNotFoundException;
import com.ticketsystem.repository.TicketRepository;
import com.ticketsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    public TicketResponse createTicket(TicketRequest request, User currentUser) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedBy(currentUser);
        ticket.setCreatedAt(LocalDateTime.now());
        
        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            ticket.setAssignedTo(assignedTo);
        }
        
        return convertToResponse(ticketRepository.save(ticket));
    }
    
    public TicketResponse updateTicket(Long id, TicketRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            ticket.setAssignedTo(assignedTo);
        }
        
        return convertToResponse(ticketRepository.save(ticket));
    }
    
    public TicketResponse updateTicketStatus(Long id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        return convertToResponse(ticketRepository.save(ticket));
    }
    
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return convertToResponse(ticket);
    }
    
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TicketResponse> searchTickets(String search, TicketStatus status, Priority priority) {
        Specification<Ticket> spec = Specification.where(null);
        
        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%")
                )
            );
        }
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        
        if (priority != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
        }
        
        return ticketRepository.findAll(spec).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TicketResponse> getMyTickets(User user) {
        return ticketRepository.findByCreatedBy(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TicketResponse> getAssignedTickets(User user) {
        return ticketRepository.findByAssignedTo(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        ticketRepository.delete(ticket);
    }
    
    private TicketResponse convertToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setStatus(ticket.getStatus());
        response.setPriority(ticket.getPriority());
        response.setCreatedBy(userService.convertToDTO(ticket.getCreatedBy()));
        response.setAssignedTo(ticket.getAssignedTo() != null ? userService.convertToDTO(ticket.getAssignedTo()) : null);
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setCommentCount(ticket.getComments() != null ? ticket.getComments().size() : 0);
        return response;
    }
}
