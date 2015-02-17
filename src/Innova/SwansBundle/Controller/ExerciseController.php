<?php

namespace Innova\SwansBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
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
     * Play and/or edit the exercise
     * @Route("/exercise/play/{id}/{edit}", requirements={"id" = "\d+"}, defaults={"edit" = 0}, name="exercise_play")
     * @ParamConverter("exercise", class="InnovaSwansBundle:Exercise")
     */
    public function playAction(Exercise $exercise) {
        $request = $this->container->get('request');
        $editParam = $request->get('edit');
        $edit = $editParam === 0 ? false : true;
        // use of specific method to order regions correctly
        $regions = $this->get('innova.region.manager')->findByAndOrder($exercise);
        if ($exercise->getId()) {
            return $this->render('InnovaSwansBundle:Exercise:play.html.twig', array('exercise' => $exercise, 'edit' => $edit, 'regions' => $regions));
        } else {
            $this->get('session')->getFlashBag()->set('error', "Aucun exercice trouvé.");
            return $this->redirect($this->generateUrl('home'));
        }
    }

    /**
     * AJAX
     * update the exercise (segments && title)
     * @Route("/exercise/edit/{id}", requirements={"id" = "\d+"}, name="exercise_edit")
     * @ParamConverter("exercise", class="InnovaSwansBundle:Exercise")
     * @Method({"POST"})
     */
    public function editAction(Exercise $exercise) {

        if ($this->getRequest()->isMethod('POST')) {
            $request = $this->container->get('request');
            $title = $request->get('title');
            $starts = $request->get('start');
            $ends = $request->get('end');
            $notes = $request->get('note');
            $ids = $request->get('region-id');
            $nbData = count($starts);

            $regionsArray = [];
            if ($title != '' && $nbData > 0 && $nbData == count($ends) && $nbData == count($notes)) {
                for ($i = 0; $i < $nbData; $i++) {
                    $regionsArray[] = array('id' => $ids[$i], 'start' => $starts[$i], 'end' => $ends[$i], 'note' => $notes[$i]);
                }
                $this->get('innova.exercise.manager')->updateExerciseName($exercise, $title);
                $this->get('innova.region.manager')->handleExerciseRegions($exercise, $regionsArray);

                $this->get('session')->getFlashBag()->set('success', "L'exercice a bien été mis à jour.");
            } else {
                $this->get('session')->getFlashBag()->set('error', "Problème lors de la mise à jour de l'exercice.");
            }
            return $this->redirect($this->generateUrl('home'));
            /*
              $regions = $this->get('innova.region.manager')->findByAndOrder($exercise);
              return $this->render('InnovaSwansBundle:Exercise:play.html.twig', array('exercise' => $exercise, 'edit' => true, 'regions' => $regions));

             */
        }
    }

    /**
     * Create a new exercise and media
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
                    // this method also persist and flush the exercise
                    $manager->handleExerciseFile($mainUploadedFile, $exercise);
                    // flashbag
                    $this->get('session')->getFlashBag()->set('success', "L'exercice a bien été créé.");
                } catch (SwansException $se) {
                    $this->get('session')->getFlashBag()->set('error', "Problème lors de la création de l'exercice :: " . $se->getMessage());
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

    /**
     * AJAX
     * @Route("/exercise/annotate", name="exercise_annotate")
     * TODO :: for now only one dictionnary with id = 1
     * When we will add other dictionnary we should add a param (en_en / fr_fr / en_us...) and find related dictionary id
     */
    public function annotationAction() {

        $request = $this->container->get('request');
        $text = $request->request->get('text');

        $manager = $this->get('innova.annotation.manager');
        $result = $manager->annotateText($text, 1);
        if ($result['result'] === 'success') {
            $response = array("success" => true, "data" => $result['text']);
        } else {
            $response = array("success" => false, "data" => "error while annotating");
        }
        return new Response(json_encode($response));
    }

}
