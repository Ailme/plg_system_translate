# Плагин для транслитерации и перевода поля alias при помощи сервиса Google Translate

Для работы нужен плагин plgSystemJSIntegrator либо закоментировать/удалить в файле translate.php строки:

if (!class_exists('plgSystemJSIntegrator')) {
  JError::raiseNotice('', JText::_('Please enable JSIntegrator plugin'));
  return false;
}

и дописать:

$document->addScript('путь к jQuery.js');