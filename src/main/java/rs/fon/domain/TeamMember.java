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
@Table(name = "team_member")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "TeamMember.findAll", query = "SELECT t FROM TeamMember t"),
    @NamedQuery(name = "TeamMember.findByIdteamMember", query = "SELECT t FROM TeamMember t WHERE t.idteamMember = :idteamMember")})
public class TeamMember implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @JoinColumn(name = "iduser", referencedColumnName = "iduser_player")
    @ManyToOne
    private UserPlayer iduser;
    @Id
    @JoinColumn(name = "idteam", referencedColumnName = "idteam")
    @ManyToOne
    private Team idteam;

    public TeamMember() {
    }


    public UserPlayer getIduser() {
        return iduser;
    }

    public void setIduser(UserPlayer iduser) {
        this.iduser = iduser;
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
        hash += (idteam != null ? idteam.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof TeamMember)) {
            return false;
        }
        TeamMember other = (TeamMember) object;
        if ((this.idteam == null && other.idteam != null) || (this.idteam != null && !this.idteam.equals(other.idteam))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.TeamMember[ idteamMember=" + idteam + " ]";
    }
    
}
