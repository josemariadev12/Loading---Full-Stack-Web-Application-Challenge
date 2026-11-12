package com.loading.solicitacoes.solicitacoes.entity.dto;

import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;

public record SolicitationRequestDTO(String title, String description, String category, PriorityEnum priority) {
}
