/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author stefan
 */
@Entity
@Table(name = "quiz_question")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "QuizQuestion.findAll", query = "SELECT q FROM QuizQuestion q"),
    @NamedQuery(name = "QuizQuestion.findByQuizId", query = "SELECT q FROM QuizQuestion q WHERE q.quizQuestionPK.quizId = :quizId"),
    @NamedQuery(name = "QuizQuestion.findByQuestionId", query = "SELECT q FROM QuizQuestion q WHERE q.quizQuestionPK.questionId = :questionId"),
    @NamedQuery(name = "QuizQuestion.findByTaken", query = "SELECT q FROM QuizQuestion q WHERE q.taken = :taken"),
    @NamedQuery(name = "QuizQuestion.findByCorrect", query = "SELECT q FROM QuizQuestion q WHERE q.correct = :correct")})
public class QuizQuestion implements Serializable {
    @JoinColumn(name = "answer", referencedColumnName = "idanswer")
    @ManyToOne
    private Answer answer;
    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected QuizQuestionPK quizQuestionPK;
    @Basic(optional = false)
    @NotNull
    @Column(name = "taken")
    private boolean taken;
    @Basic(optional = false)
    @NotNull
    @Column(name = "correct")
    private boolean correct;
    @JoinColumn(name = "question_id", referencedColumnName = "idquestion", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Question question;
    @JoinColumn(name = "quiz_id", referencedColumnName = "idquiz", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Quiz quiz;

    public QuizQuestion() {
    }

    public QuizQuestion(QuizQuestionPK quizQuestionPK) {
        this.quizQuestionPK = quizQuestionPK;
    }

    public QuizQuestion(QuizQuestionPK quizQuestionPK, boolean taken, boolean correct) {
        this.quizQuestionPK = quizQuestionPK;
        this.taken = taken;
        this.correct = correct;
    }

    public QuizQuestion(int quizId, int questionId) {
        this.quizQuestionPK = new QuizQuestionPK(quizId, questionId);
    }

    public QuizQuestionPK getQuizQuestionPK() {
        return quizQuestionPK;
    }

    public void setQuizQuestionPK(QuizQuestionPK quizQuestionPK) {
        this.quizQuestionPK = quizQuestionPK;
    }

    public boolean getTaken() {
        return taken;
    }

    public void setTaken(boolean taken) {
        this.taken = taken;
    }

    public boolean getCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (quizQuestionPK != null ? quizQuestionPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof QuizQuestion)) {
            return false;
        }
        QuizQuestion other = (QuizQuestion) object;
        if ((this.quizQuestionPK == null && other.quizQuestionPK != null) || (this.quizQuestionPK != null && !this.quizQuestionPK.equals(other.quizQuestionPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.QuizQuestion[ quizQuestionPK=" + quizQuestionPK + " ]";
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }
    
}
