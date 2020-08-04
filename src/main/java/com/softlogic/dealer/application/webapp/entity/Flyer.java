package com.softlogic.dealer.application.webapp.entity;

import javax.persistence.*;

@Entity
public class Flyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String flyerName;

    private String flyerLink;

    private String flyerImagePath;

    public Integer getFlyerId() {
        return id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setFlyerId(Integer flyerId) {
        this.id = flyerId;
    }

    public String getFlyerName() {
        return flyerName;
    }

    public void setFlyerName(String flyerName) {
        this.flyerName = flyerName;
    }

    public String getFlyerLink() {
        return flyerLink;
    }

    public void setFlyerLink(String flyerLink) {
        this.flyerLink = flyerLink;
    }

    public String getFlyerImagePath() {
        return flyerImagePath;
    }

    public void setFlyerImagePath(String flyerImagePath) {
        this.flyerImagePath = flyerImagePath;
    }
}
