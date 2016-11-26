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
public class UserPlayerLoginPojo {

    private String email;
    private String image;
    private String name;
    private String socialnetid;
    private String pushtoken;
    private String token;

    public UserPlayerLoginPojo() {
    }

    public UserPlayerLoginPojo(String email, String image, String name, String socialnetid, String pushtoken, String token) {
        this.email = email;
        this.image = image;
        this.name = name;
        this.socialnetid = socialnetid;
        this.pushtoken = pushtoken;
        this.token = token;
    }

    public static UserPlayer createQuiz(UserPlayerLoginPojo p) {
        UserPlayer q = new UserPlayer();
        q.setName(p.getName());
        q.setEmail(p.getEmail());
        q.setImage(p.getImage());
        q.setToken(p.getToken());
        q.setPushtoken(p.getPushtoken());
        q.setSocialnetid(p.getSocialnetid());
        return q;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSocialnetid() {
        return socialnetid;
    }

    public void setSocialnetid(String socialnetid) {
        this.socialnetid = socialnetid;
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
