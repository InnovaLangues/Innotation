<?php

namespace Innova\SwansBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use Doctrine\Common\Collections\ArrayCollection;
use Innova\SwansBundle\Entity\Dictionary;

/**
 * Exercise
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Exercise
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
     *
     * @var Dictionary
     * @ORM\ManyToOne(targetEntity="Innova\SwansBundle\Entity\Dictionary", inversedBy="exercises")
     * @ORM\JoinColumn(nullable=false)
     */
    private $dictionary;
    
    
     /**
     *
     * @var medias
     * if an audio file is used we will only have one media
     * if a video file is used we will have two media (video + automatically extracted audio for the waveform display) 
     * @ORM\ManyToMany(targetEntity="Innova\SwansBundle\Entity\Media", cascade={"remove", "persist"})
     * @ORM\JoinTable(name="exercise_media",
      *               joinColumns={@ORM\JoinColumn(name="exercise_id", referencedColumnName="id")},
      *               inverseJoinColumns={@ORM\JoinColumn(name="media_id", referencedColumnName="id", onDelete="CASCADE")}
      *               )
     */
    private $medias;
    
    public function __construct() {
        $this->medias = new ArrayCollection();
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
     * @return Exercise
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
    
    public function setDictionary(Dictionary $dictionary) {
        $this->dictionary = $dictionary;
        return $this;
    }
    
    public function getDictionary(){
        return $this->dictionary;
    }
    
    public function addMedia(Media $m){
        $this->medias[] = $m;
        return $this;
    }
    
    public function removeMedia(Media $m){
        $this->medias->removeElement($m);
        return $this;
    }
    
    public function getMedias(){
        return $this->medias;
    }
}
