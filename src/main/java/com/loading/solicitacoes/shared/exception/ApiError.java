package com.loading.solicitacoes.shared.exception;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ApiError(
    LocalDateTime timestamp,
    int status,
    String error,
    String path

){}
