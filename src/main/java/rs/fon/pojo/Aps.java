/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

/**
 *
 * @author stefan
 */
class Aps {
    
    private String alert;
    private Integer badge;
    private String sound;

    public Aps() {
    }

    public Aps(String alert, Integer badge, String sound) {
        this.alert = alert;
        this.badge = badge;
        this.sound = sound;
    }

    public String getSound() {
        return sound;
    }

    public void setSound(String sound) {
        this.sound = sound;
    }

    public String getAlert() {
        return alert;
    }

    public void setAlert(String alert) {
        this.alert = alert;
    }

    public Integer getBadge() {
        return badge;
    }

    public void setBadge(Integer badge) {
        this.badge = badge;
    }
    
}
