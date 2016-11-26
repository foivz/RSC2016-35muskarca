/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author stefan
 */
@Entity
@Table(name = "team")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Team.findAll", query = "SELECT t FROM Team t"),
    @NamedQuery(name = "Team.findByIdteam", query = "SELECT t FROM Team t WHERE t.idteam = :idteam"),
    @NamedQuery(name = "Team.findByTeamname", query = "SELECT t FROM Team t WHERE t.teamname = :teamname")})
public class Team implements Serializable {
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "team")
    private List<QuizQuestion> quizQuestionList;
    @ManyToMany(mappedBy = "teamList")
    private List<UserPlayer> userPlayerList;
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idteam")
    private Integer idteam;
    @Size(max = 255)
    @Column(name = "teamname")
    private String teamname;
    @OneToMany(mappedBy = "idteam")
    private List<RegistrationQuizTeam> registrationQuizTeamList;
    @OneToMany(mappedBy = "idteam")
    private List<TeamMember> teamMemberList;

    public Team() {
    }

    public Team(Integer idteam) {
        this.idteam = idteam;
    }

    public Integer getIdteam() {
        return idteam;
    }

    public void setIdteam(Integer idteam) {
        this.idteam = idteam;
    }

    public String getTeamname() {
        return teamname;
    }

    public void setTeamname(String teamname) {
        this.teamname = teamname;
    }

    @XmlTransient
    @JsonIgnore
    public List<RegistrationQuizTeam> getRegistrationQuizTeamList() {
        return registrationQuizTeamList;
    }

    public void setRegistrationQuizTeamList(List<RegistrationQuizTeam> registrationQuizTeamList) {
        this.registrationQuizTeamList = registrationQuizTeamList;
    }

    @XmlTransient
    @JsonIgnore
    public List<TeamMember> getTeamMemberList() {
        return teamMemberList;
    }

    public void setTeamMemberList(List<TeamMember> teamMemberList) {
        this.teamMemberList = teamMemberList;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (idteam != null ? idteam.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Team)) {
            return false;
        }
        Team other = (Team) object;
        if ((this.idteam == null && other.idteam != null) || (this.idteam != null && !this.idteam.equals(other.idteam))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.Team[ idteam=" + idteam + " ]";
    }

    @XmlTransient
    @JsonIgnore
    public List<UserPlayer> getUserPlayerList() {
        return userPlayerList;
    }

    public void setUserPlayerList(List<UserPlayer> userPlayerList) {
        this.userPlayerList = userPlayerList;
    }

    @XmlTransient
    @JsonIgnore
    public List<QuizQuestion> getQuizQuestionList() {
        return quizQuestionList;
    }

    public void setQuizQuestionList(List<QuizQuestion> quizQuestionList) {
        this.quizQuestionList = quizQuestionList;
    }
    
}
