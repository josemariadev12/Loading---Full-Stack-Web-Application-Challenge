package com.loading.solicitacoes.shared.exception;

import lombok.Builder;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Builder
public record ApiError(
    LocalDateTime timestamp,
    HttpStatus httpStatus,
    String error,
    String path

){}
