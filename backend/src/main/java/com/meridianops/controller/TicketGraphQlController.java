package com.meridianops.controller;

import com.meridianops.entity.Ticket;
import com.meridianops.repository.TicketRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class TicketGraphQlController {

    private final TicketRepository ticketRepository;

    public TicketGraphQlController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @QueryMapping
    public List<Ticket> tickets() {
        return ticketRepository.findAll();
    }

    @QueryMapping
    public Ticket ticket(@Argument Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    @MutationMapping
    public Ticket updateTicketStatus(@Argument Long id, @Argument String status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    @SchemaMapping(typeName = "Ticket", field = "createdAt")
    public String createdAt(Ticket ticket) {
        return ticket.getCreatedAt() == null ? null : ticket.getCreatedAt().toString();
    }

    @SchemaMapping(typeName = "Ticket", field = "updatedAt")
    public String updatedAt(Ticket ticket) {
        return ticket.getUpdatedAt() == null ? null : ticket.getUpdatedAt().toString();
    }
}
