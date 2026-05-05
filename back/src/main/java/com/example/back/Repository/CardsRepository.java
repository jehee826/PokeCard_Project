package com.example.back.Repository;

import com.example.back.Entity.CardsEntity;
import com.example.back.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardsRepository extends JpaRepository<CardsEntity, Long> {

    Optional<CardsEntity> findByCardNumber(String cardNumber);
}
