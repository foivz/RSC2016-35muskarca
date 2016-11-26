/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author stefan
 */
@Entity
@Table(name = "quiz")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Quiz.findAll", query = "SELECT q FROM Quiz q"),
    @NamedQuery(name = "Quiz.findByIdquiz", query = "SELECT q FROM Quiz q WHERE q.idquiz = :idquiz"),
    @NamedQuery(name = "Quiz.findByLongitude", query = "SELECT q FROM Quiz q WHERE q.longitude = :longitude"),
    @NamedQuery(name = "Quiz.findByLatitude", query = "SELECT q FROM Quiz q WHERE q.latitude = :latitude"),
    @NamedQuery(name = "Quiz.findByName", query = "SELECT q FROM Quiz q WHERE q.name = :name"),
    @NamedQuery(name = "Quiz.findByRang", query = "SELECT q FROM Quiz q WHERE q.rang = :rang"),
    @NamedQuery(name = "Quiz.findByMaxparticipants", query = "SELECT q FROM Quiz q WHERE q.maxparticipants = :maxparticipants"),
    @NamedQuery(name = "Quiz.findByStartdate", query = "SELECT q FROM Quiz q WHERE q.startdate = :startdate"),
    @NamedQuery(name = "Quiz.findByEnddate", query = "SELECT q FROM Quiz q WHERE q.enddate = :enddate")})
public class Quiz implements Serializable {
    @ManyToMany(mappedBy = "quizList")
    private List<Question> questionList;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "quiz")
    private List<QuizQuestion> quizQuestionList;
    @OneToMany(mappedBy = "idquiz")
    private List<RegistrationQuizTeam> registrationQuizTeamList;
    private static final long serialVersionUID = 1L;
    @Id
    @NotNull
    @Column(name = "idquiz")
    private Integer idquiz;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "longitude")
    private Double longitude;
    @Column(name = "latitude")
    private Double latitude;
    @Size(max = 255)
    @Column(name = "name")
    private String name;
    @Size(max = 255)
    @Column(name = "rang")
    private String rang;
    @Column(name = "maxparticipants")
    private Integer maxparticipants;
    @Column(name = "startdate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startdate;
    @Column(name = "enddate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date enddate;
    @JoinColumn(name = "id", referencedColumnName = "id")
    @ManyToOne
    private UserAccount id;

    public Quiz() {
    }

    public Quiz(Integer idquiz) {
        this.idquiz = idquiz;
    }

    public Integer getIdquiz() {
        return idquiz;
    }

    public void setIdquiz(Integer idquiz) {
        this.idquiz = idquiz;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRang() {
        return rang;
    }

    public void setRang(String rang) {
        this.rang = rang;
    }

    public Integer getMaxparticipants() {
        return maxparticipants;
    }

    public void setMaxparticipants(Integer maxparticipants) {
        this.maxparticipants = maxparticipants;
    }

    public Date getStartdate() {
        return startdate;
    }

    public void setStartdate(Date startdate) {
        this.startdate = startdate;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

    public UserAccount getId() {
        return id;
    }

    public void setId(UserAccount id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (idquiz != null ? idquiz.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Quiz)) {
            return false;
        }
        Quiz other = (Quiz) object;
        if ((this.idquiz == null && other.idquiz != null) || (this.idquiz != null && !this.idquiz.equals(other.idquiz))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.Quiz[ idquiz=" + idquiz + " ]";
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
    public List<QuizQuestion> getQuizQuestionList() {
        return quizQuestionList;
    }

    public void setQuizQuestionList(List<QuizQuestion> quizQuestionList) {
        this.quizQuestionList = quizQuestionList;
    }

    @XmlTransient
    @JsonIgnore
    public List<Question> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<Question> questionList) {
        this.questionList = questionList;
    }
    
}
