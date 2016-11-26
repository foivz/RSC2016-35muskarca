/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author stefan
 */
@Entity
@Table(name = "user_answer")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "UserAnswer.findAll", query = "SELECT u FROM UserAnswer u"),
    @NamedQuery(name = "UserAnswer.findByIduserAnswer", query = "SELECT u FROM UserAnswer u WHERE u.iduserAnswer = :iduserAnswer"),
    @NamedQuery(name = "UserAnswer.findByFlag", query = "SELECT u FROM UserAnswer u WHERE u.flag = :flag")})
public class UserAnswer implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iduser_answer")
    private Integer iduserAnswer;
    @Column(name = "flag")
    private Integer flag;
    @JoinColumn(name = "question", referencedColumnName = "idquestion")
    @ManyToOne
    private Question question;
    @JoinColumn(name = "registration", referencedColumnName = "idregistration")
    @ManyToOne
    private RegistrationQuizTeam registration;
    @JoinColumn(name = "iduser", referencedColumnName = "iduser_player")
    @ManyToOne
    private UserPlayer iduser;

    public UserAnswer() {
    }

    public UserAnswer(Integer iduserAnswer) {
        this.iduserAnswer = iduserAnswer;
    }

    public Integer getIduserAnswer() {
        return iduserAnswer;
    }

    public void setIduserAnswer(Integer iduserAnswer) {
        this.iduserAnswer = iduserAnswer;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public RegistrationQuizTeam getRegistration() {
        return registration;
    }

    public void setRegistration(RegistrationQuizTeam registration) {
        this.registration = registration;
    }

    public UserPlayer getIduser() {
        return iduser;
    }

    public void setIduser(UserPlayer iduser) {
        this.iduser = iduser;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (iduserAnswer != null ? iduserAnswer.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof UserAnswer)) {
            return false;
        }
        UserAnswer other = (UserAnswer) object;
        if ((this.iduserAnswer == null && other.iduserAnswer != null) || (this.iduserAnswer != null && !this.iduserAnswer.equals(other.iduserAnswer))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.UserAnswer[ iduserAnswer=" + iduserAnswer + " ]";
    }
    
}
