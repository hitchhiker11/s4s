<?php
  require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');
  
  $mailReg = "/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i";
  $isValidMail = !!preg_match($mailReg, $_POST["email"]);
  
  $isValidName = strlen($_POST["name"]) > 2;
  
  $phoneNumbers = preg_replace("/\D/","" ,$_POST["phone"]);
  $symbols = preg_replace("/\d/","" ,$_POST["phone"]);
  $symbols = str_replace(" ", "", $symbols);
  $isValidPhone = $symbols === "+()" && strlen($phoneNumbers) === 11;
  $codes = [];
  
  if (!$isValidMail) {
    $codes[] = 101;
  }
  if (!$isValidPhone) {
    $codes[] = 102;
  }
  if (!$isValidName) {
    $codes[] = 103;
  }
  if (count($codes)) {
    echo json_encode([
      "error" => true,
      "codes" => $codes
    ]);
    die();
  }
  if (CModule::IncludeModule("iblock") && $_POST["pageURL"]) {
    $el = new CIBlockElement;
    $propID = 1;
    $iBlockID = 1;
    $files = [];
    foreach($_FILES["files"]["tmp_name"] as $index => $file) {
      $files[$index] = CFile::MakeFileArray($file);
      $files[$index]["name"] = $_FILES["files"]["name"][$index];
    }
    $arrProps = [
      $propID => $files
    ];
    $text = "
Страница отправки: {$_POST["pageURL"]} \n
Имя: {$_POST["name"]} \n
Электронная почта: {$_POST["email"]} \n
Телефон: {$_POST["phone"]} \n
    ";
    $id = $el->Add([
      "IBLOCK_ID" => $iBlockID,
      "NAME" => "Новая заявка с новой формы",
      "PREVIEW_TEXT" => $text,
      "PROPERTY_VALUES" => $arrProps
    ]);
    echo json_encode([
      "error" => false
    ]);
    die();
  }
  //  echo '<pre>', print_r("k1 form", true), '</pre>';
?>

