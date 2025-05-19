<?php
  require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');
  /**
   * @global CMain $APPLICATION
   * */
  
  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
  $APPLICATION->SetTitle("Бренды");
  $brands = getBrandsMenu();
//echo '<pre>', print_r($brands["keys"], true), '</pre>';
//echo '<pre>', print_r($brands["filter"], true), '</pre>';
?>
<?php if (
  !empty($brands["filter"]["lat"])
  || !empty($brands["filter"]["num"])
  || !empty($brands["filter"]["cyr"])
) : ?>
  <div class="r-container brands-container">
    <div class="brands-filter-wrapper">
      <div>
        <a href="javascript:void(0)" data-namespace="all">Все</a>
      </div>
      <?php if (!empty($brands["filter"]["lat"])) : ?>
        <div class="filter-namespace current-filter-namespace">
          <a href="javascript:void(0)" data-namespace="lat">A-Z</a>
          <ul>
            <?php foreach ($brands["filter"]["lat"] as $lItem) : ?>
              <li>
                <a href="javascript:void(0)" data-letter="<?= $lItem ?>"><?= $lItem ?></a>
              </li>
            <?php endforeach ?>
          </ul>
        </div>
      <?php endif ?>
      <?php if (!empty($brands["filter"]["num"])) : ?>
        <div class="filter-namespace">
          <a href="javascript:void(0)" data-namespace="num">0-9</a>
          <ul>
            <?php foreach ($brands["filter"]["num"] as $lItem) : ?>
              <li>
                <a href="javascript:void(0)" data-letter="<?= $lItem ?>"><?= $lItem ?></a>
              </li>
            <?php endforeach ?>
          </ul>
        </div>
      <?php endif ?>
      <?php if (!empty($brands["filter"]["cyr"])) : ?>
        <div class="filter-namespace">
          <a href="javascript:void(0)" data-namespace="cyr">А-Я</a>
          <ul>
            <?php foreach ($brands["filter"]["cyr"] as $lItem) : ?>
              <li>
                <a href="javascript:void(0)" data-letter="<?= $lItem ?>"><?= $lItem ?></a>
              </li>
            <?php endforeach ?>
          </ul>
        </div>
      <?php endif ?>
    </div>
    <div class="brands-list">
      <?php if (!empty($brands["data"]["CHILDREN"])) : ?>
        
        <?php foreach ($brands["data"]["CHILDREN"] as $lvl2) : ?>
          <?php
          $nameSpace = "lat";
          if (preg_match("/[А-Яа-я]/", $lvl2['TEXT'])) {
            $nameSpace = "cyr";
          }
          if (preg_match("/[0-9]/", $lvl2['TEXT'])) {
            $nameSpace = "num";
          }
          ?>
          <div class="brands-block" 
               data-namespace-target="<?= $nameSpace ?>"
               data-target-letter=<?= $lvl2['TEXT'] ?>
          >
            <div class="brands-letter">
              <?= $lvl2["TEXT"] ?>
            </div>
            <?php if (!empty($lvl2["CHILDREN"])) : ?>
              <div class="brands-links">
                <?php foreach ($lvl2["CHILDREN"] as $lvl3) : ?>
                  <a href="/?brand=<?= $lvl3["TEXT"] ?>" class="brands-name">
                    <?= $lvl3["TEXT"] ?>
                  </a>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>
<?php endif; ?>
<?php CJSCore::Init(array('BrandsFilter')); ?>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
      new BrandsFilter()
    })
  </script>
<?php require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>