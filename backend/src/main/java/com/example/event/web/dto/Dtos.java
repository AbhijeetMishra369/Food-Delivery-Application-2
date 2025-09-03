package com.example.event.web.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class Dtos {
    public record CreateEventRequest(
            @NotBlank String name,
            String description,
            @NotNull LocalDate date,
            @NotNull LocalTime time,
            @NotBlank String venue,
            List<TicketTypeInput> ticketTypes
    ) {}

    public record TicketTypeInput(@NotBlank String name, @NotNull BigDecimal price, @NotNull Integer totalAvailable) {}

    public record PurchaseRequest(@NotNull Long eventId, @NotNull Long ticketTypeId) {}

    public record ValidateTicketRequest(@NotBlank String code) {}

    public record ValidateTicketResponse(boolean valid, Long id) {}
}

