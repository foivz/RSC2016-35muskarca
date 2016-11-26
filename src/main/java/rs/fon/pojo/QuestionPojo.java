/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import java.util.ArrayList;
import java.util.List;
import rs.fon.domain.Answer;
import rs.fon.domain.Category;
import rs.fon.domain.Question;
import rs.fon.domain.Quiz;
import rs.fon.domain.UserAccount;

/**
 *
 * @author stefan
 */
public class QuestionPojo {

    public static Question createQuestion(QuestionPojo p, Integer adminId) {
        Question q = new Question();
        q.setAdminid(new UserAccount(adminId));
        List<Answer> answers = new ArrayList<>();
        for (AnswerPojo col : p.getAnswerList()) {
            Answer answer = new Answer();
            answer.setAnswer(col.getAnswer());
            answer.setFlag(col.getFlag());
            answer.setIdanswer(p.getIdquestion());
            answer.setQuestionid(q);
            answers.add(answer);
        }
        q.setAnswerList(answers);
        q.setCategoryid(new Category(p.getCategoryid()));
        q.setIdquestion(p.getIdquestion());
        q.setQuestion(p.getQuestion());
        q.setType(p.getType());
        return q;
    }

    private Integer idquestion;
    private String question;
    private Integer type;
    private List<AnswerPojo> answerList;
    private Integer categoryid;

    public QuestionPojo() {
    }

    public QuestionPojo(Question q) {
        this.idquestion = q.getIdquestion();
        this.question = q.getQuestion();
        this.type = q.getType();
        this.answerList = AnswerPojo.toQuizPojo(q.getAnswerList());
        this.categoryid = q.getCategoryid().getIdcategory();
    }

    public Integer getIdquestion() {
        return idquestion;
    }

    public void setIdquestion(Integer idquestion) {
        this.idquestion = idquestion;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public static List<QuestionPojo> toAnswerPojo(List<Question> quizs) {
        List<QuestionPojo> pojos = new ArrayList<>();
        for (Question q : quizs) {
            pojos.add(new QuestionPojo(q));
        }
        return pojos;
    }

    public List<AnswerPojo> getAnswerList() {
        return answerList;
    }

    public void setAnswerList(List<AnswerPojo> answerList) {
        this.answerList = answerList;
    }

    public Integer getCategoryid() {
        return categoryid;
    }

    public void setCategoryid(Integer categoryid) {
        this.categoryid = categoryid;
    }

}
