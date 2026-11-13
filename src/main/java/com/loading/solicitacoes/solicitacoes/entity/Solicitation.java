package com.loading.solicitacoes.solicitacoes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
    @Version
    private Long version;
    @NotBlank @Column(nullable = false)
    private String title;
    @NotBlank @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING) @NotNull
    private StatusEnum status;

    @NotBlank @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING) @NotNull
    private PriorityEnum priority;
}
