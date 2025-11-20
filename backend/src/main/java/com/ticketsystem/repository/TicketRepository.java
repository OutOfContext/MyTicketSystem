package com.ticketsystem.repository;

import com.ticketsystem.entity.Ticket;
import com.ticketsystem.entity.TicketStatus;
import com.ticketsystem.entity.Priority;
import com.ticketsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    List<Ticket> findByCreatedBy(User user);
    List<Ticket> findByAssignedTo(User user);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(Priority priority);
}
