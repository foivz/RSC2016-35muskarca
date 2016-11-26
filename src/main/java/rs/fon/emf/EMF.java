/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.fon.emf;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 *
 * @author stefan
 */
@WebListener
public class EMF implements ServletContextListener{

    private static EntityManagerFactory emf;
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("PWD: " + System.getProperty("user.dir"));
        emf = Persistence.createEntityManagerFactory("rs.fon_RC3_war_1.0-SNAPSHOTPU");
        System.out.println("################## " + emf);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        emf.close();
    }
    
    public static EntityManager createEntityManager(){
        if (emf == null) {
            throw new IllegalStateException("Context is not initialized yet.");
        }
        return emf.createEntityManager();
    }
}
