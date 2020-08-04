package com.softlogic.dealer.application.webapp.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "incentives")
public class Incentive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer incentiveId;

    private Date incentiveAddedDate;

    private String incentiveAddedBy;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Double incentiveAmount;

    public Integer getIncentiveId() {
        return incentiveId;
    }

    public void setIncentiveId(Integer incentiveId) {
        this.incentiveId = incentiveId;
    }

    public Date getIncentiveAddedDate() {
        return incentiveAddedDate;
    }

    public void setIncentiveAddedDate(Date incentiveAddedDate) {
        this.incentiveAddedDate = incentiveAddedDate;
    }

    public String getIncentiveAddedBy() {
        return incentiveAddedBy;
    }

    public void setIncentiveAddedBy(String incentiveAddedBy) {
        this.incentiveAddedBy = incentiveAddedBy;
    }

    public Double getIncentiveAmount() {
        return incentiveAmount;
    }

    public void setIncentiveAmount(Double incentiveAmount) {
        this.incentiveAmount = incentiveAmount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
