package com.ticketsystem.service;

import com.ticketsystem.dto.CommentRequest;
import com.ticketsystem.dto.CommentResponse;
import com.ticketsystem.entity.Comment;
import com.ticketsystem.entity.Ticket;
import com.ticketsystem.entity.User;
import com.ticketsystem.exception.ResourceNotFoundException;
import com.ticketsystem.repository.CommentRepository;
import com.ticketsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private UserService userService;
    
    public CommentResponse addComment(Long ticketId, CommentRequest request, User user) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        
        return convertToResponse(commentRepository.save(comment));
    }
    
    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        
        return commentRepository.findByTicketOrderByCreatedAtAsc(ticket).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        commentRepository.delete(comment);
    }
    
    private CommentResponse convertToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUser(userService.convertToDTO(comment.getUser()));
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }
}
