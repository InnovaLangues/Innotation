<?php

namespace Innova\SwansBundle\Manager;

use Doctrine\ORM\EntityManager;
use Innova\SwansBundle\Entity\Exercise;
use Innova\SwansBundle\Entity\Region;
use Innova\SwansBundle\Exception\SwansException;

class RegionManager {

    protected $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

    public function save(Region $region) {
        $this->em->persist($region);
        $this->em->flush();
        return $region;
    }

    public function delete(Region $region) {
        $this->em->remove($region);
        $this->em->flush();
        return $this;
    }

    public function findByAndOrder(Exercise $exercice) {
        return $this->getRepository()->findBy(array('exercise' => $exercice), array('start' => 'ASC'));
    }

    public function getRepository() {
        return $this->em->getRepository('InnovaSwansBundle:Region');
    }

    /**
     * Update an exercise (title)
     * @param Exercise $exercice
     * @param Array of stdClass $region 
     */
    public function handleExerciseRegions(Exercise $exercice, $regions) {

        $this->deleteUnusedRegions($exercice, $regions);
        // update or create
        foreach ($regions as $region) {
            // update
            if ($region['id']) {
                $entity = $this->getRepository()->find($region['id']);
            }
            // new
            else {
                $entity = new Region();
                $entity->setExercise($exercice);
            }
            if ($entity) {
                $entity->setStart($region['start']);
                $entity->setEnd($region['end']);
                $entity->setNote($region['note']);
                $this->save($entity);
            }
        }
        return $exercice;
    }

    private function deleteUnusedRegions(Exercise $exercice, $toCheck) {
        // get existing regions in database
        $existing = $this->getRepository()->findBy(array('exercise' => $exercice));

        // delete regions if they are no more here
        if (count($existing) > 0) {
            $toDelete = $this->checkIfRegionExists($existing, $toCheck);

            foreach ($toDelete as $unused) {
                $this->delete($unused);
            }
        }
    }

    private function checkIfRegionExists($existing, $toCheck) {
        $toDelete = [];
        foreach ($existing as $region) {
            $found = false;
            foreach ($toCheck as $current) {
                if ($current['id'] == $region->getId()) {
                    $found = true;
                    break;
                }
            }

            // if not found, this is an unused region
            if (!$found) {
                $toDelete[] = $region;
            }
        }
        return $toDelete;
    }

}
