package com.loading.solicitacoes.shared.exception;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class ExceptionGlobalHandler {

    //Transform Exception to Error (Json)
    public ApiError toError(String ex, HttpServletRequest http, HttpStatus status){
        var apiError = ApiError
                .builder()
                .timestamp(LocalDateTime.now())
                .httpStatus(status)
                .error(ex)
                .path(http.getRequestURI())
                .build();

        return apiError;
    }

    //exceções usada
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> illegalArgumentException(IllegalArgumentException ex, HttpServletRequest http){
        return ResponseEntity.badRequest().body(toError(ex.getMessage(),http,HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) //exceção jogada pelo @valid / exception from @valid
    public ResponseEntity<ApiError> methodArgumentNotValidException(HttpServletRequest http){
        return ResponseEntity.badRequest().body(toError("Preencha os dados corretamente",http,HttpStatus.BAD_REQUEST));
    }








}
