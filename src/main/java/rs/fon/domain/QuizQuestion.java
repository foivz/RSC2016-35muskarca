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
    @NamedQuery(name = "QuizQuestion.findByQuestionId", query = "SELECT q FROM QuizQuestion q WHERE q.quizQuestionPK.questionId = :questionId"),
    @NamedQuery(name = "QuizQuestion.findByTaken", query = "SELECT q FROM QuizQuestion q WHERE q.taken = :taken"),
    @NamedQuery(name = "QuizQuestion.findByCorrect", query = "SELECT q FROM QuizQuestion q WHERE q.correct = :correct"),
    @NamedQuery(name = "QuizQuestion.findByRegistrationId", query = "SELECT q FROM QuizQuestion q WHERE q.quizQuestionPK.registrationId = :registrationId")})
public class QuizQuestion implements Serializable {
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
    @JoinColumn(name = "registration_id", referencedColumnName = "idregistration", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private RegistrationQuizTeam registrationQuizTeam;
    @JoinColumn(name = "user_id", referencedColumnName = "iduser_player")
    @ManyToOne
    private UserPlayer userId;

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

    public QuizQuestion(int questionId, int registrationId) {
        this.quizQuestionPK = new QuizQuestionPK(questionId, registrationId);
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

    public RegistrationQuizTeam getRegistrationQuizTeam() {
        return registrationQuizTeam;
    }

    public void setRegistrationQuizTeam(RegistrationQuizTeam registrationQuizTeam) {
        this.registrationQuizTeam = registrationQuizTeam;
    }

    public UserPlayer getUserId() {
        return userId;
    }

    public void setUserId(UserPlayer userId) {
        this.userId = userId;
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
    
}
