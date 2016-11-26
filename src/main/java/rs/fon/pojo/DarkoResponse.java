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
public class DarkoResponse {
    
    private boolean success;
    private Object payload;
    private String error;

    public DarkoResponse() {
    }

    public DarkoResponse(boolean success, Object payload, String error) {
        this.success = success;
        this.payload = payload;
        this.error = error;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
    
}
