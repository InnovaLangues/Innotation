<?php

namespace Innova\SwansBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
// use Innova\SwansBundle\Form\Type\MediaType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
/**
 * Description of ExerciseType
 *
 * @author patrick
 */
class ExerciseType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder->add('name', 'text')
  
                //->add('dictionary', 'entity', array('class' => 'InnovaSwansBundle:Dictionary', 'property' => 'name'))
                /*->add('medias', 'collection', array(
                    'type' => new MediaType(),
                    'allow_add' => true)
                )*/
                ->add('save', 'submit');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver) {

        $resolver->setDefaults(array(
            'data_class' => 'Innova\SwansBundle\Entity\Exercise'
        ));
    }

    public function getName() {
        return 'exercise';
    }

}
