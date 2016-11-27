/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import rs.fon.domain.Quiz;

/**
 *
 * @author stefan
 */
public class QuizPojo {

    private Double longitude;
    private Double latitude;
    private String name;
    private String rang;
    private Integer maxparticipants;
    private Date startdate;
    private Date enddate;
    private Integer idquiz;
    private Integer id;
    private List<Integer> questions = new ArrayList<>();

    public QuizPojo() {
    }

    public QuizPojo(Double longitude, Double latitude, String name, String rang, Integer maxparticipants, Date startdate, Date enddate, Integer idquiz, Integer id) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.name = name;
        this.rang = rang;
        this.maxparticipants = maxparticipants;
        this.startdate = startdate;
        this.enddate = enddate;
        this.idquiz = idquiz;
        this.id = id;
    }

    public QuizPojo(Quiz quiz) {
        this.longitude = quiz.getLongitude();
        this.latitude = quiz.getLatitude();
        this.name = quiz.getName();
        this.rang = quiz.getRang();
        this.maxparticipants = quiz.getMaxparticipants();
        this.startdate = quiz.getStartdate();
        this.enddate = quiz.getEnddate();
        this.idquiz = quiz.getIdquiz();
        this.id = quiz.getId().getId();
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRang() {
        return rang;
    }

    public void setRang(String rang) {
        this.rang = rang;
    }

    public Integer getMaxparticipants() {
        return maxparticipants;
    }

    public void setMaxparticipants(Integer maxparticipants) {
        this.maxparticipants = maxparticipants;
    }

    public Date getStartdate() {
        return startdate;
    }

    public void setStartdate(Date startdate) {
        this.startdate = startdate;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }
    
    public static Quiz createQuiz(QuizPojo pojo) {
        Quiz q = new Quiz();
        q.setName(pojo.getName());
        q.setLatitude(pojo.getLatitude());
        q.setLongitude(pojo.getLongitude());
        q.setRang(pojo.getRang());
        q.setStartdate(pojo.getStartdate());
        q.setEnddate(pojo.getEnddate());
        q.setMaxparticipants(pojo.getMaxparticipants());
        q.setIdquiz(null);
        return q;
    }
    
    public static List<QuizPojo> toQuizPojo(List<Quiz> quizs) {
        List<QuizPojo> pojos = new ArrayList<>();
        for (Quiz q : quizs) {
            pojos.add(new QuizPojo(q));
        }
        return pojos;
    }

    public Integer getIdquiz() {
        return idquiz;
    }

    public void setIdquiz(Integer idquiz) {
        this.idquiz = idquiz;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<Integer> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Integer> questions) {
        this.questions = questions;
    }
    
    
}
