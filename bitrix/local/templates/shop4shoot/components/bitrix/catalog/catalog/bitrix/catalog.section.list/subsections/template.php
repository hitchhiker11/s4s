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
?>

<?
  $terminations = array();
  
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SUBSECTIONS_CNT_1");
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SUBSECTIONS_CNT_2");
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SUBSECTIONS_CNT_3");
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SUBSECTIONS_CNT_4");
  
  global $KRAKEN_TEMPLATE_ARRAY;
  CKraken::includeCustomMessages();
?>

<? if (!empty($arResult["SECTIONS"])): ?>
  
  <div class="section-list k1-subsections">
    <div class="row clearfix">
      
      <? $k = 0; ?>
      
      <? foreach ($arResult["SECTIONS"] as $arSection): ?>
        
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
          
          <table class="item">
            <tr>
              <td class="left">
                
                <?
                  
                  $photo = 0;
                  
                  if ($arSection["UF_KRAKEN_MENU_PICT"])
                    $photo = $arSection["UF_KRAKEN_MENU_PICT"];
                  else if ($arSection["PICTURE"])
                    $photo = $arSection["PICTURE"]; ?>
                
                <? if ($photo): ?>
                  
                  <? $img = CFile::ResizeImageGet($photo, array('width' => 100, 'height' => 100), BX_RESIZE_IMAGE_PROPORTIONAL, false); ?>
                  
                  <img class="img-responsive lazyload" data-src="<?= $img["src"] ?>"
                       alt="<?= CKraken::prepareText($arSection["NAME"]) ?>">
                
                <? else: ?>
                  
                  <span></span>
                
                <? endif; ?>
              
              </td>
              
              <td class="right">
                <a class="name" href="<?= $arSection["SECTION_PAGE_URL"] ?>" title="<?= $arSection["NAME"] ?>">
                  <span class="bord-bot"><?= $arSection["~NAME"] ?></span>
                
                </a>
                
                <? if ($KRAKEN_TEMPLATE_ARRAY['CTLG_HIDE_COUNT_GOODS']['VALUE'][0] != "Y"): ?>
<!--                  <div class="count-sect-elem">-->
<!--                    --><?php //= $arSection["ELEMENT_CNT"] ?><!-- --><?php //= CKraken::getTermination($arSection["ELEMENT_CNT"], $terminations) ?>
<!--                  </div>-->
                
                <? endif; ?>
              </td>
            
            </tr>
          </table>
        
        </div>
        
        
        <? if (($k + 1) % 2 == 0): ?>
          <div class="clearfix visible-sm"></div>
        <? endif; ?>
        
        
        <? if (($k + 1) % 3 == 0): ?>
          <div class="clearfix hidden-sm"></div>
        <? endif; ?>
        
        <? $k++; ?>
      
      <? endforeach; ?>
    
    
    </div>
  </div>

<? endif; ?>