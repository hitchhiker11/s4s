<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>

<?global $KRAKEN_TEMPLATE_ARRAY;?>

<?
$arResult["ERRORS"] = array();
$erFlag = false;

if($KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_CALLBACK'] == "N" && $KRAKEN_TEMPLATE_ARRAY['SHOW_CALLBACK']['VALUE'][0] == "Y")
{
    $arResult["ERRORS"]["CALLBACK"] = "Y";
    $erFlag = true;
}

if($KRAKEN_TEMPLATE_ARRAY['CART_ON']['VALUE'][0] == "Y")
{
    if($KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_FAST_ORDER'] != "N" || $KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_ORDER'] != "N")
        $erFlag = false;
    
    else
    {
        $arResult["ERRORS"]["CART_FORM"] = "Y";
        $erFlag = true;
    }
    if(strlen($KRAKEN_TEMPLATE_ARRAY['BASE_CURR']['VALUE']) <= 0)
    {
        $arResult["ERRORS"]["CURR"] = "Y";
        $erFlag = true;
    }
}


        
if($KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_CATALOG'] == "N")
{
    $arResult["ERRORS"]["CATALOG_FORM"] = "Y";
    $erFlag = true;
}



?>

<?if($erFlag):?>
    <div class="alert-block hidden-sm hidden-xs">
        
        <div class="kraken-alert-btn mgo-widget-alert_pulse"></div>
        
        <div class="alert-block-content">
            
            <div class="alert-head">
                <?=GetMessage("KRAKEN_ALERT_HEAD")?>
                
                <a class="alert-close"></a>
            </div>
            
            <div class="alert-body">
                
                <?if($arResult["ERRORS"]["CALLBACK"] == "Y"):?>
                    
                    <div class="cont">
                        
                        <div class="big-name"><?=GetMessage("KRAKEN_ALERT_CALLBACK_TITLE")?></div>
                        
                        <div class="instr">
                            
                            <div class="instr-element">
                                
                                <div class="text">1. <a href="/bitrix/admin/iblock_list_admin.php?IBLOCK_ID=<?=$KRAKEN_TEMPLATE_ARRAY['FORMS']["IBLOCK_ID"]?>&type=<?=$KRAKEN_TEMPLATE_ARRAY['FORMS']["IBLOCK_TYPE_ID"]?>&lang=ru&find_section_section=0" target="_blank"><?=GetMessage("KRAKEN_ALERT_CALLBACK_TEXT_1")?></a></div>
                                
                            </div>
                            
                            <div class="instr-element">
                                
                                <div class="text">2. <a class="kraken-sets-open" data-open-set="edit-sets"><?=GetMessage("KRAKEN_ALERT_CALLBACK_TEXT_2")?></a></div>
                                <div class="comment"><?=GetMessage("KRAKEN_ALERT_CALLBACK_COMMENT_2")?></div>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    
                <?endif;?>
                
                <?if($arResult["ERRORS"]["CATALOG_FORM"] == "Y"):?>
                    
                    <div class="cont">
                        
                        <div class="big-name"><?=GetMessage("KRAKEN_ALERT_CATALOG_FORM_TITLE")?></div>
                        
                        <div class="instr">
                            
                            <div class="instr-element">
                                
                                <div class="text">1. <a href="/bitrix/admin/iblock_list_admin.php?IBLOCK_ID=<?=$KRAKEN_TEMPLATE_ARRAY['FORMS']["IBLOCK_ID"]?>&type=<?=$KRAKEN_TEMPLATE_ARRAY['FORMS']["IBLOCK_TYPE_ID"]?>&lang=ru&find_section_section=0" target="_blank"><?=GetMessage("KRAKEN_ALERT_CATALOG_FORM_TEXT_1")?></a></div>
                                
                            </div>
                            
                            <div class="instr-element">
                                
                                <div class="text">2. <a class="kraken-sets-open" data-open-set="edit-sets"><?=GetMessage("KRAKEN_ALERT_CATALOG_FORM_TEXT_2")?></a></div>
                                <div class="comment"><?=GetMessage("KRAKEN_ALERT_CATALOG_FORM_COMMENT_2")?></div>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    
                <?endif;?>
                
                <?if($arResult["ERRORS"]["CART_FORM"] == "Y"):?>
                    
                    <div class="cont">
                        
                        <div class="big-name"><?=GetMessage("KRAKEN_ALERT_CATALOG_CART_FORM_TITLE")?></div>
                        
                        <div class="instr">
                            
                            <div class="instr-element">
                                
                                <div class="text">1. <a href="/bitrix/admin/iblock_list_admin.php?IBLOCK_ID=<?=$KRAKEN_TEMPLATE_ARRAY['FORMS']["IBLOCK_ID"]?>&type=<?=$KRAKEN_TEMPLATE_ARRAY['FORMS']["IBLOCK_TYPE_ID"]?>&lang=ru&find_section_section=0" target="_blank"><?=GetMessage("KRAKEN_ALERT_CATALOG_CART_FORM_TEXT_1")?></a></div>
                                
                            </div>
                            
                            <div class="instr-element">
                                
                                <div class="text">2. <a class="kraken-sets-open" data-open-set="edit-sets"><?=GetMessage("KRAKEN_ALERT_CATALOG_CART_FORM_TEXT_2")?></a></div>
                                <div class="comment"><?=GetMessage("KRAKEN_ALERT_CATALOG_CART_FORM_COMMENT_2")?></div>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    
                <?endif;?>

                <?if($arResult["ERRORS"]["CURR"] == "Y"):?>
                    
                    <div class="cont">
                        
                        <div class="big-name"><?=GetMessage("KRAKEN_ALERT_BASE_CURR_TITLE")?></div>
                        
                        <div class="instr">
                            
                            <div class="instr-element">
                                
                                <div class="text">1. <a href="/bitrix/admin/kraken_shop_currency.php" target="_blank"><?=GetMessage("KRAKEN_ALERT_BASE_CURR_TEXT_1")?></a></div>
                                
                            </div>
                            
                            <div class="instr-element">
                                
                                <div class="text">2. <a class="kraken-sets-open" data-open-set="edit-sets"><?=GetMessage("KRAKEN_ALERT_BASE_CURR_TEXT_2")?></a></div>
                                <div class="comment"><?=GetMessage("KRAKEN_ALERT_BASE_CURR_COMMENT_2")?></div>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    
                <?endif;?>
                
            </div>
            
        </div>
        
    </div>
<?endif;?>

