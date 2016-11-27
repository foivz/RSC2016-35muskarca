/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

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
import rs.fon.domain.Question;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.QuestionPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;

/**
 *
 * @author stefan
 */
@Path("questions")
public class QuestionsEndpoint {

    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();

    public QuestionsEndpoint() {
        tokenHelper = new Base64Token();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createQuestion(@HeaderParam("authorization") String token, QuestionPojo pojo) {
        EntityManager em = EMF.createEntityManager();

        Integer id = Integer.parseInt(tokenHelper.decode(token).split("##")[1]);
        Question q = QuestionPojo.createQuestion(pojo, id);
        manager.persist(em, q);

        em.close();
        DarkoResponse dr = new DarkoResponse(true, null, null);
        return Response.ok().entity(dr).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getQuestions(@HeaderParam("authorization") String token) {
        EntityManager em = EMF.createEntityManager();
        System.out.println("**************");
        System.out.println(token);
        Integer id = Integer.parseInt(tokenHelper.decode(token).split("##")[1]);

        List<Question> resultList = em.createQuery("SELECT q FROM Question q WHERE q.adminid.id=:id", Question.class).setParameter("id", id).getResultList();
        List<QuestionPojo> toQuizPojo = QuestionPojo.toQPojo(resultList);
        em.close();
        DarkoResponse dr = new DarkoResponse(true, toQuizPojo, null);
        return Response.ok().entity(dr).build();
    }

}
