<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?php
  /**
   * @global CMain $APPLICATION
   * */
  ///bitrix/modules/concept.kraken/iblock_forms_edit/catalog.php для каталога
  //  / /bitrix/modules/concept.kraken/iblock_forms_edit/catalog_offers.php для предложений
  //  /bitrix/modules/concept.kraken/iblock_forms_edit/catalog_offers_before_save.php для предложений модификация
  // сохранения
  use \Bitrix\Main\Localization\Loc as Loc;
  use \Bitrix\Main\Page\Asset as Asset;
  use Bitrix\Sale;
  
  if ($APPLICATION->GetCurPage() === "/" && !$_GET["brand"] && !$_GET["new"]) LocalRedirect("/tyuning_oruzhiya/");
  
  //  $asset = \Bitrix\Main\Page\Asset::getInstance();
  
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/bootstrap.min.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/font-awesome.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/animate.min.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/xloader.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/blueimp-gallery.min.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/slick/slick.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/slick/slick-theme.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/jquery.datetimepicker.min.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/farbtastic.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/concept.css";
  //
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/jquery.countdown.css";
  //  $cssList[] = SITE_TEMPLATE_PATH."/css/responsive.css";
  Bitrix\Main\Loader::includeModule("sale");
  Loc::loadMessages(__FILE__);
  CJSCore::RegisterExt(
    "BrandsFilter",
    [
      "js" => "/local/js/k1/BrandsFilter.js"
    ]
  );
?>

<!DOCTYPE HTML>
<html lang="<?= LANGUAGE_ID ?>" prefix="og: //ogp.me/ns#">
<head>
  
  <meta name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0"/>
  <title><?php $APPLICATION->ShowTitle(false) ?></title>
  <?php /* ?>
<!--  <script src="https://www.google.com/recaptcha/api
.js?render=6LcdiTIpAAAAACNK-831fEFD9N-hU1Kx2y6N3KI2-1"></script>-->
 <?php */ ?>
  <?php $APPLICATION->ShowHead(); ?>
  
  <?php
    Asset::getInstance()->addCss('/bitrix/templates/concept_kraken_s1/css/k1-modal.css');
    
    Asset::getInstance()->addJs('/bitrix/templates/concept_kraken_s1/js/Modal.js');
    Asset::getInstance()->addJs('https://cdn.jsdelivr.net/gh/koles1ko/mask@1.0.3/dist/PhoneMask.js');
    Asset::getInstance()->addJs('/bitrix/templates/concept_kraken_s1/js/k1.script.js');
    
//    if ($_SERVER["REMOTE_ADDR"] === "95.174.99.161" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "95.174.99.161") {
      Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/vendor/swiper/swiper-bundle.min.css");
      Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/vendor/swiper/navigation.min.css");
      Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/vendor/swiper/pagination.min.css");
      
      Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/fonts/t.css");
      Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/css/redesign.css");
      
      Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/js/vendor/swiper/swiper.min.js");
//    }
  
  ?>
  
  <!-- Yandex.Metrika counter -->
  <script type="text/javascript" >
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
    ym(99466974, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      ecommerce:"dataLayer"
    });
  </script>
  <noscript><div><img src="https://mc.yandex.ru/watch/99466974" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  <!-- /Yandex.Metrika counter -->
  
  <?php require_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/styles_and_scripts.php"); ?>
</head>


<body
  class=""
  id="body" data-spy="scroll" data-target="#navigation">
<?php
  $APPLICATION->ShowPanel(); ?>

<?php
  $APPLICATION->IncludeComponent(
    "ft:menu",
    "open-menu",
    []
  ); ?>


