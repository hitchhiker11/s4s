<?php
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  class FTMenu extends CBitrixComponent {
    public $arParams = [];
    public $arResult = [];
    /**
     * Подготовка параметров компонента
     * @param $arParams
     * @return mixed
     */
    public function onPrepareComponentParams($arParams) {
      
      $this->arParams = $arParams;
      return $arParams;
    }
    
    /**
     * Точка входа в компонент
     */
    public function executeComponent() {
      $this->includeComponentTemplate();
    }
  }