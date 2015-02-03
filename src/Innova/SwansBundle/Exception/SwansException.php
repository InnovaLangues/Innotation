<?php

namespace Innova\SwansBundle\Exception;

use Exception;
/**
 * Description of InnovaSwansBundleExceptionInterface
 *
 * @author patrick
 */
class SwansException extends Exception {
    /**
     * 
     */
    const SWANS_EXCEPTION_ERROR_UPLOAD_MESSAGE = "Error while uploading file";
    const SWANS_EXCEPTION_ERROR_UPLOAD_CODE = 0;

    /**
     * 
     */
    const SWANS_EXCEPTION_ERROR_CONVERTION_MESSAGE = "Error while converting file.";
    const SWANS_EXCEPTION_ERROR_CONVERTION_CODE = 1;
    
    const SWANS_EXCEPTION_ERROR_FILE_DELETION_MESSAGE = "Error while deleting file.";
    const SWANS_EXCEPTION_ERROR_FILE_DELETION_CODE = 2;
    
}
