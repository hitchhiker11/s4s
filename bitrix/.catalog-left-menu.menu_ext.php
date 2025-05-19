<?php
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  /** @var array $aMenuLinks */
  
  use Bitrix\Iblock\SectionTable;
  use Bitrix\Main\Loader;
  use Bitrix\Iblock\IblockTable;
  use Bitrix\Main\Data\Cache;
  use Bitrix\Main\Data\TaggedCache;
  use Bitrix\Main\Entity;
  use Bitrix\Main\Application;
  
  $catalogIblockId = CATALOG_IB;
  
  $aMenuLinksExt = array();
  
  $cache = Cache::createInstance();
  $cacheTime = 86400;
  $cacheId = 'catalog-left-menu-ext';
  
  if ($cache->initCache($cacheTime, $cacheId, '/olegpro/bitrix.menu_ext/catalog-left-menu')) {
    $aMenuLinksExt = $cache->GetVars();
  } elseif ($cache->startDataCache()) {
    if (Loader::includeModule('iblock')) {
      $iblockIterator = IblockTable::getList(array(
        "order" => ["sort" => "asc"],
        'select' => array('SECTION_PAGE_URL', 'CODE'),
        'filter' => array('=ID' => $catalogIblockId),
        'limit' => 1
      ));
      
      if ($iblock = $iblockIterator->fetch()) {
        
        $connection = Application::getConnection();
        
        $entityUtsTableName = sprintf('b_uts_iblock_%s_section', $catalogIblockId);
        
        $entityUtsTableNameTableExists = $connection->isTableExists($entityUtsTableName);
        
        if ($entityUtsTableNameTableExists) {
          $entityUts = Entity\Base::compileEntity('utsSectionOlegproLeftCatalogMenu' . randString(4),
            [
              'VALUE_ID' => ['data_type' => 'integer'],
//              'UF_CSS_CLASS_MENU' => ['data_type' => 'string'],
            ],
            ['table_name' => sprintf('b_uts_iblock_%s_section', $catalogIblockId)]
          );
        }
        
        $sectionIteratorParameters = array(
          'select' => [
            'CODE',
            'NAME',
            'ID',
            'DEPTH_LEVEL',
            'IBLOCK_SECTION_ID',
          ],
          'filter' => [
            "=IBLOCK_ID" => $catalogIblockId,
            '<=DEPTH_LEVEL' => 4,
            '=ACTIVE' => 'Y',
            '=GLOBAL_ACTIVE' => 'Y',
          ],
          'order' => [
            'LEFT_MARGIN' => 'ASC',
          ],
          'runtime' => [],
        );
        
        if ($entityUtsTableNameTableExists && isset($entityUts) && is_object($entityUts)) {
//          $sectionIteratorParameters['select']['UF_CSS_CLASS_MENU'] = 'UF.UF_CSS_CLASS_MENU';
          
          $sectionIteratorParameters['runtime'][] = new Entity\ReferenceField('UF',
            $entityUts,
            ['=this.ID' => 'ref.VALUE_ID']
          );
        }
        
        $sectionIterator = SectionTable::getList($sectionIteratorParameters);
        
        $sections = [];
//        if ($_SERVER["REMOTE_ADDR"] === "178.155.4.218" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "178.155.4.218") {
//          var_dump($sectionIterator->fetch());
//        }
        while ($section = $sectionIterator->fetch()) {
          $sections[$section['ID']] = $section;
        }
        
        unset($section);
        
        foreach ($sections as $section) {
          
          $sectionCodes = [
            $section['CODE']
          ];
          
          $parentId = $section['IBLOCK_SECTION_ID'];
          
          while (isset($parentId)) {
            
            if (isset($sections[$parentId])) {
              $sectionCodes[] = $sections[$parentId]['CODE'];
              
              $parentId = $sections[$parentId]['IBLOCK_SECTION_ID'];
            } else {
              $parentId = null;
            }
            
          }
          
          $aMenuLinksExt[] = array(
            $section['NAME'],
            "/".$section['CODE']."/",
//            str_replace(
//              array(
//                '#SITE_DIR#',
//                '#IBLOCK_CODE#',
//                '#SECTION_CODE_PATH#',
//              ),
//              array(
//                SITE_DIR,
//                $iblock['CODE'],
//                implode('/', array_reverse($sectionCodes))
//              ),
//              $iblock['SECTION_PAGE_URL']
//            ),
            array(),
            array(
              'ID' => $section['ID'],
              'DEPTH_LEVEL' => $section['DEPTH_LEVEL'],
              'CODE' => $section['CODE'],
              'IBLOCK_SECTION_ID' => $section['IBLOCK_SECTION_ID']
//              'UF_CSS_CLASS_MENU' => $section['UF_CSS_CLASS_MENU'],
            )
          );
        }
        
        if (defined('BX_COMP_MANAGED_CACHE')) {
          $tagCache = new TaggedCache();
          $tagCache->startTagCache('/olegpro/bitrix.menu_ext/catalog-left-menu');
          $tagCache->registerTag(sprintf('iblock_id_%s', $catalogIblockId));
          $tagCache->endTagCache();
        }
        
      } else {
        $cache->abortDataCache();
      }
    }
    $cache->endDataCache($aMenuLinksExt);
  }
  
  $aMenuLinks = array_merge($aMenuLinks, $aMenuLinksExt);
  
//  if ($_SERVER["REMOTE_ADDR"] === "178.155.4.218" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "178.155.4.218") {
//    unset($aMenuLinks[0]);
//    echo '<pre>', print_r($aMenuLinks, true), '</pre>';
//  }