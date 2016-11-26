/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.logging.annotations.Param;
import rs.fon.domain.UserAccount;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.exception.NotAuthorizedException;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.UserPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;

import java.util.List;

/**
 *
 * @author stefan
 */
@Path("users")
public class UserEndpoint {

    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();

    public UserEndpoint() {
        tokenHelper = new Base64Token();
    }

    public Response checkToken(@HeaderParam("authorization") String token) {
        try {
            EntityManager em = EMF.createEntityManager();
            Integer id = Integer.parseInt(tokenHelper.decode(token).split("##")[1]);
            UserAccount user = em.createNamedQuery("UserAccount.findById", UserAccount.class).setParameter("id", id).getSingleResult();
            return Response.ok().entity(new DarkoResponse(true, new UserPojo(user), null)).build();
        } catch (Exception e) {
            return Response.ok().entity(new DarkoResponse(false, null, "Ne valja token.")).build();
        }
    }

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logIn(UserPojo pojo) {

        EntityManager em = EMF.createEntityManager();
        UserAccount user = null;
        try {
            user = (UserAccount) em
                    .createQuery("SELECT u FROM UserAccount u WHERE u.username = :userName")
                    .setParameter("userName", pojo.getUsername())
                    .getSingleResult();
        } catch (NoResultException e) {
            return Response.ok().entity(new DarkoResponse(false, null, "Username ne valja")).build();
        }

        if (!pojo.getPassword().equals(user.getPassword())) {
            return Response.ok().entity(new DarkoResponse(false, null, "Password ne valja")).build();
        }

        if (user.getToken() == null || user.getToken().equals("")) {
            user.setToken(tokenHelper.createToken(user.getId()));
            manager.merge(em, user);
        }
        UserPojo ur = new UserPojo(user);
        ur.setToken(tokenHelper.encode(ur.getToken()));
        DarkoResponse dr = new DarkoResponse(true, ur, null);
        return Response.ok().entity(dr).build();
    }

    @POST
    @Path("/pushRegistration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response pushRegistration(@HeaderParam("authorization") String token, UserPojo userPushToken) {
        try {
            EntityManager em = EMF.createEntityManager();
            manager.checkUser(em, token);
            UserAccount user = null;
            try {
                user = (UserAccount) em
                        .createQuery("SELECT u FROM UserAccount u WHERE u.token = :token")
                        .setParameter("token", tokenHelper.decode(token))
                        .getSingleResult();
                user.setPushToken(userPushToken.getPushtoken());
                manager.merge(em, user);
            } catch (NoResultException e) {
                return Response.ok().entity(new DarkoResponse(false, null, "Token ne valja")).build();
            }
            UserPojo ur = new UserPojo(user);
            DarkoResponse dr = new DarkoResponse(true, ur, null);
            return Response.ok().entity(dr).build();
        } catch (Exception e) {
            return Response.ok().entity(new DarkoResponse(false, null, "Ne valja token.")).build();
        }

    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/logout")
    public Response logOut(@HeaderParam("authorization") String token) {
        EntityManager em = EMF.createEntityManager();
        manager.checkUser(em, token); //!!
        UserAccount user = em.find(UserAccount.class, Integer.parseInt(tokenHelper.decode(token).split("##")[1]));
        user.setToken(null);
        manager.merge(em, user);
        return Response.ok().entity(new DarkoResponse(true, null, null)).build();
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(UserPojo userPojo) {
        try {
            EntityManager em = EMF.createEntityManager();
            UserAccount user = new UserAccount();

            user.setUsername(userPojo.getUsername());
            user.setPassword(userPojo.getPassword());
            user.setFullname(userPojo.getFullname());
            user.setId(null);
            manager.persist(em, user);
            return Response.ok().entity(new DarkoResponse(true, new UserPojo(user), null)).build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Response.ok().entity(new DarkoResponse(false, null, "Registracija nije uspela.")).build();
        }
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@HeaderParam("authorization") String token) {
        try {
            EntityManager em = EMF.createEntityManager();
            manager.checkUser(em, token);
            List<UserAccount> users = em.createNamedQuery("UserAccount.findAll", UserAccount.class).getResultList();
            em.close();
            return Response.ok().entity(new DarkoResponse(true, UserPojo.getList(users), null)).build();
        } catch (Exception e) {
            return Response.ok().entity(new DarkoResponse(false, null, "Ne valja token.")).build();
        }
    }

}
