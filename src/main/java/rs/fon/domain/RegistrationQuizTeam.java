/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import java.util.List;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author stefan
 */
@Entity
@Table(name = "registration_quiz_team")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "RegistrationQuizTeam.findAll", query = "SELECT r FROM RegistrationQuizTeam r"),
    @NamedQuery(name = "RegistrationQuizTeam.findByIdregistration", query = "SELECT r FROM RegistrationQuizTeam r WHERE r.idregistration = :idregistration")})
public class RegistrationQuizTeam implements Serializable {
    @OneToMany(mappedBy = "registration")
    private List<UserAnswer> userAnswerList;
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "idregistration")
    private Integer idregistration;
    @JoinColumn(name = "idquiz", referencedColumnName = "idquiz")
    @ManyToOne
    private Quiz idquiz;
    @JoinColumn(name = "idteam", referencedColumnName = "idteam")
    @ManyToOne
    private Team idteam;

    public RegistrationQuizTeam() {
    }

    public RegistrationQuizTeam(Integer idregistration) {
        this.idregistration = idregistration;
    }

    public Integer getIdregistration() {
        return idregistration;
    }

    public void setIdregistration(Integer idregistration) {
        this.idregistration = idregistration;
    }

    public Quiz getIdquiz() {
        return idquiz;
    }

    public void setIdquiz(Quiz idquiz) {
        this.idquiz = idquiz;
    }

    public Team getIdteam() {
        return idteam;
    }

    public void setIdteam(Team idteam) {
        this.idteam = idteam;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (idregistration != null ? idregistration.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof RegistrationQuizTeam)) {
            return false;
        }
        RegistrationQuizTeam other = (RegistrationQuizTeam) object;
        if ((this.idregistration == null && other.idregistration != null) || (this.idregistration != null && !this.idregistration.equals(other.idregistration))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.RegistrationQuizTeam[ idregistration=" + idregistration + " ]";
    }

    @XmlTransient
    @JsonIgnore
    public List<UserAnswer> getUserAnswerList() {
        return userAnswerList;
    }

    public void setUserAnswerList(List<UserAnswer> userAnswerList) {
        this.userAnswerList = userAnswerList;
    }
    
}
