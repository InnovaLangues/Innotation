<?php
namespace Innova\SwansBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Description of ExerciseType
 *
 * @author patrick
 */
class MediaType extends AbstractType {
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
       $builder->add('file', 'file');
    }
    
    public function setDefaultOptions(OptionsResolverInterface $resolver) {

        $resolver->setDefaults(array(
            'data_class' => 'Innova\SwansBundle\Entity\Media'
        ));
    }

    public function getName()
    {
        return 'file';
    }
}
