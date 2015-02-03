<?php

namespace Innova\SwansBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Innova\SwansBundle\Entity\Exercise;
use Innova\SwansBundle\Form\Type\ExerciseType;
use Innova\SwansBundle\Exception\SwansException;

/**
 * Description of ExerciseController
 *
 * @author patrick
 */
class ExerciseController extends Controller {

    /**
     * Play or edit the exercise
     * @Route("/exercise/play/{id}", requirements={"id" = "\d+"}, name="exercise_play")
     * @ParamConverter("exercise", class="InnovaSwansBundle:Exercise")
     */
    public function playAction(Exercise $exercise) {

        // TODO handle edit mode (if user connected => right to edit)
        // will be available later when we will know where to include this bundle
        // for now edit set to true for developpements needs

        return $this->render('InnovaSwansBundle:Exercise:play.html.twig', array('exercise' => $exercise, 'edit' => true));
    }

    /**
     * 
     * @Route("/exercise/add", name="exercise_add")
     * @Method({"GET", "POST"})
     */
    public function addAction() {
        $exercise = new Exercise();
        // for now there is only one dictionary so we set it by default
        $dictionary = $this->get('innova.dictionary.manager')->findOneByName('en_en');
        $exercise->setDictionary($dictionary);
        $form = $this->createForm(new ExerciseType(), $exercise);

        if ($this->getRequest()->isMethod('POST')) {
            $form->handleRequest($this->getRequest());
            if ($form->isValid()) {

                try {
                    // get the main file and handle it
                    $mainUploadedFile = $this->getRequest()->files->get('file');

                    $manager = $this->get('innova.exercise.manager');

                    $manager->handleExerciseFile($mainUploadedFile, $exercise);
                    
                    // flashbag
                    $this->get('session')->getFlashBag()->set('success', "L'exercice a bien été créé.");
                    
                    
                } catch (SwansException $se) {
                    $this->get('session')->getFlashBag()->set('error', "Problème lors de la création de l'exercice :: " . $se->getMessage() );
                }
                
                return $this->redirect($this->generateUrl('home'));
                
            }
        }

        return $this->render('InnovaSwansBundle:Exercise:add.html.twig', array(
                    'form' => $form->createView(),
        ));
    }

    /**
     * 
     * @Route("/exercise/delete/{id}", requirements={"id" = "\d+"}, name="exercise_delete")
     * @ParamConverter("exercise", class="InnovaSwansBundle:Exercise")
     * @Method({"POST"})
     */
    public function deleteAction(Exercise $exercise) {
        if ($this->get('innova.exercise.manager')->delete($exercise)) {
            $this->get('session')->getFlashBag()->set('success', "L'exercice a bien été supprimé.");
        };
        return $this->redirect($this->generateUrl('home'));
    }

}
