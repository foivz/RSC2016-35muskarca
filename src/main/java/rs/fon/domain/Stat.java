/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.domain;

import java.io.Serializable;
import java.math.BigInteger;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author stefan
 */
@Entity
@Table(name = "stat")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Stat.findAll", query = "SELECT s FROM Stat s"),
    @NamedQuery(name = "Stat.findByGood", query = "SELECT s FROM Stat s WHERE s.good = :good"),
    @NamedQuery(name = "Stat.findByCount", query = "SELECT s FROM Stat s WHERE s.count = :count"),
    @NamedQuery(name = "Stat.findByRegistrationId", query = "SELECT s FROM Stat s WHERE s.registrationId = :registrationId"),
    @NamedQuery(name = "Stat.findByTeamname", query = "SELECT s FROM Stat s WHERE s.teamname = :teamname")})
public class Stat implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column(name = "good")
    private BigInteger good;
    @Basic(optional = false)
    @NotNull
    @Column(name = "count")
    private long count;
    @Basic(optional = false)
    @NotNull
    @Column(name = "registration_id")
    @Id
    private int registrationId;
    @Size(max = 255)
    @Column(name = "teamname")
    private String teamname;

    public Stat() {
    }

    public BigInteger getGood() {
        return good;
    }

    public void setGood(BigInteger good) {
        this.good = good;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public int getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(int registrationId) {
        this.registrationId = registrationId;
    }

    public String getTeamname() {
        return teamname;
    }

    public void setTeamname(String teamname) {
        this.teamname = teamname;
    }
    
}
