<?php
  
  
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
    die();
  }
//  $tmp = explode("/", $_SERVER["REQUEST_URI"])[1];
//  $isCatalog = $tmp === "catalog" || $tmp === "cart" || $tmp === "bitrix";
//  $isHomePage = $_SERVER["SCRIPT_URL"] === "/";
//  if ($isHomePage) {
//    LocalRedirect("/catalog/");
//  } else if ($_SERVER["SERVER_NAME"] === "shop4shoot.com" && !$isCatalog) {
//    $url = "Location: https://weapon-culture.ru";
//    $url .= $_SERVER["REQUEST_URI"];
//    header($url);
//    exit();
//  }
  use Bitrix\Main;
  
  define("CATALOG_IB", 21);
  define("CATALOG_PARENT_SECTION", 572);
  define("CATALOG_PICTURE_STUB", "/local/templates/shop4shoot/img/no-image.jpg");
  
  $eventManager = Main\EventManager::getInstance();
  
  $eventManager->addEventHandler("form", "onBeforeResultAdd", ['FormResultAdd', 'before']);
  $eventManager->addEventHandler("form", "onAfterResultAdd", ['FormResultAdd', 'after']);
  
  $eventManager->addEventHandler("main", "OnBeforeEventAdd", ['EventHandler', 'addFilesAttach']);
  
  class EventHandler
  {
    public static function addFilesAttach(&$event, &$lid, &$arFields, &$messageId, &$files) {
      if ($event === 'FORM_FILLING_FEEDBACK_FORM') {
        if (!is_array($files)) $files = [];
        foreach ($arFields as $key => $field) {  //находим поле с ID нашего файла
          $searchField = $key === "FEEDBACK_FORM_PHOTO" || $key === "FEEDBACK_FORM_DOCUMENT";
          if ($searchField && boolval($field)) {
            $links = self::getLinkFromField($field);
            if ($links) {
              foreach ($links as $link) {
                if ($arFile = self::getFileFromLink($link)) {
                  $files[] = $arFile['FILE_ID'];
                }
              }
            }
          }
        }
      }
      
    }
    
    static function getLinkFromField($field) {
      /* Тут ищем ссылки на файл в нашем пиьсме. Обратите внимание, если у вас сайт работает на http, то надо и ниже написать http */
      preg_match_all("/(https\:.*form_show_file.*action\=download)/", $field, $out);
      return ($out[0] ?: false);
    }
    
    static function getFileFromLink($link) {
      $uri = new \Bitrix\Main\Web\Uri($link);
      parse_str($uri->getQuery(), $query);
      return CFormResult::GetFileByHash($query["rid"], $query["hash"]);
    }
  }
  
  class FormResultAdd
  {
    
    
    /**
     * Вернет input name для ответов типа file вопроса fieldCode
     * @param $formId
     * @param string $fieldCode
     * @return array
     */
    public static function getFilesInputNames($formId, $fieldCode = 'FEEDBACK_FORM_PHOTO') {
      $res = [];
      $question = \CFormField::GetBySID($fieldCode, $formId)->Fetch();
      if ($question) {
        $by = 's_id';
        $order = 'asc';
        $filter = false;
        if (intval($question['ID'])) {
          $rsAnswers = \CFormAnswer::GetList($question['ID'], $by, $order, ["FIELD_TYPE" => 'file'], $filter);
          while ($arAnswer = $rsAnswers->Fetch()) {
            $res[] = 'form_file_' . $arAnswer['ID'];
          }
        }
      }
      return $res;
    }
    
    /**
     * Осуществляем загрузку множества файлов через один input type="file" multiple
     * так как стандартными средствами Битрикс можно сделать только через множество input type="file"
     * @param $WEB_FORM_ID
     * @param $arFields
     * @param $arrVALUES
     * @throws Main\SystemException
     */
    public static function loadMultiple($WEB_FORM_ID, &$arFields, &$arrVALUES) {
      global $_FILES;
      
      if ($_FILES['files']) {
        $files = [];
        if (is_array($_FILES['files']['name'])) {
          foreach ($_FILES['files'] as $key => $val) {
            foreach ($val as $k => $v) {
              $files[$k][$key] = $v;
            }
          }
        } else {
          $files = [$_FILES['files']];
        }
        unset($_FILES['files']);
        
        $err = [];
        $inputsName = self::getFilesInputNames($WEB_FORM_ID);
        
        if ($inputsName) {
          foreach ($files as $f) {
            if ($inputName = array_shift($inputsName)) {
              $_FILES[$inputName] = $f;
            } else {
              $err[] = $f;
            }
          }
          
          if ($err) {
            $firelds = [
              'TITLE' => 'Не хватило полей в форме для подгрузки файлов ' . __FUNCTION__,
              'MESSAGE' => print_r($err, true),
            ];
            \CEvent::Send('DEBUG_SEND', SITE_ID, $firelds);
          }
        }
      }
      return true;
    }
    
    public static function before($WEB_FORM_ID, &$arFields, &$arrVALUES) {
      global $APPLICATION;
      $token = $arrVALUES["recaptcha"];
      $recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
      // Выполняем POST-запрос
//      $recaptcha = json_decode(file_get_contents($recaptchaUrl . '?secret=6LcdiTIpAAAAAJ78xouP2JWuDYxp8FXl3fhbpQBI&response=' . $token), true);
//      if ($recaptcha['score'] < 0.5) {
//        $APPLICATION->ThrowException('Не пройдена проверка на робота');
//      }
      if ($WEB_FORM_ID == 3) {
        $mailReg = "/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i";
        $isValidMail = !!preg_match($mailReg, $arrVALUES["form_text_27"]);
        
        $isValidName = strlen($arrVALUES["form_text_26"]) > 2;
        
        $phoneNumbers = preg_replace("/\D/", "", $arrVALUES["form_text_28"]);
        $symbols = preg_replace("/\d/", "", $arrVALUES["form_text_28"]);
        $symbols = str_replace(" ", "", $symbols);
        $isValidPhone = strlen($phoneNumbers) === 11;
        $codes = [];
        $str = "Не верно заполнены поля: ";
        if (!$isValidName) {
          $str .= "\n Имя";
          $codes[] = 103;
        }
        if (!$isValidMail) {
          $str .= "\n E-mail";
          $codes[] = 101;
        }
        if (!$isValidPhone) {
          $str .= "\n Телефон";
          $codes[] = 102;
        }
        
        if (count($codes)) {
          global $APPLICATION;
          
          $APPLICATION->ThrowException($str);
          return false;
        }
        self::loadMultiple($WEB_FORM_ID, $arFields, $arrVALUES);
      }
      
    }
    
    public static function sendMessageToClient($arAnswer) {
      $fields = [];
      $files = [];
      foreach ($arAnswer as $key => $item) {
        switch ($key) {
          case "FEEDBACK_FORM_NAME" :
          case "FEEDBACK_FORM_E_MAIL" :
          case "FEEDBACK_FORM_PHONE" :
          case "FEEDBACK_FORM_PLACE" :
          case "FEEDBACK_FORM_DESCRIPTION" :
          case "FEEDBACK_FORM_LINK" :
            $fields[$key] = $item[0]["USER_TEXT"];
            break;
          case "FEEDBACK_FORM_PHOTO":
          case "FEEDBACK_FORM_DOCUMENT":
            foreach ($item as $file) {
              $files[] = $file["USER_FILE_ID"];
            }
            break;
        }
      }
      $id = CEvent::Send(
        144,
        "s1",
        $fields,
        "N",
        21,
        $files
      );
    }
    
    public static function after($WEB_FORM_ID, $RESULT_ID) {
      if ($WEB_FORM_ID == 3) {
        $arResult = [];
        $arAnswer2 = [];
        $arAnswer = CFormResult::GetDataByID(
          $RESULT_ID,
          [],
          $arResult,
          $arAnswer2);
        
        self::sendMessageToClient($arAnswer);
      }
    }
    
  }
  
  function isGoodAvailable($id) {
    if (CModule::IncludeModule('iblock')) {
      $res = CIBlockElement::GetList(
        [],
        [
          "ID" => $id,
        ],
        false, false,
        [
          "ID",
          "IBLOCK_ID",
          "PROPERTY_QUANTITY",
          "PROPERTY_QUANTITY_1",
          "PROPERTY_EXIST",
          "ACTIVE"
        ]
      );
      if ($ob = $res->Fetch()) {
//        var_dump((int)$ob["PROPERTY_QUANTITY_VALUE"] > 0 || (int)$ob["PROPERTY_QUANTITY_1_VALUE"] > 0);
//        echo '<pre>', print_r($ob, true), '</pre>';
//        var_dump(($ob["PROPERTY_EXIST_VALUE"] === "Есть в наличии" || $ob["PROPERTY_EXIST_VALUE"] === "Доступен под заказ"));
        $isAvailable =
          $ob["ACTIVE"] === "Y"
          && ($ob["PROPERTY_EXIST_VALUE"] === "Есть в наличии" || $ob["PROPERTY_EXIST_VALUE"] === "Доступен под заказ")
          && ((int)$ob["PROPERTY_QUANTITY_VALUE"] > 0 || (int)$ob["PROPERTY_QUANTITY_1_VALUE"] > 0);
        return $isAvailable;
      }
      return false;
    }
  }
  
  function getMarkerCode($goodID, $offerID) {
    $code = false;
    if ($offerID) {
      $res = CIBlockElement::GetList(
        [],
        [
          "IBLOCK_ID" => 13,
          "ID" => $offerID,
        ],
        false, false,
        [
          "ID",
          "IBLOCK_ID",
          "PROPERTY_MARK_CODE"
        ]
      );
      if ($ob = $res->Fetch()) {
        $code = $ob["PROPERTY_MARK_CODE_VALUE"];
      }
    }
    if (!$code) {
      $res = CIBlockElement::GetList(
        [],
        [
          "IBLOCK_ID" => 12,
          "ID" => $goodID,
        ],
        false, false,
        [
          "ID",
          "IBLOCK_ID",
          "PROPERTY_MARK_CODE"
        ]
      );
      if ($ob = $res->Fetch()) {
        $code = $ob["PROPERTY_MARK_CODE_VALUE"];
      }
    }
    return $code;
  }
  
  function getProductDataByID($id) {
    $rdb = CIBlockElement::GetList(
      [],
      [
        "IBLOCK_ID" => CATALOG_IB,
        "ID" => $id
      ], false, false,
      [
        "ID", "NAME", "PREVIEW_PICTURE", "DETAIL_PICTURE", "PROPERTY_ARTICLE", "DETAIL_PAGE_URL"
      ]
    );
    if ($obj = $rdb->GetNext()) {
      echo '<pre>', print_r($obj, true), '</pre>';
      $picture = $obj["PREVIEW_PICTURE"] ?: $obj["DETAIL_PICTURE"];
      $pictArray = CFile::GetFileArray($picture);
      return [
        "name" => $obj["NAME"],
        "picture" => $picture ? CFile::GetPath($picture) : "",
//        "picture" => $picture ? CFile::ResizeImageGet($pictArray, array("width" => 70, "height" => 70))["src"] : "",
        "article" => $obj["PROPERTY_ARTICLE_VALUE"],
        "link" => $obj["DETAIL_PAGE_URL"]
      ];
    }
  }
  
  function getAdminMessageBody($order, $goods, $orderID) {
    $orderCost = 0;
    $res = '<div style="width:100%;max-width:800px">';
    $res .= 'Поздравляем! <br> На вашем сайте «Культура оружия» был оформлен заказ через корзину. <br>';
    $res .= 'Адрес страницы: <a href="https://shop4shoot.com/" target="_blank">https://shop4shoot.com/</a><br> <br>';
    $res .= '<b>Имя: </b>' . $order["name"] . '<br>';
    $res .= '<b>Фамилия: </b>' . $order["second-name"] . '<br>';
    $res .= '<b>Отчество: </b>' . $order["surname"] . '<br>';
    $res .= '<b>Телефон: </b>' . $order["phone"] . '<br>';
    $res .= '<b>E-mail: </b><a href="mailto:' . $order["email"] . '" target="_blank">' . $order["email"] . '</a><br><br>';
    $res .= '<b>Способ оплаты:&nbsp;</b>Банковская карта<br>';
    $res .= '<b>Способ доставки:&nbsp;</b>СДЭК<br>';
    $res .= '<b>Адрес доставки: </b>' . $order["delivery-address"] . '<br><br>';
    $res .= '<b>Номер заказа:</b> '.$orderID;
    $res .= '<div style="margin:25px 0 10px"><b></b><div><br>';
    $res .= '<table style="width:100%;border:0;border-collapse:collapse;margin:0 0 25px"><tr>';
    $res .= '<th style="font-family:Arial;font-size:12px;text-align:left;padding:5px 10px;border-top:1px solid #aaa;border-bottom:1px solid #aaa"></th>';
    $res .= '<th style="font-family:Arial;font-size:12px;text-align:left;padding:5px 10px;border-top:1px solid #aaa;border-bottom:1px solid #aaa">Товар</th>';
    $res .= '<th style="font-family:Arial;font-size:12px;text-align:left;padding:5px 10px;border-top:1px solid #aaa;border-bottom:1px solid #aaa">Цена</th>';
    $res .= '<th style="font-family:Arial;font-size:12px;text-align:left;padding:5px 10px;border-top:1px solid #aaa;border-bottom:1px solid #aaa">Количество</th>';
    $res .= '<th style="font-family:Arial;font-size:12px;text-align:left;padding:5px 10px;border-top:1px solid #aaa;border-bottom:1px solid #aaa">Сумма</th>';
    $res .= '</tr>';
    foreach($goods as $good) {
      $productData = getProductDataByID($good["PRODUCT_ID"]);
      $totalPrice = number_format($good["PRICE"] * (int)$good["QUANTITY"], 0, ".", " ");
      $goodPrice =  number_format($good["PRICE"], 0, ".", " ");
      $orderCost += $good["PRICE"] * (int)$good["QUANTITY"];
      $res .= '<tr>';
      $res .= '<td style="width:15%;vertical-align:top;font-family:Arial;font-size:12px;text-align:left;padding:10px;border-bottom:1px solid #aaa">';
      $res .= '<a href="http://shop4shoot.com/'.$productData["link"].'" target="_blank"><img style="width: 70px; height: 70px;" src="'
        .$productData["picture"].'"></a>';
      $res .= '</td>';
      $res .= '<td style="vertical-align:top;font-family:Arial;font-size:12px;text-align:left;padding:10px;border-bottom:1px solid #aaa">';
      $res .= '<div><a href="http://shop4shoot.com/'.$productData["link"].'" target="_blank">'.$productData["name"].'</a></div>';
      $res .= '<div style="font-style:italic">'.$productData["article"].'</div>';
      $res .= '</td>';
      $res .= '<td style="vertical-align:top;white-space:nowrap;font-family:Arial;font-size:12px;text-align:left;padding:10px;border-bottom:1px solid #aaa">'.$goodPrice.' ₽</td>';
      $res .= '<td style="vertical-align:top;white-space:nowrap;font-family:Arial;font-size:12px;text-align:left;padding:10px;border-bottom:1px solid #aaa">'.(int)$good["QUANTITY"].'</td>';
      $res .= '<td style="vertical-align:top;white-space:nowrap;font-family:Arial;font-size:12px;text-align:left;padding:10px;border-bottom:1px solid #aaa">'.$totalPrice.' ₽</td>';
      $res .= '</tr>';
    };
    $res .= '</table>';
    $res .= '<br> <div><b>Стоимость доставки:&nbsp;</b> -</div>';
    $res .= '<div><b>Сумма заказа без скидки:&nbsp;</b> '. number_format($orderCost, 0, ".", " ").' ₽</div>';
    $res .= '<div><b>Скидка:&nbsp;</b> -</div>';
    $res .= '<div><b>Стоимость заказа со скидкой:&nbsp;</b>'. number_format($orderCost, 0, ".", " ").' ₽</div><br>';
    $res .= '<div><b>ИТОГО: '. number_format($orderCost, 0, ".", " ").'₽</b></div>';
    $res .= '<div><a href="http://shop4shoot.firsttop.beget.tech/cart/?order_id='.$orderID.'">Оплатить</a></div>';
    $res .= '<br> <br> <br> <br><br>---<br>';
    $res .= 'Вы можете просмотреть и изменить статус этого заказа в <a href="http://shop4shoot.firsttop.beget.tech/bitrix/admin/sale_order_view.php?amp%3Bfilter=Y&%3Bset_filter=Y&lang=ru&ID='.$orderID.'" target="_blank" >админке сайта</a>';
    $res .= '';
    $res .= '';
    $res .= '</div>';
    return $res;
  }
  
  function logger($message) {
    $log_dirname = $_SERVER['DOCUMENT_ROOT'] . '/logs';
    
    $bt = debug_backtrace();
    $bt = $bt[0];
    $dRoot = $_SERVER["DOCUMENT_ROOT"];
    $dRoot = str_replace("/", "\\", $dRoot);
    $bt["file"] = str_replace($dRoot, "", $bt["file"]);
    $dRoot = str_replace("\\", "/", $dRoot);
    $bt["file"] = str_replace($dRoot, "", $bt["file"]);
    
    if (!file_exists($log_dirname)) {
      mkdir($log_dirname, 0777, true);
    }
    $log_file_data = $log_dirname . '/log_' . date('d-M-Y') . '.log';
    file_put_contents($log_file_data, 'File: ' . $bt["file"] . ' [' . $bt["line"] . '] ' . "\n" . date("H:i:s") . ' - ' . $message . "\n", FILE_APPEND);
    
    //TODO Скрипт удаления лишних логов и файлов с лидами
    
    $dirLog = $log_dirname;
    $filesAndDirs = scandir($dirLog);
    
    $date6days = date("d-M-Y", time() - 86400 * 6);
    $date5days = date("d-M-Y", time() - 86400 * 5);
    $date4days = date("d-M-Y", time() - 86400 * 4);
    $date3days = date("d-M-Y", time() - 86400 * 3);
    $date2days = date("d-M-Y", time() - 86400 * 2);
    $dateYesterday = date("d-M-Y", time() - 86400);
    $dateToday = date("d-M-Y", time());
    
    $resultFilesArray = [];
    
    if ($filesAndDirs) {
      
      // Получим все наши файлы логов и лидов в один массив
      foreach ($filesAndDirs as $file) {
        $resultFilesArray[] = $dirLog . '/' . $file;
      }
      
      // Удалим лишние файлы, при этом пропуская нужные нам
      foreach ($resultFilesArray as $delFile) {
        
        if (
          strpos($delFile, $dateToday) !== false ||
          strpos($delFile, $dateYesterday) !== false ||
          strpos($delFile, $date2days) !== false ||
          strpos($delFile, $date3days) !== false ||
          strpos($delFile, $date4days) !== false ||
          strpos($delFile, $date5days) !== false ||
          strpos($delFile, $date6days) !== false ||
          strpos($delFile, '/.') !== false ||
          strpos($delFile, '/..') !== false
        ) {
          continue;
        } else {
          unlink($delFile);
        }
      }
    }
  }
  
  function debuger($var, $all = false, $die = false)
  {
    global $USER;
    if(($USER->isAdmin()) || ($all == true))
    {
      $bt =  debug_backtrace();
      $bt = $bt[0];
      $dRoot = $_SERVER["DOCUMENT_ROOT"];
      $dRoot = str_replace("/","\\",$dRoot);
      $bt["file"] = str_replace($dRoot,"",$bt["file"]);
      $dRoot = str_replace("\\","/",$dRoot);
      $bt["file"] = str_replace($dRoot,"",$bt["file"]);
      ?>
      <div style='font-size:9pt; color:#000; background:#fff; border:1px dashed #000;'>
        <div style='padding:3px 5px; background:#99CCFF; font-weight:bold;'>File: <?=$bt["file"]?> [<?=$bt["line"]?>]</div>
        <pre style='padding:10px;'><?print_r($var)?></pre>
      </div>
      <?
    }
    if($die)
    {
      die;
    }
  }
  
  function getSectionPictureByID($id) {
    $res = CIBlockSection::GetList(
      [],
      [
        "IBLOCK_ID" => 12,
        "ID" => $id
      ], false, [
        "PICTURE"
      ]
    )->Fetch();
    if ($res && $res["PICTURE"]) {
      return CFile::GetPath($res["PICTURE"]);
    }
    return false;
  }
  
  function getHeaderSliderPictures() {
    $res = CIBlockElement::GetList(
      [],
      [
        "IBLOCK_ID" => 19,
        "ID" => 3022
      ], false, false,
      [
        "ID",
        "IBLOCK_ID",
        "NAME",
        "PROPERTY_SLIDER"
      ]
    )->GetNextElement();
    if ($res) {
      return $res->getProperties()["SLIDER"]["VALUE"];
    }
    return false;
  }
  
  function getBrandsMenu() {
    $arr = [];
    $result = [];
    $tmp = [];
    $filterData = [
      "lat" => [],
      "num" => [],
      "cyr" => []
    ];
    $elements = \Bitrix\Iblock\Elements\ElementTestCatalogTable::getList([
      'select' => ['ID', 'NAME', 'BRAND_' => 'BRAND']
    ])->fetchAll();
    foreach ($elements as $element) {
      if ($element["BRAND_VALUE"]) {
        $arr[] = $element["BRAND_VALUE"];
      }
    }
    $arr = array_unique($arr);
    sort($arr);
    foreach ($arr as $brandName) {
      $letter = mb_strtoupper(mb_substr($brandName, 0, 1));
      $tmp[$letter][] = [
        "TEXT" => $brandName,
        "PARAMS" => [
          "DEPTH_LEVEL" => 3,
          "BRANDS" => "Y"
        ],
        "CHILDREN" => []
      ];
      if (preg_match("/[A-Za-z]/", $letter)) {
        if (!in_array($letter, $filterData["lat"])) $filterData["lat"][] = $letter;
      }
      if (preg_match("/[А-Яа-я]/", $letter)) {
        if (!in_array($letter, $filterData["cyr"])) $filterData["cyr"][] = $letter;
      }
      if (preg_match("/[0-9]/", $letter)) {
        if (!in_array($letter, $filterData["num"])) $filterData["num"][] = $letter;
      }
    }
    foreach ($tmp as $key => $data) {
      $result[] = [
        "TEXT" => $key,
        "PARAMS" => [
          "DEPTH_LEVEL" => 2,
          "BRANDS" => "Y"
        ],
        "CHILDREN" => $data
      ];
    }
    
    return [
      "data" => [
        "TEXT" => "бренды",
        "PARAMS" => [
          "DEPTH_LEVEL" => 1,
          "BRANDS" => "Y"
        ],
        "CHILDREN" => $result
      ],
      "keys" => array_keys($tmp),
      "filter" => $filterData
    ];
  }

