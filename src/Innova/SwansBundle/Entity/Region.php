<?php

namespace Innova\SwansBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Region
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Region
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
     * @var float
     *
     * @ORM\Column(name="beginning", type="float")
     */
    private $beginning;

    /**
     * @var float
     *
     * @ORM\Column(name="end", type="float")
     */
    private $end;

    /**
     * @var string
     *
     * @ORM\Column(name="annotated_text", type="text")
     */
    private $annotatedText;
    
     /**
     *
     * @var Exercice
     * @ORM\ManyToOne(targetEntity="Innova\SwansBundle\Entity\Exercise", inversedBy="regions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $exercise;


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
     * Set beginning
     *
     * @param float $beginning
     * @return Region
     */
    public function setBeginning($beginning)
    {
        $this->beginning = $beginning;

        return $this;
    }

    /**
     * Get beginning
     *
     * @return float 
     */
    public function getBeginning()
    {
        return $this->beginning;
    }

    /**
     * Set end
     *
     * @param float $end
     * @return Region
     */
    public function setEnd($end)
    {
        $this->end = $end;

        return $this;
    }

    /**
     * Get end
     *
     * @return float 
     */
    public function getEnd()
    {
        return $this->end;
    }

    /**
     * Set annotatedText
     *
     * @param string $annotatedText
     * @return Region
     */
    public function setAnnotatedText($annotatedText)
    {
        $this->annotatedText = $annotatedText;

        return $this;
    }

    /**
     * Get annotatedText
     *
     * @return string 
     */
    public function getAnnotatedText()
    {
        return $this->annotatedText;
    }
    
    public function setExercise(Exercise $ex){
        $this->exercise = $ex;
        return $this;
    }
    
    public function getExercise(){
        return $this->exercise;
    }
}
