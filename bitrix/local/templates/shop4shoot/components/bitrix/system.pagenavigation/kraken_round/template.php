<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  
  /** @var array $arParams */
  /** @var array $arResult */
  /** @var CBitrixComponentTemplate $this */
  
  $this->setFrameMode(true);
  
  if (!$arResult["NavShowAlways"]) {
    if ($arResult["NavRecordCount"] == 0 || ($arResult["NavPageCount"] == 1 && $arResult["NavShowAll"] == false))
      return;
  }
  
  $strNavQueryString = ($arResult["NavQueryString"] != "" ? $arResult["NavQueryString"] . "&amp;" : "");
  $strNavQueryStringFull = ($arResult["NavQueryString"] != "" ? "?" . $arResult["NavQueryString"] : "");
  
  $colorSchemes = array(
    "green" => "bx-green",
    "yellow" => "bx-yellow",
    "red" => "bx-red",
    "blue" => "bx-blue",
  );
  if (isset($colorSchemes[$arParams["TEMPLATE_THEME"]])) {
    $colorScheme = $colorSchemes[$arParams["TEMPLATE_THEME"]];
  } else {
    $colorScheme = "";
  }
?>
<?php if (true) : ?>
  <div class="bx-pagination <?= $colorScheme ?>">
    <div class="bx-pagination-container row">
      <ul>
        <?php
          
          $strNavQueryString = ($arResult["NavQueryString"] != "" ? $arResult["NavQueryString"] . "&amp;" : "");
          $strNavQueryStringFull = ($arResult["NavQueryString"] != "" ? "?" . $arResult["NavQueryString"] : "");
        ?>
        <?php
          if ($arResult["bDescPageNumbering"] === true):
            $bFirst = true;
            if ($arResult["NavPageNomer"] < $arResult["NavPageCount"]):
              if ($arResult["bSavePage"]):
                ?>
                <li class="bx-pag-prev"><a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
                </li>
                <li class=""><a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span>1</span></a>
                </li>
              <?php else: // $arResult["bSavePage"] ?>
                <?php if (($arResult["NavPageNomer"] + 1) == $arResult["NavPageCount"]): ?>
                  <li class="bx-pag-prev"><a
                      href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"><span></span></a>
                  </li>
                <?php else: // ($arResult["NavPageNomer"] + 1) == $arResult["NavPageCount"]?>
                  <li class="bx-pag-prev"><a
                      href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
                  </li>
                <?php endif // ($arResult["NavPageNomer"] + 1) == $arResult["NavPageCount"] ?>
                <li class=""><a href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"><span>1</span></a></li>
              <?php endif; // $arResult["bSavePage"];
              
              if ($arResult["nStartPage"] < $arResult["NavPageCount"]):
                $bFirst = false;
                if ($arResult["bSavePage"]):
                  ?>
                  <a class="modern-page-first"
                     href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["NavPageCount"] ?>">1</a>
                <?php
                else:
                  ?>
                  <a class="modern-page-first" href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>">1</a>
                <?php
                endif;
                if ($arResult["nStartPage"] < ($arResult["NavPageCount"] - 1)):
                  /*?>
                        <span class="modern-page-dots">...</span>
                  <?*/
                  ?>
                  <a class="modern-page-dots"
                     href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= intval($arResult["nStartPage"] + ($arResult["NavPageCount"] - $arResult["nStartPage"]) / 2) ?>">...</a>
                <?php
                endif;
              endif;
            else : // $arResult["NavPageNomer"] < $arResult["NavPageCount"]
              ?>
              <li class="bx-pag-prev"><span></span></li>
              <li class="bx-active 123"><span>1</span></li>
            <?php endif; // $arResult["NavPageNomer"] < $arResult["NavPageCount"]
            do {
              $NavRecordGroupPrint = $arResult["NavPageCount"] - $arResult["nStartPage"] + 1;
              
              if ($arResult["nStartPage"] == $arResult["NavPageNomer"]):
                ?>
                <li class="bx-active 22">
                  <span class="<?= ($bFirst ? "modern-page-first " : "") ?>current"><?= $NavRecordGroupPrint ?></span>
                </li>
              <?php
              elseif ($arResult["nStartPage"] == $arResult["NavPageCount"] && $arResult["bSavePage"] == false):
                ?>
                <li class="">
                  <a href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"
                     class="<?= ($bFirst ? "modern-page-first" : "") ?>"><?= $NavRecordGroupPrint ?></a>
                </li>
              <?php
              else:
                ?>
                <li class="">
                  <a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["nStartPage"] ?>"<?php
                  ?> class="<?= ($bFirst ? "modern-page-first" : "") ?>"><?= $NavRecordGroupPrint ?></a>
                </li>
              <?php
              endif;
              
              $arResult["nStartPage"]--;
              $bFirst = false;
            } while ($arResult["nStartPage"] >= $arResult["nEndPage"]);
            
            if ($arResult["NavPageNomer"] > 1):
              if ($arResult["nEndPage"] > 1):
                if ($arResult["nEndPage"] > 2):
                  ?>
                  <li class="">
                    <a class="modern-page-dots"
                       href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= round($arResult["nEndPage"] / 2) ?>">...</a>
                  </li>
                <?php
                endif;
                ?>
                <li class="">
                  <a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=1"><?= $arResult["NavPageCount"] ?></a>
                </li>
              <?php
              endif;
              
              ?>
              
              <li class="bx-pag-next"><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
              </li>
            <?php
            endif;
          
          else: // $arResult["bDescPageNumbering"] === true
            $bFirst = true;
            if ($arResult["NavPageNomer"] > 1):
              if ($arResult["bSavePage"]):
                ?>
                <li class="bx-pag-prev"><a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
                </li>
              <?php
              else:
                if ($arResult["NavPageNomer"] > 2):
                  ?>
                  <li class="bx-pag-prev"><a
                      href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
                  </li>
                <?php
                else:
                  ?>
                  <li class="bx-pag-prev"><a
                      href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
                  </li>
                <?php
                endif;
              endif;
              
              if ($arResult["nStartPage"] > 1):
                $bFirst = false;
                if ($arResult["bSavePage"]):
                  ?>
                  <li class="">
                    <a class="modern-page-first"
                       href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=1">1</a>
                  </li>
                <?php
                else:
                  ?>
                  <li class="">
                    <a class="modern-page-first" href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>">1</a>
                  </li>
                <?php
                endif;
                if ($arResult["nStartPage"] > 2): ?>
                  <li class="">
                    <a class="modern-page-dots"
                       href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= round($arResult["nStartPage"] / 2) ?>">...</a>
                  </li>
                <?php
                endif;
              endif;
            endif;
            
            do {
              if ($arResult["nStartPage"] == $arResult["NavPageNomer"]):
                ?>
                <li class="bx-active 33">
                  <span
                    class="<?= ($bFirst ? "modern-page-first " : "") ?>current"><?= $arResult["nStartPage"] ?></span>
                </li>
              <?php
              elseif ($arResult["nStartPage"] == 1 && $arResult["bSavePage"] == false):
                ?>
                <li class="">
                  <a href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"
                     class="<?= ($bFirst ? "modern-page-first" : "") ?>"><?= $arResult["nStartPage"] ?></a>
                </li>
              <?php
              else:
                ?>
                <li class="">
                  <a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["nStartPage"] ?>"<?php
                  ?> class="<?= ($bFirst ? "modern-page-first" : "") ?>"><?= $arResult["nStartPage"] ?></a>
                </li>
              <?php
              endif;
              $arResult["nStartPage"]++;
              $bFirst = false;
            } while ($arResult["nStartPage"] <= $arResult["nEndPage"]);
            
            if ($arResult["NavPageNomer"] < $arResult["NavPageCount"]):
              if ($arResult["nEndPage"] < $arResult["NavPageCount"]):
                if ($arResult["nEndPage"] < ($arResult["NavPageCount"] - 1)):
                  /*?>
                      <span class="modern-page-dots">...</span>
                  <?*/
                  ?>
                  <li class="">
                    <a class="modern-page-dots"
                       href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= round($arResult["nEndPage"] + ($arResult["NavPageCount"] - $arResult["nEndPage"]) / 2) ?>">...</a>
                  </li>
                <?php
                endif;
                ?>
                <li class="">
                  <a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["NavPageCount"] ?>"><?= $arResult["NavPageCount"] ?></a>
                </li>
              <?php
              endif;
              ?>
              <li class="bx-pag-next"><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
              </li>
            <?php
            endif;
          endif;
          
          if ($arResult["bShowAll"]):
            if ($arResult["NavShowAll"]):
              ?>
              <a class="modern-page-pagen"
                 href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>SHOWALL_<?= $arResult["NavNum"] ?>=0"><?= GetMessage("nav_paged") ?></a>
            <?php
            else:
              ?>
              <a class="modern-page-all"
                 href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>SHOWALL_<?= $arResult["NavNum"] ?>=1"><?= GetMessage("nav_all") ?></a>
            <?php
            endif;
          endif
        ?>
      </ul>
    </div>
  </div>
