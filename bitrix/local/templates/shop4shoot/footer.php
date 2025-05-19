<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?php
  

  
  /**
   * @global CMain $APPLICATION
   * */ ?>


<footer class=" lazyload tone-dark default_bg">
  <div class="shadow"></div>
  <?php /* ?>
  <div class="footer-menu-wrap">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 left">
          <div class="phone">
            <div>
              <div class="phone-value">PHONES</div>
            </div>
          </div>
          <div class="button-wrap">
            <a
              class="button-def main-color  call-modal callform"
              data-call-modal="form">CALLBACK_POPUP_BUTTON</a>
          </div>
        </div>
        <div class=" center">
          <div class="copyright-text">
            <div class="political">
              <a class="call-modal callagreement" data-call-modal="agreement"><span
                  class="bord-bot">AGREEMENT</span></a>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 right">
          SOCIALS
          <div class="email"><a
              href="mailto:EMAILS"><span
                class="bord-bot white">EMAILS</span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <?php */ ?>
  <div class="footer-bot">
    <div class="container">
      <div class="row">
        <div class="col-lg-9 col-md-9 col-sm-7 col-xs-12  left">
          <div class="top-text">Контакты: <br>
            
            
            <a href="tel:88002501101">8 800 250-11-01</a> <br>
            <a href="tel:89152602018">+7 (915) 260-20-18</a> <br>
            <a href="mailto:shop@weapon-culture.ru">shop@weapon-culture.ru</a></div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-5 col-xs-12 right">
          <a class="copyright">
            <table>
              <tr>
                <td>
                  <span
                    class="text">
                    Copyright © shop4shoot.com <?= date("Y") ?>
                  </span>
                </td>
                <!--                <td>-->
                <!--                  <img class="img-responsive" src="LOGOTYPE" alt="logotype"/>-->
                <!--                </td>-->
              </tr>
            </table>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
</div>
<?php // if ($KRAKEN_TEMPLATE_ARRAY["WIDGET_FAST_CALL_ON"]["VALUE"][0]): ?>
<!--  <div id="callphone-mob" class="callphone-wrap">-->
<!--    --><?php // if (strlen($KRAKEN_TEMPLATE_ARRAY["WIDGET_FAST_CALL_DESC"]["VALUE"]) > 0): ?>
<!--      <span class="callphone-desc">--><?php //= $KRAKEN_TEMPLATE_ARRAY["WIDGET_FAST_CALL_DESC"]["VALUE"] ?><!--</span>-->
<!--    --><?php // endif; ?>
<!--    <a class='callphone' href='tel:--><?php //= $KRAKEN_TEMPLATE_ARRAY["WIDGET_FAST_CALL_NUM"]["VALUE"] ?><!--'></a>-->
<!--  </div>-->
<?php // endif; ?>

</div> <!-- /wrapper -->

<?php if ($APPLICATION->GetCurDir() != SITE_DIR . "cart/"): ?>
<?php
  $APPLICATION->IncludeFile(
    "/include/cart.php",
    array(),
    array("MODE" => "text")
  );
  
?>
<?php endif; ?>


<div class="shadow-detail"></div>

<?php /* ?>
<div class="modalArea shadow-modal-wind-contact">
  <div class="shadow-modal"></div>
  
  <div class="kraken-modal window-modal">
    
    <div class="kraken-modal-dialog">
      
      <div class="dialog-content">
        <a class="close-modal wind-close"></a>
        
        <div class="content-in">
          <div class="list-contacts-modal">
            <table>
              
              <tr>
                <td>
                  CONTACTS
                </td>
              </tr>
              
              
              <tr>
                <td>
                  EMAILS
                </td>
              </tr>
            
            
            </table>
          </div>
        </div>
      
      </div>
    
    </div>
  </div>
</div>
<?php */ ?>
<?php
  if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/include/feedbackModal.php')) {
    require_once($_SERVER['DOCUMENT_ROOT'] . '/include/feedbackModal.php');
  }
?>


<a href="#body" class="up scroll"></a>

<input class="domen-url-for-cookie" type="hidden" value="">


<script type="text/javascript">


</script>


<?php $APPLICATION->ShowViewContent("service_close_body"); ?>


<script>
  window.addEventListener("DOMContentLoaded", () => {
    //  grecaptcha.ready(function () {
    //    grecaptcha.execute("<?php //= SITE_KEY?>//", {action: "submit"}).then(function (token) {
    //      document.querySelectorAll("input[name=recaptcha]").forEach(elem => {
    //        if (elem) elem.value = token;
    //      })
    //    });
    //  });
    const lazyImages = document.querySelectorAll("img[data-src]")
    if (lazyImages.length) {
      lazyImages.forEach(img => {
        img.src = img.getAttribute("data-src")
      })
    }
  })
  $(document).on("focus", "form input.phone",
    function () {
      /*if(!device.android())*/
      $(this).mask("+7 (999) 999-99-99");
    }
  );
</script>
<script src="//code.jivo.ru/widget/41czycJrpc" async></script>

</body>
</html>