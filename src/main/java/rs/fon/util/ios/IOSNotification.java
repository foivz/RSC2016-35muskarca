/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.util.ios;

import java.util.List;
import java.util.Map;

/**
 *
 * @author marko
 */
public class IOSNotification {
    
//    private String applicationName;
    private String message;
    private Integer badge;
    private Map<String, Object> customData;

//    public String getApplicationName() {
//        return applicationName;
//    }
//
//    public void setApplicationName(String applicationName) {
//        this.applicationName = applicationName;
//    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getBadge() {
        return badge;
    }

    public void setBadge(Integer badge) {
        this.badge = badge;
    }

    public Map<String, Object> getCustomData() {
        return customData;
    }

    public void setCustomData(Map<String, Object> customData) {
        this.customData = customData;
    }
    
    
}
