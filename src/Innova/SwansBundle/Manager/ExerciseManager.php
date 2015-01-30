<?php

namespace Innova\SwansBundle\Manager;

use Doctrine\ORM\EntityManager;
use Innova\SwansBundle\Entity\Exercise;
use Innova\SwansBundle\Entity\Media;

/**
 * Description of ExerciseManager
 *
 * @author patrick
 */
class ExerciseManager {

    protected $em;
    protected $kernelRoot;

    public function __construct(EntityManager $em, $kernelRoot) {
        $this->em = $em;
        $this->kernelRoot = $kernelRoot;
    }

    public function getAll() {
        return $this->getRepository()->findAll();
    }

    public function findOne($id) {
        return $this->getRepository()->find($id);
    }

    public function save(Exercise $exercice) {
        $this->em->persist($exercice);
        $this->em->flush();
        return $exercice;
    }

    public function delete(Exercise $exercice) {
        $this->em->remove($exercice);
        $this->em->flush();
        return $this;
    }

    public function getRepository() {
        return $this->em->getRepository('InnovaSwansBundle:Exercise');
    }

    public function getExerciseMediaType(Exercise $exercise) {
        $medias = $exercise->getMedias();
        $media = $medias[0];
        $url = $media->getUrl();
        $ext = pathinfo($url, PATHINFO_EXTENSION);
        return $this->getMediaTypeFromExtension($ext);
    }

    /**
     * Set exercise media type
     * If media is video :: Extract audio and add audio to exercise media collection (for waveform display)
     * @param Exercise $exercise
     * @return Exercise
     */
    public function extractAudio(Exercise $exercise) {

        $medias = $exercise->getMedias();
        $media = $medias[0];
        $url = $media->getUrl();
        $ext = pathinfo($url, PATHINFO_EXTENSION);
        
        // 1 - extract audio sound file from the video
        $name = basename($url, "." . $ext);
        $source_url = $name . '.' . $ext;

        $cmd = 'avconv -i ' . $this->kernelRoot . '/../web/media/uploads/' . $source_url . ' -vn -f ogg ' . $this->kernelRoot . '/../web/media/uploads/' . $name . '.ogg';

        $res = exec($cmd, $output, $returnVar);
        // error
        if($returnVar !== 0){
            return null;
        }
        else{
            // 2 - create a Media with this sound file
            $media = new Media();
            $media->setType('audio');
            $media->setUrl($name . '.ogg');
            // 3 - add it to the current exercise
            $exercise->addMedia($media);
            return $exercise;
        } 
    }

    private function getMediaTypeFromExtension($ext) {
        $audio_ext = ['ogg', 'mp3', 'wav'];
        $video_ext = ['ogv', 'mp4'];
        $type = '';
        if (in_array($ext, $audio_ext)) {
            $type = 'audio';
        } elseif (in_array($ext, $video_ext)) {
            $type = 'video';
        }
        return $type;
    }

}
