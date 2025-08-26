package com.flashfoods.web;

import com.flashfoods.domain.entity.Address;
import com.flashfoods.domain.entity.User;
import com.flashfoods.domain.repo.AddressRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    record AddressBody(@NotBlank String line1, String line2, @NotBlank String city, @NotBlank String state, @NotBlank String pincode, String landmark, Boolean isDefault) {}

    private final AddressRepository addressRepository;
    private final CurrentUser currentUser;

    public AddressController(AddressRepository addressRepository, CurrentUser currentUser) {
        this.addressRepository = addressRepository;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<Address> list() {
        return addressRepository.findByUserOrderByIdDesc(currentUser.get());
    }

    @PostMapping
    public ResponseEntity<Address> create(@Valid @RequestBody AddressBody body) {
        User user = currentUser.get();
        Address a = new Address();
        a.setUser(user);
        a.setLine1(body.line1());
        a.setLine2(body.line2());
        a.setCity(body.city());
        a.setState(body.state());
        a.setPincode(body.pincode());
        a.setLandmark(body.landmark());
        a.setDefault(Boolean.TRUE.equals(body.isDefault()));
        return ResponseEntity.ok(addressRepository.save(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> update(@PathVariable Long id, @Valid @RequestBody AddressBody body) {
        User user = currentUser.get();
        return addressRepository.findById(id).filter(a -> a.getUser().getId().equals(user.getId())).map(a -> {
            a.setLine1(body.line1());
            a.setLine2(body.line2());
            a.setCity(body.city());
            a.setState(body.state());
            a.setPincode(body.pincode());
            a.setLandmark(body.landmark());
            a.setDefault(Boolean.TRUE.equals(body.isDefault()));
            return ResponseEntity.ok(addressRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User user = currentUser.get();
        return addressRepository.findById(id).filter(a -> a.getUser().getId().equals(user.getId())).map(a -> {
            addressRepository.delete(a);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

