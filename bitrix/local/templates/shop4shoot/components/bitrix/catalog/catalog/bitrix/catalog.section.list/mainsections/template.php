<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  /** @var array $arParams */
  /** @var array $arResult */
  /** @global CMain $APPLICATION */
  /** @global CUser $USER */
  /** @global CDatabase $DB */
  /** @var CBitrixComponentTemplate $this */
  /** @var string $templateName */
  /** @var string $templateFile */
  /** @var string $templateFolder */
  /** @var string $componentPath */
  /** @var CBitrixComponent $component */
  $this->setFrameMode(true);
  global $KRAKEN_TEMPLATE_ARRAY;
  CKraken::includeCustomMessages();
  CKraken::getMess(array("catalog"));
?>
<? $countSections = (!empty($arResult["SECTIONS"])) ? count($arResult["SECTIONS"]) : 0 ?>


<div class="section-with-hidden-items aside-sections-list">
  
  <? if ($countSections > 1): ?>
    
    <div
      class="btn-click click-animate-slide-down noactive noactive-mob catlist-icon"
      data-show="catalog-sections">
      <?= $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["OTHER_CATEGORY"] ?>
      <i class="down  concept-down-open-mini"></i>
      <i class="up concept-up-open-mini"></i>
    </div>
  
  <? endif; ?>
  
  <div class="body content-animate-slide-down noactive noactive-mob"
       data-show="catalog-sections" style="display: none">
    
    <div id="navigation" class="menu-navigation static">
      
      <div class="menu-navigation-wrap">
        <div class="menu-navigation-inner">
          
          <ul class="nav">
            
            <? if ($countSections > 1): ?>
              
              <? foreach ($arResult["SECTIONS"] as $arSection): ?>
                
                <li data-id="<?= $arSection["ID"] ?>">
                  <a href="<?= $arSection["SECTION_PAGE_URL"] ?>">
                    <?= strip_tags($arSection["~NAME"]) ?></td>
                    <? if ($KRAKEN_TEMPLATE_ARRAY['CTLG_HIDE_COUNT_GOODS']['VALUE'][0] != "Y"): ?>
                      <div class="count"><?= $arSection["ELEMENT_CNT"] ?></div>
                    <? endif; ?>
                  
                  </a>
                </li>
              
              <? endforeach; ?>
            
            <? endif; ?>
            
            <? if (strlen($arResult["SECTION_BACK"]) > 0): ?>
              
              <li class="back">
                <a
                  href="<?= $arResult["SECTION_BACK"] ?>"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_MAINSECTIONS_BACK") ?></a>
              </li>
            <? endif; ?>
          
          </ul>
        </div>
      </div>
    </div>
  
  </div>


</div>
