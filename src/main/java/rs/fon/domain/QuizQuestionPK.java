/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

/**
 *
 * @author stefan
 */
@Embeddable
public class QuizQuestionPK implements Serializable {
    @Basic(optional = false)
    @NotNull
    @Column(name = "quiz_id")
    private int quizId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "question_id")
    private int questionId;

    public QuizQuestionPK() {
    }

    public QuizQuestionPK(int quizId, int questionId) {
        this.quizId = quizId;
        this.questionId = questionId;
    }

    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) quizId;
        hash += (int) questionId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof QuizQuestionPK)) {
            return false;
        }
        QuizQuestionPK other = (QuizQuestionPK) object;
        if (this.quizId != other.quizId) {
            return false;
        }
        if (this.questionId != other.questionId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.QuizQuestionPK[ quizId=" + quizId + ", questionId=" + questionId + " ]";
    }
    
}
