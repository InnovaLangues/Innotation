Innotation
==========

This project is a recast of SWANS project firstly developped by Anthony Stenton at Toulouse University. 

It's goal is to allow prosodic text annotation of media and a synchronised playback between the media and annotated texts.

It uses [wavesurferjs](https://github.com/katspaugh/wavesurfer.js) to display the media sound waveform and allow the creation of region.

Installation
------------

- Fork this repo
- Create web/media and web/media/uploads directory
- Change rights on app/cache app/logs app/config web/media folders by using facl or whatever you want
- Copy app/config/parameters.yml.dist to app/config/parameters.yml and set the database parameters
- Install dependencies by running composer install 
- Install assets php app/console assets:install --symlink

Known limitations
-----------------

- No check of media validity when uploading (size / format)
- Audio is converted in ogg - vorbis (in the case of a video media audio is extracted and then converted)
- Video is not converted at all
- No user rights implemented
- Keyboard shortcuts events problems with focused elements
- Untimely page scrolls with some events
- ...

Demo
----

http://dev.innovalangues.net/tests/Innotation/web


