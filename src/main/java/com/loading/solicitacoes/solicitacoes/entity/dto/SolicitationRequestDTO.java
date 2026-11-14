package com.loading.solicitacoes.solicitacoes.entity.dto;

import com.loading.solicitacoes.solicitacoes.entity.CategoryEnum;
import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record SolicitationRequestDTO(@NotBlank @NotEmpty String title,
                                     @NotBlank @NotEmpty String description,
                                     @NotNull CategoryEnum category,
                                     @NotNull PriorityEnum priority) {
}
