/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import java.util.ArrayList;
import java.util.List;
import rs.fon.domain.Answer;

/**
 *
 * @author stefan
 */
public class AnswerPojo {

    private Integer idanswer;
    private String answer;
    private Boolean flag;

    public Integer getIdanswer() {
        return idanswer;
    }

    public void setIdanswer(Integer idanswer) {
        this.idanswer = idanswer;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Boolean getFlag() {
        return flag;
    }

    public void setFlag(Boolean flag) {
        this.flag = flag;
    }

    public AnswerPojo() {
    }

    public AnswerPojo(Answer a) {
        this.idanswer = a.getIdanswer();
        this.answer = a.getAnswer();
        this.flag = a.getFlag();
    }

    public static List<AnswerPojo> toQuizPojo(List<Answer> quizs) {
        List<AnswerPojo> pojos = new ArrayList<>();
        for (Answer q : quizs) {
            pojos.add(new AnswerPojo(q));
        }
        return pojos;
    }
}
