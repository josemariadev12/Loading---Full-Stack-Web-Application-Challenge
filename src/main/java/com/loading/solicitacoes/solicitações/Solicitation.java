package com.loading.solicitacoes.solicitações;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Solicitacao")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Solicitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long solicitationId;

    @NotBlank @NotEmpty
    private String title;
    @NotBlank @NotEmpty
    private String description;

    @Enumerated(EnumType.STRING)
    private StatusEnum status;
    private String category;

    @Enumerated(EnumType.STRING)
    private PriorityEnum priority;
}
