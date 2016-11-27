/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import rs.fon.domain.QuizQuestion;

/**
 *
 * @author stefan
 */
public class Pitanje {
    
    private QuestionPojo question;
    private Integer registrationId;
    private Integer teamId;

    public QuestionPojo getQuestion() {
        return question;
    }

    public void setQuestion(QuestionPojo question) {
        this.question = question;
    }

    public Integer getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Integer registrationId) {
        this.registrationId = registrationId;
    }

    public Integer getTeamId() {
        return teamId;
    }

    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    public Pitanje(QuizQuestion qq) {
        this.question = new QuestionPojo(qq.getQuestion());
        this.registrationId = qq.getRegistrationQuizTeam().getIdregistration();
        this.teamId = qq.getRegistrationQuizTeam().getIdteam().getIdteam();
    }

    public Pitanje() {
    }
    
    
}
