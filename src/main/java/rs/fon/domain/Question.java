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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
@Table(name = "question")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Question.findAll", query = "SELECT q FROM Question q"),
    @NamedQuery(name = "Question.findByIdquestion", query = "SELECT q FROM Question q WHERE q.idquestion = :idquestion"),
    @NamedQuery(name = "Question.findByQuestion", query = "SELECT q FROM Question q WHERE q.question = :question"),
    @NamedQuery(name = "Question.findByType", query = "SELECT q FROM Question q WHERE q.type = :type")})
public class Question implements Serializable {
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "question")
    private List<QuizQuestion> quizQuestionList;
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idquestion")
    private Integer idquestion;
    @Size(max = 255)
    @Column(name = "question")
    private String question;
    @Column(name = "type")
    private Integer type;
    @OneToMany(mappedBy = "question")
    private List<UserAnswer> userAnswerList;
    @OneToMany(mappedBy = "questionid")
    private List<Answer> answerList;
    @JoinColumn(name = "adminid", referencedColumnName = "id")
    @ManyToOne
    private UserAccount adminid;
    @JoinColumn(name = "categoryid", referencedColumnName = "idcategory")
    @ManyToOne
    private Category categoryid;

    public Question() {
    }

    public Question(Integer idquestion) {
        this.idquestion = idquestion;
    }

    public Integer getIdquestion() {
        return idquestion;
    }

    public void setIdquestion(Integer idquestion) {
        this.idquestion = idquestion;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    @XmlTransient
    @JsonIgnore
    public List<UserAnswer> getUserAnswerList() {
        return userAnswerList;
    }

    public void setUserAnswerList(List<UserAnswer> userAnswerList) {
        this.userAnswerList = userAnswerList;
    }

    @XmlTransient
    @JsonIgnore
    public List<Answer> getAnswerList() {
        return answerList;
    }

    public void setAnswerList(List<Answer> answerList) {
        this.answerList = answerList;
    }

    public UserAccount getAdminid() {
        return adminid;
    }

    public void setAdminid(UserAccount adminid) {
        this.adminid = adminid;
    }

    public Category getCategoryid() {
        return categoryid;
    }

    public void setCategoryid(Category categoryid) {
        this.categoryid = categoryid;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (idquestion != null ? idquestion.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Question)) {
            return false;
        }
        Question other = (Question) object;
        if ((this.idquestion == null && other.idquestion != null) || (this.idquestion != null && !this.idquestion.equals(other.idquestion))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "rs.fon.domain.Question[ idquestion=" + idquestion + " ]";
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
