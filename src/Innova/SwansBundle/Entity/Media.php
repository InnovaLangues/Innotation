<?php

namespace Innova\SwansBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Media
 *
 * @ORM\Table()
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 */
class Media {

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
     * @ORM\Column(name="url", type="string", length=255)
     */
    private $url;

    /**
     * @var string
     * audio or video
     * @ORM\Column(name="type", type="string", length=255)
     */
    private $type;
    
    public $file;
    
    public function __construct() {
        $this->exercises = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set url
     *
     * @param string $url
     * @return Media
     */
    public function setUrl($url) {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url
     *
     * @return string 
     */
    public function getUrl() {
        return $this->url;
    }

    public function setType($type) {
        $this->type = $type;
        return $this;
    }

    public function getType() {
        return $this->type;
    } 
  

    public function getAbsolutePath() {
        return null === $this->getUrl() ? null : $this->getUploadRootDir() . '/' . $this->url;
    }

    public function getWebPath() {
        return null === $this->getUrl() ? null : $this->getUploadDir() . '/' . $this->url;
    }

    protected function getUploadRootDir() {
        return __DIR__ . '/../../../../web/' . $this->getUploadDir();
    }

    protected function getUploadDir() {
        return 'media/uploads';
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload() {
        //var_dump($this->file);
        // we need to set the media type automatically
        if (null !== $this->file) {

            $ext = pathinfo($this->file->getClientOriginalName(), PATHINFO_EXTENSION);
            // TODO generate a unique human readable name
            $this->setUrl(sha1(uniqid(mt_rand(), true)) . '.' . $ext);
        }
    }

    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload() {
        if (null === $this->file) {
            return;
        }

        $this->file->move($this->getUploadRootDir(), $this->getUrl());

        unset($this->file);
    }

    /**
     * @ORM\PostRemove()
     */
    public function removeUpload() {
        if ($file = $this->getAbsolutePath()) {
            unlink($file);
        }
    }

}
