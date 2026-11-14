package com.loading.solicitacoes.solicitacoes.entity.dto;

import com.loading.solicitacoes.solicitacoes.entity.CategoryEnum;
import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;
import com.loading.solicitacoes.solicitacoes.entity.StatusEnum;

import java.time.Instant;
import java.util.UUID;

public record SolicitationResponseDTO(UUID solicitationId, String title,
                                      String description,
                                      StatusEnum status,
                                      CategoryEnum category,
                                      PriorityEnum priority,
                                      Instant startedAt,
                                      Instant completedAt) {
}
