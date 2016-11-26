/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 *
 * @author stefan
 */
@Path("OK")
public class OK {
    
    @GET
    public Response ok() {
        return Response.ok().build();
    }
}
