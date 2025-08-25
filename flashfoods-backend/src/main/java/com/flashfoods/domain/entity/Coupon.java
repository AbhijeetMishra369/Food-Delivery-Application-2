package com.flashfoods.domain.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private Integer percentOff; // 0-100
    private Integer maxOffCents; // optional cap
    private Instant validFrom;
    private Instant validUntil;
    private Boolean active = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Integer getPercentOff() { return percentOff; }
    public void setPercentOff(Integer percentOff) { this.percentOff = percentOff; }
    public Integer getMaxOffCents() { return maxOffCents; }
    public void setMaxOffCents(Integer maxOffCents) { this.maxOffCents = maxOffCents; }
    public Instant getValidFrom() { return validFrom; }
    public void setValidFrom(Instant validFrom) { this.validFrom = validFrom; }
    public Instant getValidUntil() { return validUntil; }
    public void setValidUntil(Instant validUntil) { this.validUntil = validUntil; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

