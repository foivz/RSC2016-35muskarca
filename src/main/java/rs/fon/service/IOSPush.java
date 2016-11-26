/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import com.sun.jersey.spi.inject.Errors;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import rs.fon.pojo.SendNotification;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.codehaus.jackson.map.ObjectMapper;
import rs.fon.exception.NotAuthorizedException;
import rs.fon.pojo.IosNotification;
import rs.fon.util.IOSPushNotification;

/**
 *
 * @author stefan
 */
@Path("ios")
public class IOSPush {
    
    IOSPushNotification iosNotification = new IOSPushNotification();

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("push")
    public Response pushNotification(SendNotification notification) {
        try {
            ObjectMapper mapper = new ObjectMapper();
//        String apiKey = apiKeysBean.getKey(notification.getApplicationName(), "IOS");
            IosNotification pojo;
            try {
                pojo = mapper.convertValue(notification.getIosNotification(), IosNotification.class);
            } catch (IllegalArgumentException e) {
                throw new NotAuthorizedException("Los body data");
            }
            String a = iosNotification.pushNotification(mapper.writeValueAsString(pojo), "", notification.getDevices());
            return Response.ok().entity(a).build();
        } catch (IOException ex) {
            Logger.getLogger(IOSPush.class.getName()).log(Level.SEVERE, null, ex);
            return Response.status(400).entity("Nije poslo push").build();
        }
    }

}
