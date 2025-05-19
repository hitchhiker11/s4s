<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?php
  /** @var array $arParams */
  /** @var array $arResult */
?>
<?php
  $menuCols = [];
  foreach ($arResult as $index => $arItem) {
    $rest = ($index + 4) % 4;
    $menuCols[$rest][] = $arItem;
  }
?>
<?php if (!empty($arResult)): ?>
  <div class="wrap-main-menu active def full ready">
    <div class="container pos-static">
      <div class="main-menu-inner">
        <div class="nav-main-menu-wrap more-four">
          <nav class="main-menu">
            <div class="row">
              <?php for ($i = 1;
                         $i <= 4;
                         $i++): ?>
                <div class="col-md-3 col-sm-6 col-xs-12">
                  <?php foreach ($menuCols[$i - 1] as $arItem): ?>
                    <div class="list-menu">
                      <a
                        href="<?= $arItem["LINK"] ?>"
                        class="main-item hover close-menu-js open"
                        target='_blank'
                      >
                        <?= $arItem["TEXT"] ?>
                      </a>
                    </div>
                  <?php endforeach ?>
                </div>
              <?php endfor; ?>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
<?php endif ?>