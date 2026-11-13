package com.loading.solicitacoes.solicitacoes.controller;


import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;
import com.loading.solicitacoes.solicitacoes.entity.StatusEnum;
import com.loading.solicitacoes.solicitacoes.entity.dto.SolicitationRequestDTO;
import com.loading.solicitacoes.solicitacoes.entity.dto.SolicitationResponseDTO;
import com.loading.solicitacoes.solicitacoes.service.Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("loading/central-solicitacoes/")
public class Controller {
    private final Service service;

    @GetMapping("/consultar")
    public ResponseEntity<List<SolicitationResponseDTO>> consultar(){
        List<SolicitationResponseDTO> sol = service.consultarSolicitations();
        return ResponseEntity.ok(sol);
    }

    @PostMapping("/registrar")
    public ResponseEntity<SolicitationResponseDTO> criar(@Valid @RequestBody SolicitationRequestDTO dto){
        return ResponseEntity.ok(service.registerSolicitation(dto));
    }

    //FIXED: COMPONENT @VALID ON ENTITYS AND DTOS
    //FEAT: CONTROLLER - FALTA APENAS FILTRO, ACEITAR E CONCLUIR

    @GetMapping("/filtros")
    public ResponseEntity<List<SolicitationResponseDTO>> filtrar(@RequestParam StatusEnum status,
                                                                 @RequestParam PriorityEnum priority){
        return ResponseEntity.ok(service.filtroSolicitation(status, priority));
    }

    @PostMapping("/aceitar")
    public ResponseEntity aceitarSolicitacao(@RequestBody SolicitationResponseDTO dto){
        service.aceitarSolicitation(dto);
        return ResponseEntity.ok().body("Solicitação aceita!");
    }

    @PostMapping("/concluir")
    public ResponseEntity concluirSolicitacao( @RequestBody SolicitationResponseDTO dto){
        service.concluirSolicitation(dto);
        return ResponseEntity.ok().body("Solicitação concluida com sucesso!");
    }


}
