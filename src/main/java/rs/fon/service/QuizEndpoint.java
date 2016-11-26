/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityManager;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import rs.fon.domain.Answer;
import rs.fon.domain.Question;
import rs.fon.domain.Quiz;
import rs.fon.domain.QuizQuestion;
import rs.fon.domain.Team;
import rs.fon.domain.UserAccount;
import rs.fon.domain.UserPlayer;
import rs.fon.emf.EMF;
import rs.fon.emf.Manager;
import rs.fon.pojo.DarkoResponse;
import rs.fon.pojo.QuestionAnswerPojo;
import rs.fon.pojo.QuizPojo;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;
import rs.fon.util.IOSPushNotification;

/**
 *
 * @author stefan
 */
@Path("quiz")
public class QuizEndpoint {

    AbstractTokenCreator tokenHelper;
    Manager manager = new Manager();
    IOSPushNotification iOSPushNotification = new IOSPushNotification();

    public QuizEndpoint() {
        tokenHelper = new Base64Token();
    }

    @POST
    @Path("{quizId}")
    public Response startQuiz(@HeaderParam("authorization") String token, @PathParam("quizId") Integer quizId) {
        EntityManager em = EMF.createEntityManager();
        List<UserPlayer> resultList = em.createQuery("SELECT u FROM Quiz q INNER JOIN q.registrationQuizTeamList r LEFT JOIN r.idteam t LEFT JOIN t.userPlayerList u WHERE q.idquiz = :id", UserPlayer.class).setParameter("id", quizId).getResultList();
        for (UserPlayer up : resultList) {
            String s = "{\"iosNotification\":{\"aps\":{\"alert\":\"Quiz is starting now. \",\"badge\":1,\"sound\":\"default\"},\"pushType\":\"quizStarted\"}}";
            iOSPushNotification.pushNotification(s, "", Arrays.asList(up.getPushtoken()));
        }
        DarkoResponse dr = new DarkoResponse(true, true, null);
        return Response.ok().entity(dr).build();
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
        List<Quiz> resultList = em.createQuery("SELECT q FROM Quiz q WHERE q.startdate > :startdate", Quiz.class).setParameter("startdate", new Date()).getResultList();
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
        List<Quiz> resultList = em.createQuery("SELECT q FROM Quiz q WHERE q.id.id=:id AND q.enddate < :enddate", Quiz.class).setParameter("enddate", new Date()).setParameter("id", id).getResultList();
        List<QuizPojo> toQuizPojo = QuizPojo.toQuizPojo(resultList);
        DarkoResponse dr = new DarkoResponse(true, toQuizPojo, null);
        return Response.ok().entity(dr).build();
    }

    @POST
    @Path("question")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuestionForQuiz(@HeaderParam("authorization") String socid, QuestionAnswerPojo qa) {
        EntityManager em = EMF.createEntityManager();
//        Integer id = Integer.parseInt(tokenHelper.decode(token).split("##")[1]);
        UserPlayer singleResult = em.createNamedQuery("UserPlayer.findBySocialnetid", UserPlayer.class).setParameter("socialnetid", socid).getSingleResult();

        //odgovorio
        if (qa.getQuestionid() != null && qa.getAnswerid() != null) {
            QuizQuestion qq = new QuizQuestion();
            qq.setUserPlayer(singleResult);
            qq.setTeam(new Team(qa.getTeamId()));
            qq.setQuiz(new Quiz(qa.getQuizid()));
            qq.setQuestion(new Question(qa.getQuestionid()));
            qq.setAnswer(new Answer(qa.getAnswerid()));
            qq.setTaken(true);
            manager.merge(em, qq);
        }
        //pass
        if (qa.getQuestionid() != null && qa.getAnswerid() == null) {
            QuizQuestion qq = new QuizQuestion();
            qq.setUserPlayer(null);
            qq.setAnswer(null);
            qq.setTaken(false);
//            qq.setQuiz(new Quiz(qa.getQuizid()));
//            qq.setQuestion(new Question(qa.getQuestionid()));
            manager.merge(em, qq);
        }
        //novo pitanje
        Quiz quiz = em.createQuery("SELECT q FROM Quiz q WHERE q.id.id=:id", Quiz.class).setParameter("id", qa.getQuizid()).getSingleResult();
        for (QuizQuestion col : quiz.getQuizQuestionList()) {
            if (!col.getTaken() && col.getAnswer() != null) {
                col.setTaken(true);
                col.setUserPlayer(singleResult);
                manager.merge(em, col);

                DarkoResponse dr = new DarkoResponse(true, col, null);
                return Response.ok().entity(dr).build();
            }
        }
        DarkoResponse dr = new DarkoResponse(true, false, null);
        return Response.ok().entity(dr).build();
    }

}