//  2430
  function getElementFilters($sectionID = null, $elementID = null, $sectionCode = null) {
    $me = $_SERVER["REMOTE_ADDR"] === "178.155.4.14" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "178.155.4.14";
    $types = [
      "product" => [],
      "weapon" => [],
      "sections" => [],
    ];
    
    // Данное решение выводит разделы 2-го уровня
    $lvl2Section = [];
    $lvl3Section = [];
    $lvl4Section = [];
    $mainSection = [];
    $nav = CIBlockSection::GetNavChain(false, $sectionID);
    $lastParentID = 0;
    while ($arSection = $nav->GetNext()) {
      if ($me) {
//        echo '<pre>', print_r($arSection, true), '</pre>';
      }
      if ($arSection["DEPTH_LEVEL"] == 1) {
        $mainSection = $arSection;
        $lastParentID = $arSection["ID"];
      }
      if ($arSection["DEPTH_LEVEL"] == 2) {
        $lvl2Section = $arSection;
        $lastParentID = $arSection["ID"];
      }
      if ($arSection["DEPTH_LEVEL"] == 3) {
        $lvl3Section = $arSection;
        $lastParentID = $arSection["ID"];
      }
      if ($arSection["DEPTH_LEVEL"] == 4) {
        $lvl4Section = $arSection;
        $lastParentID = $arSection["ID"];
      }
    }
    if ($me) {
//      echo '<pre>', print_r($lastParentID, true), '</pre>';
    }
    $sRes = CIBlockSection::GetList(
      [
        "NAME" => "ASC"
      ],
      [
        "SECTION_ID" => $lastParentID,
//        "SECTION_ID" => $mainSection["ID"],
        "ACTIVE" => "Y",
        "CNT_ACTIVE" => "Y"
      ],
      true
    );
    while ($ar_result = $sRes->GetNext()) {
      if ($ar_result["CODE"]) {
        $types["sections"][$ar_result["CODE"]] = [
          "CODE" => $ar_result["CODE"],
          "NAME" => $ar_result["NAME"]
        ];
      }
    }
    
    
    $dbRes = \CIBlockElement::GetList(
      false,
      [
        "IBLOCK_ID" => 12,
        "SECTION_ID" => $sectionID,
        "INCLUDE_SUBSECTIONS" => "Y",
      ], false, false,
      [
        "ID",
        "IBLOCK_ID",
        "PROPERTY_PRODUCT_TYPE",
        "PROPERTY_WEAPON_TYPE",
        "PROPERTY_TAG_BRAND",
      ]);
    while ($obj = $dbRes->Fetch()) {
//      if ($obj["PROPERTY_PRODUCT_TYPE_VALUE"] && !in_array($obj["PROPERTY_PRODUCT_TYPE_VALUE"], $types["product"])) {
//        $types["product"][] = $obj["PROPERTY_PRODUCT_TYPE_VALUE"];
//      }
//      if ($obj["PROPERTY_WEAPON_TYPE_VALUE"] && !in_array($obj["PROPERTY_WEAPON_TYPE_VALUE"], $types["weapon"])) {
//        $types["weapon"][] = $obj["PROPERTY_WEAPON_TYPE_VALUE"];
//      }
      if ($obj["PROPERTY_TAG_BRAND_VALUE"] && !in_array($obj["PROPERTY_TAG_BRAND_VALUE"], $types["weapon"])) {
        $types["weapon"][] = $obj["PROPERTY_TAG_BRAND_VALUE"];
      }
    }
    return $types;
  }
  
  function getSectionIDByCode($code) {
    $sectDB = CIBlockSection::GetList(
      [],
      [
        "CODE" => $code,
        "IBLOCK_ID" => CATALOG_IB
      ], false, ["ID"]
    );
    if ($obj = $sectDB->Fetch()) {
      return $obj["ID"];
    }
    return false;
  }
  
  function getGOATProduct($sectionID) {
    $id = (int)$sectionID;
    if (!$id) {
      $id = getSectionIDByCode($sectionID);
    }
    $dbRes = CIBlockElement::GetList(
      [],
      [
        "SECTION_ID" => $id,
        "IBLOCK_ID" => CATALOG_IB,
        "ACTIVE" => "Y",
        "PROPERTY_GOAT_VALUE" => "Y",
        "INCLUDE_SUBSECTIONS" => "Y",
      ]
    );
    if ($obj = $dbRes->Fetch()) {
      return $obj["ID"];
    }
    return false;
  }
  
  function getArticleData($sectionID) {
    $id = (int)$sectionID;
    if (!$id) {
      $id = getSectionIDByCode($sectionID);
    }
    $dbRes = CIBlockSection::GetList(
      [],
      [
        "IBLOCK_ID" => CATALOG_IB,
        "ID" => $id
      ], false,
      [
        "UF_NAME", "UF_PHOTO", "UF_LINK"
      ]
    );
    if ($obj = $dbRes->GetNext()) {
      if ($obj["UF_LINK"] && $obj["UF_NAME"]) {
        return [
          "LINK" => $obj["UF_LINK"],
          "NAME" => $obj["UF_NAME"],
          "PHOTO" => CFile::GetPath($obj["UF_PHOTO"])
        ];
      } else {
        return false;
      }
    }
    return false;
  }