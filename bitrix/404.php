<?
include_once($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include/urlrewrite.php');

CHTTP::SetStatus("404 Not Found");
@define("ERROR_404","Y");

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Такой страницы не существует");
?>

<?global $KRAKEN_TEMPLATE_ARRAY;?>

<?
	if($KRAKEN_TEMPLATE_ARRAY["BG_404"]["VALUE"] > 0)
		$bg = CFile::ResizeImageGet($KRAKEN_TEMPLATE_ARRAY["BG_404"]["VALUE"], array('width'=>2000, 'height'=>2000), BX_RESIZE_IMAGE_PROPORTIONAL, false, false, false, $KRAKEN_TEMPLATE_ARRAY["PICTURES_QUALITY"]["VALUE"]);

?>

<div class="error-404 tone-<?=$KRAKEN_TEMPLATE_ARRAY["HEAD_TONE"]["VALUE"]?>" <?if(isset($bg)):?> style="background-image: url(<?=$bg["src"]?>);" <?endif;?>>
	<div class="shadow"></div>
	<div class="message404">
		<?if(strlen($KRAKEN_TEMPLATE_ARRAY["MES_404"]["VALUE"])>0):?>
			<?=htmlspecialcharsBack($KRAKEN_TEMPLATE_ARRAY["MES_404"]["VALUE"])?>
		<?else:?>
		<span>404</span>
		Такой страницы не существует :(
		<?endif;?>
	</div>
</div>


<?//require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>