/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import java.util.Date;
import java.util.List;
import javax.persistence.EntityManager;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import rs.fon.domain.Quiz;
import rs.fon.domain.UserAccount;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.QuizPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;

/**
 *
 * @author stefan
 */
@Path("quiz")
public class QuizEndpoint {

    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();

    public QuizEndpoint() {
        tokenHelper = new Base64Token();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createQuiz(@HeaderParam("authorization") String token, QuizPojo pojo) {
        EntityManager em = EMF.createEntityManager();

        Integer id = Integer.parseInt(tokenHelper.decode(token).split("##")[1]);
        Quiz q = QuizPojo.createQuiz(pojo);
        q.setId(new UserAccount(id));
        manager.persist(em, q);

        pojo.setId(id);
        pojo.setIdquiz(q.getId().getId());

        DarkoResponse dr = new DarkoResponse(true, pojo, null);
        return Response.ok().entity(dr).build();
    }

    @GET
    @Path("active")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuiz() {
        EntityManager em = EMF.createEntityManager();
        List<Quiz> resultList = em.createQuery("SELECT q FROM Quiz q WHERE q.enddate > :enddate", Quiz.class).setParameter("enddate", new Date()).getResultList();
        List<QuizPojo> toQuizPojo = QuizPojo.toQuizPojo(resultList);
        DarkoResponse dr = new DarkoResponse(true, toQuizPojo, null);
        return Response.ok().entity(dr).build();
    }

    @GET
    @Path("admin")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuiz(@HeaderParam("authorization") String token) {
        EntityManager em = EMF.createEntityManager();
        Integer id = Integer.parseInt(tokenHelper.decode(token).split("##")[1]);
        List<Quiz> resultList = em.createQuery("SELECT q FROM Quiz q WHERE q.id=:id AND q.enddate > :enddate", Quiz.class).setParameter("enddate", new Date()).setParameter("id", id).getResultList();
        List<QuizPojo> toQuizPojo = QuizPojo.toQuizPojo(resultList);
        DarkoResponse dr = new DarkoResponse(true, toQuizPojo, null);
        return Response.ok().entity(dr).build();
    }

}
