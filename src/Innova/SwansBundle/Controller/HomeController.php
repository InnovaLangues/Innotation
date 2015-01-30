<?php

namespace Innova\SwansBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;


class HomeController extends Controller
{
    /**
     * 
     * @Route("/", name="home")
     */
    public function indexAction()
    {
        // doit permettre soit de creer un exercice, soit d'accéder à la liste des exercices existants pour lire/editer/supprimer       
     
        $exercises = $this->get('innova.exercise.manager')->getAll();  
        
        return $this->render('InnovaSwansBundle:Home:index.html.twig', array('exercises' => $exercises));
    }
}