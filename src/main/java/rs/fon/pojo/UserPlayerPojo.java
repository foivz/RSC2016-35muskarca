/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import rs.fon.domain.UserPlayer;

/**
 *
 * @author stefan
 */
public class UserPlayerPojo {

    private String email;
    private String image;
    private Integer iduserPlayer;
    private String name;
    private String surname;
    private Integer socialnetid;
    private String rang;
    private Integer badge;
    private String pushtoken;
    private String token;

    public UserPlayerPojo() {
    }

    public UserPlayerPojo(UserPlayer up) {
        this.email = up.getEmail();
        this.image = up.getImage();
        this.iduserPlayer = up.getIduserPlayer();
        this.name = up.getName();
        this.surname = up.getSurname();
        this.socialnetid = up.getSocialnetid();
        this.rang = up.getRang();
        this.badge = up.getBadge();
        this.pushtoken = up.getPushtoken();
        this.token = up.getToken();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getIduserPlayer() {
        return iduserPlayer;
    }

    public void setIduserPlayer(Integer iduserPlayer) {
        this.iduserPlayer = iduserPlayer;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Integer getSocialnetid() {
        return socialnetid;
    }

    public void setSocialnetid(Integer socialnetid) {
        this.socialnetid = socialnetid;
    }

    public String getRang() {
        return rang;
    }

    public void setRang(String rang) {
        this.rang = rang;
    }

    public Integer getBadge() {
        return badge;
    }

    public void setBadge(Integer badge) {
        this.badge = badge;
    }

    public String getPushtoken() {
        return pushtoken;
    }

    public void setPushtoken(String pushtoken) {
        this.pushtoken = pushtoken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
