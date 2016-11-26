/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.util;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsDelegate;
import com.notnoop.apns.ApnsNotification;
import com.notnoop.apns.ApnsService;
import com.notnoop.apns.DeliveryError;
import java.util.List;

/**
 *
 * @author stefan
 */
public class IOSPushNotification {

    public String pushNotification(String not, String cert, List<String> tokens) {
        ApnsService pushService = APNS.newService()
                .withCert("/home/stefan/Desktop/NoviSertifikat.p12", "darko123")
                .withSandboxDestination()
                .withDelegate(new ApnsDelegate() {

                    @Override
                    public void messageSent(ApnsNotification an, boolean bln) {
                        System.out.println("**********messageSent");
                    }

                    @Override
                    public void messageSendFailed(ApnsNotification an, Throwable thrwbl) {
                        System.out.println(thrwbl.getMessage());
                    }

                    @Override
                    public void connectionClosed(DeliveryError de, int i) {
                        System.out.println(de.toString());
                    }

                    @Override
                    public void cacheLengthExceeded(int i) {
                        System.out.println("**********cacheLengthExceeded");
                    }

                    @Override
                    public void notificationsResent(int i) {
                        System.out.println("notificationsResent");
                    }
                })
                .build();

//        String token = "2d26ffb85bc07b4f067c2333fbe8e57b46ad859b19fdbd402411c17dd1735d4f";
//        System.out.println("*****" + not);
//        pushService.push(token, not);

        if (tokens != null) {
            for (int i = 0; i < tokens.size(); i++) {
                pushService.push(tokens.get(i), not);
            }
        }
        return not;
//        } else {
//            throw new BadRequestException("Daj divajsove");
//        }

    }

}
