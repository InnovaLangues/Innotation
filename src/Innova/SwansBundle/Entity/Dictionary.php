<?php

namespace Innova\SwansBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Dictionary
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Dictionary
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;
    
    
     /**
     * @ORM\OneToMany(targetEntity="Innova\SwansBundle\Entity\DictionaryEntry", mappedBy="dictionary")
     * 
     */
    private $entries;
    
    /**
     *
     * @ORM\OneToMany(targetEntity="Innova\SwansBundle\Entity\Exercise", mappedBy="dictionary")
     */
    private $exercises;
    
    
    public function __construct() {
        $this->entries = new ArrayCollection();
        $this->exercises = new ArrayCollection();
    }
   

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Dictionary
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }
}
