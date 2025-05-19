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
  
  $terminations = array();
  
  $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_1"];
  $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_2"];
  $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_3"];
  $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_4"];
?>
<? $bIsMainPage = $APPLICATION->GetCurPage(false) == SITE_DIR; ?>

<div class="menu-shadow tone-<?= $KRAKEN_TEMPLATE_ARRAY["HEAD_TONE"]["VALUE"] ?> hidden-xs"></div>

<div class="open-menu tone-<?= $KRAKEN_TEMPLATE_ARRAY["HEAD_TONE"]["VALUE"] ?> hidden-xs">
  <div class="head-menu-wrap">
    <div class="container">
      <div class="row">
        <div class="head-menu">
          <a class="close-menu main"></a>
          
          <table>
            <tr>
              <td class="col-md-4 col-sm-5 col-xs-1 left">
                
                <? if ($KRAKEN_TEMPLATE_ARRAY["LOGOTYPE_POSITION"]["VALUE"] == "center"): ?>
                  
                  <? if (strlen($KRAKEN_TEMPLATE_ARRAY["HEAD_DESCRIPTOR"]["VALUE"]) > 0): ?>
                    <div
                      class="main-desciption <?= $KRAKEN_TEMPLATE_ARRAY["HEAD_DESCRIPTOR_BACKDROP"]["VALUE"][0] ?>"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_DESCRIPTOR"]["~VALUE"] ?></div>
                  <? endif; ?>
                
                <? else: ?>
                  
                  <? if (!$bIsMainPage): ?><a href="<?= SITE_DIR ?>"><? endif; ?>
                  
                  
                  <?= $KRAKEN_TEMPLATE_ARRAY["LOGOTYPE_HTML"] ?>
                  
                  
                  <? if (!$bIsMainPage): ?></a><? endif; ?>
                
                <? endif; ?>
              </td>
              <td class="col-md-4 col-sm-5 col-xs-1 center">
                
                <? if ($KRAKEN_TEMPLATE_ARRAY["LOGOTYPE_POSITION"]["VALUE"] == "center"): ?>
                  <?= $KRAKEN_TEMPLATE_ARRAY["LOGOTYPE_HTML"] ?>
                <? else: ?>
                  
                  <? if (strlen($KRAKEN_TEMPLATE_ARRAY["HEAD_DESCRIPTOR"]["VALUE"]) > 0): ?>
                    <div
                      class="main-desciption <?= $KRAKEN_TEMPLATE_ARRAY["HEAD_DESCRIPTOR_BACKDROP"]["VALUE"][0] ?>"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_DESCRIPTOR"]["~VALUE"] ?></div>
                  <? endif; ?>
                
                <? endif; ?>
              </td>
              <td class="col-md-4 col-sm-2 col-xs-1"></td>
            </tr>
          </table>
        
        </div>
      
      </div>
    </div>
  </div>
  
  <div class="body-menu">
    
    <? if (!empty($arResult["MENU_CATALOG"])): ?>
      
      <div class="catalog-navigation">
        
        <div class="container">
          <div class="row">
            
            <div class="col-xs-12">
              
              <div class="name-catalog"><a
                  href="<?= $arResult["MENU_CATALOG"]["LINK"] ?>"><?= $arResult["MENU_CATALOG"]["NAME"] ?></a></div>
            
            </div>
            
            <div class="clearfix"></div>
            
            <? $i = 1; ?>
            
            <? foreach ($arResult["MENU_CATALOG"]["SUB"] as $arItem): ?>
              
              <div class="col-lg-3 col-sm-4 col-xs-12">
                
                <table class="item <? if ($arItem["SELECTED"]): ?>selected<? endif; ?>">
                  <tr>
                    <td class="picture">
                      
                      <a href="<?= $arItem["LINK"] ?>">
                        
                        <div class="picture-board">
                          
                          <? if (isset($arItem["PICTURE_SRC"])): ?>
                            
                            <img class="lazyload" data-src="<?= $arItem["PICTURE_SRC"] ?>">
                          
                          <? else: ?>
                            
                            <div class="def-img"></div>
                          
                          <? endif; ?>
                        
                        </div>
                      </a>
                    
                    </td>
                    <td class="decription">
                      <div class="name"><a href="<?= $arItem["LINK"] ?>"><?= $arItem["NAME"] ?></a></div>
                      
                      <? if ($KRAKEN_TEMPLATE_ARRAY['CTLG_HIDE_COUNT_GOODS']['VALUE'][0] != "Y"): ?>
                        <div
                          class="count"><?= $arItem["ELEMENT_CNT"] ?> <?= CKraken::getTermination($arItem["ELEMENT_CNT"], $terminations) ?></div>
                      <? endif; ?>
                    </td>
                  </tr>
                </table>
              
              </div>
              
              <?
              
              if (($count + 1) % 4 == 0)
                echo "<div class='clearfix visible-lg'></div>";
              
              if (($count + 1) % 3 == 0)
                echo "<div class='clearfix visible-md visible-sm'></div>";
              
              $count++;
              ?>
            
            <? endforeach; ?>
            
            <div class="clearfix"></div>
          </div>
        </div>
      
      </div>
    
    <? endif; ?>
    
    <div class="main-menu-navigation">
      
      <div class="container">
        <div class="row">
          
          <? $k1 = 0; ?>
          
          <? for ($i = 1; $i <= 4; $i++): ?>
            
            <? if (!empty($arResult["MENU_COL_" . $i])): ?>
              
              <? $k1++; ?>
              
              <div class="col-md-3 col-sm-6 col-xs-12">
                
                <? foreach ($arResult["MENU_COL_" . $i] as $arItem): ?>
                  
                  <? $colorText = ''; ?>
                  <? $icon = ''; ?>
                  
                  <? if (strlen($arItem['MENU_COLOR']) > 0): ?>
                    <? $colorText = ' style="color: ' . $arItem['MENU_COLOR'] . '";'; ?>
                  <? endif; ?>
                  
                  <? if ($arItem['MENU_IC_US'] > 0): ?>
                    
                    <? $iconResize = CFile::ResizeImageGet($arItem['MENU_IC_US'], array('width' => 21, 'height' => 21), BX_RESIZE_IMAGE_PROPORTIONAL, true); ?>
                    
                    <? $icon = '<img class="img-responsive img-icon lazyload" data-src="' . $iconResize['src'] . '" alt="' . CKraken::prepareText($arItem['NAME']) . '" />'; ?>
                  
                  <? elseif (strlen($arItem['MENU_ICON']) > 0): ?>
                    <? $icon = '<i class="concept-icon ' . $arItem['MENU_ICON'] . '"></i>'; ?>
                  <? endif; ?>
                  
                  <div class="list-menu">
                    
                    <a <? if ($arItem['NOLINK']): ?>
                      
                      <?= CKraken::krakenMenuAttr($arItem, $arItem['TYPE']) ?>
                    
                    <? else: ?>
                      
                      <? if (strlen($arItem["LINK"]) > 0 && !$arItem["NONE"]): ?>href='<?= $arItem['LINK'] ?>'<? endif; ?>
                      
                      
                      <? if ($arItem['BLANK']): ?>
                        
                        target='_blank'
                      
                      <? endif; ?>
                    
                    <? endif; ?>
                      
                      class="main-item <? if (strlen($arItem["LINK"]) <= 0 && $arItem["NONE"]): ?>empty-link<? else: ?>hover close-menu-js open<? endif; ?>
        
                                        <? if ($arItem["SELECTED"]): ?>selected<? endif; ?>

                                        <? if (strlen($arItem["ID"])): ?>

                                            section-menu-id-<?= $arItem["ID"] ?>

                                        <? endif; ?>
        
                                        <? if ($arItem['NOLINK']): ?>
        
                                            <?= CKraken::krakenMenuClass($arItem, $arItem['TYPE'], '') ?>
        
                                        <? endif; ?>
        
                                         " <?= $colorText ?>><?= $icon ?><?= $arItem['NAME'] ?></a>
                    
                    <? if (!empty($arItem["SUB"])): ?>
                      <ul class="child">
                        
                        <? foreach ($arItem['SUB'] as $arElements): ?>
                          
                          <li
                            class="<? if (!empty($arElements["SUB"])): ?>parent<? endif; ?> <? if ($arElements["SELECTED"]): ?>selected<? endif; ?>

                                                    <? if (strlen($arElements["ID"])): ?>

                                                        section-menu-id-<?= $arElements["ID"] ?>

                                                    <? endif; ?>

                                                    ">
                            
                            <a
                              
                              <? if ($arElements['NOLINK']): ?>
                                
                                <?= CKraken::krakenMenuAttr($arElements, $arElements['TYPE']) ?>
                              
                              <? else: ?>
                                
                                <? if (strlen($arElements["LINK"]) > 0 && !$arElements["NONE"]): ?> href='<?= $arElements['LINK'] ?>'<? endif; ?>
                                
                                
                                <? if ($arElements['BLANK']): ?>
                                  
                                  target='_blank'
                                
                                <? endif; ?>
                              
                              <? endif; ?>
                              
                              
                              class="<? if (strlen($arElements["LINK"]) <= 0 && $arElements["NONE"]): ?>empty-link<? else: ?>hover close-menu-js<? endif; ?>
        
                                                        
        
                                                        <? if ($arElements['NOLINK']): ?>
        
                                                            <?= CKraken::krakenMenuClass($arElements, $arElements['TYPE'], '') ?>
        
                                                        <? endif; ?>
        
                                                        "><?= $arElements['NAME'] ?></a>
                            
                            <? if (!empty($arElements["SUB"])): ?>
                              
                              <ul class="child2">
                                <? foreach ($arElements["SUB"] as $key_arElements2 => $arElements2): ?>
                                  <li class="

                                                                        <? if ($arElements2["SELECTED"]): ?>selected<? endif; ?>

                                                                        <? if (strlen($arElements2["ID"])): ?>

                                                                            section-menu-id-<?= $arElements2["ID"] ?>

                                                                        <? endif; ?>

                                                                    ">
                                    
                                    
                                    <a
                                      
                                      <? if ($arElements2['NOLINK']): ?>
                                        
                                        <?= CKraken::krakenMenuAttr($arElements2, $arElements2['TYPE']) ?>
                                      
                                      <? else: ?>
                                        
                                        <? if (strlen($arElements2["LINK"]) > 0 && !$arElements2["NONE"]): ?> href='<?= $arElements2['LINK'] ?>'<? endif; ?>
                                        
                                        <? if ($arElements2['BLANK']): ?>
                                          
                                          target='_blank'
                                        
                                        <? endif; ?>
                                      
                                      <? endif; ?>
                                      
                                      
                                      class="<? if (strlen($arElements2["LINK"]) <= 0 && $arElements2["NONE"]): ?>empty-link<? else: ?>hover close-menu-js<? endif; ?>
        
                                                                    
        
                                                                    <? if ($arElements2['NOLINK']): ?>
        
                                                                        <?= CKraken::krakenMenuClass($arElements2, $arElements2['TYPE'], '') ?>

        
                                                                    <? endif; ?>
        
                                                                     "><?= $arElements2['NAME'] ?></a>
                                  </li>
                                <? endforeach; ?>
                              </ul>
                            
                            <? endif; ?>
                          
                          </li>
                        
                        <? endforeach; ?>
                      
                      </ul>
                    <? endif; ?>
                  </div>
                <? endforeach; ?>
              
              </div>
            
            
            <? endif; ?>
            
            
            <? if ($k1 == 2): ?>
              <div class="clearfix visible-sm"></div>
            <? endif; ?>
          
          
          <? endfor; ?>
          
          
          <div class="clearfix"></div>
          
          <? if ($KRAKEN_TEMPLATE_ARRAY['SEARCH']['ACTIVE']['VALUE']['ACTIVE'] == "Y" && $KRAKEN_TEMPLATE_ARRAY['SEARCH']['SEARCH_SHOW_IN']['VALUE']['IN_MENU_OPEN'] == "Y"): ?>
            
            <? $APPLICATION->IncludeComponent("concept:kraken.search.line", "", array()); ?>
          
          <? endif; ?>
        
        </div>
            <ul class="k1-header-top-menu" style="margin-top: 40px;">
              <li>
                <a href="/delivery/">
                  <img src="<?= SITE_TEMPLATE_PATH ?>/images/icons/delivery.png " alt="">
                  <span>доставка</span>
                </a>
              </li>
              <li>
                <a href="/offer/">
                  <img src="<?= SITE_TEMPLATE_PATH ?>/images/icons/offer.png " alt="">
                  <span>Договор-оферта</span>
                </a>
              </li>
              <li>
                <a href="/contacts/">
                  <img src="<?= SITE_TEMPLATE_PATH ?>/images/icons/phone.png " alt="">
                  <span>Контакты</span>
                </a>
              </li>
            </ul>
      </div>
    </div>
    
 
  </div>
  
  <div class="footer-menu-wrap">
    <div class="container">
      <div class="row">
        
        
        <? $collsCenter = 'col-md-6 col-sm-8 col-xs-12'; ?>
        
        <? if (($KRAKEN_TEMPLATE_ARRAY["SHOW_CALLBACK"]["VALUE"][0] != "Y") && empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]["VALUE"]) && empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]["VALUE"]) && $KRAKEN_TEMPLATE_ARRAY["GROUP_POS"]["VALUE"][1] != 'Y'): ?>
          
          <? $collsCenter = 'col-xs-12'; ?>
        
        <? elseif ($KRAKEN_TEMPLATE_ARRAY["SHOW_CALLBACK"]["VALUE"][0] != "Y" && empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]["VALUE"])): ?>
          
          <? $collsCenter = 'col-md-9 col-xs-12'; ?>
        
        <? elseif (empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]["VALUE"]) && $KRAKEN_TEMPLATE_ARRAY["GROUP_POS"]["VALUE"][1] != 'Y'): ?>
          
          <? $collsCenter = 'col-md-9 col-sm-8 col-xs-12'; ?>
        
        <? endif; ?>
        
        
        
        <? if (($KRAKEN_TEMPLATE_ARRAY["SHOW_CALLBACK"]["VALUE"][0] == "Y" && $KRAKEN_TEMPLATE_ARRAY["FORMS"]["VALUE_CALLBACK"] != "N") || !empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]["VALUE"])): ?>
          <div class="col-md-3 col-sm-4 col-xs-12 unset-margin-top-child left">
            
            <? if (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]["VALUE"])): ?>
              <div class="phone">
                <? foreach ($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]["~VALUE"] as $keyPhone => $arPnone): ?>
                  
                  
                  <div>
                    <div class="phone-value"><?= $arPnone['name'] ?></div>
                  </div>
                  
                  <? if ($keyPhone >= 1) break; ?>
                
                <? endforeach; ?>
              </div>
            <? endif; ?>
            
            <? if ($KRAKEN_TEMPLATE_ARRAY["SHOW_CALLBACK"]["VALUE"][0] == "Y" && $KRAKEN_TEMPLATE_ARRAY["FORMS"]["VALUE_CALLBACK"] != "N"): ?>
              
              <div class="button-wrap">
                <a
                  class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]["VALUE"] ?> call-modal callform from-modal from-openmenu"
                  data-from-open-modal='open-menu' data-header="<?= GetMessage('KRAKEN_FORM_NAME_MENU') ?>"
                  data-call-modal="form<?= $KRAKEN_TEMPLATE_ARRAY["FORMS"]["VALUE_CALLBACK"] ?>"><?= $KRAKEN_TEMPLATE_ARRAY["CALLBACK_NAME"]["VALUE"] ?></a>
              </div>
            <? endif; ?>
          </div>
        
        <? endif; ?>
        
        <div class="<?= $collsCenter ?> center">
          <div class="copyright-text unset-margin-top-child">
            
            <? if (strlen($KRAKEN_TEMPLATE_ARRAY["FOOTER_DESC"]["VALUE"]) > 0): ?>
              <div class="top-text"><?= $KRAKEN_TEMPLATE_ARRAY["FOOTER_DESC"]["~VALUE"] ?></div>
            <? endif; ?>
            
            <? /*if(strlen($KRAKEN_TEMPLATE_ARRAY["FOOTER_INFO"]["VALUE"])>0):?>
                            <div class="top-text reqs"><?=$KRAKEN_TEMPLATE_ARRAY["FOOTER_INFO"]["~VALUE"]?></div>
                        <?endif;*/ ?>
            
            
            <? if (strlen($KRAKEN_TEMPLATE_ARRAY["FOOTER_COPY"]["VALUE"]) > 0): ?>
              <div class="bottom-text"><?= $KRAKEN_TEMPLATE_ARRAY["FOOTER_COPY"]["~VALUE"] ?></div>
            <? endif; ?>
            
            <? if (!empty($KRAKEN_TEMPLATE_ARRAY['AGREEMENT_FOOTER'])): ?>
              <div class="political">
                
                
                <? foreach ($KRAKEN_TEMPLATE_ARRAY['AGREEMENT_FOOTER'] as $k => $arAgr): ?>
                  
                  <a class="call-modal callagreement from-modal from-openmenu"
                     data-call-modal="agreement<?= $arAgr['ID'] ?>"><span class="bord-bot"><?= $arAgr['NAME'] ?></span></a>
                
                
                <? endforeach; ?>
              
              </div>
            <? endif; ?>
          
          
          </div>
        </div>
        
        
        <? if (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]["VALUE"]) || $KRAKEN_TEMPLATE_ARRAY["GROUP_POS"]["VALUE"][1] == 'Y'): ?>
          
          <div class="col-md-3 col-xs-12 unset-margin-top-child right">
            
            
            <? if ($KRAKEN_TEMPLATE_ARRAY["GROUP_POS"]["VALUE"][1] == 'Y'): ?>
              <?= CKraken::CreateSoc($KRAKEN_TEMPLATE_ARRAY) ?>
            <? endif; ?>
            
            
            <? if (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]["VALUE"])): ?>
              <div class="email"><a href="mailto:<?= $KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]["VALUE"][0]['name'] ?>"><span
                    class="bord-bot white"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]["VALUE"][0]['name'] ?></span></a>
              </div>
            <? endif; ?>
          </div>
        
        <? endif; ?>
      </div>
    </div>
  
  </div>
</div><!-- /open-menu -->