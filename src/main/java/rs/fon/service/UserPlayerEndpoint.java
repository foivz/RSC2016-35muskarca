/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import rs.fon.domain.UserAccount;
import rs.fon.domain.UserPlayer;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.UserPlayerLoginPojo;
import rs.fon.pojo.UserPlayerPojo;
import rs.fon.pojo.UserPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;

/**
 *
 * @author stefan
 */
@Path("players")
public class UserPlayerEndpoint {

    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();

    public UserPlayerEndpoint() {
        tokenHelper = new Base64Token();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(UserPlayerLoginPojo loginPojo) {
        EntityManager em = EMF.createEntityManager();
        UserPlayer singleResult = null;
        try {
            singleResult = em.createNamedQuery("UserPlayer.findBySocialnetid", UserPlayer.class).setParameter("socialnetid", loginPojo.getSocialnetid()).getSingleResult();
        } catch (NoResultException nre) {
            singleResult = UserPlayerLoginPojo.createQuiz(loginPojo);
            manager.persist(em, singleResult);
        }
        DarkoResponse dr = new DarkoResponse(true, new UserPlayerPojo(singleResult), null);
        return Response.ok().entity(dr).build();
    }

    @POST
    @Path("/pushRegistration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response pushRegistration(UserPlayerLoginPojo loginPojo) {
        try {
            EntityManager em = EMF.createEntityManager();
            UserPlayer singleResult = em.createNamedQuery("UserPlayer.findBySocialnetid", UserPlayer.class).setParameter("socialnetid", loginPojo.getSocialnetid()).getSingleResult();
            singleResult.setPushtoken(loginPojo.getPushtoken());
            System.out.println("**************");
            System.out.println(loginPojo.getPushtoken());
            manager.merge(em, singleResult);
            System.out.println(singleResult.getPushtoken());
            em.close();
        } catch (NoResultException e) {
            return Response.ok().entity(new DarkoResponse(false, null, "Korisnik ne postoji.")).build();
        }
        DarkoResponse dr = new DarkoResponse(true, null, null);
        return Response.ok().entity(dr).build();

    }

}
