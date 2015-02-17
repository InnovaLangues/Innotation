<?php

namespace Innova\SwansBundle\Manager;

use Doctrine\ORM\EntityManager;
use Innova\SwansBundle\Entity\Dictionary;

/**
 * Description of DictionaryManager
 *
 * @author patrick
 */
class AnnotationManager {

    protected $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

    public function findOneByName($name) {

        return $this->getRepository()->findOneBy(array('name' => $name));
    }

    public function getRepository() {
        return $this->em->getRepository('InnovaSwansBundle:DictionaryEntry');
    }

    public function annotateText($text, $langId) {

        $sampaCorresTab = $this->getSampaMatches();
        $html = "";
        $tmpStr = "";
        $resultMatch = "";
        $correctMatch = "";
        $cleanedText = str_replace('&lt;br&gt;', "<br>", $text);
        $sampaWords = $this->getSampaWords($langId, $cleanedText);

        if ($cleanedText !== '') {

            foreach ($sampaWords as $index => $entry) {
                $word = $entry['word'];
                $sampa = $entry['sampa'];
                if ($sampa == '') {
                    $html .= $word;
                } else {
                    $annotatedText = "";
                    $spans = "";
                    $tm = 0;
                    $ts = 0;
                    $nbS = strlen($sampa);
                    $nbM = strlen($word);
                    $classCSS = "";

                    while ($ts < $nbS || $tm < $nbM) {

                        $annotatedText_old = $annotatedText;
                        $iTm = 0;
                        $iTs = 0;

                        $cs = ($ts >= $nbS) ? "" : $sampa[$ts];
                        $cm = ($tm >= $nbM) ? "" : $word[$tm];
                        $cs1 = ($ts + 1 >= $nbS) ? "" : $sampa[$ts + 1];

                        $tmpStr = "";
                        $resultMatch = "";
                        $correctMatch = "";
                        $corres = false;

                        $matches = $this->sampaMatch($sampaCorresTab, substr($sampa, $ts, 2)) ? $this->sampaMatch($sampaCorresTab, substr($sampa, $ts, 2)) : $this->sampaMatch($sampaCorresTab, $cs);

                        if (!$this->sampaSymbolInStr($cs) && $matches) {
                            $resultMatch = $matches['match'];
                            $tmpStr = $matches['ch'];
                            $tabMatch = explode(",", $resultMatch);

                            $nbTabMatch = count($tabMatch);
                            for ($j = 0; $j < $nbTabMatch; $j++) {
                                $tmpChars = substr($word, $tm, strlen($tabMatch[$j]));
                                if (!$this->sampaSymbolInStr($tmpStr)) {
                                    if ($tabMatch[$j] && ($tabMatch[$j] == strtolower($tmpChars)) && (strlen($tmpChars) > strlen($correctMatch))) {
                                        $correctMatch = $tmpChars;
                                    }
                                }
                            }

                            if ($correctMatch != "") {
                                $corres = true;
                                $iTm += strlen($correctMatch);
                                $iTs += strlen($tmpStr);
                                $annotatedText .= $correctMatch;
                            }
                        }

                        if (!$corres) {
                            if ($cs == $cm) {
                                $iTm++;
                                $iTs++;
                                $annotatedText .= $cm;
                            } else if ($this->isVowel($cm) && $cs == "s") {
                                $iTs++;
                            } else if ($cs == "" && $cm != "") {
                                $iTm++;
                                $annotatedText .= $cm;
                            } else {

                                if ($this->sampaSymbolInStr($cs)) {
                                    switch ($cs) {
                                        case".": // no accent
                                            $spans .= "<span class=\"" . $classCSS . "\">" . $annotatedText . "</span>";
                                            $annotatedText = "";
                                            $classCSS = 'accent-black';
                                            break;
                                        case"\"": // primary accent
                                            $classCSS = 'accent-blue';
                                            break;
                                        case"%": // secondary accent
                                            $classCSS = 'accent-red';
                                            break;
                                        case"`": // weak vowel
                                            $classCSS = 'accent-orange';
                                            break;
                                    }

                                    $iTs++;
                                } else if ($cm == $cs1) {

                                    $iTs++;
                                } else if ($annotatedText_old == $annotatedText) {
                                    $iTm++;
                                    $annotatedText .= $cm;
                                }
                            }
                        }
                        if (($iTm == 0 && $iTs == 0) || ($tm > $nbS && $tm >= strlen($annotatedText))) {
                            $annotatedText = $word;

                            break;
                        }

                        $ts += $iTs;
                        $tm += $iTm;
                    }

                    $html.= $spans . "<span class=\"" . $classCSS . "\">" . $annotatedText . "</span>";
                }

                $pattern = array('.', ',', '?', '!', ':', '-');
                if (array_key_exists($index + 1, $sampaWords)) {
                    $test = $sampaWords[$index + 1]['word'];
                    // punctuation : if next word is not a "punctuation word" add a space
                    if (!in_array($test, $pattern)) {
                        $html .= " ";
                    }
                }
            }
            return array("result" => "success", "text" => htmlspecialchars($html, ENT_QUOTES));
        }
    }

