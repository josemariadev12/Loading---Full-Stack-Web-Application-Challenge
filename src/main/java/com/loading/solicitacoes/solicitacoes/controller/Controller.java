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

@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*"
)


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
        //Correct way: only return 201 CREATED.
    }

    @GetMapping("/filtros")
    public ResponseEntity<List<SolicitationResponseDTO>> filtrar(@RequestParam StatusEnum status,
                                                                 @RequestParam PriorityEnum priority){
        return ResponseEntity.ok(service.filtroSolicitation(status, priority));
    }

    @PostMapping("/aceitar")
    public ResponseEntity<String> aceitarSolicitacao(@RequestBody SolicitationResponseDTO dto){
        service.aceitarSolicitation(dto);
        return ResponseEntity.ok("Solicitação aceita!");
    }

    @PostMapping("/concluir")
    public ResponseEntity<String> concluirSolicitacao( @RequestBody SolicitationResponseDTO dto){
        service.concluirSolicitation(dto);
        return ResponseEntity.ok("Solicitação concluida com sucesso!");
    }


}
