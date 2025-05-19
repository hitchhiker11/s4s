<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>

<?\Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("ajax");?>



<?
$cur_page = $_SERVER["REQUEST_URI"];
$cur_page_no_index = $APPLICATION->GetCurPage(false);
?>


<?if(!empty($arResult["SECTIONS"])):?>
	<?$selected = false;?>
    <script type="text/javascript">
    
        <?foreach($arResult["SECTIONS"] as $arSection):?>

        	<?if($selected) break;?>
        
            <?if(CMenu::IsItemSelected($arSection["SECTION_PAGE_URL"], $cur_page, $cur_page_no_index)):?>
                $("div.menu-navigation li[data-id='<?=$arSection["ID"]?>']").addClass("active");
                <?$selected = true?>
            <?endif;?>
            
        <?endforeach;?>
        
    </script>

<?endif;?>


<?\Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("ajax");?>