    /**
     * Create an array of word / sampa matches for a given dictionnary id and a sentence
     * @param integer $id
     * @param string $sentence
     * @return array
     */
    public function getSampaWords($id, $sentence = "") {
        $corresTab = array();

        if ($sentence != "") {

            $pattern = array('.', ',', '?', '!', ':', '-');
            $replace = array(' . ', ' , ', ' ? ', ' ! ', ' : ', ' - ');
            $search = str_replace($pattern, $replace, $sentence);
            $searchedWords = explode(" ", $search);

            foreach ($searchedWords as $word) {
                if (in_array($word, $pattern)) {
                    // punctuation
                    $corresTab[] = array('word' => trim($word), 'sampa' => '');
                } else if ($entry = $this->getRepository()->getSampaEntries($id, strtolower($word))) {

                    $corresTab[] = array('word' => $word, 'sampa' => $entry->getSampa());
                } else {
                    $corresTab[] = array('word' => $word, 'sampa' => '');
                }
            }
        }
        return $corresTab;
    }

    /**
     * Check if there is a entry in $sampaCorresTab for a given string
     * @param type $sampaCorresTab
     * @param type $ch
     * @return boolean
     */
    public function sampaMatch($sampaCorresTab, $ch = "") {
        $resultMatch = "";
        $tmpStr = "";

        if (is_string($ch) && array_key_exists($ch, $sampaCorresTab)) {

            $resultMatch = $sampaCorresTab[$ch];
            $tmpStr = $ch;
            return array('match' => $resultMatch, 'ch' => $tmpStr);
        } else {

            return false;
        }
    }

    public function sampaSymbolInStr($ch) {
        return (preg_match("#\.|\%|\"|\=|\`#", $ch)) ? true : false;
    }

    public function isVowel($ch) {
        return (preg_match("#a|e|i|o|u|y#i", $ch)) ? true : false;
    }

    /**
     * Get Sampa matches
     * @return array
     */
    public function getSampaMatches() {
        $arr = array(
            '4' => 't,d', '{' => 'a', '@' => 'a,e,o,i,u,we,ou', '3' => 'i,e,o,u', 'A' => 'o,a',
            'aI' => 'ei,y,i', 'Ar' => 'ar', 'aU' => 'ow,ou', 'd' => 'dd,ed', 'D' => 'th', 'dZ' => 'j,g,dg',
            'e' => 'ai,a', 'E' => 'a,e,ei', 'eI' => 'ai,ay', 'er' => 'air, ere', 'f' => 'ph,gh', 'gw' => 'gu', 'hw' => 'wh', 'i@' => 'ea', 'i' => 'e,y,ee,ea',
            'I' => 'o,e,a,i', 'IN' => 'ing', 'ir' => 'ear,ere', 'j' => 'y', 'ju' => 'u', 'j@' => 'u,io', 'ks' => 'x', 'k' => 'x,ch,ck,c,q,ks,qu',
            'l' => 'll', 'iN' => 'ing', 'O' => 'a,aw,au,o', 'OI' => 'oy,oi', 'oU' => 'O,oe', 'r' => 'wr', 's' => 'ss,c',
            'S' => 'sh,s,ti', 'Sn' => 'tion', 't' => 'ed', 'T' => 'th', 'tS' => 'ch,t', 'u' => 'ew,o,oo,ou', 'U' => 'u,oul', 'Ur' => 'our',
            'V' => 'a,o,u,ou', 'v' => 'w,f', 'Z' => 's,g', 'z' => 'z,s,x', 'zm' => 'c'
        );

        return $arr;
    }

}
