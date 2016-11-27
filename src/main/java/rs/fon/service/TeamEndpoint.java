/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import java.util.Arrays;
import java.util.List;
import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import rs.fon.domain.Quiz;
import rs.fon.domain.RegistrationQuizTeam;
import rs.fon.domain.Team;
import rs.fon.domain.UserPlayer;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.TeamPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;
import rs.fon.util.IOSPushNotification;

/**
 *
 * @author stefan
 */
@Path("teams")
public class TeamEndpoint {

    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();
    IOSPushNotification iOSPushNotification = new IOSPushNotification();

    public TeamEndpoint() {
        tokenHelper = new Base64Token();
    }

    @GET
    @Path("{teamId}/quiz/{quizId}")
    public Response registerTeamForQuiz(@PathParam("teamId") Integer teamId, @PathParam("quizId") Integer quizId) {
        EntityManager em = EMF.createEntityManager();
        RegistrationQuizTeam r = new RegistrationQuizTeam();
        r.setIdteam(new Team(teamId));
        r.setIdquiz(new Quiz(quizId));
        manager.persist(em, r);
        DarkoResponse dr = new DarkoResponse(true, true, null);
        em.close();
        return Response.ok().entity(dr).build();
    }
    
    @GET
    @Path("")
    public Response getTeams(@HeaderParam("authorization") String socid) {
        EntityManager em = EMF.createEntityManager();
        List<Team> resultList = em.createQuery("SELECT tt from UserPlayer tm left join tm.teamList tt WHERE tm.socialnetid=:sid", Team.class).setParameter("sid", socid).getResultList();
        List<TeamPojo> toPojo = TeamPojo.toPojo(resultList);
        DarkoResponse dr = new DarkoResponse(true, toPojo, null);
        em.close();
        return Response.ok().entity(dr).build();
    }

    @POST
    @Path("{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTeam(@HeaderParam("authorization") String socid, @PathParam("name") String name) {
        EntityManager em = EMF.createEntityManager();
        Team t = new Team();
        t.setTeamname(name);
        UserPlayer singleResult = em.createNamedQuery("UserPlayer.findBySocialnetid", UserPlayer.class).setParameter("socialnetid", socid).getSingleResult();
        t.setUserPlayerList(Arrays.asList(singleResult));
        manager.persist(em, t);
        singleResult.setTeamList(Arrays.asList(t));
        manager.persist(em, singleResult);
        DarkoResponse dr = new DarkoResponse(true, true, null);
        em.close();
        return Response.ok().entity(dr).build();
    }
}
