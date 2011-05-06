<?php defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.plugin.plugin' );

class plgSystemTranslate extends JPlugin
{
	function onAfterRoute()
	{
		global $mainframe;

        $plugin =& JPluginHelper::getPlugin('system', 'translate');
        $params = new JParameter( $plugin->params );
		$on = $params->get("enable_google_language");
		$srcLang = $params->get("srcLang");
		if ($mainframe->isAdmin()) {

	        if (!class_exists('plgSystemJSIntegrator')) {
	          JError::raiseNotice('', JText::_('Please enable JSIntegrator plugin'));
	          return false;
	        }
			$document = & JFactory::getDocument();
			$document->addScriptDeclaration("translate.enableGoogle = {$on};\ntranslate.fromLang = '{$srcLang}';\ntranslate.toLang = 'en';");
			$document->addScript('http://www.google.com/jsapi');
			$document->addScript('/plugins/system/translate/translate.pack.js');
		}
	}


}