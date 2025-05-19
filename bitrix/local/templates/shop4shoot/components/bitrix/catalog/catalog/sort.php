<?
//  CKraken::includeCustomMessages();
  $arAvailableSort = array();
  
  $sort2 = "id";
  $sort_order2 = "desc";
  
  $arSorts = array("SORT", "PRICE");
  
  if (in_array("SORT", $arSorts)) {
    $arAvailableSort["SORT"] = array("SORT", "desc");
  }
  if (in_array("NAME", $arSorts)) {
    $arAvailableSort["NAME"] = array("NAME", "desc");
  }
  if (in_array("PRICE", $arSorts)) {
    $arAvailableSort["PRICE"] = array("PROPERTY_PRICE", "desc");
  }
  if (in_array("QUANTITY", $arSorts)) {
    $arAvailableSort["CATALOG_AVAILABLE"] = array("QUANTITY", "desc");
  }
  
  
  $arSortVal = ["SORT", "asc"];
  $sort1 = $arSortVal[0];
  
  if ($_REQUEST["sort"]) {
    $sort1 = ToUpper($_REQUEST["sort"]);
    $_SESSION["sort"] = ToUpper($_REQUEST["sort"]);
  } elseif ($_SESSION["sort"]) {
    $sort1 = ToUpper($_SESSION["sort"]);
  }
  
  $sort_order1 = $arSortVal[1];
  
  if ($_REQUEST["order"]) {
    
    $sort_order1 = $_REQUEST["order"];
    $_SESSION["order"] = $_REQUEST["order"];
  } elseif ($_SESSION["order"]) {
    $sort_order1 = $_SESSION["order"];
  }
?>


<div class="element-sort-wrap k1-sort">
  <div class="element-sort">
    <span class="name"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_SORT_NAME") ?></span>
    
    <? foreach ($arAvailableSort as $key => $val): ?>
      
      <? $newSort = $sort_order1 == 'desc' ? 'asc' : 'desc';
      
      $current_url = explode("?", $_SERVER["REQUEST_URI"]);
      $current_url = $current_url[0];
      
      $add = DeleteParam(array("sort", "order"));
      
      if (strlen($add) > 0)
        $add .= '&sort=' . $key . '&order=' . $newSort;
      else
        $add .= 'sort=' . $key . '&order=' . $newSort;
      
      $current_url = $current_url . "?" . $add;
      $url = str_replace('+', '%2B', $current_url); ?>
      
      <a href="<?= $url; ?>"
         class="sort_btn <?= ($sort1 == $key ? 'active' : '') ?> <?= htmlspecialcharsbx($sort_order1) ?> <?= $key ?>"
         rel="nofollow" data-sort="<?= $sort1 ?>" data-key="<?= $key?>">
        <?= GetMessage('KRAKEN_TEMPLATES_CATALOG_SECTION_SORT_' . $key) ?>
      </a>
    <? endforeach; ?>
  </div>
</div>
<?
  $tmpsort = $sort1;
  
  if ($sort1 == "PRICE") {
    $sort1 = $arAvailableSort["PRICE"][0];
    
    $sort2 = "sort";
    $sort_order2 = "asc";
  }
  
  if ($sort1 == "CATALOG_AVAILABLE") {
    $sort1 = "CATALOG_QUANTITY";
  }
  
  
  // if($tmpsort == "PRICE")
  // {
  //     $sort1 = $arAvailableSort["PRICE"][0];
  //     $sort_order1 = "asc";
  // }
?>


<div class="clearfix"></div>