package com.loading.solicitacoes.solicitacoes.service;


import com.loading.solicitacoes.solicitacoes.entity.PriorityEnum;
import com.loading.solicitacoes.solicitacoes.entity.Solicitation;
import com.loading.solicitacoes.solicitacoes.entity.StatusEnum;
import com.loading.solicitacoes.solicitacoes.entity.dto.SolicitationRequestDTO;
import com.loading.solicitacoes.solicitacoes.entity.dto.SolicitationResponseDTO;
import com.loading.solicitacoes.solicitacoes.repository.Repository;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.stream.Stream;


@org.springframework.stereotype.Service
@AllArgsConstructor
public class Service {

    private final Repository repository;


    //Transforma uma Requisiçao em Entitade de Solicitação / Transform Request to Entity
    public Solicitation toEntity(SolicitationRequestDTO dto){
        var solicitation = new Solicitation();

        solicitation.setTitle(dto.title()); //SETTING RECEIVED CONTENT / RECEBENDO O CONTEUDO
        solicitation.setDescription(dto.description());
        solicitation.setCategory(dto.category());
        solicitation.setPriority(dto.priority());

        solicitation.setStatus(StatusEnum.ABERTA);

        return solicitation;

    }

    //Transformando uma Solicitação em DTO
    public SolicitationResponseDTO toDTO(Solicitation sol){
        return new SolicitationResponseDTO(sol.getSolicitationId(),sol.getTitle(),sol.getDescription(),sol.getStatus(),sol.getCategory(),sol.getPriority());

    }

    //criando solicitação / create solicitate
    public SolicitationResponseDTO registerSolicitation(SolicitationRequestDTO dto){
        //evitar "duplicatas" / avoid duplicates
       if( repository.findByTitleAndDescription(dto.title(), dto.description()).isEmpty()){
            var solicitate = toEntity(dto);
            repository.save(solicitate);

            return toDTO(solicitate);

        }else throw new IllegalArgumentException("Solicitação já existe");
    }

    //o retorno de um ResponseEntity http 200 (OK) deve satisfazer a condição e reduzir numero de duplicatas
    // return ResponseEntity http 200 (ok) should be reduced number of duplicates.


    //Lista todas as solicitações feitas
    public List<SolicitationResponseDTO> consultarSolicitations(){

        List<SolicitationResponseDTO> solicitate = repository.findAll().stream().map(solicitation -> toDTO(solicitation)).toList();
        return repository.findAll().stream().map( this :: toDTO).toList();
    }

    //Lista todas as solicitações filtradas em status e prioridades
    public List<SolicitationResponseDTO> filtroSolicitation(StatusEnum status , PriorityEnum priority){


        Stream<Solicitation> solicitations = repository.findAll().stream(); //percorre todo o repository

        //verifica se nenhuma dos filtros são nulos
        if(status != null) solicitations =solicitations.filter(solicitation -> solicitation.getStatus() == status);
        if( priority != null) solicitations = solicitations.filter(solicitation -> solicitation.getPriority() == priority);

        return solicitations.map(this::toDTO).toList();
    }

    //fazer RF04 — Regra de negócio: Controlar o fluxo Aberta → Em andamento → Concluída. Não permitir
    //saltar etapas diretamente


}
