package com.loading.solicitacoes.shared.exception;


public class SolicitationNotExists extends RuntimeException{
    public SolicitationNotExists(){
        super("Solicitacao não existe");
    }

    public SolicitationNotExists(String message){
        super(message);
    }
}
