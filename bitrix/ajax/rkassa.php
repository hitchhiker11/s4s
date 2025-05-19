<?php
  require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');
  logger(print_r($_REQUEST, true));

  use Bitrix\CKrakenOrders;
  use Bitrix\CKrakenOrdersItems;
  
  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/components/concept/kraken.cart/core.php");
  
  $orderID = $_REQUEST["InvId"];
  $sentFile = $_SERVER["DOCUMENT_ROOT"] . "/ajax/sended.json";
  
  if (!$orderID) die();
  $sent = json_decode(file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/ajax/sended.json"), true);
  if (is_array($sent) && in_array($orderID, $sent)) {
    LocalRedirect("/");
  }
  
  $orderData = CKrakenOrder::GetByID($orderID, SITE_ID);
  if (!$orderData || !$orderData["EMAIL"]) die();
  
  $to = $orderData["EMAIL"];
  
  $message = "
      Ваш заказ №$orderID оплачен и находится в обработке. <br><br>
      Наши менеджеры свяжутся с Вами. <br><br>
      При возникновении вопросов Вы можете связаться с нами <br><br>
      Телефон: <a href='tel:+79299892661' target='_blank'>+7 (929) 989-26-61</a><br>
      Почта: <a href='mailto:shop@weapon-culture.ru' target='_blank'>shop@weapon-culture.ru</a><br>
      <a href='https://t.me/+79967356433' target='_blank'>Telegram</a><br>
    ";
  
  $subject = "Заказ №$orderID оплачен";
  $boundary = "--" . md5(uniqid(time())); // генерируем разделитель
  $headers = "MIME-Version: 1.0\n";
  $headers .= "Content-Type: text/html; boundary=\"$boundary\"\n";
  $headers .= "From: info@weapon-culture.ru <info@weapon-culture.ru>\r\n";
  
  if ($to == "support@ft10.ru") {
    $to .= " kd@ft10.ru";
  }
  
  if (!mail($to, $subject, $message, $headers)) {
    $result = [
      "error" => "Y"
    ];
    $result["mess"] = $message;
    logger(print_r($result, true));
  } else {
    $sent[] = $orderID;
    file_put_contents($sentFile, json_encode($sent));
    LocalRedirect("/");
  }
  die();
  