package com.loading.solicitacoes.solicitacoes.entity.dto;

import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;
import com.loading.solicitacoes.solicitacoes.entity.StatusEnum;

import java.util.UUID;

public record SolicitationResponseDTO(UUID solicitationId, String title, String description, StatusEnum status, String category, PriorityEnum priority) {
}
