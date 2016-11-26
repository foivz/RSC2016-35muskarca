package rs.fon.service;

import rs.fon.domain.Quiz;
import rs.fon.domain.UserAccount;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.QuizPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;

import javax.persistence.EntityManager;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by marij on 11/26/2016.
 */
@Path("/team")
public class TeamEndpoint {
    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();

    public TeamEndpoint() {
        this.tokenHelper = new Base64Token();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createTeam(@HeaderParam("authorization") String token, QuizPojo pojo) {
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
}
