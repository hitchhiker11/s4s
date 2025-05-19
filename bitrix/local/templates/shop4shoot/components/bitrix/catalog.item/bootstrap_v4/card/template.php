<?php if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  use \Bitrix\Main\Localization\Loc;
  use Bitrix\Sale\Basket;
  use Bitrix\Sale\Fuser;
  
  /**
   * @global CMain $APPLICATION
   * @var array $arParams
   * @var array $item
   * @var array $actualItem
   * @var array $minOffer
   * @var array $itemIds
   * @var array $price
   * @var array $measureRatio
   * @var bool $haveOffers
   * @var bool $showSubscribe
   * @var array $morePhoto
   * @var bool $showSlider
   * @var bool $itemHasDetailUrl
   * @var string $imgTitle
   * @var string $productTitle
   * @var string $buttonSizeClass
   * @var string $discountPositionClass
   * @var string $labelPositionClass
   * @var CatalogSectionComponent $component
   */
  
  global $USER;
  $stickerClass = "";
  $stickerData = [];
  if ($item["PROPERTIES"]["NOVINKA"]["VALUE"]) {
//  if ($item["PROPERTIES"]["ISNEW"]["VALUE"]) {
    $stickerData["class"] = "r-new";
    $stickerData["text"] = "новинка";
  }
  if ($item["PROPERTIES"]["MONTHLY"]["VALUE"]) {
    $stickerData["class"] = "r-monthly";
    $stickerData["text"] = "товар месяца";
  }
  if ($arParams["isGOAT"]) {
    $stickerData["class"] = "r-goat";
    $stickerData["text"] = "Лучший товар";
  }
  $picturePath = $item['DETAIL_PICTURE']['SRC'] ?: CATALOG_PICTURE_STUB;
  
  $obBasket = Basket::loadItemsForFUser(
    FUser::getId(),
    SITE_ID
  );
  $basketItems = $obBasket->getBasketItems();
  $inBasket = false;
  $inBasketQuantity = 0;
  if ($basketItems) {
    foreach ($basketItems as $basketItem) {
      if ($basketItem->getField("PRODUCT_ID") == $item["ID"]) {
        $inBasket = true;
        $inBasketQuantity = (int)$basketItem->getField("QUANTITY");
        break;
      }
    }
  }

?>

