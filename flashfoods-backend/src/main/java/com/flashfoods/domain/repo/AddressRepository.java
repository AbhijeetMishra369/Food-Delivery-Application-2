package com.flashfoods.domain.repo;

import com.flashfoods.domain.entity.Address;
import com.flashfoods.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserOrderByIdDesc(User user);
}

