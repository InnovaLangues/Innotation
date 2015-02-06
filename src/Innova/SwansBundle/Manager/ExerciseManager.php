<?php

namespace Innova\SwansBundle\Manager;

use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Innova\SwansBundle\Entity\Exercise;
use Innova\SwansBundle\Entity\Media;
use Innova\SwansBundle\Entity\Region;
use Innova\SwansBundle\Exception\SwansException;

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
    
    public function addDefaultRegion(Exercise $exercise){
        $region = new Region();
    }

    /**
     * 
     * @param UploadedFile $file
     * @param Exercise $exercise
     * @throws SwansException
     */
    public function handleExerciseFile(UploadedFile $file, Exercise $exercise) {

        // get file type (audio / video)
        $originalName = $file->getClientOriginalName();
        $type = $this->getExerciseMediaType($originalName);

        // set new filename
        $name = $this->setName($file);

        // upload file
        if ($this->upload($file, $name)) {

            if ('video' === $type) {
                // create Media
                $media = new Media;
                $media->setType($type);
                $media->setUrl($name);
                $exercise->addMedia($media);
                $this->em->persist($exercise);
                // extract audio from uploaded video and update Exercise with new media (url, type)
                $audioFromVideo = $this->createAudioMedia($name);
                if ($audioFromVideo) {
                    $exercise->addMedia($audioFromVideo);
                    $this->em->persist($exercise);
                } else {
                    $removed = $this->removeUpload($name);
                    throw new SwansException(
                    SwansException::SWANS_EXCEPTION_ERROR_CONVERTION_MESSAGE, SwansException::SWANS_EXCEPTION_ERROR_CONVERTION_CODE
                    );
                }
            } else {
                // encode to ogg
                $audioMedia = $this->createAudioMedia($name, false);
                // update Exercise with media infos
                if ($audioMedia) {
                    $exercise->addMedia($audioMedia);
                    $this->em->persist($exercise);
                    // delete original file
                    $removed = $this->removeUpload($name);
                    // TODO write log if problem while deleting file
                } else {
                    $removed = $this->removeUpload($name);
                    throw new SwansException(
                    SwansException::SWANS_EXCEPTION_ERROR_CONVERTION_MESSAGE, SwansException::SWANS_EXCEPTION_ERROR_CONVERTION_CODE
                    );
                }
            }

            $this->em->flush();
            
        } else {
            throw new SwansException(
            SwansException::SWANS_EXCEPTION_ERROR_UPLOAD_MESSAGE, SwansException::SWANS_EXCEPTION_ERROR_UPLOAD_CODE
            );
        }
    }

    /**
     * set a name for the file
     * @param UploadedFile $file
     * @return string the new name
     */
    public function setName(UploadedFile $file) {
        if (null !== $file) {
            $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
            return sha1(uniqid(mt_rand(), true)) . '.' . $ext;
        }
    }

    /**
     * Get the type of the file regarding it's extension
     * (could not rely on mimeType)
     * @param string $name the full name of the file (with extension)
     * @return string audio or video
     */
    public function getExerciseMediaType($name) {

        $ext = pathinfo($name, PATHINFO_EXTENSION);
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

    /**
     * @param string $url original video file url
     * @param bool $fromVideo if we must extract audio from video or just convert original file to ogg
     * @return Media or null if error
     */
    public function createAudioMedia($url, $fromVideo = true) {
        $ext = pathinfo($url, PATHINFO_EXTENSION);

        // remove extension from video name
        $name = basename($url, "." . $ext);

        // extract audio sound file from the video
        if ($fromVideo) {
            // $cmd = 'avconv -i ' . $this->kernelRoot . '/../web/media/uploads/' . $url . ' -acodec libvorbis -q:a 5 -vn -f ogg ' . $this->kernelRoot . '/../web/media/uploads/' . $name . '.ogg';
            $cmd = 'avconv -i ' . $this->getUploadRootDir() . '/' . $url . ' -acodec libvorbis -q:a 5 -vn -f ogg ' . $this->getUploadRootDir() . '/' . $name . '.ogg';
        } else {
            $cmd = 'avconv -i ' . $this->getUploadRootDir() . '/' . $url . ' -acodec libvorbis -q:a 5 ' . $this->getUploadRootDir() . '/' . $name . '.ogg';
        }

        exec($cmd, $output, $returnVar);
        // error
        if ($returnVar !== 0) {
            // die($cmd);
            return null;
        } else {
            // 2 - create a Media with this sound file
            $media = new Media();
            $media->setType('audio');
            $media->setUrl($name . '.ogg');
            return $media;
        }
    }

    public function upload(UploadedFile $file, $url) {
        if (null === $file) {
            return;
        }

        $uploaded = $file->move($this->getUploadRootDir(), $url);
        unset($file);
        return $uploaded;
    }

    public function removeUpload($filename) {
        $url = $this->getUploadRootDir() . '/' . $filename;
        if (file_exists($url)) {
            unlink($url);
            return true;
        } else {
            return false;
        }
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

}