<?php else : ?>
  <div class="bx-pagination <?= $colorScheme ?>">
    <div class="bx-pagination-container row">
      <ul>
        <?php if ($arResult["bDescPageNumbering"] === true): ?>
          
          <?php if ($arResult["NavPageNomer"] < $arResult["NavPageCount"]): ?>
            <?php if ($arResult["bSavePage"]): ?>
              <li class="bx-pag-prev"><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
              </li>
              <li class=""><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span>1</span></a>
              </li>
            <?php else: ?>
              <?php if (($arResult["NavPageNomer"] + 1) == $arResult["NavPageCount"]): ?>
                <li class="bx-pag-prev"><a
                    href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"><span></span></a>
                </li>
              <?php else: ?>
                <li class="bx-pag-prev"><a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
                </li>
              <?php endif ?>
              <li class=""><a href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"><span>1</span></a></li>
            <?php endif ?>
          <?php else: ?>
            <li class="bx-pag-prev"><span></span></li>
            <li class="bx-active"><span>1</span></li>
          <?php endif ?>
          
          <?php
          $arResult["nStartPage"]--;
          while ($arResult["nStartPage"] >= $arResult["nEndPage"] + 1):
            ?>
            <?php $NavRecordGroupPrint = $arResult["NavPageCount"] - $arResult["nStartPage"] + 1; ?>
            
            <?php if ($arResult["nStartPage"] == $arResult["NavPageNomer"]): ?>
            <li class="bx-active"><span><?= $NavRecordGroupPrint ?></span></li>
          <?php else: ?>
            <li class=""><a
                href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["nStartPage"] ?>"><span><?= $NavRecordGroupPrint ?></span></a>
            </li>
          <?php endif ?>
            
            <?php $arResult["nStartPage"]-- ?>
          <?php endwhile ?>
          
          <?php if ($arResult["NavPageNomer"] > 1): ?>
            <?php if ($arResult["NavPageCount"] > 1): ?>
              <li class=""><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=1"><span><?= $arResult["NavPageCount"] ?></span></a>
              </li>
            <?php endif ?>
            <li class="bx-pag-next"><a
                href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] - 1) ?>"><span></span></a>
            </li>
          <?php else: ?>
            <?php if ($arResult["NavPageCount"] > 1): ?>
              <li class="bx-active"><span><?= $arResult["NavPageCount"] ?></span></li>
            <?php endif ?>
            <li class="bx-pag-next"><span></span></li>
          <?php endif ?>
        
        <?php else: ?>
          
          <?php if ($arResult["NavPageNomer"] > 1): ?>
            <?php if ($arResult["bSavePage"]): ?>
              <li class="bx-pag-prev"><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] - 1) ?>"><span></span></a>
              </li>
              <li class=""><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=1"><span>1</span></a>
              </li>
            <?php else: ?>
              <?php if ($arResult["NavPageNomer"] > 2): ?>
                <li class="bx-pag-prev"><a
                    href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] - 1) ?>"><span></span></a>
                </li>
              <?php else: ?>
                <li class="bx-pag-prev"><a
                    href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"><span></span></a>
                </li>
              <?php endif ?>
              <li class=""><a href="<?= $arResult["sUrlPath"] ?><?= $strNavQueryStringFull ?>"><span>1</span></a></li>
            <?php endif ?>
            <?php ?>
          <?php else: ?>
            <li class="bx-pag-prev"><span></span></li>
            <li class="bx-active"><span>1</span></li>
          <?php endif ?>
          
          <?php
          $arResult["nStartPage"]++;
          while ($arResult["nStartPage"] <= $arResult["nEndPage"] - 1):
            
            ?>
            <?php if ($arResult["nStartPage"] == $arResult["NavPageNomer"]): ?>
            <li class="bx-active"><span><?= $arResult["nStartPage"] ?></span></li>
          <?php else: ?>
            <li class=""><a
                href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["nStartPage"] ?>"><span><?= $arResult["nStartPage"] ?></span></a>
            </li>
          <?php endif ?>
            <?php $arResult["nStartPage"]++ ?>
          <?php endwhile ?>
          
          <?php if ($arResult["NavPageNomer"] < $arResult["NavPageCount"]): ?>
            <?php if ($arResult["NavPageCount"] > 1): ?>
              <li class=""><a
                  href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= $arResult["NavPageCount"] ?>"><span><?= $arResult["NavPageCount"] ?></span></a>
              </li>
            <?php endif ?>
            <li class="bx-pag-next"><a
                href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>PAGEN_<?= $arResult["NavNum"] ?>=<?= ($arResult["NavPageNomer"] + 1) ?>"><span></span></a>
            </li>
          <?php else: ?>
            <?php if ($arResult["NavPageCount"] > 1): ?>
              <li class="bx-active"><span><?= $arResult["NavPageCount"] ?></span></li>
            <?php endif ?>
            <li class="bx-pag-next"><span></span></li>
          <?php endif ?>
        <?php endif ?>
        
        <?php if ($arResult["bShowAll"]): ?>
          <?php if ($arResult["NavShowAll"]): ?>
            <li class="bx-pag-all"><a
                href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>SHOWALL_<?= $arResult["NavNum"] ?>=0"
                rel="nofollow"><span><?php echo GetMessage("round_nav_pages") ?></span></a></li>
          <?php else: ?>
            <li class="bx-pag-all"><a
                href="<?= $arResult["sUrlPath"] ?>?<?= $strNavQueryString ?>SHOWALL_<?= $arResult["NavNum"] ?>=1"
                rel="nofollow"><span><?php echo GetMessage("round_nav_all") ?></span></a></li>
          <?php endif ?>
        <?php endif ?>
      </ul>
      <div style="clear:both"></div>
    </div>
  </div>
<?php endif; ?>