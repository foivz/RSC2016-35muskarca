/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import java.util.List;

/**
 *
 * @author stefan
 */
public class QuestionAnswerPojo {
    private Integer registrationId;
    private Integer questionId;
    private Boolean answered;
//    private Integer userId;
//    private Integer teamId;
    private Boolean correct;

    public QuestionAnswerPojo() {
    }
    
    public Boolean isCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public Boolean isAnswered() {
        return answered;
    }

    public void setAnswered(Boolean answered) {
        this.answered = answered;
    }

    public Integer getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Integer registrationId) {
        this.registrationId = registrationId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    @Override
    public String toString() {
        return "QuestionAnswerPojo{" + "registrationId=" + registrationId + ", questionId=" + questionId + ", answered=" + answered + ", correct=" + correct + '}';
    }

}
