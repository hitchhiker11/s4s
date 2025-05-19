<?global $KRAKEN_TEMPLATE_ARRAY;?>
<?/*$is_constructor = IsConstructor("concept_kraken_site");*/?>

<?
$page = $APPLICATION->GetCurPage();

if(SITE_DIR != "/")
    $pageTmp = "/".str_replace(SITE_DIR, "", $page);
else
    $pageTmp = $page;


if(!empty($KRAKEN_TEMPLATE_ARRAY["MAIN_URLS"]))
{
    $page = "";
    foreach ($KRAKEN_TEMPLATE_ARRAY["MAIN_URLS"] as $key => $value){
        preg_match('/^\/'.$key.'\//', $pageTmp, $matches);
        
        if(!empty($matches))
            $page = $matches[0];
    }
}
$page = $GLOBALS["KRAKEN_CURRENT_PAGE"];
?>

<div class="hidden-xs">
    <div class="kraken-main-setting">
        <div class="kraken-btn mgo-widget-call_pulse">
            
        </div>
        <span><?=GetMessage("KRAKEN_SETTINGS_LIST_BUTTON_TIP")?></span>
    </div>


    <div class="kraken-sets-list-wrap">
        <div class="kraken-sets-list">

            <div class="kraken-sets-list-table">

                <div class="kraken-sets-list-cell">

                    <?
                        $pageIblockID = $KRAKEN_TEMPLATE_ARRAY["PAGES"][$GLOBALS["KRAKEN_CURRENT_PAGE"]];
                        /*$pageIblockID = $KRAKEN_TEMPLATE_ARRAY["PAGES"][$page];*/

                        $arPages = array("news", "blog", "action", "catalog");
                        $arPage["news"] = "tab_cont_news_tab";
                        $arPage["blog"] = "tab_cont_blog_tab";
                        $arPage["action"] = "tab_cont_action_tab";
                        $arPage["catalog"] = "tab_cont_catalog_tab";
                        $arPage["cart"] = "tab_cont_shop";
                    ?>
                  
                    <?if(in_array($page, $arPages)):?>

                        <?if($GLOBALS["KRAKEN_CURRENT_DIR"] == "main"):?>
                            <a class="kraken-sets-list-item sectedit" href='/bitrix/admin/concept_kraken.php?site_id=<?=SITE_ID?>&tab=<?=$arPage[$page]?>' target='_blank'>
                                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_MAIN_".$page)?></span>
                            </a>
                        <?endif;?>

                        <?if($GLOBALS["KRAKEN_CURRENT_DIR"] == "section"):?>
                            <a class="kraken-sets-list-item sectedit" href='/bitrix/admin/iblock_section_edit.php?IBLOCK_ID=<?=$pageIblockID?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&ID=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&lang=ru&find_section_section=0' target='_blank'>
                                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_SECT_".$page)?></span>
                            </a>
                        <?endif;?>

                        <?if($GLOBALS["KRAKEN_CURRENT_DIR"] == "element"):?>

                            <a class="kraken-sets-list-item sectedit" href='/bitrix/admin/iblock_element_edit.php?IBLOCK_ID=<?=$pageIblockID?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&ID=<?=$GLOBALS["KRAKEN_ELEMENT_ID"]?>&find_section_section=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&WF=Y' target='_blank'>
                                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_ELEM_".$page)?></span>
                            </a>

                        <?endif;?>

                    <?else:?>

                        <?if($page == "cart"):?>

                            <a class="kraken-sets-list-item sectedit" href='/bitrix/admin/concept_kraken.php?site_id=<?=SITE_ID?>&tab=<?=$arPage[$page]?>' target='_blank'>
                                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_MAIN_".$page)?></span>
                            </a>

                        <?else:?>
                            <a class="kraken-sets-list-item sectedit" href='/bitrix/admin/iblock_section_edit.php?IBLOCK_ID=<?=$KRAKEN_TEMPLATE_ARRAY['CONSTR']["IBLOCK_ID"]?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&ID=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&lang=ru&find_section_section=0' target='_blank'>
                                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_PAGE")?></span>
                            </a>
                        <?endif;?>
                    <?endif;?>

                </div>

                

                <?if(in_array($page, $arPages)):?>

                    <div class="kraken-sets-list-cell">

                        <a class="kraken-sets-list-item addsect" href="/bitrix/admin/iblock_section_edit.php?IBLOCK_ID=<?=$pageIblockID?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&ID=0&lang=ru&IBLOCK_SECTION_ID=0&find_section_section=0&from=iblock_list_admin" target='_blank'>
                            <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_SECTEDIT")?></span>
                        </a>
                        <!-- <div class="vertic-line"></div> -->
                    </div>

                <?endif;?>


                
                <!-- <div class="kraken-sets-list-cell">
                    <a class="kraken-sets-list-item page kraken-sets-open" data-open-set='page'>
                        <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_EDIT_SETS")?></span>
                    </a>
                </div> -->

                <?if($page != "cart"):?>
                    <div class="kraken-sets-list-cell">

                        <?if(in_array($page, $arPages)):?>
                       
                            <a class="kraken-sets-list-item addblock" href='/bitrix/admin/iblock_element_edit.php?IBLOCK_ID=<?=$pageIblockID?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&ID=0&lang=ru&IBLOCK_SECTION_ID=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&find_section_section=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&from=iblock_list_admin' target='_blank'>
                                <span class="set-icon">
                                    <?=GetMessage("KRAKEN_SETTINGS_ADD_".$page)?>
                                </span>
                            </a>

                        <?else:?>
                            <a class="kraken-sets-list-item addblock" href='/bitrix/admin/iblock_element_edit.php?IBLOCK_ID=<?=$KRAKEN_TEMPLATE_ARRAY['CONSTR']["IBLOCK_ID"]?>&type=<?=$KRAKEN_TEMPLATE_ARRAY["IBLOCK_TYPE"]?>&ID=0&lang=ru&IBLOCK_SECTION_ID=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&find_section_section=<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>&from=iblock_list_admin' target='_blank'>
                                <span class="set-icon">
                                    <?=GetMessage("KRAKEN_SETTINGS_LIST_ADDBLOCK")?>
                                </span>
                            </a>
                        <?endif;?>
                    </div>
                <?endif;?>

                <div class="kraken-sets-list-cell">
                    <a class="kraken-sets-list-item seo kraken-sets-open" data-open-set='seo'>
                        <span class="seo-name">SEO</span>
                        <span class="set-icon">

                            <?if(in_array($page, $arPages) || $page == "cart"):?>
                                <?=GetMessage("KRAKEN_SETTINGS_LIST_SEO_PAGE")?>
                            <?else:?>
                                <?=GetMessage("KRAKEN_SETTINGS_LIST_SEO")?>
                            <?endif;?>

                        </span>

                        <span class="status-seo"></span>
                    </a>
                </div>
                <div class="kraken-sets-list-cell">
                    <div class="kraken-sets-list-close">
                        
                    </div>
                    <span><?=GetMessage("KRAKEN_SETTINGS_CLOSE_LIST_SET")?></span>
                </div>
            </div>
        </div>

        <div class="kraken-sets-list-left">
           
            <a class="kraken-sets-list-item kraken-sets-open edit-sets" data-open-set='edit-sets'>
                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_EDIT_SETS")?></span>
            </a>
            <a class="kraken-sets-list-item kraken-sets-open addpage" data-open-set='addpage'>
                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_ADDPAGE")?></span>
            </a>
            <a class="kraken-sets-list-item kraken-sets-open forms" data-open-set='forms'>
                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_FORMS")?></span>
            </a>
            <a class="kraken-sets-list-item kraken-sets-open modals" data-open-set='modals'>
                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_LIST_MODAL")?></span>
            </a>

            <a class="kraken-sets-list-item kraken-sets-open iblist" data-open-set='iblist'>
                <span class="set-icon"><?=GetMessage("KRAKEN_SETTINGS_IBLIST")?></span>
            </a>
              
          
        </div>

    </div>

    <div class="sets-shadow"></div>

    <div class="kraken-setting edit-sets"></div>
    <div class="kraken-setting addpage"></div>
    <div class="kraken-setting newpage"></div>
    <div class="kraken-setting modals list-style"></div>
    <div class="kraken-setting forms list-style"></div>
    <div class="kraken-setting iblist list-style"></div>

    <input type="hidden" name="currentSectionId" value="<?=$GLOBALS["KRAKEN_CURRENT_SECTION_ID"]?>">
    <?
        CKraken::getOptions(array("hide_adv"));

        if($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HIDE_ADV"]["ITEMS"]["ACTIVE"]["VALUE"]["ACTIVE"] == "Y"):?>
        <div class="hide-adv" data-user="<?=$USER->getId()?>"></div>
    <?endif;?>

</div>
