<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?php
  /** @var array $arParams */
?>
<?php if (!empty($arResult)): ?>
  <div class="wrap-main-menu active def full ready">
    <div class="container pos-static">
      <div class="main-menu-inner">
        <div class="nav-main-menu-wrap more-four">
          <nav class="main-menu">
<!--            <ul class="left-menu">-->
              <?php
                foreach ($arResult as $arItem):
                  if ($arParams["MAX_LEVEL"] == 1 && $arItem["DEPTH_LEVEL"] > 1)
                    continue;
                  ?>
                  <?php if ($arItem["SELECTED"]): ?>
                  <li class="lvl1 view_1 visible">
                    <a href="<?= $arItem["LINK"] ?>" class="selected">
                      <span class="wrap-name"><span><?= $arItem["TEXT"] ?><div class="bord"></div></span></span>
                    </a>
                  </li>
                <?php else: ?>
                  <li class="lvl1 view_1 visible">
                    <a href="<?= $arItem["LINK"] ?>">
                      <span class="wrap-name"><span><?= $arItem["TEXT"] ?><div class="bord"></div></span></span>
                    </a>
                  </li>
                <?php endif ?>
                <?php endforeach ?>
<!--            </ul>-->
          </nav>
        </div>
      </div>
    </div>
  </div>
<?php endif ?>