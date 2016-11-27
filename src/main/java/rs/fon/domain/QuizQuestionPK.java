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
    @Column(name = "question_id")
    private int questionId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "registration_id")
    private int registrationId;

    public QuizQuestionPK() {
    }

    public QuizQuestionPK(int questionId, int registrationId) {
        this.questionId = questionId;
        this.registrationId = registrationId;
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public int getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(int registrationId) {
        this.registrationId = registrationId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) questionId;
        hash += (int) registrationId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof QuizQuestionPK)) {
            return false;
        }
        QuizQuestionPK other = (QuizQuestionPK) object;
        if (this.questionId != other.questionId) {
            return false;
        }
        if (this.registrationId != other.registrationId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.QuizQuestionPK[ questionId=" + questionId + ", registrationId=" + registrationId + " ]";
    }
    
}