<div class="product-item r-product-item <?= $stickerClass?>">
  <?php if (!empty($stickerData["class"])) : ?>
    <div class="product-item__sticker <?= $stickerData["class"]?>">
      <?= $stickerData["text"]?>
    </div>
  <?php endif; ?>
  <div>
    <?php if ($itemHasDetailUrl): ?>
    <a class="product-item-image-wrapper" href="<?= $item['DETAIL_PAGE_URL'] ?>"
       title="<?= $imgTitle ?>"
       data-entity="image-wrapper">
      <?php else: ?>
      <span class="product-item-image-wrapper" data-entity="image-wrapper">
	<?php endif; ?>
  
		<span class="product-item-image-slider-slide-container slide" id="<?= $itemIds['PICT_SLIDER'] ?>"
			<?= ($showSlider ? '' : 'style="display: none;"') ?>
			data-slider-interval="<?= $arParams['SLIDER_INTERVAL'] ?>" data-slider-wrap="true">
			<?php
        if ($showSlider) {
          foreach ($morePhoto as $key => $photo) {
            ?>
            <span class="product-item-image-slide item <?= ($key == 0 ? 'active' : '') ?>"
                  style="background-image: url('<?= $photo['SRC'] ?>');"></span>
            <?php
          }
        }
      ?>
		</span>
		<span class="product-item-image-original" id="<?= $itemIds['PICT'] ?>"
          style="background-image: url('<?= $picturePath ?>'); <?= ($showSlider ? 'display: none;' : '') ?>"></span>
		<?php
      if ($item['SECOND_PICT']) {
        $bgImage = !empty($item['PREVIEW_PICTURE_SECOND']) ? $item['PREVIEW_PICTURE_SECOND']['SRC'] : $item['PREVIEW_PICTURE']['SRC'];
        ?>
        <span class="product-item-image-alternative" id="<?= $itemIds['SECOND_PICT'] ?>"
              style="background-image: url('<?= $bgImage ?>'); <?= ($showSlider ? 'display: none;' : '') ?>"></span>
        <?php
      }
      
      if ($arParams['SHOW_DISCOUNT_PERCENT'] === 'Y') {
        ?>
        <div class="product-item-label-ring <?= $discountPositionClass ?>" id="<?= $itemIds['DSC_PERC'] ?>"
				<?= ($price['PERCENT'] > 0 ? '' : 'style="display: none;"') ?>>
				<span><?= -$price['PERCENT'] ?>%</span>
			</div>
        <?php
      }
      
      if ($item['LABEL']) {
        ?>
        <div class="product-item-label-text <?= $labelPositionClass ?>" id="<?= $itemIds['STICKER_ID'] ?>">
				<?php
          if (!empty($item['LABEL_ARRAY_VALUE'])) {
            foreach ($item['LABEL_ARRAY_VALUE'] as $code => $value) {
              ?>
              <div<?= (!isset($item['LABEL_PROP_MOBILE'][$code]) ? ' class="d-none d-sm-block"' : '') ?>>
							<span title="<?= $value ?>"><?= $value ?></span>
						</div>
              <?php
            }
          }
        ?>
			</div>
        <?php
      }
    ?>
		<span class="product-item-image-slider-control-container" id="<?= $itemIds['PICT_SLIDER'] ?>_indicator"
			<?= ($showSlider ? '' : 'style="display: none;"') ?>>
			<?php
        if ($showSlider) {
          foreach ($morePhoto as $key => $photo) {
            ?>
            <span class="product-item-image-slider-control<?= ($key == 0 ? ' active' : '') ?>"
                  data-go-to="<?= $key ?>"></span>
            <?php
          }
        }
      ?>
		</span>
		<?php
      if ($arParams['SLIDER_PROGRESS'] === 'Y') {
        ?>
        <span class="product-item-image-slider-progress-bar-container">
				<span class="product-item-image-slider-progress-bar" id="<?= $itemIds['PICT_SLIDER'] ?>_progress_bar"
              style="width: 0;"></span>
			</span>
        <?php
      }
    ?>
        <?php if ($itemHasDetailUrl): ?>
    </a>
  <?php else: ?>
    </span>
  <?php endif; ?>
    <h3 class="product-item-title">
      <?php if ($itemHasDetailUrl): ?>
      <a href="<?= $item['DETAIL_PAGE_URL'] ?>" title="<?= $productTitle ?>">
        <?php endif; ?>
        <?= $productTitle ?>
        <?php if ($itemHasDetailUrl): ?>
      </a>
    <?php endif; ?>
    </h3>
    <?php
      if (gettype($arParams['PRODUCT_BLOCKS_ORDER']) === "string")
        $arParams['PRODUCT_BLOCKS_ORDER'] = explode(",", $arParams['PRODUCT_BLOCKS_ORDER']);
      if (!empty($arParams['PRODUCT_BLOCKS_ORDER'])) {
        foreach ($arParams['PRODUCT_BLOCKS_ORDER'] as $blockName) {
          switch ($blockName) {
           
            
           
            
            case 'quantity':
              if (!$haveOffers) {
                if ($actualItem['CAN_BUY'] && $arParams['USE_PRODUCT_QUANTITY']) {
                  ?>
                  <div class="product-item-info-container product-item-hidden" data-entity="quantity-block">
                    <div class="product-item-amount">
                      <div class="product-item-amount-field-container">
                      <span class="product-item-amount-field-btn-minus no-select"
                            id="<?= $itemIds['QUANTITY_DOWN'] ?>"></span>
                        <div class="product-item-amount-field-block">
                          <input class="product-item-amount-field" id="<?= $itemIds['QUANTITY'] ?>" type="number"
                                 name="<?= $arParams['PRODUCT_QUANTITY_VARIABLE'] ?>" value="<?= $measureRatio ?>">
                          <span class="product-item-amount-description-container">
												<span
                          id="<?= $itemIds['QUANTITY_MEASURE'] ?>"><?= $actualItem['ITEM_MEASURE']['TITLE'] ?></span>
												<span id="<?= $itemIds['PRICE_TOTAL'] ?>"></span>
											</span>
                        </div>
                        <span class="product-item-amount-field-btn-plus no-select"
                              id="<?= $itemIds['QUANTITY_UP'] ?>"></span>
                      </div>
                    </div>
                  </div>
                  <?php
                }
              } elseif ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y') {
                if ($arParams['USE_PRODUCT_QUANTITY']) {
                  ?>
                  <div class="product-item-info-container product-item-hidden" data-entity="quantity-block">
                    <div class="product-item-amount">
                      <div class="product-item-amount-field-container">
                      <span class="product-item-amount-field-btn-minus no-select"
                            id="<?= $itemIds['QUANTITY_DOWN'] ?>"></span>
                        <div class="product-item-amount-field-block">
                          <input class="product-item-amount-field" id="<?= $itemIds['QUANTITY'] ?>" type="number"
                                 name="<?= $arParams['PRODUCT_QUANTITY_VARIABLE'] ?>" value="<?= $measureRatio ?>">
                          <span class="product-item-amount-description-container">
												<span
                          id="<?= $itemIds['QUANTITY_MEASURE'] ?>"><?= $actualItem['ITEM_MEASURE']['TITLE'] ?></span>
												<span id="<?= $itemIds['PRICE_TOTAL'] ?>"></span>
											</span>
                        </div>
                        <span class="product-item-amount-field-btn-plus no-select"
                              id="<?= $itemIds['QUANTITY_UP'] ?>"></span>
                      </div>
                    </div>
                  </div>
                  <?php
                }
              }
              
              break;
            
            
            case 'props':
              if (!$haveOffers) {
                if (!empty($item['DISPLAY_PROPERTIES'])) {
                  ?>
                  <div class="product-item-info-container product-item-hidden" data-entity="props-block">
                    <dl class="product-item-properties">
                      <?php
                        foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty) {
                          ?>
                          <dt
                            class="text-muted<?= (!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' d-none d-sm-block' : '') ?>">
                            <?= $displayProperty['NAME'] ?>
                          </dt>
                          <dd
                            class="text-dark<?= (!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' d-none d-sm-block' : '') ?>">
                            <?= (is_array($displayProperty['DISPLAY_VALUE'])
                              ? implode(' / ', $displayProperty['DISPLAY_VALUE'])
                              : $displayProperty['DISPLAY_VALUE']) ?>
                          </dd>
                          <?php
                        }
                      ?>
                    </dl>
                  </div>
                  <?php
                }
                
                if ($arParams['ADD_PROPERTIES_TO_BASKET'] === 'Y' && !empty($item['PRODUCT_PROPERTIES'])) {
                  ?>
                  <div id="<?= $itemIds['BASKET_PROP_DIV'] ?>" style="display: none;">
                    <?php
                      if (!empty($item['PRODUCT_PROPERTIES_FILL'])) {
                        foreach ($item['PRODUCT_PROPERTIES_FILL'] as $propID => $propInfo) {
                          ?>
                          <input type="hidden" name="<?= $arParams['PRODUCT_PROPS_VARIABLE'] ?>[<?= $propID ?>]"
                                 value="<?= htmlspecialcharsbx($propInfo['ID']) ?>">
                          <?php
                          unset($item['PRODUCT_PROPERTIES'][$propID]);
                        }
                      }
                      
                      if (!empty($item['PRODUCT_PROPERTIES'])) {
                        ?>
                        <table>
                          <?php
                            foreach ($item['PRODUCT_PROPERTIES'] as $propID => $propInfo) {
                              ?>
                              <tr>
                                <td><?= $item['PROPERTIES'][$propID]['NAME'] ?></td>
                                <td>
                                  <?php
                                    if (
                                      $item['PROPERTIES'][$propID]['PROPERTY_TYPE'] === 'L'
                                      && $item['PROPERTIES'][$propID]['LIST_TYPE'] === 'C'
                                    ) {
                                      foreach ($propInfo['VALUES'] as $valueID => $value) {
                                        ?>
                                        <label>
                                          <?php $checked = $valueID === $propInfo['SELECTED'] ? 'checked' : ''; ?>
                                          <input type="radio"
                                                 name="<?= $arParams['PRODUCT_PROPS_VARIABLE'] ?>[<?= $propID ?>]"
                                                 value="<?= $valueID ?>" <?= $checked ?>>
                                          <?= $value ?>
                                        </label>
                                        <br/>
                                        <?php
                                      }
                                    } else {
                                      ?>
                                      <select name="<?= $arParams['PRODUCT_PROPS_VARIABLE'] ?>[<?= $propID ?>]">
                                        <?php
                                          foreach ($propInfo['VALUES'] as $valueID => $value) {
                                            $selected = $valueID === $propInfo['SELECTED'] ? 'selected' : '';
                                            ?>
                                            <option value="<?= $valueID ?>" <?= $selected ?>>
                                              <?= $value ?>
                                            </option>
                                            <?php
                                          }
                                        ?>
                                      </select>
                                      <?php
                                    }
                                  ?>
                                </td>
                              </tr>
                              <?php
                            }
                          ?>
                        </table>
                        <?php
                      }
                    ?>
                  </div>
                  <?php
                }
              } else {
                $showProductProps = !empty($item['DISPLAY_PROPERTIES']);
                $showOfferProps = $arParams['PRODUCT_DISPLAY_MODE'] === 'Y' && $item['OFFERS_PROPS_DISPLAY'];
                
                if ($showProductProps || $showOfferProps) {
                  ?>
                  <div class="product-item-info-container product-item-hidden" data-entity="props-block">
                    <dl class="product-item-properties">
                      <?php
                        if ($showProductProps) {
                          foreach ($item['DISPLAY_PROPERTIES'] as $code => $displayProperty) {
                            ?>
                            <dt
                              class="text-muted<?= (!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' d-none d-sm-block' : '') ?>">
                              <?= $displayProperty['NAME'] ?>
                            </dt>
                            <dd
                              class="text-dark<?= (!isset($item['PROPERTY_CODE_MOBILE'][$code]) ? ' d-none d-sm-block' : '') ?>">
                              <?= (is_array($displayProperty['DISPLAY_VALUE'])
                                ? implode(' / ', $displayProperty['DISPLAY_VALUE'])
                                : $displayProperty['DISPLAY_VALUE']) ?>
                            </dd>
                            <?php
                          }
                        }
                        
                        if ($showOfferProps) {
                          ?>
                          <span id="<?= $itemIds['DISPLAY_PROP_DIV'] ?>" style="display: none;"></span>
                          <?php
                        }
                      ?>
                    </dl>
                  </div>
                  <?php
                }
              }
              
              break;
            
            case 'sku':
              if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y' && $haveOffers && !empty($item['OFFERS_PROP'])) {
                ?>
                <div class="product-item-info-container product-item-hidden" id="<?= $itemIds['PROP_DIV'] ?>">
                  <?php
                    foreach ($arParams['SKU_PROPS'] as $skuProperty) {
                      $propertyId = $skuProperty['ID'];
                      $skuProperty['NAME'] = htmlspecialcharsbx($skuProperty['NAME']);
                      if (!isset($item['SKU_TREE_VALUES'][$propertyId]))
                        continue;
                      ?>
                      <div data-entity="sku-block">
                        <div class="product-item-scu-container" data-entity="sku-line-block">
                          <div class="product-item-scu-block-title text-muted"><?= $skuProperty['NAME'] ?></div>
                          <div class="product-item-scu-block">
                            <div class="product-item-scu-list">
                              
                              <ul class="product-item-scu-item-list">
                                <?php
                                  foreach ($skuProperty['VALUES'] as $value) {
                                    if (!isset($item['SKU_TREE_VALUES'][$propertyId][$value['ID']]))
                                      continue;
                                    
                                    $value['NAME'] = htmlspecialcharsbx($value['NAME']);
                                    
                                    if ($skuProperty['SHOW_MODE'] === 'PICT') {
                                      ?>
                                      <li class="product-item-scu-item-color-container" title="<?= $value['NAME'] ?>"
                                          data-treevalue="<?= $propertyId ?>_<?= $value['ID'] ?>"
                                          data-onevalue="<?= $value['ID'] ?>">
                                        <div class="product-item-scu-item-color-block">
                                          <div class="product-item-scu-item-color" title="<?= $value['NAME'] ?>"
                                               style="background-image: url('<?= $value['PICT']['SRC'] ?>');"></div>
                                        </div>
                                      </li>
                                      <?php
                                    } else {
                                      ?>
                                      <li class="product-item-scu-item-text-container" title="<?= $value['NAME'] ?>"
                                          data-treevalue="<?= $propertyId ?>_<?= $value['ID'] ?>"
                                          data-onevalue="<?= $value['ID'] ?>">
                                        <div class="product-item-scu-item-text-block">
                                          <div class="product-item-scu-item-text"><?= $value['NAME'] ?></div>
                                        </div>
                                      </li>
                                      <?php
                                    }
                                  }
                                ?>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <?php
                    }
                  ?>
                </div>
                <?php
                foreach ($arParams['SKU_PROPS'] as $skuProperty) {
                  if (!isset($item['OFFERS_PROP'][$skuProperty['CODE']]))
                    continue;
                  
                  $skuProps[] = array(
                    'ID' => $skuProperty['ID'],
                    'SHOW_MODE' => $skuProperty['SHOW_MODE'],
                    'VALUES' => $skuProperty['VALUES'],
                    'VALUES_COUNT' => $skuProperty['VALUES_COUNT']
                  );
                }
                
                unset($skuProperty, $value);
                
                if ($item['OFFERS_PROPS_DISPLAY']) {
                  foreach ($item['JS_OFFERS'] as $keyOffer => $jsOffer) {
                    $strProps = '';
                    
                    if (!empty($jsOffer['DISPLAY_PROPERTIES'])) {
                      foreach ($jsOffer['DISPLAY_PROPERTIES'] as $displayProperty) {
                        $strProps .= '<dt>' . $displayProperty['NAME'] . '</dt><dd>'
                          . (is_array($displayProperty['VALUE'])
                            ? implode(' / ', $displayProperty['VALUE'])
                            : $displayProperty['VALUE'])
                          . '</dd>';
                      }
                    }
                    
                    $item['JS_OFFERS'][$keyOffer]['DISPLAY_PROPERTIES'] = $strProps;
                  }
                  unset($jsOffer, $strProps);
                }
              }
              
              break;
          }
        }
      }
      
      if (
        $arParams['DISPLAY_COMPARE']
        && (!$haveOffers || $arParams['PRODUCT_DISPLAY_MODE'] === 'Y')
      ) {
        ?>
        <div class="product-item-compare-container">
          <div class="product-item-compare">
            <div class="checkbox">
              <label id="<?= $itemIds['COMPARE_LINK'] ?>">
                <input type="checkbox" data-entity="compare-checkbox">
                <span data-entity="compare-title"><?= $arParams['MESS_BTN_COMPARE'] ?></span>
              </label>
            </div>
          </div>
        </div>
        <?php
      } ?>
  </div>
  <div>
  <?php
    if (!empty($arParams['PRODUCT_BLOCKS_ORDER'])) {
      
      foreach ($arParams['PRODUCT_BLOCKS_ORDER'] as $blockName) {
        switch ($blockName) {
          case 'price': ?>
            <div class="product-item-info-container product-item-price-container" data-entity="price-block">
              <?php
                if ($arParams['SHOW_OLD_PRICE'] === 'Y') {
                  ?>
                  <span class="product-item-price-old" id="<?= $itemIds['PRICE_OLD'] ?>"
								<?= ($price['RATIO_PRICE'] >= $price['RATIO_BASE_PRICE'] ? 'style="display: none;"' : '') ?>>
								<?= $price['PRINT_RATIO_BASE_PRICE'] ?>
							</span>&nbsp;
                  <?php
                }
              ?>
              <span class="product-item-price-current" id="<?= $itemIds['PRICE'] ?>">
							<?php
                if (!empty($price)) {
                  if ($arParams['PRODUCT_DISPLAY_MODE'] === 'N' && $haveOffers) {
                    echo Loc::getMessage(
                      'CT_BCI_TPL_MESS_PRICE_SIMPLE_MODE',
                      array(
                        '#PRICE#' => $price['PRINT_RATIO_PRICE'],
                        '#VALUE#' => $measureRatio,
                        '#UNIT#' => $minOffer['ITEM_MEASURE']['TITLE']
                      )
                    );
                  } else {
                    echo $price['PRINT_RATIO_PRICE'];
                  }
                }
              ?>
						</span>
            </div>
            <?php
            break;
          case 'quantityLimit':
            
            if ($arParams['SHOW_MAX_QUANTITY'] !== 'N') {
              if ($haveOffers) {
                if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y') {
                  ?>
                  <div class="product-item-info-container product-item-hidden"
                       id="<?= $itemIds['QUANTITY_LIMIT'] ?>"
                       style="display: none;"
                       data-entity="quantity-limit-block">
                    <div class="product-item-info-container-title text-muted">
                      <?= $arParams['MESS_SHOW_MAX_QUANTITY'] ?>:
                      <span class="product-item-quantity text-dark" data-entity="quantity-limit-value"></span>
                    </div>
                  </div>
                  <?php
                }
              } else {
                if (
                  $measureRatio
                  && (float)$actualItem['CATALOG_QUANTITY'] > 0
                  && $actualItem['CATALOG_QUANTITY_TRACE'] === 'Y'
                  && $actualItem['CATALOG_CAN_BUY_ZERO'] === 'N'
                ) {
                  ?>
                  <div class="product-item-info-container product-item-hidden" id="<?= $itemIds['QUANTITY_LIMIT'] ?>">
                    <div class="product-item-info-container-title text-muted">
                      <?= $arParams['MESS_SHOW_MAX_QUANTITY'] ?>:
                      <span class="product-item-quantity text-dark" data-entity="quantity-limit-value">
												<?php
                          if ($arParams['SHOW_MAX_QUANTITY'] === 'M') {
                            if ((float)$actualItem['CATALOG_QUANTITY'] / $measureRatio >= $arParams['RELATIVE_QUANTITY_FACTOR']) {
                              echo $arParams['MESS_RELATIVE_QUANTITY_MANY'];
                            } else {
                              echo $arParams['MESS_RELATIVE_QUANTITY_FEW'];
                            }
                          } else {
                            echo $actualItem['CATALOG_QUANTITY'] . ' ' . $actualItem['ITEM_MEASURE']['TITLE'];
                          }
                        ?>
											</span>
                    </div>
                  </div>
                  <?php
                }
              }
            }
            
            if ((int)$actualItem['CATALOG_QUANTITY']) :
              ?>
              <div class="r-product-quantity">
              <?php
              echo "В наличии " . $actualItem['CATALOG_QUANTITY'] . ' ' . $actualItem['ITEM_MEASURE']['TITLE'];
              ?></div><?php
            else :  ?>
              <div class="r-product-quantity" style="color: red;">Нет в наличии</div>
            <?php endif;
            
            break;
          case 'buttons':
            ?>
            <div class="product-item-info-container k1-buttons-block" style="margin-top: 20px;" data-entity="buttons-block">
              <div class="btn-detail-wrap" style="">
                <?php
                  if (!$haveOffers) {
                    if ($actualItem['CAN_BUY']) {
                      ?>
                      <div class="product-item-button-container" id="<?= $itemIds['BASKET_ACTIONS'] ?>">
                        <button class="r-button <?= $inBasket ? "r-button-disabled" : "" ?>"
                                id="<?= $itemIds['BUY_LINK'] ?>"
                                href="javascript:void(0)" rel="nofollow">
                          
                          <?= $inBasket ? "В корзине" : "В корзину" ?>
                        </button>
                        <?php global $USER; if ($USER->IsAdmin()) : ?>
                          <div class="k-element-count <?= $inBasket ? "added" : "" ?>"
                               data-k-id="<?= $item["ID"]?>"
                               data-k-max="<?= $item["CATALOG_QUANTITY"]?>"
                          >
                            <table>
                              <tbody>
                              <tr>
                                <td class="left minus k-count-minus">
                                  <div></div>
                                </td>
                                <td class="center">
                                  <input name="count-cart" type="text" value="<?= $inBasketQuantity?>" class="k-count-val">
                                </td>
                                <td class="right plus k-count-plus <?= $inBasketQuantity >= $item["CATALOG_QUANTITY"]
                                ? "disabled" : "" ?>">
                                  <div>
                                  </div>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        <?php endif; ?>
                      </div>
                      <?php
                    } else {
                      ?>
                      <div class="product-item-button-container">
                        <?php
                          if ($showSubscribe) {
                            $APPLICATION->IncludeComponent(
                              'bitrix:catalog.product.subscribe',
                              '',
                              array(
                                'PRODUCT_ID' => $actualItem['ID'],
                                'BUTTON_ID' => $itemIds['SUBSCRIBE_LINK'],
                                'BUTTON_CLASS' => 'btn btn-primary ' . $buttonSizeClass,
                                'DEFAULT_DISPLAY' => true,
                                'MESS_BTN_SUBSCRIBE' => $arParams['~MESS_BTN_SUBSCRIBE'],
                              ),
                              $component,
                              array('HIDE_ICONS' => 'Y')
                            );
                          }
                        ?>
                        <a class="link-def k1-test" style="font-size: 14px;" href="<?= $item["DETAIL_PAGE_URL"] ?>"
                           id="<?= $itemIds["BTN2DETAIL"] ?>">
                          <i class="ic-style fa fa-info" aria-hidden="true"></i><span
                            class="bord-bot">Узнать больше</span>
                        </a>
                        <div class="r-button" style="opacity: 0;pointer-events: none">stub</div>
                      </div>
                      <?php
                    }
                  } else {
                    if ($arParams['PRODUCT_DISPLAY_MODE'] === 'Y') {
                      ?>
                      <div class="product-item-button-container">
                        <?php
                          if ($showSubscribe) {
                            $APPLICATION->IncludeComponent(
                              'bitrix:catalog.product.subscribe',
                              '',
                              array(
                                'PRODUCT_ID' => $item['ID'],
                                'BUTTON_ID' => $itemIds['SUBSCRIBE_LINK'],
                                'BUTTON_CLASS' => 'btn btn-primary ' . $buttonSizeClass,
                                'DEFAULT_DISPLAY' => !$actualItem['CAN_BUY'],
                                'MESS_BTN_SUBSCRIBE' => $arParams['~MESS_BTN_SUBSCRIBE'],
                              ),
                              $component,
                              array('HIDE_ICONS' => 'Y')
                            );
                          }
                        ?>
                        <button class=" button-def main-color elips <?= $buttonSizeClass ?>"
                                id="<?= $itemIds['NOT_AVAILABLE_MESS'] ?>" href="javascript:void(0)" rel="nofollow"
                          <?= ($actualItem['CAN_BUY'] ? 'style="display: none;"' : '') ?>>
                          <?= $arParams['MESS_NOT_AVAILABLE'] ?>
                        </button>
                        <div
                          id="<?= $itemIds['BASKET_ACTIONS'] ?>" <?= ($actualItem['CAN_BUY'] ? '' : 'style="display: none;"') ?>>
                          <button class=" button-def main-color elips <?= $buttonSizeClass ?>" id="<?=
                            $itemIds['BUY_LINK'] ?>"
                                  href="javascript:void(0)" rel="nofollow">
                            <?= ($arParams['ADD_TO_BASKET_ACTION'] === 'BUY' ? $arParams['MESS_BTN_BUY'] : $arParams['MESS_BTN_ADD_TO_BASKET']) ?>
                          </button>
                        </div>
                        <div style="margin-top: 15px;">
                          <a class="link-def" style="font-size: 14px;" href="<?= $item["DETAIL_PAGE_URL"] ?>"
                             id="<?= $itemIds["BTN2DETAIL"] ?>">
                            <i class="ic-style fa fa-info" aria-hidden="true"></i><span
                              class="bord-bot">Узнать больше</span>
                          </a>
                        </div>
                      </div>
                      <?php
                    } else {
                      ?>
                      <div class="product-item-button-container">
                        <a class="btn btn-primary button-def main-color elips<?= $buttonSizeClass ?>"
                           href="<?= $item['DETAIL_PAGE_URL'] ?>">
                          <?= $arParams['MESS_BTN_DETAIL'] ?>
                        </a>
                      </div>
                      <div style="margin-top: 15px;">
                        <a class="link-def" style="font-size: 14px;" href="<?= $item["DETAIL_PAGE_URL"] ?>"
                           id="<?= $itemIds["BTN2DETAIL"] ?>">
                          <i class="ic-style fa fa-info" aria-hidden="true"></i><span
                            class="bord-bot">Узнать больше</span>
                        </a>
                      </div>
                      <?php
                    }
                  }
                ?>
              </div>
            </div>
            <?php
            break;
        }
      }
    }
  ?>
  </div>
</div>





















