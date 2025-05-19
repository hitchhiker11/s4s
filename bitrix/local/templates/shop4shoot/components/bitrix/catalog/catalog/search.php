<?if( $KRAKEN_TEMPLATE_ARRAY['SEARCH']['ACTIVE']['VALUE']['ACTIVE'] == "Y" && $KRAKEN_TEMPLATE_ARRAY['SEARCH']['SEARCH_SHOW_IN']['VALUE']['CATALOG'] == "Y" ):?>

	<div class="search-block col-lg-12 col-md-12 col-sm-12 col-xs-12 clearfix">
		<?$APPLICATION->IncludeComponent("concept:kraken.search.line", "", Array("START_PAGE"=>"catalog"));?>
	</div>

<?endif;?>