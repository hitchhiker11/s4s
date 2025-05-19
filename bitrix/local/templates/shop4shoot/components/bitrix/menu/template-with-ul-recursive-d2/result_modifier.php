<?php
  /**
   * Created by olegpro.ru.
   * User: Oleg Maksimenko <oleg.39style@gmail.com>
   * Date: 26.08.2016. Time: 11:15
   */
  
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  /** @var array $arResult */
  /** @var array $arParams */
  /** @var CBitrixComponentTemplate $this */


// [section_id => [all parents ids]]
  $selectedItems = [];

// [section_id => parent_section_id]
  $mapSectionIds = [];

// [section_id => [all parents ids]]
  $mapSectionParentIds = [];
  
  $allSelectedItems = [];
  
  foreach ($arResult as $arItem) {
    if ($arItem['SELECTED'] && isset($arItem['PARAMS']['ID'])) {
      $selectedItems[$arItem['PARAMS']['ID']] = 1;
    }
    
    if (isset($arItem['PARAMS']['ID']) && array_key_exists('IBLOCK_SECTION_ID', $arItem['PARAMS'])) {
      $mapSectionIds[$arItem['PARAMS']['ID']] = $arItem['PARAMS']['IBLOCK_SECTION_ID'];
    }
    
    
  }
  
  $selectedDirectItemsId = $selectedItems;
  
  foreach ($mapSectionIds as $sectionId => $sectionParentId) {
    
    $sectionsParent = [];
    
    $parentId = $sectionParentId;
    
    while (isset($parentId)) {
      
      $sectionsParent[] = $parentId;
      
      $parentId = isset($mapSectionIds[$parentId])
        ? $mapSectionIds[$parentId]
        : null;
    }
    
    $mapSectionParentIds[$sectionId] = $sectionsParent;
    
    if (isset($selectedItems[$sectionId])) {
      $selectedItems[$sectionId] = $sectionsParent;
      
      $allSelectedItems = array_merge($allSelectedItems, $sectionsParent);
    }
    
  }
  
  
  if (!empty($allSelectedItems)) {
    $allSelectedItems = array_flip($allSelectedItems);
  }
  
  
  foreach ($arResult as $key => $arItem) {
    if (
      isset(
        $arItem['PARAMS']['ID'],
        $allSelectedItems[$arItem['PARAMS']['ID']]
      )
    ) {
      $arItem['SELECTED'] = true;
      
      $arResult[$key] = $arItem;
    }
  }
  
  unset($key, $arItem);


// Generate hierarchical tree
  $map = [
    0 => [
      'CHILDREN' => []
    ]
  ];
  
  foreach ($arResult as &$arItem) {
    $arItem['CHILDREN'] = [];
    
    $map[$arItem['PARAMS']['ID']] = &$arItem;
  }
  
  $count = 0;
  foreach ($arResult as &$arItem) {
    if ($count > 4 && $arItem["PARAMS"]["DEPTH_LEVEL"] == 1) break;
    if ($arItem["PARAMS"]["DEPTH_LEVEL"] == 1) $count += 1;
    $map[(int)$arItem['PARAMS']['IBLOCK_SECTION_ID']]['CHILDREN'][] = &$arItem;
  }
  
  $arResultCopy = $arResult;
  
  $arResult = [
    'CHILDREN' => $map[0]['CHILDREN'],
    'SELECTED_DIRECT_IDS' => $selectedDirectItemsId,
  ];
  $brandsData = getBrandsMenu();
//  echo '<pre>', print_r($arResult["CHILDREN"][0]["PARAMS"]["ID"], true), '</pre>';
  if ($arResult["CHILDREN"][0]["PARAMS"]["ID"] == 420) {
//  if ($arResult["CHILDREN"][0]["PARAMS"]["ID"] == CATALOG_PARENT_SECTION) {
    $arResult["CHILDREN"] = $arResult["CHILDREN"][0]["CHILDREN"];
  }
//  $arResult["CHILDREN"][] = $brandsData["data"];
  $arResult["CHILDREN"][] = [
    "TEXT" => "бренды",
    "LINK" => "/brands/",
    "PARAMS" => [
      "DEPTH_LEVEL" => 1,
    ],
    "CHILDREN" => []
  ];
  $arResult["CHILDREN"][] = [
    "TEXT" => "новинки",
    "LINK" => "/?new=y",
    "PARAMS" => [
      "DEPTH_LEVEL" => 1,
    ],
    "CHILDREN" => []
  ];
  $arResult["CHILDREN"][] = [
    "TEXT" => "Доставка",
    "LINK" => "/delivery/",
    "PARAMS" => [
      "DEPTH_LEVEL" => 1,
      "MOBILE" => "Y"
    ],
    "CHILDREN" => []
  ];
  $arResult["CHILDREN"][] = [
    "TEXT" => "договор-оферта",
    "LINK" => "/offer/",
    "PARAMS" => [
      "DEPTH_LEVEL" => 1,
      "MOBILE" => "Y"
    ],
    "CHILDREN" => []
  ];
  $arResult["CHILDREN"][] = [
    "TEXT" => "контакты",
    "LINK" => "/contacts/",
    "PARAMS" => [
      "DEPTH_LEVEL" => 1,
      "MOBILE" => "Y"
    ],
    "CHILDREN" => []
  ];
  
  $arResult["brandsKeys"] = $brandsData["keys"];
  $arResult["brandsFilter"] = $brandsData["filter"];
  
  $map = null;
  
  unset($map);