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
import javax.persistence.JoinTable;
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
@Table(name = "user_player")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "UserPlayer.findAll", query = "SELECT u FROM UserPlayer u"),
    @NamedQuery(name = "UserPlayer.findByIduserPlayer", query = "SELECT u FROM UserPlayer u WHERE u.iduserPlayer = :iduserPlayer"),
    @NamedQuery(name = "UserPlayer.findByName", query = "SELECT u FROM UserPlayer u WHERE u.name = :name"),
    @NamedQuery(name = "UserPlayer.findBySurname", query = "SELECT u FROM UserPlayer u WHERE u.surname = :surname"),
    @NamedQuery(name = "UserPlayer.findBySocialnetid", query = "SELECT u FROM UserPlayer u WHERE u.socialnetid = :socialnetid"),
    @NamedQuery(name = "UserPlayer.findByRang", query = "SELECT u FROM UserPlayer u WHERE u.rang = :rang"),
    @NamedQuery(name = "UserPlayer.findByBadge", query = "SELECT u FROM UserPlayer u WHERE u.badge = :badge"),
    @NamedQuery(name = "UserPlayer.findByPushtoken", query = "SELECT u FROM UserPlayer u WHERE u.pushtoken = :pushtoken"),
    @NamedQuery(name = "UserPlayer.findByToken", query = "SELECT u FROM UserPlayer u WHERE u.token = :token")})
public class UserPlayer implements Serializable {
    // @Pattern(regexp="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message="Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Size(max = 255)
    @Column(name = "email")
    private String email;
    @Size(max = 255)
    @Column(name = "image")
    private String image;
    @JoinTable(name = "team_member", joinColumns = {
        @JoinColumn(name = "iduser", referencedColumnName = "iduser_player")}, inverseJoinColumns = {
        @JoinColumn(name = "idteam", referencedColumnName = "idteam")})
    @ManyToMany
    private List<Team> teamList;
    @OneToMany(mappedBy = "iduser")
    private List<UserAnswer> userAnswerList;
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iduser_player")
    private Integer iduserPlayer;
    @Size(max = 255)
    @Column(name = "name")
    private String name;
    @Size(max = 255)
    @Column(name = "surname")
    private String surname;
    @Column(name = "socialnetid")
    private Integer socialnetid;
    @Size(max = 255)
    @Column(name = "rang")
    private String rang;
    @Column(name = "badge")
    private Integer badge;
    @Size(max = 255)
    @Column(name = "pushtoken")
    private String pushtoken;
    @Size(max = 255)
    @Column(name = "token")
    private String token;
    @OneToMany(mappedBy = "iduser")
    private List<TeamMember> teamMemberList;

    public UserPlayer() {
    }

    public UserPlayer(Integer iduserPlayer) {
        this.iduserPlayer = iduserPlayer;
    }

    public Integer getIduserPlayer() {
        return iduserPlayer;
    }

    public void setIduserPlayer(Integer iduserPlayer) {
        this.iduserPlayer = iduserPlayer;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Integer getSocialnetid() {
        return socialnetid;
    }

    public void setSocialnetid(Integer socialnetid) {
        this.socialnetid = socialnetid;
    }

    public String getRang() {
        return rang;
    }

    public void setRang(String rang) {
        this.rang = rang;
    }

    public Integer getBadge() {
        return badge;
    }

    public void setBadge(Integer badge) {
        this.badge = badge;
    }

    public String getPushtoken() {
        return pushtoken;
    }

    public void setPushtoken(String pushtoken) {
        this.pushtoken = pushtoken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
        hash += (iduserPlayer != null ? iduserPlayer.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof UserPlayer)) {
            return false;
        }
        UserPlayer other = (UserPlayer) object;
        if ((this.iduserPlayer == null && other.iduserPlayer != null) || (this.iduserPlayer != null && !this.iduserPlayer.equals(other.iduserPlayer))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.UserPlayer[ iduserPlayer=" + iduserPlayer + " ]";
    }

    @XmlTransient
    @JsonIgnore
    public List<Team> getTeamList() {
        return teamList;
    }

    public void setTeamList(List<Team> teamList) {
        this.teamList = teamList;
    }

    @XmlTransient
    @JsonIgnore
    public List<UserAnswer> getUserAnswerList() {
        return userAnswerList;
    }

    public void setUserAnswerList(List<UserAnswer> userAnswerList) {
        this.userAnswerList = userAnswerList;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
    
}
