/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.emf;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimerTask;
import javax.persistence.EntityManager;
import rs.fon.domain.RegistrationQuizTeam;
import rs.fon.domain.UserPlayer;
import rs.fon.token.AbstractTokenCreator;
import rs.fon.token.Base64Token;
import rs.fon.util.IOSPushNotification;

/**
 *
 * @author stefan
 */
class MyTask extends TimerTask {

    @Override
    public void run() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

//    IOSPushNotification iOSPushNotification = new IOSPushNotification();
//
//    AbstractTokenCreator tokenHelper;
//    Manager manager = new Manager();
//
//    public MyTask() {
//        tokenHelper = new Base64Token();
//    }
//
//    @Override
//    public void run() {
//        EntityManager em = EMF.createEntityManager();
//        Date d = new Date();
//        long ONE_MINUTE_IN_MILLIS = 60000;//millisecs
//
//        Calendar date = Calendar.getInstance();
//        long t = date.getTimeInMillis();
//        Date afterAdding5 = new Date(t + (5 * ONE_MINUTE_IN_MILLIS));
//
//        List<RegistrationQuizTeam> resultList = em.createQuery("SELECT r.idteam FROM RegistrationQuizTeam r LEFT JOIN r.idquiz q  WHERE q.enddate > :d1 AND q.enddate < :d2 ", RegistrationQuizTeam.class).setParameter("d1", d).setParameter("d2", afterAdding5).getResultList();
//        for (RegistrationQuizTeam resultList1 : resultList) {
//            for (UserPlayer r : resultList1.getIdteam().getUserPlayerList()) {
//                iOSPushNotification.
//            }
//        }
//    }

}
