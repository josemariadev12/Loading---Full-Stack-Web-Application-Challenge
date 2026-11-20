package com.loading.solicitacoes.shared.exception;

public class SolicitationDuplicateException extends RuntimeException {
    public SolicitationDuplicateException(){
        super("Solicitacao já existe");
    }
    public SolicitationDuplicateException(String message){
        super(message);
    }
}
