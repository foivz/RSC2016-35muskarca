/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.util.ios;

import java.util.Map;

/**
 *
 * @author marko
 */
public class MessageIOS {
    
    private String alertBody;
    private String alertTitle;
    private String sound;
    private int badge;

    public MessageIOS() {
    }

    public MessageIOS(String alertBody, String alertTitle, String sound, int badge) {
        this.alertBody = alertBody;
        this.alertTitle = alertTitle;
        this.sound = sound;
        this.badge = badge;
    }

    public String getAlertBody() {
        return alertBody;
    }

    public void setAlertBody(String alertBody) {
        this.alertBody = alertBody;
    }

    public String getAlertTitle() {
        return alertTitle;
    }

    public void setAlertTitle(String alertTitle) {
        this.alertTitle = alertTitle;
    }

    public String getSound() {
        return sound;
    }

    public void setSound(String sound) {
        this.sound = sound;
    }

    public int getBadge() {
        return badge;
    }

    public void setBadge(int badge) {
        this.badge = badge;
    }
    
}
