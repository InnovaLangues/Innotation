<?php

namespace Innova\SwansBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Innova\SwansBundle\Entity\MediaType;
use Innova\SwansBundle\Entity\Media;
use Innova\SwansBundle\Entity\Dictionary;
use Innova\SwansBundle\Entity\Exercise;

/**
 * Description of LoadMediaTypeData
 *
 * @author patrick
 */
class LoadRequiredFixtures implements FixtureInterface {

    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager) {
       
        
        $dico = new Dictionary();
        $dico->setName('en_en');
        $manager->persist($dico); 
        
        $manager->flush();
    }

}
