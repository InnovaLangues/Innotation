<?php

namespace Innova\SwansBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DictionaryEntry
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class DictionaryEntry
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
     * @ORM\Column(name="word", type="string", length=255)
     */
    private $word;

    /**
     * @var integer
     *
     * @ORM\Column(name="length", type="integer")
     */
    private $length;

    /**
     * @var string
     *
     * @ORM\Column(name="sampa", type="string", length=255)
     */
    private $sampa;

    /**
     * @var integer
     *
     * @ORM\Column(name="nbPhon", type="integer")
     */
    private $nbPhon;

    /**
     * @var integer
     *
     * @ORM\Column(name="nbSyll", type="integer")
     */
    private $nbSyll;
    
    /**
     * @ORM\ManyToOne(targetEntity="Innova\SwansBundle\Entity\Dictionary", inversedBy="entries")
     * @ORM\JoinColumn(name="dictionary_id", referencedColumnName="id", nullable=false)
     **/
    private $dictionary;


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
     * Set word
     *
     * @param string $word
     * @return DictionaryEntry
     */
    public function setWord($word)
    {
        $this->word = $word;

        return $this;
    }

    /**
     * Get word
     *
     * @return string 
     */
    public function getWord()
    {
        return $this->word;
    }

    /**
     * Set length
     *
     * @param integer $length
     * @return DictionaryEntry
     */
    public function setLength($length)
    {
        $this->length = $length;

        return $this;
    }

    /**
     * Get length
     *
     * @return integer 
     */
    public function getLength()
    {
        return $this->length;
    }

    /**
     * Set sampa
     *
     * @param string $sampa
     * @return DictionaryEntry
     */
    public function setSampa($sampa)
    {
        $this->sampa = $sampa;

        return $this;
    }

    /**
     * Get sampa
     *
     * @return string 
     */
    public function getSampa()
    {
        return $this->sampa;
    }

    /**
     * Set nbPhon
     *
     * @param integer $nbPhon
     * @return DictionaryEntry
     */
    public function setNbPhon($nbPhon)
    {
        $this->nbPhon = $nbPhon;

        return $this;
    }

    /**
     * Get nbPhon
     *
     * @return integer 
     */
    public function getNbPhon()
    {
        return $this->nbPhon;
    }

    /**
     * Set nbSyll
     *
     * @param integer $nbSyll
     * @return DictionaryEntry
     */
    public function setNbSyll($nbSyll)
    {
        $this->nbSyll = $nbSyll;

        return $this;
    }

    /**
     * Get nbSyll
     *
     * @return integer 
     */
    public function getNbSyll()
    {
        return $this->nbSyll;
    }  
}
