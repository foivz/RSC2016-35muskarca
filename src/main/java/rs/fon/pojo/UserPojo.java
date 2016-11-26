/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import rs.fon.domain.UserAccount;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author stefan
 */
public class UserPojo {
    
    private Integer id;
    private String username;
    private String password;
    private String token;
    private String fullname;
    private String pushToken;

    public UserPojo() {
    }

    public UserPojo(Integer id, String username, String password, String token, String fullname) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.token = token;
        this.fullname = fullname;
    }

    public UserPojo(UserAccount account) {
        this.id = account.getId();
        this.username = account.getUsername();
        this.password = account.getPassword();
        this.token = account.getToken();
        this.fullname = account.getFullname();
        this.pushToken = account.getPushToken();
    }

    public static List<UserPojo> getList(List<UserAccount> userAccountList) {
        List<UserPojo> li = new ArrayList<>();
        for (UserAccount ua : userAccountList) {
            li.add(new UserPojo(ua));
        }
        return li;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getPushtoken() {
        return pushToken;
    }

    public void setPushtoken(String pushtoken) {
        this.pushToken = pushtoken;
    }
}
