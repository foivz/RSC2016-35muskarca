/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.pojo;

import java.util.ArrayList;
import java.util.List;
import rs.fon.domain.Team;

/**
 *
 * @author stefan
 */
public class TeamPojo {

    private Integer idteam;
    private String teamname;

    public TeamPojo() {
    }

    public TeamPojo(Team team) {
        this.idteam = team.getIdteam();
        this.teamname = team.getTeamname();
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

    public static List<TeamPojo> toPojo(List<Team> quizs) {
        List<TeamPojo> pojos = new ArrayList<>();
        for (Team q : quizs) {
            pojos.add(new TeamPojo(q));
        }
        return pojos;
    }

}