<div class="wrapper" data-r="redesign">
  <div class="search-top search-top-js">
    <div class="container">
      <div class="close-search-top"></div>
      <?php
        //        $APPLICATION->IncludeComponent("concept:kraken.search.line",
        //        "", array());
      ?>
    </div>
  </div>
  <!--<div class="xLoader">-->
  <!--  <div class="google-spin-wrapper">-->
  <!--    <div class="google-spin"></div>-->
  <!--  </div>-->
  <!--</div>-->
  <!--<div class="wrapper ">-->
  <?php
    //    if ($KRAKEN_MENU > 0)
    //      $APPLICATION->IncludeComponent(
    //        "concept:kraken.menu",
    //        "mobile_menu",
    //        array(
    //          "COMPONENT_TEMPLATE" => "mobile_menu",
    //          "COMPOSITE_FRAME_MODE" => "N",
    //          "CACHE_TIME" => "36000000",
    //          "CACHE_TYPE" => "A",
    //          "CACHE_USE_GROUPS" => "Y"
    //        )
    //      );
  ?>
  <?php
    $APPLICATION->IncludeComponent(
      "bitrix:menu",
      "mobile",
      array(
        "ALLOW_MULTI_SELECT" => "N",  // Разрешить несколько активных пунктов одновременно
        "CHILD_MENU_TYPE" => "",  // Тип меню для остальных уровней
        "DELAY" => "N",  // Откладывать выполнение шаблона меню
        "MAX_LEVEL" => "1",  // Уровень вложенности меню
        "MENU_CACHE_GET_VARS" => array(  // Значимые переменные запроса
          0 => "",
        ),
        "MENU_CACHE_TIME" => "3600",  // Время кеширования (сек.)
        "MENU_CACHE_TYPE" => "N",  // Тип кеширования
        "MENU_CACHE_USE_GROUPS" => "Y",  // Учитывать права доступа
        "ROOT_MENU_TYPE" => "header-page",  // Тип меню для первого уровня
        "USE_EXT" => "N",  // Подключать файлы с именами вида .тип_меню.menu_ext.php
      ),
      false
    );
  
  ?>
  
  <?php if (true): ?>
    <?php
    
    
    $sliderPictures = getHeaderSliderPictures();
