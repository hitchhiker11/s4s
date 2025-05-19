<?require($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include/prolog_before.php');?>

<?if(!empty($arResult)):?>

<?
	$cur_page = $_SERVER["REQUEST_URI"];
	$cur_page_no_index = $APPLICATION->GetCurPage(false);
	$arrUrls = array();
	$selected = 0;

	foreach ($arResult as $key => $arItem)
	{

		if(strlen($arItem["LINK"]) > 0)
		{
			$selected = CMenu::IsItemSelected($arItem["LINK"], $cur_page, $cur_page_no_index);

			if($selected > 0 && !empty($arrUrls) && in_array($arItem["LINK"], $arrUrls))
		        $selected = 0;
		    
		    if($selected > 0)
		        $arrUrls[] = $arItem["LINK"];


		    $arResult[$key]["SELECTED"] = $selected;
		}
		


		if(!empty($arItem["SUB"]) && is_array($arItem["SUB"]))
	    {
	    	foreach($arItem["SUB"] as $key1=>$arSub)
	        {

	        	if(strlen($arSub["LINK"]) > 0)
	        	{
	        		$selected = CMenu::IsItemSelected($arSub["LINK"], $cur_page, $cur_page_no_index);

		        	if($selected > 0 && !empty($arrUrls) && in_array($arSub["LINK"], $arrUrls))
		                $selected = 0;
		            
		            if($selected > 0)
		                $arrUrls[] = $arSub["LINK"];


		        	$arResult[$key]["SUB"][$key1]["SELECTED"] = $selected;

		        	if($arResult[$key]["SUB"][$key1]["SELECTED"])
		        		$arResult[$key]["SELECTED"] = $selected;
	        	}

	        	


	        	if(!empty($arSub["SUB"]) && is_array($arSub["SUB"]))
	            {
	                foreach($arSub["SUB"] as $key2=>$arSub2)
	                {
	                	if(strlen($arSub2["LINK"]) > 0)
	                	{
	                		$selected = CMenu::IsItemSelected($arSub2["LINK"], $cur_page, $cur_page_no_index);

		                	if($selected > 0 && !empty($arrUrls) && in_array($arSub2["LINK"], $arrUrls))
				                $selected = 0;
				            
				            if($selected > 0)
				                $arrUrls[] = $arSub2["LINK"];

		                	$arResult[$key]["SUB"][$key1]["SUB"][$key2]["SELECTED"] = $selected;

		                	if($arResult[$key]["SUB"][$key1]["SUB"][$key2]["SELECTED"])
		                	{
		                		$arResult[$key]["SELECTED"] = $selected;
		                		$arResult[$key]["SUB"][$key1]["SELECTED"] = $selected;
		                	}
	                	}
	                	
	                    
	                }
	            }
	        }
	    }
	}
?>



<?\Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("menu-mobile");?>
<script>

$(document).ready(function($) {
		
	
	<?foreach ($arResult as $key => $arItem):?>
		<?if($arItem["SELECTED"]):?>
			$(".open-menu-mobile .section-menu-id-"+<?=$arItem["ID"]?>).addClass('selected');
		<?endif;?>
		

		<?if(!empty($arItem["SUB"]) && is_array($arItem["SUB"])):?>
	    
	    	<?foreach($arItem["SUB"] as $key1=>$arSub):?>
	        
	        	<?if($arSub["SELECTED"]):?>
	        		$(".open-menu-mobile .section-menu-id-"+<?=$arSub["ID"]?>).addClass('selected');
				<?endif;?>

	        	<?if(!empty($arSub["SUB"]) && is_array($arSub["SUB"])):?>
	            
	                <?foreach($arSub["SUB"] as $key2=>$arSub2):?>
	                
	                	<?if($arSub2["SELECTED"]):?>
							$(".open-menu-mobile .section-menu-id-"+<?=$arSub2["ID"]?>).addClass('selected');
						<?endif;?>

					<?endforeach;?>

				<?endif;?>

			<?endforeach;?>
		
		<?endif;?>

	<?endforeach;?>

});
</script>
<?\Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("menu-mobile");?>

<?endif;?>