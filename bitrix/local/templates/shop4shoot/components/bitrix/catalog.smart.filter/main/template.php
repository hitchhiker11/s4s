<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);

global $KRAKEN_TEMPLATE_ARRAY;
CKraken::getHIBlockOptions();


?>

<?if($arResult["SHOW_FILTER"]):?>

<?CKraken::getMess(array("catalog"))?>

	<div class="section-with-hidden-items">

		<div class="btn-click click-animate-slide-down active noactive-mob filter-icon" data-show =
    "<?=$arParams["DATA_SHOW"]?>"><?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CATALOG_FILTER_TAB"]?><i class="down  concept-down-open-mini"></i><i class="up concept-up-open-mini"></i></div>

		

		<div class="body content-animate-slide-down active noactive-mob" data-show = "<?=$arParams["DATA_SHOW"]?>"
         style='display:block'>

			<div class="hidden-lg hidden-md head-filter" data-show = "<?=$arParams["DATA_SHOW"]?>"><?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CATALOG_FILTER_TAB"]?><a class="close"></a></div>

			<div class="bx-filter">
				<div class="bx-filter-section">

					<form name="<?echo $arResult["FILTER_NAME"]."_form"?>" action="<?echo $arResult["FORM_ACTION"]?>" method="get" class="smartfilter">

						<?if(!empty($arResult["HIDDEN"])):?>
						<?foreach($arResult["HIDDEN"] as $arItem):?>

							<input type="hidden" name="<?echo $arItem["CONTROL_NAME"]?>" id="<?echo $arItem["CONTROL_ID"]?>" value="<?echo $arItem["HTML_VALUE"]?>" />

						<?endforeach;?>
						<?endif;?>

						

						<?if(!empty($arResult["ITEMS"])):?>
							<?foreach($arResult["ITEMS"] as $key=>$arItem)//prices
							{
								$key = $arItem["ENCODED_ID"];
								if(isset($arItem["PRICE"])):
									if ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0)
										continue;

									$step_num = 4;
									$step = ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"]) / $step_num;
									$prices = array();
									if (Bitrix\Main\Loader::includeModule("currency"))
									{
										for ($i = 0; $i < $step_num; $i++)
										{
											$prices[$i] = CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MIN"]["VALUE"] + $step*$i, $arItem["VALUES"]["MIN"]["CURRENCY"], false);
										}
										$prices[$step_num] = CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MAX"]["VALUE"], $arItem["VALUES"]["MAX"]["CURRENCY"], false);
									}
									else
									{
										$precision = $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0;
										for ($i = 0; $i < $step_num; $i++)
										{
											$prices[$i] = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step*$i, $precision, ".", "");
										}
										$prices[$step_num] = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", "");
									}
									?>
									<div class="bx-filter-parameters-box bx-active">

										<span class="bx-filter-container-modef"></span>

										<div class="bx-filter-parameters-box-title" onclick="smartFilter.hideFilterProps(this)"><span>
											<span class="bold"><?=$arItem["NAME"]?></span> <i data-role="prop_angle" class="arrow-toogle fa fa-angle-<?if ($arItem["DISPLAY_EXPANDED"]== "Y"):?>down<?else:?>up<?endif?>"></i></span>
										</div>

										<div class="bx-filter-block" data-role="bx_filter_block">
											<div class="row bx-filter-parameters-box-container">
												<div class="col-xs-6 bx-filter-parameters-box-container-block bx-left">
													
													<div class="bx-filter-input-container">
														<input
															class="min-price"
															type="text"
															name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>"
															id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>"
															value="<?echo $arItem["VALUES"]["MIN"]["HTML_VALUE"]?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
															placeholder = "<?echo CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MIN"]["VALUE"], $arItem["VALUES"]["MIN"]["CURRENCY"], false)?>"
														/>
														<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_FROM")?></i>
													</div>
												</div>
												<div class="col-xs-6 bx-filter-parameters-box-container-block bx-right">
													
													<div class="bx-filter-input-container">
														<input
															class="max-price"
															type="text"
															name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>"
															id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>"
															value="<?echo $arItem["VALUES"]["MAX"]["HTML_VALUE"]?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
															placeholder = "<?echo CCurrencyLang::CurrencyFormat($arItem["VALUES"]["MAX"]["VALUE"], $arItem["VALUES"]["MAX"]["CURRENCY"], false)?>"
														/>
														<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_TO")?></i>
													</div>
												</div>

												<div class="col-xs-12 bx-ui-slider-track-container">
													<div class="row justify-content-between">
														<div class="col-xs-6 bx-ui-slider-part left"><span><?=$prices[0]?></span></div>
														<div class="col-xs-6 bx-ui-slider-part right"><span><?=$prices[$step_num]?></span></div>
													</div>

													<div class="bx-ui-slider-track" id="drag_track_<?=$key?>">
														

														<div class="bx-ui-slider-pricebar-vd" style="left: 0;right: 0;" id="colorUnavailableActive_<?=$key?>"></div>
														<div class="bx-ui-slider-pricebar-vn" style="left: 0;right: 0;" id="colorAvailableInactive_<?=$key?>"></div>
														<div class="bx-ui-slider-pricebar-v"  style="left: 0;right: 0;" id="colorAvailableActive_<?=$key?>"></div>
														<div class="bx-ui-slider-range" id="drag_tracker_<?=$key?>"  style="left: 0%; right: 0%;">
															<a class="bx-ui-slider-handle left"  style="left:0;" href="javascript:void(0)" id="left_slider_<?=$key?>"></a>
															<a class="bx-ui-slider-handle right" style="right:0;" href="javascript:void(0)" id="right_slider_<?=$key?>"></a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<?
									$arJsParams = array(
										"leftSlider" => 'left_slider_'.$key,
										"rightSlider" => 'right_slider_'.$key,
										"tracker" => "drag_tracker_".$key,
										"trackerWrap" => "drag_track_".$key,
										"minInputId" => $arItem["VALUES"]["MIN"]["CONTROL_ID"],
										"maxInputId" => $arItem["VALUES"]["MAX"]["CONTROL_ID"],
										"minPrice" => $arItem["VALUES"]["MIN"]["VALUE"],
										"maxPrice" => $arItem["VALUES"]["MAX"]["VALUE"],
										"curMinPrice" => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
										"curMaxPrice" => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
										"fltMinPrice" => intval($arItem["VALUES"]["MIN"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MIN"]["FILTERED_VALUE"] : $arItem["VALUES"]["MIN"]["VALUE"] ,
										"fltMaxPrice" => intval($arItem["VALUES"]["MAX"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MAX"]["FILTERED_VALUE"] : $arItem["VALUES"]["MAX"]["VALUE"],
										"precision" => $precision,
										"colorUnavailableActive" => 'colorUnavailableActive_'.$key,
										"colorAvailableActive" => 'colorAvailableActive_'.$key,
										"colorAvailableInactive" => 'colorAvailableInactive_'.$key,
									);
									?>
									<script type="text/javascript">
										BX.ready(function(){
											window['trackBar<?=$key?>'] = new BX.Iblock.SmartFilter(<?=CUtil::PhpToJSObject($arJsParams)?>);
										});
									</script>
								<?endif;
							}

							//not prices

							

							foreach($arResult["ITEMS"] as $key=>$arItem)
							{
								if(
									empty($arItem["VALUES"])
									|| isset($arItem["PRICE"])
								)
									continue;

								if (
									$arItem["DISPLAY_TYPE"] == "A"
									&& (
										$arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0
									)
								)
									continue;
								
								?>
								<div class="bx-filter-parameters-box <?if ($arItem["DISPLAY_EXPANDED"]== "Y"):?>bx-active<?endif?>">
									<span class="bx-filter-container-modef"></span>
									<div class="bx-filter-parameters-box-title" onclick="smartFilter.hideFilterProps(this)">




										<span class="bold"><?=$arItem["NAME"]?></span>
										<?if ($arItem["FILTER_HINT"] <> ""):?>
											<i class="hint-filter fa fa-question-circle" data-toggle="tooltip" data-placement="bottom" title="" data-original-title='<?= CKraken::prepareText($arItem["FILTER_HINT"])?>'></i>

											<?/*<i id="item_title_hint_<?echo $arItem["ID"]?>" class="fa fa-question-circle"></i>
											<script type="text/javascript">
												new top.BX.CHint({
													parent: top.BX("item_title_hint_<?echo $arItem["ID"]?>"),
													show_timeout: 10,
													hide_timeout: 200,
													dx: 2,
													preventHide: true,
													min_width: 250,
													hint: '<?= CUtil::JSEscape($arItem["FILTER_HINT"])?>'
												});
											</script>*/?>
										<?endif?>
											
										<i data-role="prop_angle" class="arrow-toogle fa fa-angle-<?if ($arItem["DISPLAY_EXPANDED"]== "Y"):?>up<?else:?>down<?endif?>"></i>
									</div>



									<div class="bx-filter-block" data-role="bx_filter_block">
										<div class="row bx-filter-parameters-box-container">
										<?
										
										$arCur = current($arItem["VALUES"]);
										switch ($arItem["DISPLAY_TYPE"])
										{
											case "A"://NUMBERS_WITH_SLIDER

												$precision = $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0;
												$min_val_formated = number_format($arItem["VALUES"]["MIN"]["VALUE"], $precision, ".", " ");
												$max_val_formated = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", " ");
												?>
												<div class="col-xs-6 bx-filter-parameters-box-container-block bx-left">
													
													<div class="bx-filter-input-container">
														<input
															class="min-price"
															type="text"
															name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>"
															id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>"
															value="<?echo $arItem["VALUES"]["MIN"]["HTML_VALUE"]?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
															placeholder = "<?echo $min_val_formated?>"
														/>
														<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_FROM")?></i>
													</div>
												</div>
												<div class="col-xs-6 bx-filter-parameters-box-container-block bx-right">
													
													<div class="bx-filter-input-container">
														<input
															class="max-price"
															type="text"
															name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>"
															id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>"
															value="<?echo $arItem["VALUES"]["MAX"]["HTML_VALUE"]?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
															placeholder = "<?echo $max_val_formated?>"
														/>
														<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_TO")?></i>
													</div>
												</div>

												<div class="col-xs-12 bx-ui-slider-track-container">
													<?
														
														$step = ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"]) / 4;
														$value1 = number_format($arItem["VALUES"]["MIN"]["VALUE"], $precision, ".", "");
														$value2 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step, $precision, ".", "");
														$value3 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * 2, $precision, ".", "");
														$value4 = number_format($arItem["VALUES"]["MIN"]["VALUE"] + $step * 3, $precision, ".", "");
														$value5 = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", "");
													?>

													<div class="row justify-content-between">
														<div class="col-xs-6 bx-ui-slider-part left"><span><?=$value1?></span></div>
														<div class="col-xs-6 bx-ui-slider-part right"><span><?=$value5?></span></div>
													</div>

													<div class="bx-ui-slider-track" id="drag_track_<?=$key?>">
														

														<div class="bx-ui-slider-pricebar-vd" style="left: 0;right: 0;" id="colorUnavailableActive_<?=$key?>"></div>
														<div class="bx-ui-slider-pricebar-vn" style="left: 0;right: 0;" id="colorAvailableInactive_<?=$key?>"></div>
														<div class="bx-ui-slider-pricebar-v"  style="left: 0;right: 0;" id="colorAvailableActive_<?=$key?>"></div>
														<div class="bx-ui-slider-range" 	id="drag_tracker_<?=$key?>"  style="left: 0;right: 0;">
															<a class="bx-ui-slider-handle left"  style="left:0;" href="javascript:void(0)" id="left_slider_<?=$key?>"></a>
															<a class="bx-ui-slider-handle right" style="right:0;" href="javascript:void(0)" id="right_slider_<?=$key?>"></a>
														</div>
													</div>
												</div>
												<?
												$arJsParams = array(
													"leftSlider" => 'left_slider_'.$key,
													"rightSlider" => 'right_slider_'.$key,
													"tracker" => "drag_tracker_".$key,
													"trackerWrap" => "drag_track_".$key,
													"minInputId" => $arItem["VALUES"]["MIN"]["CONTROL_ID"],
													"maxInputId" => $arItem["VALUES"]["MAX"]["CONTROL_ID"],
													"minPrice" => $arItem["VALUES"]["MIN"]["VALUE"],
													"maxPrice" => $arItem["VALUES"]["MAX"]["VALUE"],
													"curMinPrice" => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
													"curMaxPrice" => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
													"fltMinPrice" => intval($arItem["VALUES"]["MIN"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MIN"]["FILTERED_VALUE"] : $arItem["VALUES"]["MIN"]["VALUE"] ,
													"fltMaxPrice" => intval($arItem["VALUES"]["MAX"]["FILTERED_VALUE"]) ? $arItem["VALUES"]["MAX"]["FILTERED_VALUE"] : $arItem["VALUES"]["MAX"]["VALUE"],
													"precision" => $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0,
													"colorUnavailableActive" => 'colorUnavailableActive_'.$key,
													"colorAvailableActive" => 'colorAvailableActive_'.$key,
													"colorAvailableInactive" => 'colorAvailableInactive_'.$key,
												);
												?>
												<script type="text/javascript">
													BX.ready(function(){
														window['trackBar<?=$key?>'] = new BX.Iblock.SmartFilter(<?=CUtil::PhpToJSObject($arJsParams)?>);
													});
												</script>
												<?
												break;
											case "B"://NUMBERS
												$precision = $arItem["DECIMALS"]? $arItem["DECIMALS"]: 0;
												$min_val_formated = number_format($arItem["VALUES"]["MIN"]["VALUE"], $precision, ".", " ");
												$max_val_formated = number_format($arItem["VALUES"]["MAX"]["VALUE"], $precision, ".", " ");
												?>
												<div class="col-xs-6 bx-filter-parameters-box-container-block bx-left">
													
													<div class="bx-filter-input-container">
														<input
															class="min-price"
															type="text"
															name="<?echo $arItem["VALUES"]["MIN"]["CONTROL_NAME"]?>"
															id="<?echo $arItem["VALUES"]["MIN"]["CONTROL_ID"]?>"
															value="<?echo $arItem["VALUES"]["MIN"]["HTML_VALUE"]?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
															placeholder = "<?=$min_val_formated?>"
															/>
															<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_FROM")?></i>
													</div>
												</div>
												<div class="col-xs-6 bx-filter-parameters-box-container-block bx-right">
													
													<div class="bx-filter-input-container">
														<input
															class="max-price"
															type="text"
															name="<?echo $arItem["VALUES"]["MAX"]["CONTROL_NAME"]?>"
															id="<?echo $arItem["VALUES"]["MAX"]["CONTROL_ID"]?>"
															value="<?echo $arItem["VALUES"]["MAX"]["HTML_VALUE"]?>"
															size="5"
															onkeyup="smartFilter.keyup(this)"
															placeholder = "<?=$max_val_formated?>"
															/>
														<i class="bx-ft-sub"><?=GetMessage("CT_BCSF_FILTER_TO")?></i>
													</div>
												</div>
												<?
												break;
											case "G"://CHECKBOXES_WITH_PICTURES
												?>

												<?
													$arCurrentHIBlock = array();
													if($arItem["USER_TYPE"] && !empty($arItem["USER_TYPE_SETTINGS"]))
													{
														if(!empty($KRAKEN_TEMPLATE_ARRAY["SKU_PROP_LIST"]))
														{
															foreach ($KRAKEN_TEMPLATE_ARRAY["SKU_PROP_LIST"] as $itemSKU) {
																if($arItem["USER_TYPE_SETTINGS"]["TABLE_NAME"] == $itemSKU["TABLE_NAME"])
																{
																	$arCurrentHIBlock = $itemSKU;
																}
															}
														}
													}


												?>

												<div class="col-xs-12">
													<div class="checkbox-with-pic">

														<?if(!empty($arItem["VALUES"])):?>
														<?foreach ($arItem["VALUES"] as $val => $ar):?><?
																$currentValues = array();
																$styleTab = "";

																if(!empty($arCurrentHIBlock["VALUES"]))
																{
																	foreach ($arCurrentHIBlock["VALUES"] as $HIkey => $HIValue)
																	{
																		if($ar["URL_ID"] == strtolower($HIkey))
																			$currentValues = $HIValue;
																	}
																}


																if(isset($currentValues["PICT"]) || isset($currentValues["PICT_SEC"]) )
				                                                {
				                                                    if(isset($currentValues["PICT_SEC"]))
				                                                    {
				                                                        if(isset($currentValues["PICT"]))
				                                                            $styleTab .= "background-image: url('".$currentValues['PICT']['SMALL']."'); ";
				                                                        else
				                                                            $styleTab .= "background-image: url('".$currentValues['PICT_SEC']['SMALL']."'); ";
				                                                    }

				                                                    else if(isset($currentValues["PICT"]))
				                                                    {
				                                                        $styleTab .= "background-image: url('".$currentValues['PICT']['SMALL']."'); ";
				                                                    }
				                                                }

				                                                if($currentValues["COLOR"])
				                                                    $styleTab .= "background-color:".$currentValues["COLOR"]."; ";
			                                                

																$class = "";
																if ($ar["CHECKED"])
																	$class.= " bx-active";
																if ($ar["DISABLED"])
																	$class.= " disabled";
															?><label for="<?=$ar["CONTROL_ID"]?>" data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label <?=$class?>" onclick="smartFilter.click(BX('<?=CUtil::JSEscape($ar["CONTROL_ID"])?>'));" title = "<?=CKraken::prepareText($ar["VALUE"])?>">

																<input
																	style="display: none"
																	type="checkbox"
																	name="<?=$ar["CONTROL_NAME"]?>"
																	id="<?=$ar["CONTROL_ID"]?>"
																	value="<?=$ar["HTML_VALUE"]?>"
																	<?= $ar["CHECKED"]? 'checked="checked"': '' ?>
																	<?= $ar["DISABLED"]? 'disabled="disabled"': '' ?>
																/>
																<span class="active-flag"></span>
																<div class="bx-filter-btn-color-icon" style="<?=$styleTab?>"></div>
																<span class="disabled-flag"></span>

															</label><?endforeach?>
														<?endif;?>
													</div>
												</div>
												<?
												break;
											case "H"://CHECKBOXES_WITH_PICTURES_AND_LABELS
												?>

												<?
													$arCurrentHIBlock = array();
													if($arItem["USER_TYPE"] && !empty($arItem["USER_TYPE_SETTINGS"]))
													{
														if(!empty($KRAKEN_TEMPLATE_ARRAY["SKU_PROP_LIST"]))
														{
															foreach ($KRAKEN_TEMPLATE_ARRAY["SKU_PROP_LIST"] as $itemSKU) {
																if($arItem["USER_TYPE_SETTINGS"]["TABLE_NAME"] == $itemSKU["TABLE_NAME"])
																{
																	$arCurrentHIBlock = $itemSKU;
																}
															}
														}
													}


												?>
													
													<div class="col-xs-12">
														<div class="checkbox-with-pic">

															<?if(!empty($arItem["VALUES"])):?>

															<?foreach ($arItem["VALUES"] as $val => $ar):?>

																<?
																	$currentValues = array();
																	$styleTab = "";
																	if(!empty($arCurrentHIBlock["VALUES"]))
																	{

																		foreach ($arCurrentHIBlock["VALUES"] as $HIValue)
																		{
																			if($ar["URL_ID"] == strtolower($HIValue["XML_ID"]))
																				$currentValues = $HIValue;
																		}

																	}


																	if(isset($currentValues["PICT"]) || isset($currentValues["PICT_SEC"]) )
					                                                {
					                                                    if(isset($currentValues["PICT_SEC"]))
					                                                    {
					                                                        if(isset($currentValues["PICT"]))
					                                                            $styleTab .= "background-image: url('".$currentValues['PICT']['SMALL']."'); ";
					                                                        else
					                                                            $styleTab .= "background-image: url('".$currentValues['PICT_SEC']['SMALL']."'); ";
					                                                    }

					                                                    else if(isset($currentValues["PICT"]))
					                                                    {
					                                                        $styleTab .= "background-image: url('".$currentValues['PICT']['SMALL']."'); ";
					                                                    }
					                                                }

					                                                if($currentValues["COLOR"])
					                                                    $styleTab .= "background-color:".$currentValues["COLOR"]."; ";
					                                                
																
																	$class = "";
																	if ($ar["CHECKED"])
																		$class.= " bx-active";
																	if ($ar["DISABLED"])
																		$class.= " disabled";
																?>

																<label for="<?=$ar["CONTROL_ID"]?>" data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label <?=$class?>" onclick="smartFilter.click(BX('<?=CUtil::JSEscape($ar["CONTROL_ID"])?>'));" title = "<?=CKraken::prepareText($ar["VALUE"])?>">
																	<input
																		style="display: none"
																		type="checkbox"
																		name="<?=$ar["CONTROL_NAME"]?>"
																		id="<?=$ar["CONTROL_ID"]?>"
																		value="<?=$ar["HTML_VALUE"]?>"
																		<?= $ar["CHECKED"]? 'checked="checked"': '' ?>
																		<?= $ar["DISABLED"]? 'disabled="disabled"': '' ?>
																	/>
																	<span class="active-flag"></span>
																	<div class="bx-filter-btn-color-icon" style="<?=$styleTab?>"></div>
																	<span class="disabled-flag"></span>
																</label>
																
															<?endforeach?>
															<?endif;?>
														</div>
													</div>
												<?
												break;
											case "P"://DROPDOWN
												$checkedItemExist = false;
												?>
												<div class="col-xs-12">
													<div class="bx-filter-select-container">
														<div class="bx-filter-select-block" onclick="smartFilter.showDropDownPopup(this, '<?=CUtil::JSEscape($key)?>')">
															<div class="bx-filter-select-text" data-role="currentOption">
																<?
																foreach ($arItem["VALUES"] as $val => $ar)
																{
																	if ($ar["CHECKED"])
																	{
																		echo $ar["VALUE"];
																		$checkedItemExist = true;
																	}
																}
																if (!$checkedItemExist)
																{
																	echo GetMessage("CT_BCSF_FILTER_ALL");
																}
																?>
															</div>
															<div class="bx-filter-select-arrow"></div>
															<input
																style="display: none"
																type="radio"
																name="<?=$arCur["CONTROL_NAME_ALT"]?>"
																id="<? echo "all_".$arCur["CONTROL_ID"] ?>"
																value=""
															/>
															<?foreach ($arItem["VALUES"] as $val => $ar):?>
																<input
																	style="display: none"
																	type="radio"
																	name="<?=$ar["CONTROL_NAME_ALT"]?>"
																	id="<?=$ar["CONTROL_ID"]?>"
																	value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																	<?= $ar["CHECKED"]? 'checked="checked"': '' ?>
																	<?= $ar["DISABLED"]? 'disabled="disabled"': '' ?>
																/>
															<?endforeach?>
															<div class="bx-filter-select-popup" data-role="dropdownContent" style="display: none;">
																<ul>
																	<li>
																		<label for="<?="all_".$arCur["CONTROL_ID"]?>" class="bx-filter-param-label" data-role="label_<?="all_".$arCur["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape("all_".$arCur["CONTROL_ID"])?>')">
																			<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																		</label>
																	</li>
																<?
																foreach ($arItem["VALUES"] as $val => $ar):
																	$class = "";
																	if ($ar["CHECKED"])
																		$class.= " selected";
																	if ($ar["DISABLED"])
																		$class.= " disabled";
																?>
																	<li>
																		<label for="<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label<?=$class?>" data-role="label_<?=$ar["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape($ar["CONTROL_ID"])?>')"><?=$ar["VALUE"]?></label>
																	</li>
																<?endforeach?>
																</ul>
															</div>
														</div>
													</div>
												</div>
												<?
												break;
											case "R"://DROPDOWN_WITH_PICTURES_AND_LABELS
												?>
												<div class="col-xs-12">
													<div class="bx-filter-select-container">
														<div class="bx-filter-select-block" onclick="smartFilter.showDropDownPopup(this, '<?=CUtil::JSEscape($key)?>')">
															<div class="bx-filter-select-text" data-role="currentOption">
																<?
																foreach ($arItem["VALUES"] as $val => $ar)
																{
																	if ($ar["CHECKED"])
																	{
																		echo $ar["VALUE"];
																		$checkedItemExist = true;
																	}
																}
																if (!$checkedItemExist)
																{
																	echo GetMessage("CT_BCSF_FILTER_ALL");
																}
																?>
															</div>
															<div class="bx-filter-select-arrow"></div>
															<input
																style="display: none"
																type="radio"
																name="<?=$arCur["CONTROL_NAME_ALT"]?>"
																id="<? echo "all_".$arCur["CONTROL_ID"] ?>"
																value=""
															/>
															<?foreach ($arItem["VALUES"] as $val => $ar):?>
																<input
																	style="display: none"
																	type="radio"
																	name="<?=$ar["CONTROL_NAME_ALT"]?>"
																	id="<?=$ar["CONTROL_ID"]?>"
																	value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																	<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																	<?= $ar["DISABLED"]? 'disabled="disabled"': '' ?>
																/>
															<?endforeach?>
															<div class="bx-filter-select-popup" data-role="dropdownContent" style="display: none;">
																<ul>
																	<li>
																		<label for="<?="all_".$arCur["CONTROL_ID"]?>" class="bx-filter-param-label" data-role="label_<?="all_".$arCur["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape("all_".$arCur["CONTROL_ID"])?>')">
																			<? echo GetMessage("CT_BCSF_FILTER_ALL"); ?>
																		</label>
																	</li>
																<?
																foreach ($arItem["VALUES"] as $val => $ar):
																	$class = "";
																	if ($ar["CHECKED"])
																		$class.= " selected";
																	if ($ar["DISABLED"])
																		$class.= " disabled";
																?>
																	<li>
																		<label for="<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label<?=$class?>" data-role="label_<?=$ar["CONTROL_ID"]?>" onclick="smartFilter.selectDropDownItem(this, '<?=CUtil::JSEscape($ar["CONTROL_ID"])?>')"><?=$ar["VALUE"]?></label>
																	</li>
																<?endforeach?>
																</ul>
															</div>
														</div>
													</div>
												</div>
												<?
												break;
											case "K"://RADIO_BUTTONS
												?>

												<div class="col-xs-12">

													<ul class="input-radio-css">

														<li>
															<label class="bx-filter-param-label input-radio-css" for="<? echo "all_".$arCur["CONTROL_ID"] ?>">
																<span class="bx-filter-input-checkbox">
																	<input
																		type="radio"
																		value=""
																		name="<? echo $arCur["CONTROL_NAME_ALT"] ?>"
																		id="<? echo "all_".$arCur["CONTROL_ID"] ?>"
																		onclick="smartFilter.click(this)"
																	/>

																	<span class="ic"></span>
																	<span class="bx-filter-param-text text"><? echo GetMessage("CT_BCSF_FILTER_ALL"); ?></span>
																</span>
															</label>
														</li>

														<?if(!empty($arItem["VALUES"])):?>

														<?foreach($arItem["VALUES"] as $val => $ar):?>

															<li>
																<label data-role="label_<?=$ar["CONTROL_ID"]?>" class="bx-filter-param-label input-radio-css" for="<? echo $ar["CONTROL_ID"] ?>">
																	<span class="bx-filter-input-checkbox <? echo $ar["DISABLED"] ? 'disabled': '' ?>">
																		<input
																			type="radio"
																			value="<? echo $ar["HTML_VALUE_ALT"] ?>"
																			name="<? echo $ar["CONTROL_NAME_ALT"] ?>"
																			id="<? echo $ar["CONTROL_ID"] ?>"
																			<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																			onclick="smartFilter.click(this)"
																		/>
																		<span class="ic"></span>
																		<span class="bx-filter-param-text text" title="<?=CKraken::prepareText($ar["VALUE"]);?>"><?=$ar["VALUE"];?><?
																		if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																			?>&nbsp;(<span data-role="count_<?=$ar["CONTROL_ID"]?>"><? echo $ar["ELEMENT_COUNT"]; ?></span>)<?
																		endif;?></span>
																	</span>
																</label>
															</li>
															
														<?endforeach;?>

														<?endif;?>

													</ul>
													
												</div>
												<?
												break;
											case "U"://CALENDAR
												?>
												<div class="col-xs-12">
													<div class="bx-filter-parameters-box-container-block"><div class="bx-filter-input-container bx-filter-calendar-container">
														<?$APPLICATION->IncludeComponent(
															'bitrix:main.calendar',
															'',
															array(
																'FORM_NAME' => $arResult["FILTER_NAME"]."_form",
																'SHOW_INPUT' => 'Y',
																'INPUT_ADDITIONAL_ATTR' => 'class="calendar" placeholder="'.FormatDate("SHORT", $arItem["VALUES"]["MIN"]["VALUE"]).'" onkeyup="smartFilter.keyup(this)" onchange="smartFilter.keyup(this)"',
																'INPUT_NAME' => $arItem["VALUES"]["MIN"]["CONTROL_NAME"],
																'INPUT_VALUE' => $arItem["VALUES"]["MIN"]["HTML_VALUE"],
																'SHOW_TIME' => 'N',
																'HIDE_TIMEBAR' => 'Y',
															),
															null,
															array('HIDE_ICONS' => 'Y')
														);?>
													</div></div>
													<div class="bx-filter-parameters-box-container-block"><div class="bx-filter-input-container bx-filter-calendar-container">
														<?$APPLICATION->IncludeComponent(
															'bitrix:main.calendar',
															'',
															array(
																'FORM_NAME' => $arResult["FILTER_NAME"]."_form",
																'SHOW_INPUT' => 'Y',
																'INPUT_ADDITIONAL_ATTR' => 'class="calendar" placeholder="'.FormatDate("SHORT", $arItem["VALUES"]["MAX"]["VALUE"]).'" onkeyup="smartFilter.keyup(this)" onchange="smartFilter.keyup(this)"',
																'INPUT_NAME' => $arItem["VALUES"]["MAX"]["CONTROL_NAME"],
																'INPUT_VALUE' => $arItem["VALUES"]["MAX"]["HTML_VALUE"],
																'SHOW_TIME' => 'N',
																'HIDE_TIMEBAR' => 'Y',
															),
															null,
															array('HIDE_ICONS' => 'Y')
														);?>
													</div></div>
												</div>
												<?
												break;
											default://CHECKBOXES
												?>

												<div class="col-xs-12">

													<ul class="input-checkbox-css">

														<?if(!empty($arItem["VALUES"])):?>
													
														<?foreach($arItem["VALUES"] as $val => $ar):?>

															<li>
															
																<label data-role="label_<?=$ar["CONTROL_ID"]?>" class=" input-checkbox-css bx-filter-param-label <? echo $ar["DISABLED"] ? 'disabled': '' ?>" for="<? echo $ar["CONTROL_ID"] ?>">
																	
																	<input
																		type="checkbox"
																		value="<? echo $ar["HTML_VALUE"] ?>"
																		name="<? echo $ar["CONTROL_NAME"] ?>"
																		id="<? echo $ar["CONTROL_ID"] ?>"
																		<? echo $ar["CHECKED"]? 'checked="checked"': '' ?>
																		onclick="smartFilter.click(this)"
																	/>
																	<span class="ic"></span>
																	<span class="bx-filter-param-text text" title="<?=CKraken::prepareText($ar["VALUE"]);?>"><?=$ar["VALUE"];?><?
																	if ($arParams["DISPLAY_ELEMENT_COUNT"] !== "N" && isset($ar["ELEMENT_COUNT"])):
																		?>&nbsp;(<span data-role="count_<?=$ar["CONTROL_ID"]?>"><? echo $ar["ELEMENT_COUNT"]; ?></span>)<?
																	endif;?></span>
																	
																</label>

															</li>
															
														<?endforeach;?>
														<?endif;?>

													</ul>

												</div>
												
										<?
										}
										?>
										</div>
										<div style="clear: both"></div>
									</div>
								</div>
							<?
							}
							?>
						<?endif;?>

						<div class="bx-filter-button-box">
							<div class="bx-filter-block">
								<div class="bx-filter-parameters-box-container">
									<input
										class="button-def main-color elips"
										type="submit"
										id="set_filter"
										name="set_filter"
										value="<?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["SMARTFILTER_BTN_SHOW"]?>"
									/>
									<div class="wrapper-button-gray">
										<input
											class="button-gray"
											type="submit"
											id="del_filter"
											name="del_filter"
											value="<?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["SMARTFILTER_BTN_CLEAR"]?>"
										/>
										<div class="clear-ic"></div>
									</div>
									<div class="bx-filter-popup-result right" id="modef" <?if(!isset($arResult["ELEMENT_COUNT"])) echo 'style="display:none"';?> style="display: inline-block;">

											<?echo GetMessage("CT_BCSF_FILTER_COUNT", array("#ELEMENT_COUNT#" => '<span id="modef_num">'.intval($arResult["ELEMENT_COUNT"]).'</span>'));?>

										<!-- <span class="arrow"></span> -->&#8594;

										<a href="<?echo $arResult["FILTER_URL"]?>" target=""><span class='bord-bot white'><?echo GetMessage("CT_BCSF_FILTER_SHOW")?></span></a>

									</div>
								</div>
							</div>
						</div>
					
						<div class="clb"></div>
					</form>
				</div>
			</div>


		</div>


	</div>


<?endif;?>

<script type="text/javascript">
	var smartFilter = new JCSmartFilter('<?echo CUtil::JSEscape($arResult["FORM_ACTION"])?>', '<?=CUtil::JSEscape($arParams["FILTER_VIEW_MODE"])?>', <?=CUtil::PhpToJSObject($arResult["JS_FILTER_PARAMS"])?>);
</script>