//    if ($_SERVER["REMOTE_ADDR"] === "178.155.4.218" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "178.155.4.218") {
//    	echo '<pre>', print_r($sliderPictures, true), '</pre>';
//    }
    ?>
    <header class="r-header r-header--fix" >
      <div class="r-header__top r-header-top">
        <div class="r-header-shadow">
          
          <div class="header-row-container">
            <div class="r-header-row">
              <div class="r-header-top__tg">
                <a href="https://t.me/shop4shoot" target="_blank">
                  <img src="<?= SITE_TEMPLATE_PATH ?>/img/icons/tg.svg" alt="">
                </a>
                <a href="https://t.me/shop4shoot" target="_blank">
                  <div>НАШ ТЕЛЕГРАМ КАНАЛ</div>
                </a>
              </div>
              <nav class="r-header-top__menu">
                <menu>
                  <li>
                    <a href="/delivery/">ДОСТАВКА</a>
                  </li>
                  <li>
                    <a href="/offer/">ДОГОВОР-ОФЕРТА</a>
                  </li>
                  <li>
                    <a href="/contacts/">КОНТАКТЫ</a>
                  </li>
                </menu>
              </nav>
              <a href="<?= $APPLICATION->GetCurPage() === "/" ? "javascript:void(0)" : "/"?>"
                 class="r-header-top__logo">
                <img src="/local/templates/shop4shoot/img/logo.svg" alt="">
              </a>
            </div>
          </div>
        </div>
      </div>
      <?php if ($sliderPictures) : ?>
        <div class="r-header__slider swiper">
          <div class="swiper-wrapper">
            <?php foreach ($sliderPictures as $slide) : ?>
              <div class="swiper-slide">
                <img src="<?= CFile::GetPath($slide) ?>" alt="">
              </div>
            <?php endforeach; ?>
          </div>
          <div class="swiper-pagination r-header__slider-pagination"></div>
        </div>
      <?php endif; ?>
      <div class="r-header__footer">
        <div class="header-container">
          <div class="r-header__footer-body">
            <div class="r-header-burger">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <?php $APPLICATION->IncludeComponent(
              "bitrix:menu",
              "template-with-ul-recursive",
              array(
                "ALLOW_MULTI_SELECT" => "Y",
                "CHILD_MENU_TYPE" => "",
                "DELAY" => "N",
                "MAX_LEVEL" => "2",
                "MENU_CACHE_GET_VARS" => array(),
                "MENU_CACHE_TIME" => "3600",
                "MENU_CACHE_TYPE" => "N",
                "MENU_CACHE_USE_GROUPS" => "Y",
                "ROOT_MENU_TYPE" => "catalog-left-menu",
                "USE_EXT" => "Y",
                "COMPONENT_TEMPLATE" => "template-with-ul-recursive"
              ),
              false
            ); ?>
            <div class="r-header__search">
              <form action="/search/catalog/">
                <label>
                  <input type="text" name="q" value="<?= $_GET["q"]?>">
                </label>
                <button>
                  <img src="<?= SITE_TEMPLATE_PATH?>/img/icons/search.png" alt="">
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
    <header class="r-header" >
      <div class="r-header__top r-header-top">
        <div class="r-header-shadow">
          
          <div class="header-row-container">
            <div class="r-header-row">
              <div class="r-header-top__tg">
                <a href="https://t.me/shop4shoot" target="_blank">
                  <img src="<?= SITE_TEMPLATE_PATH ?>/img/icons/tg.svg" alt="">
                </a>
                <a href="https://t.me/shop4shoot" target="_blank">
                  <div>НАШ ТЕЛЕГРАМ КАНАЛ</div>
                </a>
              </div>
              <nav class="r-header-top__menu">
                <menu>
                  <li>
                    <a href="/delivery/">ДОСТАВКА</a>
                  </li>
                  <li>
                    <a href="/offer/">ДОГОВОР-ОФЕРТА</a>
                  </li>
                  <li>
                    <a href="/contacts/">КОНТАКТЫ</a>
                  </li>
                </menu>
              </nav>
              <a href="<?= $APPLICATION->GetCurPage() === "/" ? "javascript:void(0)" : "/"?>"
                 class="r-header-top__logo">
                <img src="/local/templates/shop4shoot/img/logo.svg" alt="">
              </a>
            </div>
          </div>
        </div>
      </div>
      <?php if ($sliderPictures) : ?>
        <div class="r-header__slider swiper">
          <div class="swiper-wrapper">
            <?php foreach ($sliderPictures as $slide) : ?>
              <div class="swiper-slide">
                <img src="<?= CFile::GetPath($slide) ?>" alt="">
              </div>
            <?php endforeach; ?>
          </div>
          <div class="swiper-pagination r-header__slider-pagination"></div>
        </div>
      <?php endif; ?>
      <div class="r-header__footer">
        <div class="header-container">
          <div class="r-header__footer-body">
            <div class="r-header-burger">
              <div></div>
              <div></div>
              <div></div>
            </div>
          <?php
            global $USER;
            $compTemplate = "template-with-ul-recursive";
