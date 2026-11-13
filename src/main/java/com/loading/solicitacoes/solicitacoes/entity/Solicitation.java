package com.loading.solicitacoes.solicitacoes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "Solicitacao")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Solicitation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID solicitationId;

    @NotBlank @NotEmpty
    private String title;
    @NotBlank @NotEmpty
    private String description;

    @Enumerated(EnumType.STRING) @Version
    private StatusEnum status;

    @NotEmpty @NotBlank
    private String category;

    @Enumerated(EnumType.STRING) @NotEmpty @NotBlank
    private PriorityEnum priority;
}
