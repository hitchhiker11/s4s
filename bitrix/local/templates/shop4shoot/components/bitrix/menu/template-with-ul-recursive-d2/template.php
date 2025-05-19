<?php
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  /** @var array $arResult */
  /** @var array $arParams */
  /** @var CBitrixComponentTemplate $this */
  
  $this->setFrameMode(true);
  if (!empty($arResult)) {
    $count = 0;
    $menuRecursive = function ($items, $level = 2) use ($arParams, $arResult, &$menuRecursive) {
      
      $items = array_values($items);
      
      $countItems = sizeof($items);
      
      if (sizeof($items) > 0) {
        
        $cssClassOuter = array_filter(
          array_map('trim', explode(' ', $arParams['CSS_CLASS_OUTER']))
        );
        
        $cssClassOuter = array_map(
          function ($value) use ($level, &$cssClassOuter) {
            return implode(' ', [$value, sprintf('%s-level%d', $value, $level)]);
          },
          $cssClassOuter
        );
        $isBrands = $items[0]["PARAMS"]["BRANDS"] === "Y";
        $listClass = "r-parent";
        if ((int)$level === 3) {
          $listClass = "r-child";
          
        }
        if ((int)$level === 4) {
          $listClass = "r-items";
        }
        if ((int)$level === 3) :
          
          ?><div class="<?php if ($isBrands) echo "brands-list-wrapper" ?>">
          <?php
//            echo '<pre>', print_r($items[0], true), '</pre>';
          ?>
          <?php if ($isBrands) : ?>
          <?php if (
            !empty($arResult["brandsFilter"]["lat"])
            || !empty($arResult["brandsFilter"]["num"])
            || !empty($arResult["brandsFilter"]["cyr"])
          ) : ?>
            <div class="brands-filter-wrapper">
              <div>
                <a href="javascript:void(0)" data-namespace="all">Все</a>
              </div>
              <?php if (!empty($arResult["brandsFilter"]["lat"])) : ?>
                <div class="filter-namespace current-filter-namespace">
                  <a href="javascript:void(0)" data-namespace="lat">A-Z</a>
                  <ul>
                    <?php foreach ($arResult["brandsFilter"]["lat"] as $lItem) : ?>
                      <li>
                        <a href="javascript:void(0)" data-letter="<?= $lItem ?>"><?= $lItem ?></a>
                      </li>
                    <?php endforeach ?>
                  </ul>
                </div>
              <?php endif ?>
              <?php if (!empty($arResult["brandsFilter"]["num"])) : ?>
                <div class="filter-namespace">
                  <a href="javascript:void(0)" data-namespace="num">0-9</a>
                  <ul>
                    <?php foreach ($arResult["brandsFilter"]["num"] as $lItem) : ?>
                      <li>
                        <a href="javascript:void(0)" data-letter="<?= $lItem ?>"><?= $lItem ?></a>
                      </li>
                    <?php endforeach ?>
                  </ul>
                </div>
              <?php endif ?>
              <?php if (!empty($arResult["brandsFilter"]["cyr"])) : ?>
                <div class="filter-namespace">
                  <a href="javascript:void(0)" data-namespace="cyr">А-Я</a>
                  <ul>
                    <?php foreach ($arResult["brandsFilter"]["cyr"] as $lItem) : ?>
                      <li>
                        <a href="javascript:void(0)" data-letter="<?= $lItem ?>"><?= $lItem ?></a>
                      </li>
                    <?php endforeach ?>
                  </ul>
                </div>
              <?php endif ?>
            </div>
          <?php endif; ?>
        <?php endif; ?>
        <?php
        endif;
        $isMobile = $items[0]["PARAMS"]["MOBILE"] === "Y";
        if ($isMobile) $listClass.= " r-header-mobile"
        ?>
        <ul class="<?= $listClass ?>"><?php
        
        foreach ($items as $i => $arItem) {
          $cssClasses = [
            $arParams['CSS_CLASS_ITEM'],
          ];
          
          if (($i + 1) % 2 == 0) {
            $cssClasses[] = 'even';
          } else {
            $cssClasses[] = 'odd';
          }
          
          if ($i == 0) {
            $cssClasses[] = 'first';
          }
          
          if ($countItems == $i + 1) {
            $cssClasses[] = 'last';
          }
          
          if ($arItem['SELECTED']) {
            $cssClasses[] = $arParams['CSS_CLASS_ITEM_ACTIVE'];
          }
          
          if (isset($arItem['PARAMS'], $arItem['PARAMS']['CLASS']) && strlen(trim($arItem['PARAMS']['CLASS']))) {
            $cssClasses[] = trim($arItem['PARAMS']['CLASS']);
          }
          $nameSpaceAttribute = "";
          if ((int)$level === 3 && $isBrands) : ?>
            <?php
            $nameSpace = "lat";
            if (preg_match("/[А-Яа-я]/", $arItem['TEXT'])) {
              $nameSpace = "cyr";
            }
            if (preg_match("/[0-9]/", $arItem['TEXT'])) {
              $nameSpace = "num";
            }
            $nameSpaceAttribute = "data-target-namespace=".$nameSpace." data-target-letter=".$arItem['TEXT'];
            ?>
            <?php endif;
//          $isMobile = $arItem["PARAMS"]["MOBILE"];
          $isMobile = $arItem["PARAMS"]["MOBILE"] === "Y";
          if ($isMobile) $cssClasses[] = "r-header-mobile"
            ?>
          <?php if ($arItem['SELECTED'] && isset($arResult['SELECTED_DIRECT_IDS'][$arItem['PARAMS']['ID']])) {
            ?>
            <li class="<?php echo implode(' ', $cssClasses) ?>"
              <?= $nameSpaceAttribute?>
            >
            <span><?php echo $arItem['TEXT'] ?></span>
            <?php $menuRecursive($arItem['CHILDREN'], $arItem['PARAMS']['DEPTH_LEVEL'] + 1) ?>
            </li><?php
          } else {
            ?>
            <li class="<?php echo implode(' ', $cssClasses) ?>"
              <?= $nameSpaceAttribute?>
            >
            <a href="<?php echo $arItem['LINK'] ?>"><?php echo $arItem['TEXT'] ?></a>
            <?php $menuRecursive($arItem['CHILDREN'], $arItem['PARAMS']['DEPTH_LEVEL'] + 1) ?>
            </li><?php
          }
          if ((int)$level === 2 && $countItems != $i + 1 && !$isMobile) {
            ?>
            <li class="separator"></li>
            <?php
          }
        }
        ?></ul><?php
        if ((int)$level === 3) : ?>
          </div>
        <?php endif;
      }
      
    };
    
    $menuRecursive($arResult['CHILDREN']);
    
  }