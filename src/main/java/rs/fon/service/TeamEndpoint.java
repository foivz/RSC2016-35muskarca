/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
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
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerTeamForQuiz(@PathParam("teamId") Integer teamId, @PathParam("quizId") Integer quizId) {
        EntityManager em = EMF.createEntityManager();
        try {
            RegistrationQuizTeam singleResult = em.createQuery("select r from RegistrationQuizTeam r where r.idquiz.idquiz =:qt AND r.idteam.idteam=:tt", RegistrationQuizTeam.class).setParameter("qt", quizId).setParameter("tt", teamId).getSingleResult();
        } catch (NoResultException e) {
            DarkoResponse dr = new DarkoResponse(false, null, "You are allready registred for this event.");
            em.close();
            return Response.ok().entity(dr).build();
        }
        RegistrationQuizTeam r = new RegistrationQuizTeam();
        r.setIdteam(new Team(teamId));
        r.setIdquiz(new Quiz(quizId));
        r.setPin(r.getIdregistration() + "qgv4a");
        manager.persist(em, r);
        Map map = new HashMap();
        map.put("pin", r.getPin());
        DarkoResponse dr = new DarkoResponse(true, map, null);
        em.close();
        return Response.ok().entity(dr).build();
    }

    @GET
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTeams(@HeaderParam("authorization") String socid) {
        EntityManager em = EMF.createEntityManager();
        List<Team> resultList = em.createQuery("SELECT tt from UserPlayer tm left join tm.teamList tt WHERE tm.socialnetid=:sid", Team.class).setParameter("sid", socid).getResultList();
        List<TeamPojo> toPojo = TeamPojo.toPojo(resultList);
        DarkoResponse dr = new DarkoResponse(true, toPojo, null);
        em.close();
        return Response.ok().entity(dr).build();
    }

    @POST
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTeam(@HeaderParam("authorization") String socid, @QueryParam("name") String name) {
        EntityManager em = EMF.createEntityManager();
        Team t = new Team();
        t.setTeamname(name);
        UserPlayer singleResult = em.createNamedQuery("UserPlayer.findBySocialnetid", UserPlayer.class).setParameter("socialnetid", socid).getSingleResult();
        t.setUserPlayerList(Arrays.asList(singleResult));
        manager.persist(em, t);
        singleResult.setTeamList(Arrays.asList(t));
        manager.persist(em, singleResult);
        DarkoResponse dr = new DarkoResponse(true, t.getIdteam() + "af124a", null);
        em.close();
        return Response.ok().entity(dr).build();
    }
}
