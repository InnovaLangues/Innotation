<?php

namespace Innova\SwansBundle\Manager;

use Doctrine\ORM\EntityManager;
use Innova\SwansBundle\Entity\Dictionary;

/**
 * Description of DictionaryManager
 *
 * @author patrick
 */
class DictionaryManager {

    protected $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

    public function getAll() {
        return $this->getRepository()->findAll();
    }

    public function findOne($id) {
        return $this->getRepository()->find($id);
    }
    
    public function findOneByName($name){
        return $this->getRepository()->findOneBy(array('name' => $name));
    }

    public function save(Dictionary $dictionary) {
        $this->em->persist($dictionary);
        $this->em->flush();
    }

    public function delete(Dictionary $dictionary) {
        $this->em->remove($dictionary);
        $this->em->flush();
    }

    public function getRepository() {
        return $this->em->getRepository('InnovaSwansBundle:Dictionary');
    }

   
}
