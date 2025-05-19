<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
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

<?php
  global $admin_active;
  global $show_setting;
  global $KRAKEN_TEMPLATE_ARRAY;
  CKraken::includeCustomMessages();
  
  $admin_active = $USER->isAdmin();
  $show_setting = $KRAKEN_TEMPLATE_ARRAY["MODE_FAST_EDIT"]['VALUE'][0];
  
  
  $terminations = array();
  
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_CNT_1");
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_CNT_2");
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_CNT_3");
  $terminations[] = GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_CNT_4");
?>


<div class="catalog-main-menu big-parent-colls">
  
  
  <?php if ($admin_active && $show_setting == "Y"): ?>
    <div
      class="change-colls-info"><?= GetMessage('KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_BLINK_INFO_SAVE') ?></div>
  <?php endif; ?>
  
  <div class="container">
    <div class="row">
      
      <div class="frame-wrap clearfix">
        
        <?php $k = 0; ?>
        
        <?php foreach ($arResult["SECTIONS"] as $arSection): ?>
          
          <?php $size = array("width" => 280, "height" => 280); ?>
          <?php $cols = 'col-lg-3 col-md-3 col-sm-6 col-xs-12 small'; ?>
          
          <?php if ($arSection["UF_KRAKEN_CTLG_SIZE_ENUM"]["XML_ID"] == 'middle'): ?>
            <?php $size = array("width" => 580, "height" => 280); ?>
            <?php $cols = 'col-lg-6 col-md-6 col-sm-6 col-xs-12 middle'; ?>
          <?php endif; ?>
          
          <?php $size2 = array("width" => 400, "height" => 280); ?>
          <?php $size3 = array("width" => 350, "height" => 350); ?>
          
          
          <div class="k1-section <?= $cols ?> parent-change-cools">
            
            <div
              class="frame-outer<?php if (strlen($arSection["UF_KRAKEN_CTLG_PRTXT"]) > 0 || !empty($arSection["SUB"])): ?> elem-hover<?php endif; ?>">
              
              <div class="frame-inner elem-hover-height-more">
                
                <a class="frame light elem-hover-height" href="<?= $arSection["SECTION_PAGE_URL"] ?>">
                  <?php if ($admin_active && $show_setting == 'Y'): ?>
                    <input type="hidden" class='colls_code' value="UF_KRAKEN_CTLG_SIZE"/>
                    <input type="hidden" class='colls_middle' value="<?= $arResult["SIZES"]["middle"] ?>"/>
                    <input type="hidden" class='colls_small' value="<?= $arResult["SIZES"]["small"] ?>"/>
                    <span class='change-colls' data-type='section' data-element-id='<?= $arSection["ID"] ?>'></span>
                  <?php endif; ?>
                  <!-- <a class="wrap-link" href="<?php // = $arSection["SECTION_PAGE_URL"] ?>"></a> -->
                  
                  <?php if ($arSection["PICTURE"] > 0): ?>
                    
                    <?php $img = CFile::ResizeImageGet($arSection["PICTURE"], array('width' => 900, 'height' => 900), BX_RESIZE_IMAGE_EXACT, false); ?>
                    
                    
                    <?php $img = CFile::ResizeImageGet($arSection["PICTURE"], $size, BX_RESIZE_IMAGE_EXACT, true); ?>
                    <img class="img hidden-xs hidden-sm lazyload" data-src="<?= $img["src"] ?>"/>
                    
                    
                    <?php $img = CFile::ResizeImageGet($arSection["PICTURE"], $size2, BX_RESIZE_IMAGE_EXACT, true); ?>
                    <img class="img visible-sm lazyload" data-src="<?= $img["src"] ?>"/>
                    
                    
                    <?php $img = CFile::ResizeImageGet($arSection["PICTURE"], $size3, BX_RESIZE_IMAGE_EXACT, true); ?>
                    <img class="img visible-xs lazyload" data-src="<?= $img["src"] ?>"/>
                  
                  <?php endif; ?>
                  
                  <div class="small-shadow"
                       style="background: url('/bitrix/templates/concept_kraken_s1/images/small-shadow.png') repeat-x left bottom;"
                  ></div>
                  <div class="frameshadow"></div>
                  
                  <div class="text">
                    
                    <div class="cont">
                      <div class="name bold"><?= $arSection["NAME"] ?></div>
                      
                      <?php if ($KRAKEN_TEMPLATE_ARRAY['CTLG_HIDE_COUNT_GOODS']['VALUE'][0] != "Y"): ?>
                        <!--                        <div-->
                        <!--                          class="comment">--><?php //= $arSection["ELEMENT_CNT"] ?><!-- --><?php //= CKraken::getTermination($arSection["ELEMENT_CNT"], $terminations) ?><!--</div>-->
                      
                      <?php endif; ?>
                    </div>
                    
                    <div class="button">
                      
                      <div class="button-def button-def--main-color main-color elips">
                        
                        <?php if (strlen($arSection["UF_KRAKEN_CTLG_BTN"]) > 0): ?>
                          <?= $arSection["~UF_KRAKEN_CTLG_BTN"] ?>
                        <?php else: ?>
                          <?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_BUTTON") ?>
                        <?php endif; ?>
                      
                      </div>
                      <!--                      <a class="button-def main-color -->
                      <?php //= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?><!--"-->
                      <!--                         href="--><?php //= $arSection["SECTION_PAGE_URL"] ?><!--">-->
                      <!--                        -->
                      <!--                        --><?php // if (strlen($arSection["UF_KRAKEN_CTLG_BTN"]) > 0): ?>
                      <!--                          --><?php //= $arSection["~UF_KRAKEN_CTLG_BTN"] ?>
                      <!--                        --><?php // else: ?>
                      <!--                          --><?php //= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_BUTTON") ?>
                      <!--                        --><?php // endif; ?>
                      <!--                      -->
                      <!--                      </a>-->
                    
                    </div>
                  
                  
                  </div>
                  
                  
                  <?php if ($admin_active && $show_setting == 'Y'): ?>
                    
                    <div class="tool-settings">
                      
                      <!--                      <a-->
                      <!--                        href="/bitrix/admin/iblock_section_edit.php?IBLOCK_ID=-->
                      <?php //= $arParams["IBLOCK_ID"] ?><!--&type=-->
                      <?php //= $arParams["IBLOCK_TYPE_ID"] ?><!--&ID=-->
                      <?php //= $arSection["ID"] ?><!--&lang=ru&find_section_section=0"-->
                      <!--                        class="tool-settings " data-toggle="tooltip" target="_blank" data-placement="right" title=""-->
                      <!--                        data-original-title="-->
                      <?php //= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LIST_SECTION_LIST_ADMIN_EDIT") ?><!-- &quot;-->
                      <?php //= htmlspecialcharsEx($arSection["NAME"]) ?><!--&quot; ">-->
                      <!--                        -->
                      <!--                      </a>-->
                    
                    
                    </div>
                  
                  <?php endif; ?>
                
                
                </a>
                
                
                <?php if (strlen($arSection["UF_KRAKEN_CTLG_PRTXT"]) > 0 || !empty($arSection["SUB"])): ?>
                  
                  <div class="frame-desc-wrap elem-hover-show">
                    
                    <?php if (!empty($arSection["SUB"])): ?>
                      
                      <ul class="catalog-link clearfix">
                        <?php foreach ($arSection["SUB"] as $arSub): ?>
                          <li>
                            <a href="<?= $arSub["SECTION_PAGE_URL"] ?>" title="<?= $arSub["NAME"] ?>"><span
                                class="bord-bot"><?= $arSub["~NAME"] ?></span></a>
                          </li>
                        <?php endforeach; ?>
                      </ul>
                    
                    <?php endif; ?>
                    
                    <?php if (strlen($arSection["UF_KRAKEN_CTLG_PRTXT"]) > 0): ?>
                      <?php ?>
                      <div class="frame-desc-wrap-inner">
                        <?= $arSection["~UF_KRAKEN_CTLG_PRTXT"] ?>
                      </div>
                      <?php ?>
                    <?php endif; ?>
                  
                  </div>
                
                <?php endif; ?>
              
              
              </div>
            
            </div>
          </div>
          
          
          <?php if (($k + 1) % 2 == 0): ?>
            <div class="clearfix visible-sm"></div>
          <?php endif; ?>
          
          
          <?php $k++; ?>
        
        <?php endforeach; ?>
      
      </div>
    
    </div>
  </div>

</div>