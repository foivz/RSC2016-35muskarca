package rs.fon.domain;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Created by marij on 11/27/2016.
 */
@Entity
@Table(name = "mladenquiz")
@XmlRootElement
public class MladenQuiz implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idquestion1")
    Integer questionID;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idquiz1")
    Integer quiz1;

    public MladenQuiz() {
    }

    public Integer getQuestionID() {
        return questionID;
    }

    public void setQuestionID(Integer questionID) {
        this.questionID = questionID;
    }

    public Integer getQuiz1() {
        return quiz1;
    }

    public void setQuiz1(Integer quiz1) {
        this.quiz1 = quiz1;
    }

    public MladenQuiz(Integer question, Integer qui) {
        quiz1= qui;
        questionID = question;
    }

}
