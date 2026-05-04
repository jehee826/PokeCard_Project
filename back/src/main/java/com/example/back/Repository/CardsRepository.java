package com.example.back.Repository;

import com.example.back.Entity.CardsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardsRepository extends JpaRepository<CardsEntity, Long> {
}
