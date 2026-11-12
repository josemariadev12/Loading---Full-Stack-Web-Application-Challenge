package com.loading.solicitacoes.solicitacoes.repository;

import com.loading.solicitacoes.solicitacoes.entity.Solicitation;
import com.loading.solicitacoes.solicitacoes.entity.dto.SolicitationRequestDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface Repository extends JpaRepository<Solicitation, UUID> {
    List<Solicitation> findByTitleAndDescription(String title, String description);
}
