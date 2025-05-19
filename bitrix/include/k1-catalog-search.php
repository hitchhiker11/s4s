<style>
  .k1-catalog-search-form-wrapper {
    box-shadow: 0 5px 15px 0 rgba(0,0,0, 0.25);
    background-color: white;
    padding: 30px 0;
  }

  .k1-search-checkboxes {
    padding-left: 60px;
    display: flex;
    gap: 1rem 2rem;
    margin-top: 1rem;
    flex-wrap: wrap;
    z-index: 10;
  }

  .k1-search-input:not(:focus) {
    outline: 1px solid grey
  }
  
  .k1-search-panel {
    display: flex;
    align-items: center;
    gap: 40px;
  }
  .k1-search-panel .k1-search-panel__input {
    flex: 1 1 100%;
    position: relative;
  }
  .k1-search-panel .k1-search-panel__input label {
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }
  .k1-search-panel .k1-search-panel__input input {
    width: 100%;
    background-color: rgba(227,227,226, 0.5);
    border-radius: 30px;
    padding: 16px 30px 17px 30px ;
    border: none;
    outline: none;
    box-shadow: 0 4px 20px 0 rgba(0,0,0,0.3)
  }
  .k1-search-panel .search-icon {
    position: absolute;
    width: 35px;
    height: 35px;
    background: url('/bitrix/templates/concept_kraken_s1/images/search/search_gr.svg') center no-repeat;
    background-size: 35px;
    top: 50%;
    right: 20px;
    transform: translate(0,-50%);
    cursor: pointer;
  }

  .k1-search-panel .k1-search-panel__button .button-def {
    padding: 20px 56px 20px 48px;
  }

  .k1-search-panel__categories .k1-search-panel__categories-text {
    background-color: #52514F;
    padding-top: 20px;
    padding-bottom: 20px;
    display: block;
  }
  .k1-search-panel__categories .k1-search-checkboxes {
    display: none;
    position: absolute;
    gap: 5px;
    flex-direction: column;
    box-shadow: 0 4px 20px 0 rgba(0,0,0,0.30);
    border-radius: 30px;
    z-index: 11;
    background-color: white;
    padding: 30px;
    margin-top: 8px;
  }
  .k1-search-panel__categories .k1-search-checkboxes label {
    cursor: pointer;
  }

  .k1-search-panel__categories .k1-search-checkboxes input {
    opacity: 0;
    visibility: hidden;
    appearance: none;
  }

  .k1-search-panel__categories .k1-search-checkboxes input:checked + span:after{
    display: inline-block;
  }

  .k1-search-panel__categories .k1-search-checkboxes input + span {
    position: relative;
  }
  .k1-search-panel__categories .k1-search-checkboxes input + span:before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    border: 1px solid #52514F;
    margin-right: 9px;
  }
  .k1-search-panel__categories .k1-search-checkboxes input + span:after {
    position: absolute;
    left: 2px;
    top: 5px;
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 3px;
    background: #52514F;
    display: none;
  }
  
  @media (max-width: 767px) {
    .k1-search-checkboxes {
      padding-left: 0;
    }
    .k1-search-panel {
      flex-wrap: wrap;
      gap: 20px 40px;
      justify-content: space-between;
      & .k1-search-panel__categories {
        order: 2;
      },
      & .k1-search-panel__input {
      order: 1;
    }
      & .k1-search-panel__button {
        order: 3;
      }
    }
  }
  @media (max-width: 480px) {
    .k1-search-panel {
      gap: 20px;
      & .k1-search-panel__button {
        & .button-def {
          padding-left: 26px;
          padding-right: 26px;
        }
      }
    }
  }
</style>
<div class="k1-catalog-search-form-wrapper">
  <div class="container">
    <form action="/search/catalog/" class="search-form k1-catalog-search-form k1-catalog-search-form-js">
      <div class="k1-search-panel">
        <div class="k1-search-panel__categories">
          <div class="k1-search-panel__categories-text button-def search-btn-style elips ">Категории 🡫</div>
          <div class="k1-search-checkboxes">
            <label>
              <input type="checkbox" name="tag" value="brand">
              <span>Бренд</span>
            </label>
            <label>
              <input type="checkbox" name="tag" value="spares">
              <span>Запчасти</span>
            </label>
            <label>
              <input type="checkbox" name="tag" value="equip">
              <span>Экипировка</span>
            </label>
          </div>
        </div>
        <div class="k1-search-panel__input">
          <label >
            <input style="" name="q" class="k1-search-input search-style search-js" type="text" value="">
          </label>
          <div class="search-icon hidden-xs"></div>
        </div>
        <div class="k1-search-panel__button">
          <button
            class="button-def elips search-btn-style main-color button-def--main-color"
            type="submit">🡨 Найти
          </button>
        </div>
      </div>
      <?php /* ?>
      
      <table class="search-panel">
        <tr>
          <td class="col-lg-8 col-md-7 col-sm-7 col-xs-9">
            <div class="search-input-box">
              
              <input style="" name="q" class="k1-search-input search-style search-js" type="text" value="">
              <div class="search-icon search-icon-js hidden-xs"></div>
            
            </div>
            
          </td>
          <td class="col-lg-4 col-md-5 col-sm-5 col-xs-3" valign="top">
            <div class="row">
              <table class="search-btns-box active before-active">
                <tr>
                  <td class="col-lg-8 col-md-8 col-sm-8 col-xs-0 show-search-list-parent hidden-xs">
                  </td>
                  <td class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <button
                      class="button-def search-btn-style main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> hidden-xs"
                      type="submit">Найти
                    </button>
                    <button
                      class="button-def search-btn-style mob main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> visible-xs"
                      type="submit">
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      
      </table>
      <div class="clearfix"></div>
      <?php */ ?>
    </form>
  </div>
</div>
<div class="container k1-search-description" >
  <?php
    global $APPLICATION;
    if (!str_contains($APPLICATION->GetCurPage(), "search/catalog")) {
      if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/include/orderTableDescription.php')) {
        include($_SERVER['DOCUMENT_ROOT'] . '/include/orderTableDescription.php');
      }
    }
  
  ?>
</div>

<script>

</script>