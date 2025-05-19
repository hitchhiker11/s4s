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
global $APPLICATION;

?>


<?if(!empty($arResult)):?>

    <?
        CKraken::getMess(array("catalog"));

        $terminations = Array();

        $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_1"];
        $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_2"];
        $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_3"];
        $terminations[] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["CNT_4"];


        $admin_active = ($USER->isAdmin() || $APPLICATION->GetGroupRight("concept.kraken") > "R");
        $show_setting = $KRAKEN_TEMPLATE_ARRAY["MODE_FAST_EDIT"]['VALUE'][0];
        $styleBg= '';

        if(strlen($KRAKEN_TEMPLATE_ARRAY["MENU_BG_COLOR"]['VALUE']) > 0)
        {

            $arColor = $KRAKEN_TEMPLATE_ARRAY["MENU_BG_COLOR"]['VALUE'];
            $percent = 1;

            if($arColor != '#')
            {

                if(preg_match('/^\#/', $KRAKEN_TEMPLATE_ARRAY["MENU_BG_COLOR"]['VALUE']))
                {
                    $arColor = CKraken::Krakenhex2rgb($KRAKEN_TEMPLATE_ARRAY["MENU_BG_COLOR"]['VALUE']);
                    $arColor = implode(',',$arColor);
                }

                if(strlen($KRAKEN_TEMPLATE_ARRAY["MENU_BG_OPACITY"]['VALUE'])>0)
                    $percent = (100 - $KRAKEN_TEMPLATE_ARRAY["MENU_BG_OPACITY"]['VALUE'])/100;
                

                if($KRAKEN_TEMPLATE_ARRAY["MENU_TYPE"]['VALUE'] == "2")
                    $styleBg= 'style="background-color: rgba('.$arColor.', '.$percent.')";';

                if($KRAKEN_TEMPLATE_ARRAY["MENU_TYPE"]['VALUE'] == "3")
                    $styleBg= 'style="border-bottom: 2px solid rgba('.$arColor.', '.$percent.')";';
            }
            
        }
    ?>

    <div class="wrap-main-menu active <?=$KRAKEN_TEMPLATE_ARRAY["MENU_TEXT_COLOR"]['VALUE']?> <?=$KRAKEN_TEMPLATE_ARRAY["ITEMS"]["DROPDOWN_MENU_WIDTH"]['VALUE']?>" <?if($KRAKEN_TEMPLATE_ARRAY["MENU_VIEW"]['VALUE'] == "1"):?> <?=$styleBg?><?endif;?>>
        <div class="container <?=($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["DROPDOWN_MENU_WIDTH"]['VALUE'] == "full")?"pos-static":""?>">

            <div class="main-menu-inner"<?if($KRAKEN_TEMPLATE_ARRAY["MENU_VIEW"]['VALUE'] == "2"):?> <?=$styleBg?><?endif;?>>
                <?if($admin_active && $show_setting == 'Y'):?>
                    <div class="tool-settings">
                        <a href='/bitrix/admin/iblock_list_admin.php?IBLOCK_ID=<?=$KRAKEN_TEMPLATE_ARRAY["MENU_IBLOCK_ID"]?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&lang=ru&find_section_section=0' class="tool-settings <?if($center):?>in-center<?endif;?>" data-toggle="tooltip" target="_blank" data-placement="right" title="<?=GetMessage("KRAKEN_PAGE_GENERATOR_EDIT")?> &quot;<?=TruncateText(GetMessage("KRAKEN_MENU"), 35)?>&quot;"></a>

                    </div>

                <?endif;?>



                

                <div class="nav-main-menu-wrap">
              
                    <nav class="main-menu">

                        <li class="menu visible">
                            <a class="ic-main-menu-burger open-main-menu">
                                <div class="icon-hamburger-wrap">
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                </div>
                            </a>
                        </li>

                        <?foreach($arResult as $arItem):?>
                            <?$colorText = '';?>
                            <?$icon = '';?>

                            <?if(strlen($arItem['MENU_COLOR'])>0):?>
                                <?$colorText = ' style="color: '.$arItem['MENU_COLOR'].'";';?>
                            <?endif;?>

                            <?if($arItem['MENU_IC_US']>0):?>

                                <?$iconResize = CFile::ResizeImageGet($arItem['MENU_IC_US'], array('width'=>15, 'height'=>15), BX_RESIZE_IMAGE_PROPORTIONAL, true);?>

                                <?$icon = '<img class="img-responsive img-icon lazyload" data-src="'.$iconResize['src'].'" alt="'.CKraken::prepareText($arItem['NAME']).'" />';?>

                            <?elseif(strlen($arItem['MENU_ICON'])>0):?>
                            
                                <?$icon = '<i class="concept-icon '.$arItem['MENU_ICON'].'"></i>';?>
                                
                            <?endif;?>

                            <li class="lvl1
                                <?=$arItem["VIEW"]?>
                                <?if($arItem["SELECTED"]):?>selected<?endif;?>
                                <?if(!empty($arItem["SUB"])):?>parent<?endif;?> 
                                <?if(strlen($arItem["ID"])):?>section-menu-id-<?=$arItem["ID"]?><?endif;?>
                            ">


                                <a 

                                <?if($arItem['NOLINK']):?>

                                    <?=CKraken::krakenMenuAttr($arItem, $arItem['TYPE'])?>

                                <?else:?>

                                    <?if(strlen($arItem["LINK"]) > 0  && !$arItem["NONE"]):?> 

                                        href='<?=$arItem['LINK']?>'


                                        <?if($arItem['BLANK']):?>

                                            target='_blank'

                                        <?endif;?>

                                    <?endif;?>

                                <?endif;?>

                                class="<?if(strlen($arItem["LINK"]) <= 0 && $arItem["NONE"]):?>empty-link<?endif;?>
                                
                                <?if($arItem['NOLINK']):?>

                                    <?=CKraken::krakenMenuClass($arItem, $arItem['TYPE'])?>

                                <?endif;?>

                                

                                " <?=$colorText?> ><span class="wrap-name"><span><?=$icon?><?=$arItem['NAME']?><div class="bord"></div></span></span></a>



                                <?if(!empty($arItem["SUB"])):?>

                                    <?if($arItem["VIEW"] == "view_1"):?>

                                        <ul class="child">
                                            <li class="wrap-shadow"></li>

                                            <?foreach($arItem["SUB"] as $arMenuChild):?>

                                                <li class="<?if(!empty($arMenuChild['SUB'])):?>parent2<?endif;?> 

                                                    <?if($arMenuChild["SELECTED"]):?>selected<?endif;?>

                                                    <?if(strlen($arMenuChild["ID"])):?>

                                                        section-menu-id-<?=$arMenuChild["ID"]?>

                                                    <?endif;?>">

                                                    <a 


                                                    <?if($arMenuChild['NOLINK']):?>

                                                        <?=CKraken::krakenMenuAttr($arMenuChild, $arMenuChild['TYPE'])?>

                                                    <?else:?>

                                                        <?if(strlen($arMenuChild["LINK"]) > 0 && !$arMenuChild["NONE"]):?> 

                                                            href='<?=$arMenuChild['LINK']?>'

                                                            <?if($arMenuChild['BLANK']):?>

                                                                target='_blank'

                                                            <?endif;?>

                                                        <?endif;?>

                                                    <?endif;?>


                                                     class="<?if(strlen($arMenuChild["LINK"]) <= 0  && $arMenuChild["NONE"]):?>empty-link<?endif;?>

                                                        

                                                        <?if($arMenuChild['NOLINK']):?>

                                                            <?=CKraken::krakenMenuClass($arMenuChild, $arMenuChild['TYPE'])?>

                                                        <?endif;?>

                                                        "><?=$arMenuChild['NAME']?><div></div> <span class="act"></span></a> 

                                                   

                                                    <?if(!empty($arMenuChild['SUB'])):?>
                                                    
                                                        <ul class="child2">
                                                            <li class="wrap-shadow"></li>

                                                            <?foreach($arMenuChild['SUB'] as $keyChild2 => $arMenuChild2):?>
                                                                <li class="

                                                                    <?if($arMenuChild2["SELECTED"]):?>selected<?endif;?>

                                                                    <?if(strlen($arMenuChild2["ID"])):?>

                                                                        section-menu-id-<?=$arMenuChild2["ID"]?>

                                                                    <?endif;?>">

                                                                    <a 

                                                                    <?if($arMenuChild2['NOLINK']):?>

                                                                        <?=CKraken::krakenMenuAttr ($arMenuChild2, $arMenuChild2['TYPE'])?>

                                                                    <?else:?>

                                                                        <?if(strlen($arMenuChild2["LINK"]) > 0 && !$arMenuChild2["NONE"]):?> 
                                                                        
                                                                            href='<?=$arMenuChild2['LINK']?>'

                                                                            <?if($arMenuChild2['BLANK']):?>

                                                                                target='_blank'

                                                                            <?endif;?>

                                                                        <?endif;?>

                                                                    <?endif;?>

                                                                     class="<?if(strlen($arMenuChild2["LINK"]) <= 0 && $arMenuChild2["NONE"]):?>empty-link<?endif;?>


                                                                     <?if($arMenuChild2['NOLINK']):?>

                                                                        <?=CKraken::krakenMenuClass($arMenuChild2, $arMenuChild2['TYPE'])?>

                                                                    <?endif;?>

                                                                     "><?=$arMenuChild2['NAME']?><div></div> <span class="act"></span>

                                                                    </a>
                                                                </li>


                                                            <?endforeach;?>
                                                 
                                                        </ul>
                                                    <?endif;?>
                                                </li>

                                            <?endforeach;?>
                                        </ul>

                                    <?elseif($arItem["VIEW"] == "view_2"):?>

                                        <div class="dropdown-menu-view-2">

                                            <div class="container">

                                                <div class="inner">
                                                    <div class="row">   

                                                        <?$count = 0;?>
                                                        <?foreach($arItem["SUB"] as $arMenuChild):?>

                                                            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
           
                                                                <table class="item">
                                                                    <tr>
                                                                        <td class="left">
                                                                        
                                                                            <?if(isset($arMenuChild["PICTURE_SRC"])):?>
                                                                                
                                                                                <img data-src="<?=$arMenuChild["PICTURE_SRC"]?>" class="lazyload img-fluid" alt="<?=CKraken::prepareText($arMenuChild['NAME'])?>">
                                                                                
                                                                            <?else:?>
                                                                            
                                                                                <span></span>
                                                                                
                                                                            <?endif;?>
                                                 
                                                                        </td>
                                                                        
                                                                        <td class="right <?if(!empty($arMenuChild['SUB'])):?>sub<?endif;?>">

                                                                            <a class="name 

                                                                                <?if(strlen($arMenuChild["ID"])):?>

                                                                                    section-menu-id-<?=$arMenuChild["ID"]?>

                                                                                <?endif;?>

                                                                                <?if($arMenuChild["SELECTED"]):?>selected<?endif;?>

                                                                            " <?if(strlen($arMenuChild["LINK"])>0):?>href="<?=$arMenuChild["LINK"]?>"<?endif;?> title="<?=$arMenuChild["NAME"]?>">
                                                                                <?=$arMenuChild['NAME']?>
                                                                                    
                                                                            </a>

                                                                            <?if($arItem["TYPE"] == 'catalog' && $KRAKEN_TEMPLATE_ARRAY['CTLG_HIDE_COUNT_GOODS']['VALUE'][0] != "Y"):?>

                                                                                <div class="count-sect-elem"><?=$arMenuChild['ELEMENT_CNT']?> <?=CKraken::getTermination($arMenuChild["ELEMENT_CNT"], $terminations)?></div>
                                                                            <?endif;?>

                                                                            <?if( !empty($arMenuChild['SUB']) ):?>

                                                                                <ul class="lvl2">

                                                                                    <?
                                                                                        $j = 1;

                                                                                        $breakCount = intval($arItem["MAX_QUANTITY_SECTION_SHOW"]);
                                                                                    ?>

                                                                                    <?foreach($arMenuChild['SUB'] as $arMenuChild2):?>

                                                                                        <?if($j > $breakCount) break;?>

                                                                                        <li class=
                                                                                        "
                                                                                            <?if($arMenuChild2['SELECTED']):?>selected<?endif;?>

                                                                                            <?if(strlen($arMenuChild2["ID"])):?>

                                                                                                section-menu-id-<?=$arMenuChild2["ID"]?>

                                                                                            <?endif;?>


                                                                                        ">

                                                                                            <a title = "<?=$arMenuChild2['NAME']?>" <?if(strlen($arMenuChild2['LINK'])>0):?>href='<?=$arMenuChild2['LINK']?>'<?endif;?>>

                                                                                                <?=$arMenuChild2['NAME']?>

                                                                                            </a>
                                                                                        </li>

                                                                                        <?$j++;?>

                                                                                    <?endforeach;?>

                                                                                    <?if(count($arMenuChild['SUB']) > $breakCount):?>
                                                                                        <li class="last">
                                                                                            <a <?if(strlen($arMenuChild["LINK"])>0):?>href="<?=$arMenuChild["LINK"]?>"<?endif;?>>
                                                                                                <span><?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["MENU_ALL_SECTIONS"];?></span>
                                                                                            </a>
                                                                                        </li>

                                                                                    <?endif;?>
                                                                                </ul>

                                                                            <?endif;?>


                                                                        </td>
                                                                        
                                                                    </tr>
                                                                </table>
                                                                
                                                            </div>

                                                            <?

                                                                if( ($count+1) % 4 == 0) 
                                                                    echo "<div class='clearfix visible-lg'></div>";

                                                                if( ($count+1) % 3 == 0) 
                                                                    echo "<div class='clearfix visible-md'></div>";

                                                                if( ($count+1) % 2 == 0) 
                                                                    echo "<div class='clearfix visible-sm'></div>";

                                                                $count++;
                                                            ?>


                                                        <?endforeach;?>

                                                    </div>
                                                </div>
                                            </div>

                                            <div class="blur-shadow-top"></div>
                                            <div class="blur-shadow-bottom"></div>


                                        </div>

                                    <?endif;?>

                                <?endif;?>

                             
                            </li>
                            

                        <?endforeach;?>

                        <?if( $KRAKEN_TEMPLATE_ARRAY['SEARCH']['ACTIVE']['VALUE']['ACTIVE'] == "Y" && $KRAKEN_TEMPLATE_ARRAY['SEARCH']['SEARCH_SHOW_IN']['VALUE']['IN_MENU'] == "Y" ):?>
                            <li class="visible">
                                <div class="mini-search-style open-search-top">

                                </div>
                            </li>
                        <?endif;?>

                        <?if( $KRAKEN_TEMPLATE_ARRAY['CART_ON']['VALUE'][0] == "Y" && $KRAKEN_TEMPLATE_ARRAY['CART_IN_MENU_ON']['VALUE'][0] == "Y" && $APPLICATION->GetCurDir() != SITE_DIR."cart/"):?>

                            <li class="visible">
                                <div class="mini-cart-style mini-cart-js active hidden-xs">
                                    <div class="open-cart-menu cart-empty basket-count-control-mini-widget">

                                        <div class="count basket-count-value">0</div>

                                            <a class="cart_link scroll" href="<?=$KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"]?>" data-url="<?=(strlen($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"])>0)?$KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"]:""?>"></a>
                                    </div>
                                </div>
                            </li>

                        <?endif;?>

                    </nav>

                </div>

             </div>

        </div>
    </div>

<?endif;?>