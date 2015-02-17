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
     * @ORM\Column(name="start", type="float")
     */
    private $start;

    /**
     * @var float
     *
     * @ORM\Column(name="end", type="float")
     */
    private $end;

    /**
     * @var string
     *
     * @ORM\Column(name="note", type="text", nullable=true)
     */
    private $note;
    
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
     * Set start of the region
     *
     * @param float $start
     * @return Region
     */
    public function setStart($start)
    {
        $this->start = $start;

        return $this;
    }

    /**
     * Get start
     *
     * @return float 
     */
    public function getStart()
    {
        return $this->start;
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
     * Set note
     *
     * @param string $note
     * @return Region
     */
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
    }

    /**
     * Get note
     *
     * @return string 
     */
    public function getNote()
    {
        return $this->note;
    }
    
    public function setExercise(Exercise $ex){
        $this->exercise = $ex;
        return $this;
    }
    
    public function getExercise(){
        return $this->exercise;
    }
}
