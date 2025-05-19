<?php
  
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  use Bitrix\Main\Localization\Loc;
  
  Loc::loadMessages(__FILE__);
  
  $arTemplateParameters = array(
    'CSS_CLASS_OUTER' => array(
      'NAME' => Loc::getMessage('MENU_CSS_CLASS_OUTER'),
      'TYPE' => 'STRING',
      'DEFAULT' => 'menu',
    ),
    'CSS_CLASS_ITEM' => array(
      'NAME' => Loc::getMessage('MENU_CSS_CLASS_ITEM'),
      'TYPE' => 'STRING',
      'DEFAULT' => 'menu',
    ),
    'CSS_CLASS_ITEM_ACTIVE' => array(
      'NAME' => Loc::getMessage('MENU_CSS_CLASS_ITEM_ACTIVE'),
      'TYPE' => 'STRING',
      'DEFAULT' => 'menu',
    ),
  );