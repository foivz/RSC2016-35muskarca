/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import java.util.List;

/**
 *
 * @author marko
 */
public class SendNotification {
    
    private String applicationName;
    private IosNotification iosNotification;
    private List<String> devices;

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public IosNotification getIosNotification() {
        return iosNotification;
    }

    public void setIosNotification(IosNotification iosNotification) {
        this.iosNotification = iosNotification;
    }

    public List<String> getDevices() {
        return devices;
    }

    public void setDevices(List<String> devices) {
        this.devices = devices;
    }
    
    
}