//            if ($USER->IsAdmin()) {
//              $compTemplate = "template-with-ul-recursive-d2";
//            }
            $APPLICATION->IncludeComponent(
            "bitrix:menu",
            $compTemplate,
            array(
              "ALLOW_MULTI_SELECT" => "Y",
              "CHILD_MENU_TYPE" => "",
              "DELAY" => "N",
              "MAX_LEVEL" => "2",
              "MENU_CACHE_GET_VARS" => array(),
              "MENU_CACHE_TIME" => "3600",
              "MENU_CACHE_TYPE" => "N",
              "MENU_CACHE_USE_GROUPS" => "Y",
              "ROOT_MENU_TYPE" => "catalog-left-menu",
              "USE_EXT" => "Y",
              "COMPONENT_TEMPLATE" => "template-with-ul-recursive"
            ),
            false
          ); ?>
          <div class="r-header__search">
            <form action="/search/catalog/">
              <label>
                <input type="text" name="q" value="<?= $_GET["q"] ?>">
              </label>
              <button>
                <img src="<?= SITE_TEMPLATE_PATH?>/img/icons/search.png" alt="">
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
    </header>
  <?php else : ?>
    
    <header
      class="k1-header tone-dark menu-type-3 menu-view-2 head-view-center fixed color_header-def view-hide lazyload">
      <div class="header-top k1-header-top">
        <div class="container top-line">
          <div class="row">
            <table class="wrap hidden-xs k1-header-line">
              <tr>
                <td class="col-sm-4 col-xs-1 left col-sm-6 k1-header-burger-wrapper">
                  <div class="row">
                    <table>
                      <tr>
                        <td class="menu-burger">
                          <a class="ic-menu-burger main-color open-main-menu">
                            <div class="icon-hamburger-wrap">
                              <span class="icon-bar"></span>
                              <span class="icon-bar"></span>
                              <span class="icon-bar"></span>
                            </div>
                          </a>
                        </td>
                        <td>
                          <ul class="k1-header-top-menu">
                            <li>
                              <a href="/delivery/">
                                <img src="/bitrix/templates/concept_kraken_s1/images/icons/delivery.png " alt="">
                                <span>доставка</span>
                              </a>
                            </li>
                            <li>
                              <a href="/offer/">
                                <img src="/bitrix/templates/concept_kraken_s1/images/icons/offer.png " alt="">
                                <span>Договор-оферта</span>
                              </a>
                            </li>
                            <li>
                              <a href="/contacts/">
                                <img src="/bitrix/templates/concept_kraken_s1/images/icons/phone.png " alt="">
                                <span>Контакты</span>
                              </a>
                            </li>
                            <li class="k-tg">
                              <a href="https://t.me/shop4shoot" target="_blank">
                                <img src="/bitrix/templates/concept_kraken_s1/images/icons/telegram.svg" alt="">
                              </a>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td><!-- /left -->
                <td class="col-sm-4 col-xs-10 center col-sm-2">
                </td><!-- /center -->
                <td class="col-sm-4 col-xs-1 right k1-logo-column">
                  <a class="visible-part phone open_modal_contacts"><span></span></a>
                  <div class="row hidden-xs">
                    <table class="right-inner">
                      <tr>
                        <td>
                          <div class="main-phone">
                            <?php /* ?>
                        <!--                        <div class="visible-part phone"><a href="tel:‭89684980519‬">+‭7 (968) 498-05-19‬</a></div>-->
                          <?php */ ?>
                          </div>
                        </td>
                        <td>
                          <a class="ic-callback main-color call-modal callform"
                             data-header="Шапка сайта"
                             data-call-modal="form36"><span></span></a>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="k1-new-logo">
                    <a href="/"> <img class='logotype lazyload '
                                      data-src='/upload/kraken/91e/ee5zmvk6bhvmron78jyfiam5dp3yn30c.svg'/>
                      <!--                    <img src="/bitrix/templates/concept_kraken_s1/images/logo.svg" alt="">-->
                    </a></div>
                  <div style="display: none;align-items: flex-end;">
                    <div class="k1-modal-open-feedback big button-def left elips main-btn secondary"
                         style="margin: 0 0 0 auto;"
                    >
                      Стол заказов
                    </div>
                  </div>
                </td><!-- /right -->
              </tr>
            </table>
            <div class="col-xs-12">
              <div class="header-block-mob-wrap visible-xs">
                <table class="header-block-mob cart-on ">
                  <tr>
                    <td class="mob-callmenu">
                      <a class="ic-menu-burger main-color open-main-menu">
                        <div class="icon-hamburger-wrap">
                          <span class="icon-bar"></span>
                          <span class="icon-bar"></span>
                          <span class="icon-bar"></span>
                        </div>
                      </a>
                    </td>
                    <td class="mob-logo">
                      <a href="/">
                        <img class="logotype" src="/local/templates/shop4shoot/img/logo.svg" alt="">
                      </a>
                    </td>
                    <?php
                      $basket = Sale\Basket::loadItemsForFUser(Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
                      $isShowWidget = count($basket->toArray()) > 0;
                    ?>
                    <td class="mob-cart">
                      <div
                        class="open-cart-mob  basket-count-control-widget-in-public-mob <?= $isShowWidget ? "no-empty" : "" ?>">
                        <div class="bg-color"></div>
                        <div class="wrap-img-count">
                          <table>
                            <tr>
                              <td><span class="icon"></span></td>
                              <td><span class="count basket-count-value">0</span></td>
                            </tr>
                          </table>
                        </div>
                        <a class="cart_link url2Basket hidden" href="/cart/"></a>
                      </div>
                    </td>
                    <td class="mob-contacts">
                      <a class="visible-part main-color phone open_modal_contacts"><span></span></a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <?php
          $APPLICATION->IncludeComponent(
            "bitrix:menu",
            "header-page",
            array(
              "ALLOW_MULTI_SELECT" => "N",  // Разрешить несколько активных пунктов одновременно
              "CHILD_MENU_TYPE" => "",  // Тип меню для остальных уровней
              "DELAY" => "N",  // Откладывать выполнение шаблона меню
              "MAX_LEVEL" => "1",  // Уровень вложенности меню
              "MENU_CACHE_GET_VARS" => array(  // Значимые переменные запроса
                0 => "",
              ),
              "MENU_CACHE_TIME" => "3600",  // Время кеширования (сек.)
              "MENU_CACHE_TYPE" => "N",  // Тип кеширования
              "MENU_CACHE_USE_GROUPS" => "Y",  // Учитывать права доступа
              "ROOT_MENU_TYPE" => "header-page",  // Тип меню для первого уровня
              "USE_EXT" => "N",  // Подключать файлы с именами вида .тип_меню.menu_ext.php
            ),
            false
          );
        ?>
    </header>
    <div
      class="header-page catalog-first-block section cover parent-scroll-down dark kraken-firsttype-3 "
      style="background-image: url(<?php $APPLICATION->ShowViewContent("header-bg"); ?>);">
      
      <div class="shadow"></div>
      <div class="top-shadow"></div>
      
      <div class="container">
        <div class="row">
          <div class="catalog-first-block-table clearfix">
            <div class="catalog-first-block-cell text-part col-lg-9 col-md-9 col-sm-9 col-xs-12">
              <div class="head">
                <div class="inner-breadcrumb-wrap">
                  <?php if ($APPLICATION->GetCurPage(false) !== '/') : ?>
                    <?php
                    $APPLICATION->IncludeComponent(
                      "bitrix:breadcrumb",
                      "bread",
                      array(
                        "PATH" => "",  // Путь, для которого будет построена навигационная цепочка (по умолчанию, текущий путь)
                        "SITE_ID" => "s1",  // Cайт (устанавливается в случае многосайтовой версии, когда DOCUMENT_ROOT у сайтов разный)
                        "START_FROM" => "0",  // Номер пункта, начиная с которого будет построена навигационная цепочка
                      ),
                      false
                    ); ?>
                  <?php endif; ?>
                </div>
                <div class="title k1-main-title main1"><h1><?php $APPLICATION->ShowTitle() ?></h1></div>
              
              
              </div>
            
            </div>
            
            <div class="catalog-first-block-cell col-lg-3 col-md-3 col-sm-3 col-xs-12 hidden-xs">
              <?php if ($APPLICATION->GetCurDir() != SITE_DIR . "cart/"): ?>
                <div class="wrap-scroll-down active hidden-xs">
                  <div class="down-scrollBig">
                    <i class="fa fa-chevron-down"></i>
                  </div>
                </div>
              <?php endif; ?>
            </div>
          
          
          </div>
        
        </div>
      </div>
    
    </div>
  <?php endif; ?>
  
  
  