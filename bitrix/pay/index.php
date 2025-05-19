<?
  require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
  $APPLICATION->SetTitle("Контакты");
?>
  <div class="header-page catalog-first-block sections cover parent-scroll-down <?=$KRAKEN_TEMPLATE_ARRAY["HEAD_TONE"]["VALUE"]?> kraken-firsttype-<?=$KRAKEN_TEMPLATE_ARRAY["MENU_TYPE"]["VALUE"]?> <?=($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES_MODE"]["VALUE"] == "custom" && strlen($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES"]["SRC"])<=0) ? "def-bg-xs" : "";?>"
       style="background-image: url('/upload/resize_cache/kraken/7d8/2560_1500_1/e9aul9z5prariv2myl5uh2sfud15zmzo.png');"
  >
    
    <div class="shadow"></div>
    <div class="top-shadow"></div>
    
    <div class="container">
      <div class="row">
        
        <div class="catalog-first-block-table clearfix">
          
          <div class="catalog-first-block-cell text-part col-lg-9 col-md-9 col-sm-9 col-xs-12">
            
            
            
            <div class="head">
              
              <?$APPLICATION->IncludeComponent("bitrix:breadcrumb", "breadcrumbs", Array(
                "COMPONENT_TEMPLATE" => ".default",
                "START_FROM" => "0",
                "PATH" => "",
                "SITE_ID" => SITE_ID,
                "COMPOSITE_FRAME_MODE" => "A",
                "COMPOSITE_FRAME_TYPE" => "AUTO",
              ),
                $component
              );?>
              
              
              <div class="title main1"><h1><?$APPLICATION->ShowTitle(false);?></h1></div>
              
              <?if(strlen($KRAKEN_TEMPLATE_ARRAY["CTLG_DESC"]["VALUE"]) > 0):?>
                <div class="subtitle">
                  <!--                              --><?php //=$KRAKEN_TEMPLATE_ARRAY["CTLG_DESC"]["~VALUE"]?>
                </div>
              <?endif;?>
            
            </div>
          
          </div>
          
          <div class="catalog-first-block-cell col-lg-3 col-md-3 col-sm-3 col-xs-12 hidden-xs">
            
            <div class="wrap-scroll-down hidden-xs">
              <div class="down-scrollBig">
                <i class="fa fa-chevron-down"></i>
              </div>
            </div>
          
          </div>
        
        </div>
      
      
      
      </div>
    </div>
  
  </div>


<?php $APPLICATION->IncludeComponent(
  "concept:kraken.pages",
  ".default",
  array(
    "BROWSER_TITLE" => "-",
    "CACHE_GROUPS" => "N",
    "CACHE_TIME" => "86400",
    "CACHE_TYPE" => "N",
    "CHECK_DATES" => "Y",
    "COMPONENT_TEMPLATE" => ".default",
    "COMPOSITE_FRAME_MODE" => "A",
    "COMPOSITE_FRAME_TYPE" => "AUTO",
    "DETAIL_SET_CANONICAL_URL" => "N",
    "DISPLAY_NAME" => "Y",
    "FILE_404" => "",
    "IBLOCK_ID" => "14",
    "IBLOCK_TYPE" => "concept_kraken_s1",
    "MESSAGE_404" => "",
    "META_DESCRIPTION" => "-",
    "META_KEYWORDS" => "-",
    "SEF_FOLDER" => "/",
    "SEF_MODE" => "Y",
    "SET_STATUS_404" => "Y",
    "SET_TITLE" => "Y",
    "SHOW_404" => "Y",
    "USE_PERMISSIONS" => "N",
    "SEF_URL_TEMPLATES" => array(
      "main" => "",
      "page" => "#SECTION_CODE#/",
    )
  ),
  false
);?>

<!--  -->
<!--  <script type="text/javascript" src="https://auth.robokassa.ru/Merchant/bundle/robokassa_iframe.js"></script>-->
<!--  <input type="submit" value="Оплатить" onclick="Robokassa.StartPayment({-->
<!--             MerchantLogin: 'shop4shoot.ru',-->
<!--             OutSum: '11.00',-->
<!--             Description: 'Оплата заказа в Тестовом магазине ROBOKASSA',-->
<!--             Culture: 'ru',-->
<!--             Encoding: 'utf-8',-->
<!--             SignatureValue: '3925b771e47d405cbcbb492daa936824'})">-->
<?php /*
          $mrh_login = "shop4shoot.ru";
          $mrh_pass1 = "gwizRYk95lxr332FaOKI";
          $inv_desc = "Товары для животных";
          $out_summ = "100.00";
          $IsTest = 1;
          $crc = md5("$mrh_login:$out_summ:$inv_id:$mrh_pass1");
          print "<html><script language=JavaScript ".
            "src='https://auth.robokassa.ru/Merchant/PaymentForm/FormMS.js?".
            "MerchantLogin=$mrh_login&OutSum=$out_summ&InvoiceID=$inv_id".
            
            "&Description=$inv_desc&SignatureValue=$crc&IsTest=$IsTest'></script></html>";
  */
  
//  $merchant_login = "shop4shoot.ru";
//  $password_1 = "h7R2iTWk8W8e7DSbnejU";
//  $description = "Оплата";
//  $out_sum = 11111;
//  $signature_value = md5("$merchant_login:$out_sum:$password_1");
//  print "<html><script language=JavaScript ".
//    "src='https://auth.robokassa.ru/Merchant/PaymentForm/FormMS.js?".
//    "MerchantLogin=$merchant_login&OutSum=$out_sum".
//    "&Description=$description&SignatureValue=$signature_value'></script></html>";
?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>