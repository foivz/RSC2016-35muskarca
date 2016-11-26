package rs.fon.pojo;

import rs.fon.domain.RegistrationQuizTeam;
import rs.fon.domain.TeamMember;

import javax.persistence.Column;
import javax.persistence.OneToMany;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * Created by marij on 11/26/2016.
 */
public class TeamPojo {
    private Integer idteam;
    private String teamname;
    private List<RegistrationQuizTeam> registrationQuizTeamList;
    private List<TeamMember> teamMemberList;

    public TeamPojo() {
    }

    public TeamPojo(Integer idteam) {
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
}
