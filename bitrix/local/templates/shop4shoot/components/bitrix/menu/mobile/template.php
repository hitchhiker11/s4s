<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?php
  /** @var array $arParams */
  /** @var array $arResult */
  /** @global CMain $APPLICATION */
  
//  echo '<pre>', print_r($arResult, true), '</pre>';
  
?>
<a class="close-menu mobile hidden-lg hidden-md hidden-sm"></a>
<div
  class="open-menu-mobile hidden-lg hidden-md hidden-sm tone-dark">
  <div class="menu-mobile-inner">
    <div class="head-wrap">
      <table class="logotype">
        <tr>
          <td>
            <img class="logotype" src="/local/templates/shop4shoot/img/logo.svg" alt="">
          </td>
        </tr>
      </table>
    </div>
    
    
    <div class="menu-content">
      
      <form action="/search/catalog/" class="search-form">
        
        <div class="search-panel-mob row">
          <div class="col-xs-8 h-100">
            <div class="search-input-box">
              
              <input
                id="search-main-mob"
                name="q"
                class="search-style search-js"
                type="text"
                value=""
                autocomplete="off"
                placeholder="">
              <div class="search-icon search-icon-js" title=""></div>
            </div>
          </div>
          <div class="col-xs-4 h-100">
            <button class="button-def search-btn-style mob main-color elips visible-xs" type="submit">
              <span>Найти</span>
            </button>
          </div>
        </div>
        
        <div class="clearfix"></div>
      </form>
      
      <ul class="mobile-menu-list main-list show-open" data-menu-list="main">
        
        <?php foreach ($arResult as $arItem): ?>
          <li
            class="<?php if ($arItem["SELECTED"]): ?>selected <?php endif; ?>">
            <a
              href="<?= $arItem['LINK'] ?>"
              target='_blank'>
              <?= $arItem['TEXT'] ?>
            </a>
            <div class="border-mob-menu"></div>
          </li>
        <?php endforeach; ?>
      </ul><!-- ^mobile-menu-list -->
      
      <ul class="k1-header-top-menu">
        <li>
          <a href="/delivery/">
            <img src="<?= SITE_TEMPLATE_PATH ?>/img/icons/delivery.png " alt="">
            <span>доставка</span>
          </a>
        </li>
        <li>
          <a href="/offer/">
            <img src="<?= SITE_TEMPLATE_PATH ?>/img/icons/offer.png " alt="">
            <span>Договор-оферта</span>
          </a>
        </li>
        <li>
          <a href="/contacts/">
            <img src="<?= SITE_TEMPLATE_PATH ?>/img/icons/phone.png " alt="">
            <span>Контакты</span>
          </a>
        </li>
      </ul>
    
    
    </div><!-- ^menu-content -->
  
  </div><!-- ^menu-mobile-inner -->
  
  
  <div class="foot-wrap">
    
    
    <?php if (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['VALUE']) || !empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE'])): ?>
      
      <div class="contacts">
        <div class="phone-wrap">
          <?php $is = ''; ?>
          
          <?php if (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['VALUE'])): ?>
            
            <div class="phone"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['~VALUE'][0]['name'] ?></div>
            <?php $is = 'phone'; ?>
            <div class="desc"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['~VALUE'][0]['desc'] ?></div>
          <?php else: ?>
            <a href="mailto:<?= $KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE'][0]['name'] ?>"><span
                class="bord-bot"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE'][0]['name'] ?></span></a>
            <div class="desc"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['~VALUE'][0]['desc'] ?></div>
            <?php $is = 'email'; ?>
          <?php endif; ?>
          
          <?php if (count($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['VALUE']) > 1 || count($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE']) > 1 || (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['VALUE']) && !empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE']))): ?>
            <div class="ic-open-list-contact open-list-contact"><span></span></div>
          <?php endif; ?>
        </div>
        
        <?php if (count($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['VALUE']) > 1 || count($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE']) > 1 || (!empty($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['VALUE']) && !empty($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE']))): ?>
          
          <div class="list-contacts">
            
            <?php foreach ($KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['~VALUE'] as $keyPhone => $arPnone): ?>
              
              <?php if ($is == 'phone' && $keyPhone == 0) continue; ?>
              <div class="contact-wrap">
                <div class="phone"><?= $arPnone['name'] ?></div>
                <div class="desc"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_CONTACTS"]['~VALUE'][$keyPhone]['desc'] ?></div>
              </div>
            <?php endforeach; ?>
            
            <?php foreach ($KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE'] as $keyEmail => $arEmail): ?>
              <?php if ($is == 'email' && $keyEmail == 0) continue; ?>
              
              <div class="contact-wrap">
                
                <div class="email"><a href="mailto:<?= $arEmail['name'] ?>"><span
                      class="bord-bot"><?= $arEmail['name'] ?></span></a></div>
                <div class="desc"><?= $KRAKEN_TEMPLATE_ARRAY["HEAD_EMAILS"]['VALUE'][$keyEmail]['desc'] ?></div>
              </div>
            
            
            <?php endforeach; ?>
          
          </div>
        
        
        <?php endif; ?>
      
      
      </div>
    <?php endif; ?>
    
    <?php if ($KRAKEN_TEMPLATE_ARRAY["SHOW_CALLBACK"]['VALUE'][0] == "Y" && $KRAKEN_TEMPLATE_ARRAY["FORMS"]['VALUE_CALLBACK'] != "N"): ?>
      <a class="button-def shine main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> call-modal callform"
         data-header="<?= GetMessage('KRAKEN_FORM_NAME_MOB') ?>"
         data-call-modal="form<?= $KRAKEN_TEMPLATE_ARRAY["FORMS"]["VALUE_CALLBACK"] ?>"><?= $KRAKEN_TEMPLATE_ARRAY["CALLBACK_NAME"]["VALUE"] ?></a>
    
    <?php endif; ?>
    
    <?php if ($KRAKEN_TEMPLATE_ARRAY["GROUP_POS"]["VALUE"][2] == 'Y'): ?>
      <?= CKraken::CreateSoc($KRAKEN_TEMPLATE_ARRAY) ?>
    <?php endif; ?>
  
  
  </div><!-- ^foot-wrap -->


</div><!-- ^menu-mobile -->