package com.loading.solicitacoes.solicitacoes.entity.dto;

import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record SolicitationRequestDTO(@NotBlank @NotEmpty String title,
                                     @NotBlank @NotEmpty String description,
                                     @NotBlank @NotEmpty String category,
                                     @NotNull PriorityEnum priority) {
}
