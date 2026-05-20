package com.example.back.Repository;

import com.example.back.Entity.CardSetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardSetRepository extends JpaRepository<CardSetEntity, Long> {
}
