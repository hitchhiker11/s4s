<?php
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  /** @var array $arParams */
  /** @var array $arResult */
  /** @global CMain $APPLICATION */
  ?>

<div class="menu-shadow tone-dark hidden-xs"></div>

<div class="open-menu tone-dark hidden-xs">
  <div class="head-menu-wrap">
    <div class="container">
      <div class="row">
        <div class="head-menu">
          <a class="close-menu main"></a>
          <table>
            <tr>
              <td class="col-md-4 col-sm-5 col-xs-1 left">
              </td>
              <td class="col-md-4 col-sm-5 col-xs-1 center">
                <img class="logotype" src="/upload/kraken/91e/ee5zmvk6bhvmron78jyfiam5dp3yn30c.svg" alt="">
              </td>
              <td class="col-md-4 col-sm-2 col-xs-1"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="body-menu">
    <div class="main-menu-navigation">
      
      <div class="container">
        <div class="row">
          <?php
            $APPLICATION->IncludeComponent(
              "bitrix:menu",
              "popup",
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
          <?php
            if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/include/k1-catalog-search.php')) {
              require_once($_SERVER['DOCUMENT_ROOT'] . '/include/k1-catalog-search.php');
            }
          ?>
        </div>
        <ul class="k1-header-top-menu" style="margin-top: 40px;">
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
      </div>
    </div>
  </div>
  <div class="footer-menu-wrap">
    <div class="container">
      <div class="row"></div>
    </div>
  </div>
</div><!-- /open-menu -->
