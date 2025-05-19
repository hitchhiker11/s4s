<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Контакты");
?>
  <div class="header-page catalog-first-block sections cover parent-scroll-down <?=$KRAKEN_TEMPLATE_ARRAY["HEAD_TONE"]["VALUE"]?> kraken-firsttype-<?=$KRAKEN_TEMPLATE_ARRAY["MENU_TYPE"]["VALUE"]?> <?=($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES_MODE"]["VALUE"] == "custom" && strlen($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES"]["SRC"])<=0) ? "def-bg-xs" : "";?>">
<!--      style="background-image: url('/upload/resize_cache/kraken/7d8/2560_1500_1/e9aul9z5prariv2myl5uh2sfud15zmzo.png');"-->

<!--    <div class="shadow"></div>-->
<!--    <div class="top-shadow"></div>-->
    
    <div class="container">
      <div class="row">
        
        <div class="catalog-first-block-table clearfix">
          
          <div class="catalog-first-block-cell text-part col-lg-9 col-md-9 col-sm-9 col-xs-12">
            
            
            
            <div class="head">
              
<!--              --><?//$APPLICATION->IncludeComponent("bitrix:breadcrumb", "breadcrumbs", Array(
//                "COMPONENT_TEMPLATE" => ".default",
//                "START_FROM" => "0",
//                "PATH" => "",
//                "SITE_ID" => SITE_ID,
//                "COMPOSITE_FRAME_MODE" => "A",
//                "COMPOSITE_FRAME_TYPE" => "AUTO",
//              ),
//                $component
//              );?>
              
              
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
<?//$APPLICATION->IncludeComponent(
//  "concept:kraken.search",
//  ".default",
//  array(
//    "COMPONENT_TEMPLATE" => ".default",
//    "SEF_MODE" => "Y",
//    "SEF_FOLDER" => "/#search/",
//    "SET_STATUS_404" => "Y",
//    "SHOW_404" => "Y",
//    "MESSAGE_404" => "",
//    "FILE_404" => "",
//    "SEF_URL_TEMPLATES" => array(
//      "main" => "",
//      "page" => "#SECTION#/",
//    )
//  ),
//  false
//);?>
<!--  <div class="contacts">-->
<!--    <h1>test</h1>-->
<!--  </div>-->
  <?php /* ?>
<p>Обратитесь к нашим специалистам и получите профессиональную консультацию по вопросам создания и покупки мебели (от дизайна, разработки технического задания до доставки мебели к Вам домой).</p>

<p>Вы можете обратиться к нам по телефону, по электронной почте или договориться о встрече в нашем офисе. Будем рады помочь вам и ответить на все ваши вопросы. </p>

<h2>Телефоны</h2>

<ul> 
	<li>Телефон/факс:
		<ul> 
			<li><b>(495) 212-85-06</b></li>
		</ul>
	</li>
 
	<li>Телефоны:
		<ul> 
			<li><b>(495) 212-85-07</b></li>
			<li><b>(495) 212-85-08</b></li>
		</ul>
	</li>
</ul>

<h2>Email</h2>

<ul> 
  <li><a href="mailto:info@example.ru">info@example.ru</a> &mdash; общие вопросы</li>
  <li><a href="mailto:sales@example.ru">sales@example.ru</a> &mdash; приобретение продукции</li>
  <li><a href="mailto:marketing@example.ru">marketing@example.ru</a> &mdash; маркетинг/мероприятия/PR</li>
</ul>

<h2>Офис в Москве</h2>
<p><?$APPLICATION->IncludeComponent("bitrix:map.google.view", ".default", array(
	"KEY" => "ABQIAAAAOSNukcWVjXaGbDo6npRDcxS1yLxjXbTnpHav15fICwCqFS-qhhSby0EyD6rK_qL4vuBSKpeCz5cOjw",
	"INIT_MAP_TYPE" => "NORMAL",
	"MAP_DATA" => "a:3:{s:10:\"google_lat\";s:7:\"55.7383\";s:10:\"google_lon\";s:7:\"37.5946\";s:12:\"google_scale\";i:13;}",
	"MAP_WIDTH" => "600",
	"MAP_HEIGHT" => "500",
	"CONTROLS" => array(
		0 => "LARGE_MAP_CONTROL",
		1 => "MINIMAP",
		2 => "HTYPECONTROL",
		3 => "SCALELINE",
	),
	"OPTIONS" => array(
		0 => "ENABLE_SCROLL_ZOOM",
		1 => "ENABLE_DBLCLICK_ZOOM",
		2 => "ENABLE_DRAGGING",
	),
	"MAP_ID" => ""
	),
	false
);?></p>
<?php */ ?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>