<?php

namespace Innova\SwansBundle\Repository;

use Doctrine\ORM\EntityRepository;

class DictionaryEntryRepository extends EntityRepository {

    public function getSampaEntries($dictionaryId, $word) {
        
        
        $builder = $this->createQueryBuilder('de');
        $builder->where('de.dictionary = :id');
        $builder->andWhere('LOWER(de.word) = :word');
        $builder->andWhere('de.nbSyll > :nbsyll');

        $builder->setParameters(array('id' => $dictionaryId, 'word' => $word, 'nbsyll' => 1));
        $result = $builder->getQuery()->getResult();
        return $result && $result[0] ? $result[0]:null;
    }

}
