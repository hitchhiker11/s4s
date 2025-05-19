var lazyController = false,
  parentContainerSlide = {},
  parent = {},
  flagSlider = 0,
  customEvent = false,
  arImagesLazyload = {},
  isIos = device.ios();


var paramsLazy = {
  scrollDirection: 'vertical',
  threshold: 500,
  visibleOnly: true,
  effect: 'fadeIn'
};

function buildFormValues(form, params) {
  
  params = params || null;
  
  var formSendAll = new FormData();
  
  
  if (params) {
    for (key in params) {
      formSendAll.append(key, params[key]);
    }
  }
  
  form_arr = form.find(':input,select,textarea').serializeArray();
  
  
  for (var i = 0; i < form_arr.length; i++) {
    if (form_arr[i].value.length > 0)
      formSendAll.append(form_arr[i].name, form_arr[i].value);
    
    
  }
  ;
  
  if (form.hasClass('file-download')) {
    form.find('input[type=file]').each(function (key) {
      
      var inp = $(this);
      var file_list_name = "";
      
      $(inp[0].files).each(
        function (k) {
          formSendAll.append(inp.attr('name'), inp[0].files[k], inp[0].files[k].name);
        }
      );
      
    });
  }
  
  return formSendAll;
}

function checkToolSettings() {
  
  if ($('div.tool-settings').length > 0) {
    
    if ($('div.kraken-sets-list-wrap').hasClass('on')) {
      $('div.tool-settings').addClass('on');
    } else {
      $('div.tool-settings').removeClass('on');
    }
    
  }
  
}

function menuOffset(li) {
  var mainPosition = $(li).parents('.main-menu-inner').width() + $(li).parents(
    '.main-menu-inner').offset().left;
  var liPosition = $(li).children('ul').offset().left + $(li).children('ul').width();
  if (liPosition >= mainPosition) $(li).addClass('reverse');
}

function addGoal(action) {
  
  if (typeof globalGoals !== "undefined") {
    if (globalGoals[action])
      $('body').append(globalGoals[action]);
  }
}

function showProcessLoad() {
  $('.google-spin-wrapper').addClass('active');
}

function closeProcessLoad() {
  $('.google-spin-wrapper').removeClass('active');
}

function startBlurWrapperContainer() {
  $('body').addClass('modal-open');
  $('.wrapper').addClass('blur');
  
  if (isIos) {
    $("body").addClass("modal-ios");
  }
}

function stopBlurWrapperContainer() {
  $('body').removeClass('modal-open');
  $('.wrapper').removeClass('blur');
  
  if (isIos) {
    $("body").removeClass("modal-ios");
    window.scrollTo(0, cur_pos);
  }
}


function updateLazyLoad() {
  $('.lazyload').Lazy(
    {
      scrollDirection: 'vertical',
      threshold: 500,
      visibleOnly: true,
      effect: 'fadeIn',
      afterLoad: function (element) {
        parent = $(element).parent();
        parentContainerSlide = parent.find('.parent-slider-item-js');
        
        if ($(element).hasClass("slider-start")) {
          
          if (typeof arImagesLazyload["id" + $(element).attr("data-id")] === "undefined")
            arImagesLazyload["id" + $(element).attr("data-id")] = {"s": 0, "f": 0, "type": null};
          
          arImagesLazyload["id" + $(element).attr("data-id")].s = 1;
          
          
          arImagesLazyload["id" + $(element).attr("data-id")].type = parentContainerSlide;
          
        }
        
        
        if ($(element).hasClass('slider-finish')) {
          
          if (typeof arImagesLazyload["id" + $(element).attr("data-id")] === "undefined")
            arImagesLazyload["id" + $(element).attr("data-id")] = {"s": 0, "f": 0, "type": null};
          
          arImagesLazyload["id" + $(element).attr("data-id")].f = 1;
          arImagesLazyload["id" + $(element).attr("data-id")].type = parentContainerSlide;
          
        }
        
        if ($(element).hasClass('slider-finish') || $(element).hasClass("slider-start")) {
          for (key in arImagesLazyload) {
            
            if (arImagesLazyload[key].s == 1 && arImagesLazyload[key].f == 1) {
              /*if( arImagesLazyload[key].type.hasClass('first-slider') && !arImagesLazyload[key].type.hasClass('slider-init'))
								initFSlider(arImagesLazyload[key].type);*/
              
              controllerSliders(arImagesLazyload[key].type);
              
              delete arImagesLazyload[key];
            }
          }
        }
        
        
        if ($(element).parents(".parent-video-bg").find(".videoBG").length > 0)
          correctSizeVideoBg($(element).parents(".parent-video-bg").find(".videoBG"));
        
        
        if ($(element).hasClass('map-start'))
          generateMaps($(element).parents("div.block"));
        
        if ($(element).hasClass('video-start'))
          generateVideos($(element).parents("div.block"));
        
        if ($(element).hasClass('video-start-js'))
          generateVideos($(element).parents("div.video-start-parent"));
        
        if ($(element).hasClass('videoBG-start'))
          generateVideoBG($(element).parents("div.block"));
        
        if ($(element).hasClass('videoBG-start-fb'))
          generateVideoBG($(element).parents("div.first-block"));
      }
    }
  );
}


function generateMaps(container) {
  var mapBlock = $(".iframe-map-area", container);
  
  if (mapBlock.length > 0) {
    mapBlock.each(
      function (index, element) {
        $(element).after($(element).attr("data-src"));
        $(element).remove();
      }
    );
  }
}

function generateVideos(container) {
  
  var videoBlock = $(".iframe-video-area", container);
  
  if (videoBlock.length > 0) {
    videoBlock.each(
      function (index, element) {
        $(element).after($(element).attr("data-src"));
        $(element).remove();
      }
    );
  }
}

function setSharesValues() {
  
  if ($(".public_shares").length > 0) {
    
    var title = "",
      description = "",
      image = "",
      url = "";
    
    if ($("meta[property=\"og:title\"]").length)
      title = $("meta[property=\"og:title\"]").attr("content");
    
    if ($("meta[property=\"og:description\"]").length)
      description = $("meta[property=\"og:description\"]").attr("content");
    
    if ($("meta[property=\"og:image\"]").length)
      image = $("meta[property=\"og:image\"]").attr("content");
    
    if ($("meta[property=\"og:url\"]").length)
      url = $("meta[property=\"og:url\"]").attr("content");
    
    
    $(".public_shares a.vkontakte").attr("onclick", "Share.vkontakte('" + url + "','" + title + "','" + image + "', '" + description + "')");
    $(".public_shares a.facebook").attr("onclick", "Share.facebook('" + url + "','" + title + "','" + image + "', '" + description + "')");
    $(".public_shares a.twitter").attr("onclick", "Share.twitter('" + url + "','" + title + "')");
    
  }
}


function initblueimp() {
  setTimeout(function () {
    $("body").append('<div class="blueimp-gallery blueimp-gallery-controls" id="blueimp-gallery">'
      + '<div class="slides"></div>'
      + '<h3 class="title bold"></h3>'
      + '<a class="prev"></a>'
      + '<a class="next"></a>'
      + '<a class="close"></a>'
      + '</div>');
  }, 2000);
}


function initGlobalBasketItems() {
  
  $.post(
    "/bitrix/tools/kraken/ajax/cart/cart_js_items.php",
    {
      "site_id": $("input.site_id").val()
    },
    function (data) {
      globalBasketItems = data;
      updateBasketPublicInfo();
    },
    "json"
  );
}

function controllerSliders(obj) {
  if (obj) {
    if (!obj.hasClass('slider-init')) {
      
      if (obj.hasClass('slider'))
        initOpSlider(obj);
      
      if (obj.hasClass('slider-mini'))
        initOpMiniSlider(obj);
      
      if (obj.hasClass('advantages-big-slide'))
        initAdvantagesBigSlider(obj);
      
      if (obj.hasClass('advantages-small-slide'))
        initAdvantagesSmallSlider(obj);
      
      if (obj.hasClass('slider-news-big'))
        initNewsBigSlider(obj);
      
      if (obj.hasClass('slider-news-small'))
        initNewsSmallSlider(obj);
      
      if (obj.hasClass('slider-gallery'))
        initGallerySlider(obj);
      
      if (obj.hasClass('menu-banner-slider'))
        initBannerSlider(obj);
      
      if (obj.hasClass('tariff-flat'))
        initTariffsElements(obj);
    }
  }
}

function setChangerBlocks() {
  $("div.changer-blocks").each(
    function () {
      var block = $(this);
      
      $("div.changer-link-js", block).each(
        function (index, value) {
          var arIds = $(this).attr("data-id").split(",");
          
          if (arIds) {
            for (var i = 0; i < arIds.length; i++) {
              
              if ($(this).hasClass("active")) {
                $("div#block" + arIds[i]).removeClass("hidden");
                $('.lazyload').Lazy(paramsLazy);
                
                var obj = $("div#block" + arIds[i]).find(".parent-slider-item-js");
                
                controllerSliders(obj);
              }
              
            }
          }
          
        }
      );
    }
  );
  
  
  $("div.changer-link-js").click(
    function () {
      var block = $(this).parents("div.changer-blocks");
      
      $("div.changer-link-js", block).removeClass("active");
      $(this).addClass("active");
      
      $("div.changer-link-js", block).each(
        function (index, value) {
          var arIds = $(this).attr("data-id").split(",");
          
          if (arIds) {
            for (var i = 0; i < arIds.length; i++) {
              $("div#block" + arIds[i]).addClass("hidden");
            }
          }
          
        }
      );
      
      var arIds = $(this).attr("data-id").split(",");
      
      if (arIds) {
        for (var i = 0; i < arIds.length; i++) {
          $("div#block" + arIds[i]).removeClass("hidden");
          $('.lazyload').Lazy(paramsLazy);
          var obj = $("div#block" + arIds[i]).find(".parent-slider-item-js");
          controllerSliders(obj);
        }
      }
      
      
    }
  );
}

$(document).ready(function () {
  initGlobalBasketItems();
  
  initblueimp();
  setSharesValues();
  
  
  if ($(window).width() >= 991)
    $(".slide-hidden-lg").remove();
  
  else {
    $(".slide-hidden-xs").remove();
  }
  
  
  if ($(window).width() < 768) {
    if ($(".error-404").length > 0)
      $("div.wrapper").addClass('overflow-visible');
  }
  
  
  updateLazyLoad();
  
  if (window.frameCacheVars !== undefined) {
    BX.addCustomEvent("onFrameDataReceived", function (json) {
      customEvent = true;
    });
  }
  
  if (isIos)
    $('div.block.parallax-attachment').removeClass('parallax-attachment');
  
  
  $("form.timer_form").each(function (index) {
    timerCookie($(this));
  });
  
  if ($(window).width() > 1200) {
    $('.elem-hover').hover(function () {
      var total = parseInt($(this).find('.elem-hover-height-more').css(
        'margin-bottom')) + $(this).find('.elem-hover-height').outerHeight(
        true);
      $(this).css({
        'height': total + 'px'
      });
      $(this).find('div.elem-hover-show').slideDown(250);
    }, function () {
      $(this).find('div.elem-hover-show').slideUp(0);
    });
  }
  
  if ($(window).width() > 1024) {
    $('.service-block').find('.service-item').hover(function () {
      var element_height = $(this).find('.service-element').height();
      var element_bot_height = $(this).find('.bot-wrap').height();
      var need_height = element_height - element_bot_height;
      $(this).css({
        'height': need_height + 'px'
      });
    }, function () {
      $(this).css({
        'height': 'auto'
      });
    });
  } else {
    $('.service-block').find('.service-item').hover(function () {
      $(this).css({
        'height': 'auto'
      });
    });
  }
  $("div.expired-page").height($(document).height());
  $("div.error-404").height($(document).height());
  
  if ($(window).width() > 1199) {
    
    
    $('header .main-phone div.phone').hover(function () {
      var itThis = $(this);
      $.data(this, 'timer', setTimeout($.proxy(function () {
        $(itThis).parents(".main-phone").find('.list-contacts').stop(true,
          true).addClass('open');
      }, this), 300));
    }, function () {
      clearTimeout($.data(this, 'timer'));
    });
    
    
    $('header .main-phone div.ic-open-list-contact.open-list-contact').hover(
      function () {
        var itThis = $(this);
        $.data(this, 'timer', setTimeout($.proxy(function () {
          $(itThis).parents(".main-phone").find('.list-contacts').stop(true,
            true).addClass('open');
        }, this), 300));
      },
      function () {
        clearTimeout($.data(this, 'timer'));
      });
    $('header .list-contacts').hover(function () {
    }, function () {
      $(this).removeClass('open');
    });
    
    
    $('nav.main-menu > li.parent.view_2').hover(function () {
      
      var th = $(this);
      
      jQuery.data(this, 'timer', setTimeout(jQuery.proxy(function () {
        
        th.find(".dropdown-menu-view-2").addClass('on');
        setTimeout(function () {
          th.find(".dropdown-menu-view-2").addClass('active');
          $('.lazyload').Lazy(paramsLazy);
        }, 100);
        
        
      }, this), 200));
      
      
    }, function () {
      var th = $(this);
      
      clearTimeout(jQuery.data(this, 'timer'));
      
      th.find(".dropdown-menu-view-2").removeClass('active');
      setTimeout(function () {
        th.find(".dropdown-menu-view-2").removeClass('on');
      }, 100);
      
      
    });
    
    
    $('nav.main-menu > li.parent.view_1').hover(function () {
      jQuery.data(this, 'timer', setTimeout(jQuery.proxy(function () {
        $('ul.child', this).stop(true, true).addClass("show-open");
        menuOffset(this);
        if ($('ul.child', this).width() < $(this).width())
          $('ul.child', this).css('width', $(this).width());
      }, this), 150));
    }, function () {
      clearTimeout(jQuery.data(this, 'timer'));
      $('ul.child', this).stop(true, true).removeClass("show-open");
    });
    
    
    $('nav.main-menu ul.child > li.parent2').hover(function () {
      jQuery.data(this, 'timer', setTimeout(jQuery.proxy(function () {
        $('ul.child2', this).stop(true, true).addClass("show-open");
        menuOffset(this);
      }, this), 100));
    }, function () {
      clearTimeout(jQuery.data(this, 'timer'));
      $('ul.child2', this).stop(true, true).removeClass("show-open");
    });
    
    
  }
  
  
  $('body').append(
    '<div class="modalArea modalAreaDetail"></div><div class="modalArea modalAreaVideo"></div><div class="modalArea modalAreaForm"></div><div class="modalArea modalAreaWindow"></div><div class="modalArea modalAreaAgreement"></div>'
  );
  
  try {
    $.datetimepicker.setLocale('ru');
    $('form.form .date').datetimepicker({
      timepicker: false,
      format: 'd/m/Y',
      scrollMonth: false,
      scrollInput: false,
      dayOfWeekStart: 1
    });
  } catch (e) {
    console.log(e)
  }
  
  
  if ($(window).width() < 767) {
    var anim_callmob_in = setTimeout(function () {
      $("#callphone-mob .callphone-desc").show().addClass('active');
      clearTimeout(anim_callmob_in);
    }, 5000);
    var anim_callmob_out = setTimeout(function () {
      $("#callphone-mob .callphone-desc").removeClass('active');
      clearTimeout(anim_callmob_out);
    }, 12000);
    var anim_callmob_out2 = setTimeout(function () {
      $("#callphone-mob .callphone-desc").hide();
      clearTimeout(anim_callmob_out2);
    }, 12500);
  }
  
  if ($(window).width() > 767) {
    $(window).enllax();
    new WOW().init();
    var wow = new WOW({
      boxClass: 'parent-animate',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      callback: function (box) {
        var sec = 0;
        $("div.child-animate", box).each(function () {
          var elem = $(this);
          setTimeout(function () {
            elem.removeClass("opacity-zero").addClass("animated fadeIn");
          }, sec);
          sec += 500;
        });
      },
      scrollContainer: null
    });
    wow.init();
  }
  
  $('[data-toggle="tooltip"]').tooltip({
    html: true,
    container: "body"
  });
  
  
  if ($(window).width() > 767) {
    setTimeout(function () {
      $('div.wrap-scroll-down').addClass('active');
    }, 3000);
  }
  
  $(".quest-click").click(function () {
    var block = $(this).parents("div.quest-parent");
    if (!block.hasClass("active")) {
      $(".quest-text", block).slideDown(200, function () {
        block.addClass("active");
      });
    } else {
      $(".quest-text", block).slideUp(200, function () {
        block.removeClass("active");
      });
    }
  });
  
  
  $("div.switcher-wrap div.switcher-title").click(function () {
    var block = $(this).parents("div.switcher-wrap");
    if (!block.hasClass("active")) {
      $("div.switcher-content", block).slideDown(200, function () {
        block.addClass("active");
      });
    } else {
      $("div.switcher-content", block).slideUp(200, function () {
        block.removeClass("active");
      });
    }
  });
  
  var url = location.href;
  url = url.split("#");
  if (typeof (url[1]) != "undefined") {
    if (url[1].length > 0 && url[1].length < 20)
      scrollToBlock("#" + url[1], false);
    
  }
  
  setChangerBlocks();
  
  setComments();
});

function showProcessLoadBlock(obj) {
  obj.find('.loading-block').addClass('active');
}

function closeProcessLoadBlock(obj) {
  obj.find('.loading-block').removeClass('active');
}

function ajaxGetComments(params) {
  var path = "/bitrix/tools/kraken/ajax/comments/comments_block.php";
  params = params || 0;
  
  showProcessLoadBlock($(".block-comments-js"));
  
  $.post(path, {
      site_id: $("input.site_id").val(),
      id: $(".block-comments-js").attr("data-element-id"),
      mode: params.mode,
      page: params.pageNum
      
    },
    function (html) {
      closeProcessLoadBlock($(".block-comments-js"));
      
      if (params.this) {
        if (params.this.hasClass('get-comments-js')) {
          $(".block-comments-js .comments-set-js").append(html);
          params.this.remove();
        }
      } else {
        $('.comments-set-js').append(html);
      }
      
      
      if (params.newItem) {
        
        
        $.ajax({
          url: "/bitrix/tools/kraken/ajax/ajax_hit_page.php",
          method: 'POST',
          success: function (json) {
          }
        });
        
        
        var otherHeight = 0;
        if ($('header').hasClass('fixed'))
          otherHeight = 100;
        
        var newItem = $('.comments-set-js').find('.review-item.first');
        newItem.addClass('new');
        formAttentionScroll(newItem.offset().top - otherHeight, $("html:not(:animated),body:not(:animated)"));
        setTimeout(function () {
          newItem.removeClass('new');
        }, 2000);
      }
    }
  );
}

function setComments(newItem) {
  if ($('.block-comments-js').length > 0) {
    newItem = newItem || '';
    var params = {
      newItem: newItem,
      mode: "full"
    };
    
    ajaxGetComments(params);
  }
}

$(document).on("click", ".get-comments-js", function () {
  var params = {
    "this": $(this),
    "pageNum": $(this).attr("data-page"),
    "mode": "list"
  };
  ajaxGetComments(params);
});

function deleteComment(params) {
  var path = "/bitrix/tools/kraken/ajax/comments/delete.php";
  params = params || 0;
  
  showProcessLoadBlock($(".block-comments-js"));
  
  $.post(
    path, {
      site_id: $("input.site_id").val(),
      ELEMENT_ID: params.ELEMENT_ID
    },
    function (data) {
      closeProcessLoadBlock($(".block-comments-js"));
      
      if (data.OK == "Y") {
        $(".review-item[data-review-id='" + params.ELEMENT_ID + "']").remove();
      } else {
        $('.comments-set-js').html('');
        setComments();
      }
    },
    "json"
  );
}

$(document).on("click", ".comment-delete-js", function () {
  var params = {
    "ELEMENT_ID": $(this).attr("data-review-id")
  };
  deleteComment(params);
});
$(document).on("focus", ".text-require, .input-simple input[type='email']", function () {
  $(this).removeClass("has-error");
});

function sendComments(that, fields) {
  fields = fields || null;
  
  var form = that.parents("form"),
    load = form.find(".loader-simple"),
    question = form.find(".question-js"),
    thank = form.find(".thank-js"),
    text = form.find("textarea[name=TEXT]"),
    btn = that;
  
  if (text.val() <= 5) {
    var otherHeight = 0;
    if ($('header').hasClass('fixed'))
      otherHeight = 100;
    
    text.addClass('has-error');
    formAttentionScroll(text.offset().top - otherHeight, $("html:not(:animated),body:not(:animated)"));
    return false;
  } else {
    load.removeClass('hidden');
    btn.addClass('hidden');
    
    
    var formSendAll = buildFormValues(form);
    
    formSendAll.append("send", "Y");
    formSendAll.append("site_id", $("input.site_id").val());
    
    
    if (fields) {
      if (fields.captchaToken)
        formSendAll.append("captchaToken", fields.captchaToken);
    }
    
    
    var path = "/bitrix/tools/kraken/ajax/comments/add.php";
    
    
    $.ajax({
      url: path,
      method: 'POST',
      contentType: false,
      processData: false,
      data: formSendAll,
      dataType: 'json',
      success: function (json) {
        if (json.OK == "Y") {
          
          thank.html(json.MESSAGE);
          question.addClass('hidden');
          thank.removeClass('hidden');
          
          setTimeout(function () {
            
            if (json.NEW === 'Y') {
              $('.comments-set-js').html('');
              setComments(json.NEW);
            }
            question.removeClass('hidden');
            thank.addClass('hidden');
            load.addClass('hidden');
            btn.removeClass('hidden');
            
            text.val('');
            text.parent().removeClass('in-focus');
            
          }, 2000);
          
          $.ajax({
            url: "/bitrix/tools/kraken/ajax/ajax_hit_page.php",
            method: 'POST',
            success: function (json) {
            }
          });
          
          /*setTimeout(function() {

                        location.href = location.href;
                    }, 3000);*/
          
          
        } else if (json.OK == "N") {
          question.removeClass('hidden');
          thank.addClass('hidden');
          load.addClass('hidden');
          btn.removeClass('hidden');
        }
        
        console.log(json.CAPTCHA_SCORE);
        
      }
    });
    
    
  }
}

$(document).on("click", ".btn-submit-comments-js", function () {
  
  var that = $(this);
  if ($("body").hasClass('captcha')) {
    grecaptcha.execute($(".captcha-site-key").val(), {action: 'homepage'}).then(function (token) {
      
      sendComments(that, {captchaToken: token});
    });
  } else {
    sendComments(that);
  }
  
  
});


function initOpMiniSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  
  obj.slick({
    dots: true,
    infinite: true,
    adaptiveHeight: true,
    arrows: true
  });
  
}

function initOpSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  var count = obj.attr('data-count');
  
  if (count == 1) {
    $('.slider-for', obj).slick({
      slidesToShow: 1,
      arrows: false,
      asNavFor: obj.find('.slider-nav'),
      appendArrows: obj.find('.slider-nav-wrap')
    });
    $('.slider-nav', obj).slick({
      slidesToShow: 1,
      asNavFor: obj.find('.slider-for'),
      centerPadding: 0,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
    });
    obj.addClass("one-slide");
  } else if (count == 2) {
    $('.slider-for', obj).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 300,
      fade: true,
      adaptiveHeight: true,
      arrows: false,
      asNavFor: obj.find('.slider-nav'),
      appendArrows: obj.find('.slider-nav-wrap')
    });
    $('.slider-nav', obj).slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      speed: 300,
      asNavFor: obj.find('.slider-for'),
      centerPadding: 0,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          infinite: true,
        }
      }, {
        breakpoint: 991,
        settings: {
          slidesToShow: 1
        }
      }, {
        breakpoint: 0,
        settings: "unslick"
      }]
    });
  } else {
    $('.slider-for', obj).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 300,
      fade: true,
      adaptiveHeight: true,
      arrows: false,
      asNavFor: obj.find('.slider-nav'),
      appendArrows: obj.find('.slider-nav-wrap')
    });
    $('.slider-nav', obj).slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 300,
      asNavFor: obj.find('.slider-for'),
      centerPadding: 0,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: true,
        }
      }, {
        breakpoint: 991,
        settings: {
          slidesToShow: 1
        }
      }, {
        breakpoint: 0,
        settings: "unslick"
      }]
    });
  }
  
}

function initFSlider(obj, size) {
  var adaptiveMob = ($(window).width() < 768 && $(".wrap-first-slider").attr("data-mobile-height") == "Y") ? false : true,
    sizeSlides = $('div.first-slider div.first-block').length,
    params = {};
  
  if (size == "lg") {
    params = {
      dots: false,
      infinite: true,
      adaptiveHeight: false,
      speed: 500,
      pauseOnFocus: false,
      pauseOnHover: false
    };
  } else if (size == "xs") {
    params = {
      dots: false,
      infinite: true,
      adaptiveHeight: false,
      speed: 500,
      pauseOnFocus: false,
      pauseOnHover: false,
      responsive: [
        {
          
          breakpoint: 767,
          settings: {
            adaptiveHeight: adaptiveMob,
            
          }
          
        },
        {
          
          breakpoint: 0,
          settings: "unslick"
          
        }]
    };
  }
  
  obj.on('init', function (event, slick) {
    obj.find(".first-block").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
  });
  
  
  if ($(".wrap-first-slider").attr("data-autoslide") == "Y") {
    params["autoplaySpeed"] = $(".wrap-first-slider").attr("data-autoslide-time");
    params["autoplay"] = true;
  }
  
  
  obj.slick(params);
  
  
  if ($(window).width() >= 768 || ($(window).width() < 768 && $(".wrap-first-slider").attr("data-mobile-height") == "Y")) {
    
    var height1 = 0;
    var height2 = 0;
    
    
    $('div.first-slider div.first-block').each(
      function (index) {
        
        if ($(this).outerHeight() > height2) {
          height1 = $(this).height();
          height2 = $(this).outerHeight();
        }
        
        
        if (sizeSlides == index + 1) {
          
          $('div.first-slider div.first-block-container').css("height", height1);
          
          if ($(".wrap-first-slider").attr("data-desktop-height") == "Y") {
            if ($(window).height() > $(".wrap-first-slider").height())
              $(".wrap-first-slider").find(".slick-track").css("height", $(window).height() +
                "px");
          }
          
          if (($(window).width() < 768 && $(".wrap-first-slider").attr("data-mobile-height") == "Y")) {
            if ($(window).height() > $(".wrap-first-slider").height())
              $(".wrap-first-slider").find(".slick-track").css("height", $(window).height() +
                "px");
          }
          
          if (obj.find(".videoBG").length > 0) {
            $(obj.find(".videoBG")).each(
              function (index) {
                correctSizeVideoBg($(this));
              }
            );
          }
        }
      }
    );
    
    
  }
  
  
  if ($(window).width() < 768) {
    if ($(".wrap-first-slider").attr("data-mobile-height") == "Y") {
      if ($(window).height() > $(".wrap-first-slider").height())
        $(".wrap-first-slider").find(".slick-track").css("height", $(window).height() +
          "px");
    }
  }
  
}

function initAdvantagesBigSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  obj.slick({
    dots: true,
    adaptiveHeight: false
  });
}

function initAdvantagesSmallSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  obj.slick({
    dots: true,
    slidesToShow: 2,
    adaptiveHeight: false,
    slidesToScroll: 2,
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }, {
      breakpoint: 0,
      settings: "unslick"
    }]
  });
}

function initNewsBigSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  
  obj.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    infinite: false,
    centerPadding: 0,
    centerMode: false,
    adaptiveHeight: false,
    focusOnSelect: false,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        infinite: true,
      }
    }, {
      breakpoint: 991,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 767,
      settings: {
        slidesToShow: 1
      }
    }, {
      breakpoint: 0,
      settings: "unslick"
    }]
  });
}

function initNewsSmallSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  
  obj.slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    infinite: false,
    centerPadding: 0,
    centerMode: false,
    adaptiveHeight: false,
    focusOnSelect: false,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        infinite: true,
      }
    }, {
      breakpoint: 991,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 767,
      settings: {
        slidesToShow: 1
      }
    }, {
      breakpoint: 0,
      settings: "unslick"
    }]
  });
}

function correctLazyloadInSlider(obj) {
  if ($('.lazyload', obj).length) {
    $('.lazyload', obj).each(
      function (index, element) {
        $(element).attr("src", $(element).attr("data-src"));
        $(element).removeAttr("data-src");
      }
    );
  }
}

function initGallerySlider(obj) {
  var count = parseInt(obj.attr("data-slide-visible"));
  
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  
  obj.slick({
    dots: true,
    adaptiveHeight: true,
    slidesToScroll: count,
    slidesToShow: count,
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }, {
      breakpoint: 0,
      settings: "unslick"
    }]
  });
}

function initBannerSlider(obj) {
  obj.on('init', function (event, slick) {
    obj.find(".slick-slide").removeClass('noactive-slide-lazyload');
    obj.addClass("slider-init");
    correctLazyloadInSlider(obj);
    if (obj.parents(".parent-video-bg").find(".videoBG").length > 0) {
      correctSizeVideoBg(obj.parents(".parent-video-bg").find(".videoBG"));
    }
  });
  
  
  obj.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false,
    infinite: true,
    adaptiveHeight: false,
    speed: 500,
    arrows: false
  });
}


function tariffsHeightRound(obj) {
  var cols = 0,
    cur_row = 1,
    heights = new Array();
  
  if ($(window).width() >= 1200)
    cols = obj.attr("data-col-lg");
  
  if ($(window).width() >= 992 && $(window).width() <= 1199)
    cols = obj.attr("data-col-md");
  
  if ($(window).width() >= 768 && $(window).width() <= 991)
    cols = obj.attr("data-col-sm");
  
  var quantity = obj.find(".tarif-element-inner").length;
  
  var max_height = 0;
  
  obj.find(".tarif-element-inner").each(function (index) {
    var cur_element = index + 1;
    
    if (max_height < $(this).height())
      max_height = $(this).height();
    
    if (cur_element % cols == 0 || cur_element == quantity) {
      heights[cur_row] = max_height;
      cur_row++;
      max_height = 0;
    }
  });
  cur_row = 1;
  obj.find(".tarif-element-inner").each(function (index) {
    var cur_element = index + 1;
    var top_height = $(this).find(".trff-top-part").height();
    $(this).height(heights[cur_row]);
    $(this).find(".trff-top-part").height(top_height + (heights[cur_row] -
      $(this).find(".trff-top-part").height() - $(this).find(
        ".trff-bot-part").height()));
    
    if (cur_element % cols == 0)
      cur_row++;
  });
}

function initTariffsElements(obj) {
  if ($(window).width() > 767) {
    if (obj.attr("data-round-height") == "Y") {
      if (typeof ($('.lazyload', obj)) != "undefined") {
        if ($('.lazyload', obj).length > 0) {
          var countItems = $('.lazyload', obj).length;
          $('.lazyload', obj).each(
            function (index, element) {
              $(element).attr("src", $(element).attr("data-src"));
              $(element).removeAttr('data-src');
              
              $(element).load(function () {
                
                if (index == countItems - 1) {
                  tariffsHeightRound(obj);
                }
              });
            });
        } else {
          tariffsHeightRound(obj);
        }
      }
    }
  }
  
}

function correctSizeVideoBg(obj) {
  
  var height = obj.parents('.parent-video-bg').outerHeight();
  var videoThis = obj.find(".video-bg-display");
  var width = $(window).width();
  var video_w = 0;
  var video_h = 0;
  var add = 4;
  
  if (width / height < 16 / 9) {
    video_w = height * 16 / 9 + add;
    video_h = height + add;
  } else {
    video_w = width + add;
    video_h = width * 9 / 16 + add;
  }
  
  videoThis.width(video_w).height(video_h);
  videoThis.addClass('active');
}

function generateVideoBG(container) {
  if ($(window).width() >= 1200 || ($(window).width() >= 768 && $(window).width() < 1200 && !device.android() && !isIos)) {
    var videoBG = $(".videoBG", container),
      iframeType = videoBG.attr("data-type"),
      srcMP4 = videoBG.attr("data-srcMP4"),
      srcWEBM = videoBG.attr("data-srcWEBM"),
      srcOGG = videoBG.attr("data-srcOGG"),
      srcYB = videoBG.attr("data-srcYB"),
      html = "";
    
    
    if (iframeType == "file") {
      if (videoBG.children('video').length <= 0) {
        if (srcMP4)
          html += '<source src="' + srcMP4 + '" type="video/mp4">';
        
        if (srcWEBM)
          html += '<source src="' + srcWEBM + '" type="video/webm">';
        
        if (srcOGG)
          html += '<source src="' + srcOGG + '" type="video/ogg">';
        
        
        html = '<video class="video-bg-display" autoplay="autoplay" loop="loop" preload="auto" muted="muted">' + html + '</video>';
      }
    } else if (iframeType == "iframe") {
      
      if (videoBG.children('iframe').length <= 0) {
        if (srcYB)
          html += '<iframe src="' + srcYB + '" class="video-bg-display" allowfullscreen="" frameborder="0" height="100%" width="100%"></iframe>';
      }
    }
    
    if (html)
      videoBG.prepend(html);
    
    correctSizeVideoBg(videoBG);
    
  }
}

$(window).on("load", function () {
  if (customEvent) {
    updateLazyLoad();
  } else {
    var counter = 0;
    
    var timerId = setInterval(
      function () {
        if (counter > 5)
          clearInterval(timerId);
        
        updateLazyLoad();
        counter++;
      },
      1000
    );
    
    
  }
});

$(window).load(function () {
  
  if ($('#navigation').hasClass('on-scroll')) {
    var lastmarg = 0;
    if (parseInt($("div.block").last().css('margin-bottom')) > 0)
      lastmarg = parseInt($("div.block").last().css('margin-bottom'));
    
    var menu_scroll = $('#navigation.on-scroll').find('div.menu-navigation-inner').outerHeight() + lastmarg;
    var side_scroll = $('div.content-inner').outerHeight();
    var total = side_scroll - menu_scroll;
    
    if (total > 100) {
      $('#navigation.on-scroll').find('div.menu-navigation-wrap').width($(
        '#navigation.on-scroll').width());
      
      var base_padding = parseFloat($('#navigation.on-scroll').find('div.menu-navigation-wrap').css("padding-top").replace("px", ""));
      var moreHeight = base_padding - 10;
      
      if ($('header').hasClass('fixed'))
        moreHeight = 70 + base_padding - 10;
      
      var sscr = $('div.content-inner').offset().top;
      var docscr = $(document).scrollTop() + moreHeight;
      
      $('#navigation.on-scroll').height(side_scroll);
      
      if (sscr + base_padding <= docscr && side_scroll >= (docscr - sscr +
        menu_scroll)) {
        $('#navigation.on-scroll').addClass('fixed').find(
          'div.menu-navigation-wrap').css('padding-top', moreHeight + 'px');
        $('#navigation.on-scroll').removeClass('absolute').removeClass('static');
      } else if (side_scroll <= (docscr - sscr + menu_scroll)) {
        $('#navigation.on-scroll').removeClass('static');
        $('#navigation.on-scroll').removeClass('fixed').addClass('absolute').find(
          'div.menu-navigation-wrap').css('padding-bottom', lastmarg + 'px');
      } else {
        $('#navigation.on-scroll').addClass('static');
        $('#navigation.on-scroll').removeClass('fixed');
      }
      $(window).scroll(function () {
        
        menu_scroll = $('#navigation.on-scroll').find(
          'div.menu-navigation-inner').outerHeight() + lastmarg;
        side_scroll = $('div.content-inner').outerHeight();
        total = side_scroll - menu_scroll;
        sscr = $('div.content-inner').offset().top;
        docscr = $(document).scrollTop() + moreHeight;
        
        if (side_scroll != $('div.content-inner').outerHeight())
          side_scroll = $('div.content-inner').outerHeight();
        
        $('#navigation.on-scroll').height(side_scroll);
        if (total > 0) {
          if (sscr + base_padding <= docscr && side_scroll >= (docscr - sscr +
            menu_scroll)) {
            $('#navigation.on-scroll').addClass('fixed').find(
              'div.menu-navigation-wrap').css('padding-top', moreHeight + 'px');
            $('#navigation.on-scroll').removeClass('absolute').removeClass(
              'static');
          } else if (side_scroll <= (docscr - sscr + menu_scroll)) {
            $('#navigation.on-scroll').removeClass('static');
            $('#navigation.on-scroll').removeClass('fixed').addClass('absolute').find(
              'div.menu-navigation-wrap').css('padding-bottom', lastmarg + 'px');
          } else {
            $('#navigation.on-scroll').addClass('static');
            $('#navigation.on-scroll').removeClass('fixed');
          }
        }
      });
    }
  }
});


function updateMainMenu(menu) {
  if (menu.length > 0) {
    menu.removeClass('full');
    menu.find('li.lvl1').removeClass('visible');
    menu.parents(".wrap-main-menu").removeClass('ready');
    
    var totalWidth = menu.parents('div.main-menu-inner').width() - 60;
    
    
    if ($(".mini-cart-js").length > 0)
      totalWidth = totalWidth - $(".mini-cart-js").width();
    
    if ($(".mini-search-style").length > 0)
      totalWidth = totalWidth - $(".mini-search-style").width();
    
    if ($(document).width() > 767) {
      var visible = 0;
      var size = menu.find('li.lvl1').length;
      
      menu.find('li.lvl1').each(function (index) {
        
        if (visible > 4) {
          $("div.nav-main-menu-wrap").addClass('more-four');
        }
        
        if (totalWidth > ($(this).width())) {
          totalWidth = totalWidth - $(this).width();
          
          $(this).addClass('visible');
          visible++;
          
          if (size == (index + 1))
            $(".wrap-main-menu").addClass('ready');
        } else {
          menu.parents('div.main-menu-inner').find(".ic-main-menu-burger").addClass(
            "active").removeClass("noactive");
          
          $(".wrap-main-menu").addClass('ready');
          return false;
        }
      });
    }
  }
}

$(document).ready(function () {
  updateMainMenu($('nav.main-menu'));
});

$(window).on("load", function () {
  if ($(".hide-adv").length > 0) {
    setTimeout(function () {
      $.post(
        "/bitrix/tools/kraken/ajax/hide_adv.php",
        {
          "check": "Y",
          "USER_ID": $(".hide-adv").attr("data-user")
        },
        function (data) {
          if (data.OK == "Y") {
            $("body").append('<script type="text/javascript"> (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(54591493, "init", { clickmap:false, trackLinks:false, accurateTrackBounce:false }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/54591493" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'
              + '<script>ym(54591493, \'reachGoal\', \'hide_kraken\');</script>');
          }
        },
        "json"
      );
      
    }, 20000);
  }
});

$(window).scroll(function () {
  
  
  if ($('header').hasClass('fixed')) {
    var headerBotPos = $('header').outerHeight(true) + 150;
    
    if ($(window).scrollTop() >= headerBotPos) {
      $('header').addClass('top');
      setTimeout(function () {
        $('header').addClass('on');
      }, 100);
    } else {
      $('header').removeClass('top');
      setTimeout(function () {
        $('header').removeClass('on');
      }, 50);
    }
  }
  
  var top = $(document).scrollTop();
  var height = $('header').height();
  
  if (top >= height)
    $('a.up').addClass('on');
  else {
    $('a.up').removeClass('on');
  }
});

var windowWidth = $(window).width();


$(window).resize(function () {
  
  mobileMenuPositionFooter();
  
  if (windowWidth != $(window).width()) {
    krakenResizeVideo();
    updateMainMenu($('nav.main-menu'));
  }
  
});

if ($(window).width() < 1199) {
  $(document).on("click", "header .open-list-contact", function () {
    $("header div.list-contacts").addClass('open');
  });
  
  
  $(document).mouseup(function (e) {
    var div = $("header div.list-contacts");
    if (!div.is(e.target) && div.has(e.target).length === 0) div.removeClass(
      'open');
  });
  
  
  $(document).on("click", "nav.main-menu li.parent.view_1", function () {
    var menu = $(this).parents('nav.main-menu');
    if (!$(this).children('a').hasClass("open")) {
      $('li.parent', menu).find("ul.child").removeClass("show-open").find(
        "ul.child2").removeClass("show-open");
      $('li.parent > a', menu).removeClass("open");
      $(this).find("ul.child").addClass("show-open");
      $(this).children('a').addClass("open");
      menuOffset(this);
      return false;
    }
  });
  
  
  $(document).on("click", "nav.main-menu li.parent.view_2", function () {
    
    if (!$(this).children('a').hasClass("open")) {
      $(this).children('a').addClass("open");
      
      var th = $(this);
      
      $('.lazyload').Lazy(paramsLazy);
      $(this).find(".dropdown-menu-view-2").addClass('on');
      setTimeout(function () {
        th.find(".dropdown-menu-view-2").addClass('active');
      }, 100);
      
      return false;
    }
  });
  
  
  $(document).on("click", "nav.main-menu li.parent2", function () {
    var menu = $(this).parents('nav.main-menu');
    var menu_list = $("ul.child > li.parent2", menu);
    if (!$(this).children('a').hasClass("open")) {
      menu.find("ul.child2").removeClass("show-open");
      $(this).find("ul.child2").addClass("show-open");
      $("a", menu_list).removeClass("open");
      $(this).children('a').addClass("open");
      menuOffset(this);
      return false;
    }
  });
  
  
  $(document).mouseup(function (e) {
    var div = $("nav.main-menu");
    if (!div.is(e.target) && div.has(e.target).length === 0) {
      $('li.parent > a', div).removeClass("open");
      $("ul.child", div).removeClass("show-open");
      $('li.parent2 > a', div).removeClass("open");
      $("ul.child2", div).removeClass("show-open");
      
      if ($(".dropdown-menu-view-2", div).length > 0) {
        $(".dropdown-menu-view-2", div).removeClass('active');
        setTimeout(function () {
          $(".dropdown-menu-view-2", div).removeClass('on');
        }, 100);
      }
      
    }
  });
}

$(document).on("click", ".cart-show", function () {
  
  if ($(this).hasClass('cart-empty'))
    return false;
  
  openCart();
});

$(document).on("click", ".cart-close", function () {
  closeCart();
});

$(document).on("click", ".mobile-break .continue-shopping", function (event) {
  event.preventDefault()
  closeCart();
});

$(document).on("keypress", "input.count-val", function (e) {
  e = e || event;
  
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  
  var chr = getChar(e);
  
  if (chr == null) return false;
});

$(document).on("blur", "input.count-val",
  function (e) {
    e = e || event;
    
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    
    var chr = getChar(e);
    
    if (chr == null) return false;
    
    var mainBlock = $(this).parents(".parent-calccart"),
      newVal = $(this).val(),
      step = mainBlock.attr(
        "data-cart-step"),
      minVal = mainBlock.attr(
        "data-cart-min"),
      maxVal = mainBlock.attr(
        "data-cart-max"),
      productID = mainBlock.attr("data-product-id"),
      mainId = mainBlock.attr("data-main-product-id");
    
    step = +step;
    minVal = +minVal;
    maxVal = +maxVal;
    
    if (isNaN(minVal))
      minVal = 1;
    
    if (isNaN(maxVal))
      maxVal = false;
    
    if (isNaN(step))
      step = 1;
    
    newVal = +newVal;
    newVal = parseCount(newVal, step, minVal, maxVal);
    $(this).val(newVal);
    
    updateBasket(productID, newVal, mainId);
  }
);

function parseMinVal(value, step, minVal, maxVal = false) {
  var tmpMin = step;
  
  if (step < minVal)
    tmpMin = minVal;
  
  if (value <= tmpMin || isNaN(value))
    value = minVal;
  
  if (maxVal && (value >= maxVal || isNaN(value)))
    value = maxVal;
  
  return value;
}

$(document).on("click", ".count-plus",
  function () {
    actionCalc($(this), true);
  }
);

function actionCalc(_this, action) {
  var mainBlock = _this.parents(".parent-calccart"),
    input = mainBlock.find("input.count-val"),
    value = parseFloat(input.val()),
    step = mainBlock.attr("data-cart-step"),
    minVal = mainBlock.attr("data-cart-min"),
    maxVal = mainBlock.attr("data-cart-max"),
    productID = mainBlock.attr("data-product-id"),
    mainId = mainBlock.attr("data-main-product-id");
  ;
  
  step = +step;
  minVal = +minVal;
  maxVal = +maxVal;
  
  if (isNaN(minVal))
    minVal = 1;
  
  if (isNaN(maxVal))
    maxVal = false;
  
  if (isNaN(step))
    step = 1;
  
  if (isNaN(value))
    value = 0;
  
  if (action) {
    value += step;
    value = parseMinVal(value, step, minVal, maxVal);
    
    input.val(value);
  } else {
    value -= step;
    value = parseMinVal(value, step, minVal, maxVal);
    
    input.val(value);
  }
  
  
  updateBasket(productID, value, mainId);
}

$(document).on("click", ".count-minus",
  function () {
    actionCalc($(this), false);
  }
);


$(document).on('click', 'ul.switcher-tab li:not(.active)', function () {
  $(this).addClass('active').siblings().removeClass('active').closest(
    'div.switcher').find('div.switcher-wrap').removeClass('active').eq($(this)
    .index()).addClass('active');
});

$(document).on('click', 'a.map-show', function () {
  $(this).parent().hide();
  $(this).parents('div.map-block').find(".map-height").show();
});


$(document).on("click", "ul.tabs li:not(.active)", function () {
  $(this).addClass('active').siblings().removeClass('active').closest(
    'div.descriptive-tabs-wrap').find('div.image-content').removeClass(
    'active').eq($(this).index()).addClass('active');
  $('.lazyload').Lazy(paramsLazy);
});

$(document).on("click", "div.mob-tab", function () {
  
  var block = $(this).parent("div.image-content");
  
  if (!$(this).hasClass("active")) {
    
    if ($("img", block).attr("data-src")) {
      var _this = $(this);
      
      $("img", block).Lazy({
        afterLoad: function (element) {
          $("img", block).removeAttr('style');
          
          _this.addClass("active");
          
          $("div.mob-content", block).slideDown(200, function () {
            $(this).removeClass("active");
          });
        }
      });
    } else {
      $(this).addClass("active");
      $("div.mob-content", block).slideDown(200, function () {
        $(this).removeClass("active");
      });
    }
    
    
  } else {
    $(this).removeClass("active");
    $("div.mob-content", block).slideUp(200, function () {
      $(this).removeClass("active");
    });
  }
});

$(document).on("click", "div.wrap-scroll-down", function () {
  var s_b = $(this).parents('div.parent-scroll-down').next(),
    heightOut = 70,
    destination = null;
  
  while (s_b.hasClass('hidden-lg')) {
    s_b = s_b.next();
  }
  
  destination = $(s_b).offset().top - heightOut;
  
  $("html:not(:animated),body:not(:animated)").animate({
    scrollTop: destination
  }, 700);
});

$(document).on('click', '.open-main-menu', function () {
  if ($(window).width() <= 767) {
    
    $('div.open-menu-mobile').addClass('show-open');
    setTimeout(function () {
      $('div.open-menu-mobile.show-open').addClass('on');
    }, 50);
    setTimeout(function () {
      $('a.close-menu.mobile').addClass('on');
    }, 1000);
    setTimeout(function () {
      mobileMenuPositionFooter();
    }, 100);
    $('body').addClass('modal-open');
    $('a.up').addClass('hidden');
    
    
  } else {
    $('div.open-menu').addClass('show-open');
    setTimeout(function () {
      openMenuFooterPos();
    }, 100);
    setTimeout(function () {
      $('div.open-menu').addClass('on');
    }, 150);
    $('div.wrapper').addClass('blur');
    $('div.menu-shadow').addClass('show-open');
    $('body').addClass('modal-open');
    $(".open-cart").addClass('off');
  }
  $('.lazyload').Lazy(paramsLazy);
});

$(document).on('click', '.close-menu', function () {
  if ($(window).width() <= 767) {
    $('div.open-menu-mobile').removeClass('on');
    $('body').removeClass('modal-open');
    $('a.close-menu.mobile').removeClass('on');
    setTimeout(function () {
      $('div.open-menu-mobile.show-open').removeClass('show-open');
    }, 500);
    $('a.up').removeClass('hidden');
  } else {
    $('div.wrapper').removeClass('blur');
    $('div.open-menu').removeClass('show-open');
    $('div.menu-shadow').removeClass('show-open');
    $('body').removeClass('modal-open');
    $(".open-cart").removeClass('off');
  }
});


$(document).on('click', '.close-menu-js.open', function () {
  
  $('div.wrapper').removeClass('blur');
  $('div.open-menu').removeClass('show-open');
  $('div.menu-shadow').removeClass('show-open');
  $('body').removeClass('modal-open');
  $(".open-cart").removeClass('off');
  
});

$(document).on('click', '.close-menu-mobile-js', function () {
  
  $('div.open-menu-mobile').removeClass('on');
  $('body').removeClass('modal-open');
  $('a.close-menu.mobile').removeClass('on');
  setTimeout(function () {
    $('div.open-menu-mobile.show-open').removeClass('show-open');
  }, 500);
  $('a.up').removeClass('hidden');
});

$(document).on("click", "div.list-menu li.parent", function () {
  var menu = $(this).parents('div.list-menu');
  var Li = $(this);
  menu.find('ul.child2').slideUp(200);
  if (!$(this).children('a').hasClass("open")) {
    $('li.parent > a', menu).removeClass("open");
    $("ul.child2", Li).slideDown(200);
    $(this).children('a').addClass("open");
    return false;
  } else if ($(this).children('a').hasClass("empty-link")) {
    menu.find('ul.child2').slideUp(200);
    $('li.parent > a', menu).removeClass("open");
  }
});

$(document).on('click', 'a.open-mobile-list', function () {
  $('ul.mobile-menu-list').removeClass('show-open');
  $("ul.mobile-menu-list[data-menu-list='" + $(this).attr('data-menu-list') +
    "']").addClass('show-open');
  mobileMenuPositionFooter();
});

$(document).on('click', 'div.open-menu-mobile div.open-list-contact', function () {
  var btn = $(this);
  if (!btn.hasClass("active")) {
    btn.parents('div.contacts').find('div.list-contacts').addClass('open');
    btn.addClass("active");
  } else {
    btn.parents('div.contacts').find('div.list-contacts').removeClass('open');
    btn.removeClass("active");
  }
  mobileMenuPositionFooter();
});

$(document).on("click", "a.scroll", function () {
  var elementClick = $(this).attr("href");
  scrollToBlock(elementClick, $(this));
  if ($(this).hasClass('from-modal')) {
    $('div.no-click-block').removeClass('on');
    $('body').removeClass('modal-open');
    $('div.wrapper').removeClass('blur');
    if (isIos) {
      window.scrollTo(0, cur_pos);
      $("body").removeClass("modal-ios");
    }
  }
  return false;
});

$(document).on('click', 'div.tab-child:not(.active)', function () {
  $(this).addClass('active').siblings().removeClass('active').closest(
    'div.tab-parent').find('div.tab-content').removeClass('active').eq($(this)
    .index()).addClass('active');
});

$(document).on('click', '.select-list-choose', function () {
  $(this).parents('.form-select').addClass('open');
});

$(document).on('click', '.ar-down', function () {
  if ($(this).parents('.form-select').hasClass('open')) $(this).parents(
    '.form-select').removeClass('open');
  else {
    $(this).parents('.form-select').addClass('open');
  }
});

$(document).on('click', '.form-select .name', function () {
  $(this).parents('.form-select').find('.select-list-choose').removeClass(
    'first').find(".list-area").text($(this).text());
  $(this).parents('.form-select').removeClass('open');
});

$(document).on('click', '.call-modal', function () {
  
  if (!$("body").hasClass("modal-ios")) cur_pos = $(document).scrollTop();
  var path = '';
  var area = '';
  var value = $(this).attr("data-call-modal");
  var comment = $(this).attr("data-name");
  var header = $(this).attr("data-header");
  var formTitle = $(this).attr("data-name-form");
  var from = $(this).attr("data-from-open-modal");
  var element_id = "";
  var element_type = "";
  if ($(this).hasClass("more-modal-info")) {
    element_id = $(this).attr("data-element-id");
    element_type = $(this).attr("data-element-type");
  }
  var cart_form = "";
  var th = $(this);
  
  
  site_id = $("input.site_id").val();
  
  $('div.wrapper').addClass('blur');
  if ($(this).hasClass('callform')) {
    area = 'modalAreaForm';
    path = 'formmodal.php';
    value = value.replace("form", "");
    if ($(this).hasClass('for_cart')) cart_form = "Y";
  }
  if ($(this).hasClass('cart-form')) {
    area = 'areacart-form';
    path = 'form_cart.php';
    value = value.replace("form", "");
  }
  if ($(this).hasClass('callvideo')) {
    area = 'modalAreaVideo';
    path = 'videomodal.php';
  }
  if ($(this).hasClass('callmodal')) {
    area = 'modalAreaWindow';
    path = 'windowmodal.php';
    value = value.replace("modal", "");
  }
  if ($(this).hasClass('callagreement')) {
    area = 'modalAreaAgreement';
    path = 'agreemodal.php';
    value = value.replace("agreement", "");
  }
  if (typeof (comment) != "undefined") {
    if (comment.length > 0) type = "Y";
  }
  $('.google-spin-wrapper').addClass('active');
  $.post("/bitrix/tools/kraken/ajax/" + path, {
    formId: value,
    site_id: site_id,
    element_id: element_id,
    element_type: element_type,
    cart_form: cart_form
  }, function (html) {
    $("body").addClass("modal-open");
    if (isIos && !th.hasClass('box-form')) {
      $("body").addClass("modal-ios");
    }
    $('div.' + area).html(html);
    
    $('[data-toggle="tooltip"]').tooltip({
      html: true,
      container: "body"
    });
    checkToolSettings();
    
    $('.google-spin-wrapper').removeClass('active');
    if (from == 'open-menu') {
      $('div.open-menu').addClass('blur');
      $('div.' + area).find('.close-modal').addClass('open-menu');
    }
    setTimeout(function () {
      $('div.' + area).find('.kraken-modal').addClass('active');
    }, 100);
    if (area == 'modalAreaForm') {
      
      setTimeout(function () {
        $("input[name='url']").val(decodeURIComponent(location.href));
        
        if (typeof (comment) != "undefined") {
          if (comment.length > 0) $("div.modalAreaForm").find("div.add_text").html(
            comment);
        }
        if (typeof (formTitle) != "undefined") {
          if (formTitle.length > 0) $('div.modalAreaForm').find(
            "form input[name='comment']").val(formTitle);
        }
        if (typeof (header) != "undefined") {
          if (header.length > 0) $('div.modalAreaForm').find(
            "form input[name='header']").val(header);
        }
        $.datetimepicker.setLocale('ru');
        $('div.modalAreaForm form.form .date').datetimepicker({
          timepicker: false,
          format: 'd/m/Y',
          scrollMonth: false,
          scrollInput: false,
          dayOfWeekStart: 1
        });
      }, 100);
    }
    if (area == 'modalAreaVideo') {
      setTimeout(function () {
        krakenResizeVideo();
      }, 100);
    }
    
    if (th.hasClass('from-modalform')) {
      $('div.modalAreaAgreement').find('.close-modal').addClass('from-modal');
      $('div.modalAreaAgreement').find('.close-modal').addClass(
        'from-modalform');
      $('div.form-modal').addClass('blur');
    } else if (th.hasClass('from-openmenu')) {
      $('div.modalAreaForm').find('.close-modal').addClass('from-modal');
      $('div.modalAreaAgreement').find('.close-modal').addClass('from-modal');
      $('div.modalAreaAgreement').find('.close-modal').addClass(
        'from-openmenu');
      $('div.modalAreaForm').find('.close-modal').addClass('from-openmenu');
      $('div.open-menu').addClass('blur');
      $('div.modalAreaWindow').find('.close-modal').addClass('from-modal');
      $('div.modalAreaWindow').find('.close-modal').addClass('from-openmenu');
    } else if (th.hasClass('from-set')) {
      $('div.modalAreaForm').find('.close-modal').addClass('from-modal');
      $('div.modalAreaWindow').find('.close-modal').addClass('from-modal');
    } else if (th.hasClass('from-modal')) {
      $('div.modalAreaForm').find('.close-modal').addClass('from-modal');
      $('div.modalAreaWindow').find('.close-modal').addClass('from-modal');
      $('div.modalAreaAgreement').find('.close-modal').addClass('from-modal');
    } else if (area == 'areacart-form') {
      th.parents(".wrapper-cart").find(".info-table").removeClass('active');
      th.parents(".wrapper-cart").find(".cart-back").addClass('active');
      th.parents(".wrapper-cart").find(".areacart-form").addClass('active');
      th.parents(".wrapper-cart").find("form input[name='url']").val(
        decodeURIComponent(location.href));
      $.datetimepicker.setLocale('ru');
      $('.wrapper-cart form.form .date').datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        scrollMonth: false,
        scrollInput: false,
        dayOfWeekStart: 1
      });
    }
    
    $('.lazyload').Lazy(paramsLazy);
  });
});

$(document).on("click", ".cart-back", function (e) {
  $(this).removeClass('active');
  $(this).parents(".wrapper-cart").find(".areacart-form").removeClass('active');
  $(this).parents(".wrapper-cart").find(".info-table").addClass('active');
});

$(document).on('click', '.close-modal', function () {
  $('div.modalAreaForm form.form .date').datetimepicker('destroy');
  if (!($(this).hasClass('from-modal'))) {
    stopBlurWrapperContainer();
  }
  if ($(this).hasClass('from-modalform')) $('div.form-modal').removeClass(
    'blur');
  if ($(this).hasClass('from-openmenu')) $('div.open-menu').removeClass('blur');
  if ($(this).hasClass('wind-close')) $(this).parents(
    "div.shadow-modal-wind-contact").removeClass('on');
  else {
    $(this).parents("div.modalArea").children().remove();
  }
});

$(document).on('click', '.open_modal_contacts', function () {
  $('div.shadow-modal-wind-contact').addClass('on');
  $('div.wrapper').addClass('blur');
  $("body").addClass("modal-open");
  if (isIos) {
    cur_pos = $(document).scrollTop();
    $("body").addClass("modal-ios");
  }
});

$(document).on('click', 'div.tab-menu', function () {
  $(this).parents('.tab-control').find('.tab-menu').removeClass('active');
  $(this).parents('.tab-control').find('.tabb-content').removeClass('active');
  $(this).addClass('active');
  $('.tabb-content[data-tab="' + $(this).attr("data-tab") + '"]').addClass(
    'active');
});

$(document).on('click', '.show-hidden', function () {
  $(this).parents('.show-hidden-parent').find('.show-hidden-child').removeClass(
    'hidden').removeClass('hidden-sm');
  $(this).hide();
  $(this).parent().addClass('off');
});

$(document).on("click", ".click-slide-show", function () {
  var block = $(this).parent(".parent-slide-show");
  if (!$(this).hasClass("active")) {
    $(this).addClass("active");
    $(".content-slide-show", block).slideDown(200, function () {
      $(this).addClass("active");
    });
  } else {
    $(this).removeClass("active");
    $(".content-slide-show", block).slideUp(200, function () {
      $(this).removeClass("active");
    });
  }
});

Share = {
  vkontakte: function (purl, ptitle, pimg, text) {
    url = 'http://vkontakte.ru/share.php?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&image=' + encodeURIComponent(pimg);
    url += '&noparse=true';
    Share.popup(url);
  },
  facebook: function (purl, ptitle, pimg, text) {
    url = 'https://www.facebook.com/sharer/sharer.php?';
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&u=' + encodeURIComponent(purl);
    url += '&picture=' + encodeURIComponent(pimg);
    Share.popup(url);
  },
  twitter: function (purl, ptitle) {
    url = 'http://twitter.com/share?';
    url += 'text=' + encodeURIComponent(ptitle);
    url += '&url=' + encodeURIComponent(purl);
    url += '&counturl=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  
  ok: function (purl, ptitle) {
    url = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview';
    url += '&st.title=' + encodeURIComponent(ptitle);
    url += '&st.shareUrl=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  
  mailRu: function (purl, ptitle) {
    url = 'https://connect.mail.ru/share?';
    url += '&url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    Share.popup(url);
  },
  
  wtsApp: function (purl, ptitle) {
    url = 'https://api.whatsapp.com/send?';
    url += '&text=' + encodeURIComponent(ptitle) + ' ' + encodeURIComponent(purl);
    Share.popup(url);
  },
  
  telegram: function (purl, ptitle) {
    url = 'https://telegram.me/share/url?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&text=' + encodeURIComponent(ptitle);
    Share.popup(url);
  },
  skype: function (purl) {
    url = 'https://web.skype.com/share?';
    url += 'url=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  gPlus: function (purl) {
    url = 'https://plus.google.com/share?';
    url += 'url=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  
  reddit: function (purl) {
    url = 'https://www.reddit.com/submit?';
    url += 'url=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  
  popup: function (url) {
    window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
  }
};

$(document).on('click', '.click-show-pic', function () {
  console.log($(this).attr("data-show-pic"))
  $(this).parents('.parent-show-pic').find('.item-show-pic').removeClass(
    'active');
  $(this).parents('.parent-show-pic').find('.click-show-pic').removeClass(
    'active');
  const a = $(this).parents('.parent-show-pic').find('.item-show-pic[data-show-pic="' +
    $(this).attr("data-show-pic") + '"]')
  a.addClass('active');
  $(this).addClass('active');
});

$(document).on('click', '.scroll-next', function () {
  var dist = $(this).parents('.scroll-next-parent').next().offset().top - 40;
  if ($("header").hasClass("fixed")) dist -= 70;
  $("html:not(:animated),body:not(:animated)").animate({
    scrollTop: dist
  }, 700);
});

$(document).on("click", ".kraken-alert-btn", function () {
  $("div.alert-block div.kraken-alert-btn").addClass("on");
  $("div.alert-block div.alert-block-content").addClass("on");
});

$(document).on("click", "a.alert-close", function () {
  $("div.alert-block div.kraken-alert-btn").removeClass("on");
  $("div.alert-block div.alert-block-content").removeClass("on");
});

var mouseUp = (isIos) ? "touchend" : "mouseup";

$(document).on(mouseUp, function (e) {
  
  var div = $(".form-select");
  if (!div.is(e.target) && div.has(e.target).length === 0)
    div.removeClass('open');
  
  
  var div2 = $(".search-list");
  if (!div2.is(e.target) && div2.hasClass("active")) {
    div2.removeClass('active');
  }
  
  var search_top_js = $(".search-top-js");
  if (!search_top_js.is(e.target) && search_top_js.has(e.target).length === 0) {
    if (search_top_js.hasClass("active")) {
      search_top_js.removeClass('active');
      $(".no-click-block").removeClass('on');
      $('body').removeClass('modal-open');
      $('.wrapper').removeClass('blur');
      var st = setTimeout(function () {
        search_top_js.removeClass('fixed');
        clearTimeout(st);
      }, 100);
    }
  }
  
  var checboxReq = $(".check-require.has-error");
  if (!checboxReq.is(e.target))
    checboxReq.removeClass('has-error');
  
  
  var selectReq = $(".form-select.has-error");
  if (!selectReq.is(e.target))
    selectReq.removeClass('has-error');
  
});

$(document).on('change', ".cart-choose-select", function () {
  $(this).parents(".parent-choose-select").find(".inp-show-js").removeClass(
    'active');
  $(this).parents(".parent-choose-select").find(
    ".inp-show-js[data-choose-select='" + $(this).attr("data-choose-select") +
    "']").addClass('active');
});

$(document).on("click", ".search-icon-js", function () {
  $(this).parents(".search-input-box").find(".search-js").focus();
});

$(document).on("click", ".show-search-list", function () {
  $(this).parents(".show-search-list-parent").find(".search-list").addClass('active');
});

$(document).ready(function () {
  if ($('div.first-slider.slider-lg').length > 0)
    initFSlider($('div.first-slider.slider-lg'), "lg");
  
  if ($('div.first-slider.slider-xs').length > 0)
    initFSlider($('div.first-slider.slider-xs'), "xs");
});

/*$(document).ready(function()
{
	$("form.search-form").each(
		function()
		{
			var attr_url = $(this).find("span.search-get.active").attr("data-url");

			if(typeof(attr_url) == "undefined")
				attr_url = location.href;

			$(this).attr("action", attr_url);
		}
	);

});*/

$(document).on("click", "span.search-get", function () {
  $(this).parents(".show-search-list-parent").find(".search-cur").text($(this).text());
  $(this).parents(".search-list").find('span.search-get').removeClass("active");
  $(this).parents(".search-list").removeClass('active');
  $(this).addClass('active');
  $(this).parents("form.search-form").attr("action", $(this).attr("data-url"));
});


function checkInput(input) {
  
  if (input.parents('.search-panel-js').hasClass("hint")) {
    if (input.val().length > 0) {
      input.parents('.search-panel-js').find('.hint-area').hide();
      input.parents('.search-panel-js').find('.search-btns-box').addClass('before-active');
      
      var timeOut = setTimeout(
        function () {
          input.parents('.search-panel-js').find('.search-btns-box').addClass('active');
          clearTimeout(timeOut);
        }, 100);
    } else {
      input.parents('.search-panel-js').find('.search-btns-box').removeClass('before-active active');
      input.parents('.search-panel-js').find('.hint-area').show();
    }
  }
  
  
}

$(document).on("keyup", "form.search-form input.search-js",
  function () {
    checkInput($(this));
  }
);

$('form.search-form input.search-js').focusout(function () {
  checkInput($(this));
});

$(document).on("click", ".paste-in-input", function () {
  var input = $(this).parents('.search-panel-js').find('input.search-js');
  input.val($(this).text());
  checkInput(input);
});

$(document).on("click", ".open-search-top", function () {
  $(".search-top-js").addClass('fixed');
  $('.wrapper').addClass('blur');
  $('body').addClass('modal-open');
  var st = setTimeout(function () {
    $(".no-click-block").addClass('on');
    $(".search-top-js").addClass('active');
    $(".search-top-js").find('input.search-js').focus();
    clearTimeout(st);
  }, 100);
});
$(document).on("click", ".close-search-top", function () {
  $(this).parents(".search-top-js").removeClass('active');
  var th = $(this);
  $(".no-click-block").removeClass('on');
  $('body').removeClass('modal-open');
  $('.wrapper').removeClass('blur');
  var st = setTimeout(function () {
    th.parents(".search-top-js").removeClass('fixed');
    clearTimeout(st);
  }, 100);
  
});


(function (window) {
  
  window.JCCatalogElementKraken = function (arParams) {
    
    this.productType = null;
    this.firstLoad = true;
    this.visual = {};
    
    this.config = {
      useAdd2Basket: false,
      useFastOrder: false,
      useSku: false
    };
    this.product = {};
    this.offerNum = 0;
    this.offerNumPrev = 0;
    this.treeProps = [];
    this.selectedValues = {};
    this.emptySku = true;
    this.formFastOrder = null;
    
    
    this.obTree = null;
    this.obGallery = null;
    this.obArticleAvailableText = null;
    this.obArticle = null;
    this.obWrArticle = null;
    this.obAvailable = null;
    this.obWrAvailable = null;
    this.obText = null;
    this.obWrText = null;
    
    
    this.obPriceBlock = null;
    this.obPriceRequest = null;
    this.obPrice = null;
    this.obOldPrice = null;
    this.obDots = null;
    this.obDiscount = null;
    
    this.obSkuChars = null;
    
    
    this.obComment1 = null;
    
    
    this.obBtnFastOrder = null;
    this.obBtnAdd2Basket = null;
    
    
    this.errorCode = 0;
    
    if (typeof arParams === 'object') {
      this.params = arParams;
      this.initConfig();
      this.initBtns();
      
      switch (this.productType) {
        case "PRODUCT":
          this.initProductData();
          break;
        case "OFFERS":
          
          if (!this.emptySku)
            this.initOffersData();
          
          break;
        default:
          this.errorCode = -1;
      }
    }
    
    if (this.errorCode === 0)
      BX.ready(BX.delegate(this.init, this));
    
    this.params = {};
  },
    
    window.JCCatalogElementKraken.prototype =
      {
        initBtns: function () {
          if (this.config.useFastOrder) {
            this.obBtnFastOrder = BX(this.visual.BTN_FAST_ORDER);
            BX.bind(this.obBtnFastOrder, 'click', BX.delegate(this.callFastOrderForm, this));
          }
          
          if (this.config.useAdd2Basket) {
            this.obBtnAdd2Basket = BX(this.visual.BTN_ADD2BASKET);
            BX.bind(this.obBtnAdd2Basket, 'click', BX.delegate(this.add2Basket, this));
          }
        },
        
        initConfig: function () {
          
          this.productType = this.params.PRODUCT_TYPE;
          
          this.visual = this.params.VISUAL;
          
          if (this.params.CONFIG.USE_ADD2BASKET)
            this.config.useAdd2Basket = this.params.CONFIG.USE_ADD2BASKET;
          
          if (this.params.CONFIG.USE_FAST_ORDER)
            this.config.useFastOrder = this.params.CONFIG.USE_FAST_ORDER;
          
          if (this.params.CONFIG.USE_SKU)
            this.config.useSku = this.params.CONFIG.USE_SKU;
          
          
          this.emptySku = this.params.CONFIG.EMPTY_SKU;
          
          this.product = this.params.PRODUCT;
          
          this.formFastOrder = this.params.FAST_ORDER_FORM_ID;
        },
        
        init: function () {
          switch (this.productType) {
            case "PRODUCT":
              break;
            case "OFFERS":
              this.setCurrent();
              
              break;
            default:
              this.errorCode = -1;
          }
        },
        
        initProductData: function () {
          this.refreshBtnAdd2Basket();
        },
        
        initOffersData: function () {
          
          this.treeProps = this.params.TREE_PROPS;
          this.obTree = BX(this.visual.SKU_ID);
          this.obGallery = BX(this.visual.GALLERY);
          
          this.obArticleAvailableText = BX(this.visual.ARTICLE_AVAILABLE_TEXT);
          this.obArticle = BX(this.visual.ARTICLE);
          this.obWrArticle = BX(this.visual.ARTICLE_BLOCK);
          this.obAvailable = BX(this.visual.AVAILABLE);
          this.obWrAvailable = BX(this.visual.AVAILABLE_BLOCK);
          this.obText = BX(this.visual.PREVIEW_TEXT);
          this.obWrText = BX(this.visual.PREVIEW_TEXT_BLOCK);
          
          this.obPriceBlock = BX(this.visual.PRICE_BLOCK_ID);
          /*this.obPriceRequest = BX(this.visual.PRICE_REQUEST);*/
          this.obPrice = BX(this.visual.PRICE_VALUE);
          this.obOldPrice = BX(this.visual.OLDPRICE_VALUE);
          this.obDots = BX(this.visual.DOTS);
          this.obDiscount = BX(this.visual.DISCOUNT);
          
          this.obComment1 = BX(this.visual.PRICE_COMMENT1);
          
          this.obSkuChars = BX(this.visual.CHARS);
          this.addButtonWrapper = BX(this.visual.ADD_BUTTON_WRAPPER);
          
          var treeItems = this.obTree.querySelectorAll('li');
          
          for (i = 0; i < treeItems.length; i++) {
            BX.bind(treeItems[i], 'click', BX.delegate(this.selectOfferProp, this));
          }
          
          if (this.params.OFFER_SELECTED != "0") {
            this.offerNum = this.params.OFFER_SELECTED;
            /*this.firstLoad = false;*/
          }
          
        },
        
        deleteParameterURL: function (url, param) {
          var a = url.split('?');
          var re = new RegExp('(\\?|&)' + param + '=[^&]+', 'g');
          
          if (url == "undefined")
            url = "";
          
          url = ('?' + a[1]).replace(re, '');
          url = url.replace(/^&|\?/, '');
          
          if (url == "undefined")
            url = "";
          
          var dlm = (url == '') ? '' : '?';
          return a[0] + dlm + url;
        },
        
        addParameterToURL: function (param, value) {
          
          var url = window.location.href;
          
          
          if (history.replaceState) {
            var baseUrl = this.deleteParameterURL(url, param);
            baseUrl += (baseUrl.split('?')[1] ? '&' : '?') + param + "=" + value;
            history.replaceState(null, null, baseUrl);
          } else {
            console.warn('History API don`t support');
          }
        },
        
        callFastOrderForm: function () {
          
          var productID, mainID = null, isOffer = "N";
          
          switch (this.productType) {
            case "PRODUCT":
              productID = this.product.PRODUCT_ID;
              mainID = this.product.MAIN_ID;
              break;
            case "OFFERS":
              productID = this.product[this.offerNum].PRODUCT_ID;
              mainID = this.product[this.offerNum].MAIN_ID;
              isOffer = "Y";
              break;
            default:
              break;
          }
          
          var params = {
            "element_type": "CTL",
            "element_id": productID,
            "main_id": mainID,
            "isOffer": isOffer,
            "formId": this.formFastOrder,
            "action": "order"
          };
          
          callFormDialog(params);
        },
        
        add2Basket: function () {
          var productID = "", count = "", _this = this, mainID = "", maxCount = 0;
          
          switch (this.productType) {
            case "PRODUCT":
              productID = this.product.PRODUCT_ID;
              count = this.product.MIN_QUANTITY;
              maxCount = this.product.MAX_QUANTITY || 999;
              mainID = this.product.MAIN_ID;
              break;
            case "OFFERS":
              productID = this.product[this.offerNum].PRODUCT_ID;
              count = this.product[this.offerNum].MIN_QUANTITY;
              mainID = this.product[this.offerNum].MAIN_ID;
              maxCount = this.product.MAX_QUANTITY || 999;
              break;
            default:
              break;
          }
          
          add2Basket(productID, count, maxCount, mainID, function () {
            _this.refreshBtnAdd2Basket();
          });
          
        },
        
        selectOfferProp: function () {
          var i = 0,
            strTreeValue = '',
            arTreeItem = [],
            rowItems = null,
            target = BX.proxy_context;
          
          
          if (target && target.hasAttribute('data-treevalue')) {
            if (BX.hasClass(target, 'active'))
              return;
            
            
            strTreeValue = target.getAttribute('data-treevalue');
            arTreeItem = strTreeValue.split('_');
            
            this.searchOfferPropIndex(arTreeItem[0], arTreeItem[1]);
            
            
            rowItems = BX.findChildren(target.parentNode, {tagName: 'li'}, false);
            
            
            if (rowItems && rowItems.length) {
              for (i = 0; i < rowItems.length; i++) {
                BX.removeClass(rowItems[i], 'active');
              }
            }
            
            
            BX.addClass(target, 'active');
            
          }
        },
        
        searchOfferPropIndex: function (strPropID, strPropValue) {
          var i = 0,
            j = 0,
            strName = '',
            arShowValues = false,
            arFilter = {};
          
          
          for (i = 0; i < this.treeProps.length; i++) {
            if (this.treeProps[i].ID === strPropID) {
              index = i;
              break;
            }
          }
          
          if (index > -1) {
            for (i = 0; i < index; i++) {
              strName = 'PROP_' + this.treeProps[i].ID;
              arFilter[strName] = this.selectedValues[strName];
            }
            
            strName = 'PROP_' + this.treeProps[index].ID;
            arFilter[strName] = strPropValue;
            
            
            for (i = index + 1; i < this.treeProps.length; i++) {
              strName = 'PROP_' + this.treeProps[i].ID;
              arShowValues = this.getRowValues(arFilter, strName);
              
              if (!arShowValues)
                break;
              
              if (this.selectedValues[strName] && BX.util.in_array(this.selectedValues[strName], arShowValues)) {
                arFilter[strName] = this.selectedValues[strName];
              } else {
                arFilter[strName] = arShowValues[0];
              }
              
              
              this.updateRow(i, arFilter[strName], arShowValues);
              
              
            }
            
            this.selectedValues = arFilter;
            
            
            this.changeInfo();
            
          }
          
        },
        
        setCurrent: function () {
          var i = 0,
            j = 0,
            strName = '',
            arShowValues = false,
            arFilter = {},
            current = this.product[this.offerNum].TREE;
          
          
          for (i = 0; i < this.treeProps.length; i++) {
            strName = 'PROP_' + this.treeProps[i].ID;
            arShowValues = this.getRowValues(arFilter, strName);
            
            if (!arShowValues)
              break;
            
            
            if (BX.util.in_array(current[strName], arShowValues) && current[strName])
              arFilter[strName] = current[strName];
            
            this.updateRow(i, arFilter[strName], arShowValues);
            
          }
          
          this.selectedValues = arFilter;
          
          this.changeInfo();
        },
        
        getRowValues: function (arFilter, index) {
          var arValues = [],
            i = 0,
            j = 0,
            boolSearch = false,
            boolOneSearch = true;
          
          if ($.isEmptyObject(arFilter)) {
            for (i = 0; i < this.product.length; i++) {
              if (!BX.util.in_array(this.product[i].TREE[index], arValues) && this.product[i].TREE[index]) {
                arValues[arValues.length] = this.product[i].TREE[index];
              }
            }
            boolSearch = true;
          } else {
            for (i = 0; i < this.product.length; i++) {
              boolOneSearch = true;
              
              for (j in arFilter) {
                if (arFilter[j] !== this.product[i].TREE[j]) {
                  boolOneSearch = false;
                  break;
                }
              }
              
              
              if (boolOneSearch) {
                if (!BX.util.in_array(this.product[i].TREE[index], arValues) && this.product[i].TREE[index]) {
                  arValues[arValues.length] = this.product[i].TREE[index];
                }
                
                
                boolSearch = true;
              }
            }
            
          }
          
          
          return (boolSearch ? arValues : false);
        },
        
        updateRow: function (intNumber, activeId, showId) {
          
          var i = 0,
            value = '',
            isCurrent = false,
            rowItems = null;
          
          
          var lineContainer = this.obTree.querySelectorAll(".sku-row");
          
          
          if (intNumber > -1 && intNumber < lineContainer.length) {
            rowItems = lineContainer[intNumber].querySelectorAll('li');
            
            for (i = 0; i < rowItems.length; i++) {
              value = rowItems[i].getAttribute('data-onevalue');
              isCurrent = value === activeId;
              
              if (isCurrent) {
                BX.addClass(rowItems[i], 'active');
              } else {
                BX.removeClass(rowItems[i], 'active');
              }
              
              rowItems[i].style.display = BX.util.in_array(value, showId) ? '' : 'none';
              
              if (isCurrent) {
                lineContainer[intNumber].style.display = (value == 0) ? 'none' : '';
              }
            }
          }
          
          if (showId.length === 0) {
            lineContainer[intNumber].style.display = 'none';
          }
          
        },
        
        setCurrentOfferNum: function () {
          
          var index = -1;
          
          for (i = 0; i < this.product.length; i++) {
            boolOneSearch = true;
            
            for (j in this.selectedValues) {
              
              if (this.selectedValues[j] !== this.product[i].TREE[j]) {
                boolOneSearch = false;
                break;
              }
              
            }
            
            if (boolOneSearch) {
              index = i;
              break;
            }
          }
          
          this.offerNumPrev = this.offerNum;
          
          this.offerNum = index;
        },
        
        faqBtn: function () {
          $(".faq-btn-form").attr("data-product-id", this.product[this.offerNum].PRODUCT_ID);
        },
        
        changeInfo: function () {
          var j = 0,
            i = 0;
          
          this.setCurrentOfferNum();
          this.addParameterToURL("oID", this.product[this.offerNum].PRODUCT_ID);
          this.refreshBtnAdd2Basket();
          
          
          if (!this.firstLoad) {
            this.drawGallery();
            this.drawArticleAvailableText();
            this.drawPriceBlock();
            this.drawSkuCharsBlock();
            this.faqBtn();
            updateBasketPublicInfo();
          } else {
            this.firstLoad = false;
          }
          
        },
        
        refreshBtnAdd2Basket: function () {
          if (this.config.useAdd2Basket) {
            switch (this.productType) {
              case "PRODUCT":
                break;
              case "OFFERS":
                if (this.obBtnAdd2Basket.hasAttribute("data-product-id")) {
                  this.obBtnAdd2Basket.setAttribute("data-product-id", this.product[this.offerNum].PRODUCT_ID);
                }
                if (this.product[this.offerNum].IS_AVAILABLE === "N")
                  this.obBtnAdd2Basket.classList.add("hidden");
                else {
                  this.obBtnAdd2Basket.classList.remove("hidden");
                }
                break;
              default:
                break;
            }
          }
        },
        
        drawSkuCharsBlock: function () {
          this.obSkuChars.innerHTML = "";
          
          if (this.product[this.offerNum].SKU_CHARS.length > 0) {
            var html = "";
            
            for (var i = 0; i < this.product[this.offerNum].SKU_CHARS.length; i++) {
              
              html +=
                "<table class=\"cart-char-table mobile-break show-hidden-child\">"
                + "<tr>"
                + "<td class=\"left\">" + this.product[this.offerNum].SKU_CHARS[i].NAME + "</td>"
                + "<td class=\"dotted\"><div class=\"dotted\"></div></td>"
                + "<td class=\"right bold\">" + this.product[this.offerNum].SKU_CHARS[i].VALUE + "</td>"
                + "</tr>"
                + "</table>";
            }
            
            this.obSkuChars.innerHTML = html;
          }
          
          if (this.obSkuChars.innerHTML.length <= 0 && $('.props_chars_js').length <= 0 && $('.prop_chars_js').length <= 0) {
            $('#chars').addClass('hidden');
          } else {
            $('#chars').removeClass('hidden');
          }
          
        },
        
        drawGallery: function () {
          
          if (this.obGallery) {
            var galleryContainer = this.obGallery.querySelector('.gallery-list'),
              controlContainer = this.obGallery.querySelector('.gallery-control'),
              galleryHTML = "",
              controlHTML = "",
              countGallery = (+this.product[this.offerNum].GALLERY_COUNT);
            
            
            for (var i = 0; i < countGallery; i++) {
              galleryHTML += "<div class=\"item-show-pic " + ((i == 0) ? "active" : "") + "\" data-show-pic=\"img-" + i + "\">"
                + "<a href=\"" + this.product[this.offerNum].GALLERY[i].BIG + "\" data-gallery=\"gal-item\" class=\"cursor-loop\">"
                + "<img class=\"img-responsive center-block animate_to_box\" data-cart-id-img=\"" + this.product[this.offerNum].PRODUCT_ID + "\" title=\"" + this.product[this.offerNum].GALLERY[i].TITLE + "\" alt=\"" + this.product[this.offerNum].GALLERY[i].ALT + "\" src=\"" + this.product[this.offerNum].GALLERY[i].SMALL + "\">"
                + "</a>"
                + "</div>";
            }
            
            controlContainer.innerHTML = "";
            
            if (countGallery > 1) {
              
              for (var i = 0; i < countGallery; i++) {
                controlHTML += "<div class=\"col-xs-3 pic-item\">"
                  + "<div class=\"mini-pic click-show-pic " + ((i == 0) ? "active" : "") + "\" data-show-pic=\"img-" + i + "\" title=\"" + this.product[this.offerNum].GALLERY[i].TITLE + "\">"
                  + "<table>"
                  + "<tr>"
                  + "<td>"
                  + "<div class=\"pic-border\">"
                  + "<img class=\"img-responsive center-block\" alt=\"" + this.product[this.offerNum].GALLERY[i].ALT + "\" src=\"" + this.product[this.offerNum].GALLERY[i].CONTROL + "\">"
                  + "<div class=\"pic-shadow\"></div>"
                  + "</div>"
                  + "</td>"
                  + "</tr>"
                  + "</table>"
                  + "</div>"
                  + "</div>";
              }
              
              
              controlContainer.classList.remove('hidden');
              
              controlContainer.innerHTML = controlHTML;
              
            } else {
              controlContainer.classList.add('hidden');
            }
            
            galleryContainer.innerHTML = galleryHTML;
          }
          
        },
        
        drawArticleAvailableText: function () {
          var article = false,
            available = false,
            text = false;
          
          this.product[this.offerNum].ARTICLE;
          this.product[this.offerNum].AVAILABLE.VALUE;
          this.product[this.offerNum].AVAILABLE.VALUE_XML_ID;
          this.product[this.offerNum].PREVIEW_TEXT;
          
          
          if (this.product[this.offerNum].ARTICLE.length)
            article = true;
          
          if (typeof this.product[this.offerNum].AVAILABLE.VALUE !== "undefined")
            available = true;
          
          if (this.product[this.offerNum].PREVIEW_TEXT.length)
            text = true;
          
          
          if (article || available || text)
            this.obArticleAvailableText.classList.remove('hidden');
          else {
            this.obArticleAvailableText.classList.add('hidden');
          }
          
          if (article) {
            
            this.obWrArticle.classList.remove('hidden');
            this.obArticle.innerHTML = BX.message('ARTICLE') + " " + this.product[this.offerNum].ARTICLE;
            this.obArticleAvailableText.classList.remove('no-article');
          } else {
            this.obWrArticle.classList.add('hidden');
            this.obArticle.innerHTML = "";
            this.obArticleAvailableText.classList.add('no-article');
          }
          
          if (available) {
            if (typeof this.product[this.offerNumPrev].AVAILABLE.VALUE !== "undefined")
              this.obAvailable.classList.remove(this.product[this.offerNumPrev].AVAILABLE.VALUE_XML_ID);
            
            this.obAvailable.classList.add(this.product[this.offerNum].AVAILABLE.VALUE_XML_ID);
            this.obAvailable.innerHTML = this.product[this.offerNum].AVAILABLE.VALUE;
            this.obWrAvailable.classList.remove('hidden');
          } else {
            this.obWrAvailable.classList.add('hidden');
            
            if (typeof this.product[this.offerNumPrev].AVAILABLE.VALUE !== "undefined")
              this.obAvailable.classList.remove(this.product[this.offerNumPrev].AVAILABLE.VALUE_XML_ID);
            
            this.obAvailable.innerHTML = "";
          }
          
          
          if (text) {
            this.obWrText.classList.remove('hidden');
            this.obText.innerHTML = this.product[this.offerNum].PREVIEW_TEXT;
            
          } else {
            this.obWrText.classList.add('hidden');
            this.obText.innerHTML = "";
          }
        },
        
        drawPriceBlock: function () {
          
          
          if (this.product[this.offerNum].CAN_BUY == "Y") {
            this.obPriceBlock.classList.remove('hidden');
            
            if (this.product[this.offerNum].REQUEST_PRICE == "Y") {
              this.obPrice.innerHTML = this.product[this.offerNum].PRICE.HTML;
              this.obPrice.classList.add('big');
              this.obPrice.classList.remove('hidden');
              this.obPrice.classList.remove('red-color');
              this.obOldPrice.classList.add('hidden');
              /*this.obPriceRequest.classList.remove('hidden');*/
            } else {
              /*this.obPriceRequest.classList.add('hidden');*/
              
              if (typeof this.product[this.offerNum].PRICE.VALUE !== "undefined") {
                this.obPrice.classList.remove('hidden');
                
                if (typeof this.product[this.offerNum].OLD_PRICE.VALUE !== "undefined") {
                  this.obPrice.classList.remove('big');
                  this.obPrice.classList.add('red-color');
                } else {
                  this.obPrice.classList.add('big');
                  this.obPrice.classList.remove('red-color');
                }
                
                
                this.obPrice.innerHTML = this.product[this.offerNum].PRICE.HTML;
              } else {
                this.obPrice.classList.add('hidden');
                this.obPrice.innerHTML = "";
              }
              
              
              if (typeof this.product[this.offerNum].OLD_PRICE.VALUE !== "undefined") {
                this.obOldPrice.classList.remove('hidden');
                this.obOldPrice.innerHTML = this.product[this.offerNum].OLD_PRICE.HTML;
              } else {
                this.obOldPrice.classList.add('hidden');
                this.obOldPrice.innerHTML = "";
              }
              
            }
            
            if (typeof this.product[this.offerNum].DISCOUNT.VALUE !== "undefined") {
              this.obDots.classList.remove('hidden');
              this.obDiscount.classList.remove('hidden');
              this.obDiscount.innerHTML = BX.message("ECONOMY_MESSAGE") + "&nbsp;<span class=\"total bold\">" + this.product[this.offerNum].DISCOUNT.HTML + "</span>";
              $(this.obPriceBlock).find(".wrap-btn").addClass("marg");
            } else {
              this.obDots.classList.add('hidden');
              this.obDiscount.classList.add('hidden');
              this.obDiscount.innerHTML = "";
              $(this.obPriceBlock).find(".wrap-btn").removeClass("marg");
            }
            
            if (this.product[this.offerNum].PRICE_COMMENT1.length > 0)
              this.obComment1.innerHTML = this.product[this.offerNum].PRICE_COMMENT1;
            
            else {
              this.obComment1.innerHTML = "";
            }
          } else {
            this.obPriceBlock.classList.add('hidden');
          }
          
          
        }
        
        
      },
    
    
    window.JCCatalogItemKraken = function (arParams) {
      
      this.productType = null;
      this.firstLoad = true;
      this.visual = {};
      
      this.config = {
        useAdd2Basket: false,
        useFastOrder: false,
        useSku: false
      };
      this.product = {};
      this.offerNum = 0;
      this.offerNumPrev = 0;
      this.treeProps = [];
      this.selectedValues = {};
      this.emptySku = true;
      this.formFastOrder = null;
      
      
      this.obTree = null;
      this.obGallery = null;
      this.obArticleAvailableText = null;
      this.obArticle = null;
      this.obWrArticle = null;
      this.obAvailable = null;
      this.obWrAvailable = null;
      this.obText = null;
      this.obWrText = null;
      
      
      this.obPriceBlock = null;
      this.obPriceRequest = null;
      this.obPrice = null;
      this.obOldPrice = null;
      this.obDots = null;
      this.obDiscount = null;
      
      this.obSkuChars = null;
      
      
      this.obComment1 = null;
      
      
      this.obBtnFastOrder = null;
      this.obWrBtnFastOrder = null;
      this.obBtnAdd2Basket = null;
      this.obWrBtnAdd2Basket = null;
      this.obBtn2Detail = null;
      
      
      this.errorCode = 0;
      
      if (typeof arParams === 'object') {
        this.params = arParams;
        this.initConfig();
        this.initBtns();
        
        switch (this.productType) {
          case "PRODUCT":
            this.initProductData();
            break;
          case "OFFERS":
            
            if (!this.emptySku)
              this.initOffersData();
            
            break;
          default:
            this.errorCode = -1;
        }
      }
      
      if (this.errorCode === 0)
        BX.ready(BX.delegate(this.init, this));
      
      this.params = {};
    },
    
    window.JCCatalogItemKraken.prototype =
      {
        initBtns: function () {
          if (this.config.useFastOrder) {
            this.obBtnFastOrder = BX(this.visual.BTN_FAST_ORDER);
            BX.bind(this.obBtnFastOrder, 'click', BX.delegate(this.callFastOrderForm, this));
            
            this.obWrBtnFastOrder = BX(this.visual.WR_BTN_FAST_ORDER);
          }
          
          if (this.config.useAdd2Basket) {
            this.obBtnAdd2Basket = BX(this.visual.BTN_ADD2BASKET);
            BX.bind(this.obBtnAdd2Basket, 'click', BX.delegate(this.add2Basket, this));
            
            this.obWrBtnAdd2Basket = BX(this.visual.WR_BTN_ADD2BASKET);
          }
          
          this.obBtn2Detail = BX(this.visual.BTN2DETAIL);
        },
        
        initConfig: function () {
          
          this.productType = this.params.PRODUCT_TYPE;
          
          this.visual = this.params.VISUAL;
          
          if (this.params.CONFIG.USE_ADD2BASKET)
            this.config.useAdd2Basket = this.params.CONFIG.USE_ADD2BASKET;
          
          if (this.params.CONFIG.USE_FAST_ORDER)
            this.config.useFastOrder = this.params.CONFIG.USE_FAST_ORDER;
          
          if (this.params.CONFIG.USE_SKU)
            this.config.useSku = this.params.CONFIG.USE_SKU;
          
          
          this.emptySku = this.params.CONFIG.EMPTY_SKU;
          
          this.product = this.params.PRODUCT;
          
          this.formFastOrder = this.params.FAST_ORDER_FORM_ID;
        },
        
        init: function () {
          switch (this.productType) {
            case "PRODUCT":
              break;
            case "OFFERS":
              this.setCurrent();
              
              break;
            default:
              this.errorCode = -1;
          }
          
        },
        
        initProductData: function () {
          this.refreshBtnAdd2Basket();
        },
        
        initOffersData: function () {
          
          this.treeProps = this.params.TREE_PROPS;
          this.obName2Detail = BX(this.visual.NAME2DETAIL);
          this.obTree = BX(this.visual.SKU_ID);
          this.obGallery = BX(this.visual.GALLERY);
          
          this.obArticleAvailableText = BX(this.visual.ARTICLE_AVAILABLE_TEXT);
          this.obArticle = BX(this.visual.ARTICLE);
          this.obWrArticle = BX(this.visual.ARTICLE_BLOCK);
          this.obAvailable = BX(this.visual.AVAILABLE);
          this.obWrAvailable = BX(this.visual.AVAILABLE_BLOCK);
          this.obText = BX(this.visual.PREVIEW_TEXT);
          this.obWrText = BX(this.visual.PREVIEW_TEXT_BLOCK);
          
          this.obPriceBlock = BX(this.visual.PRICE_BLOCK_ID);
          /*this.obPriceRequest = BX(this.visual.PRICE_REQUEST);*/
          this.obPrice = BX(this.visual.PRICE_VALUE);
          this.obOldPrice = BX(this.visual.OLDPRICE_VALUE);
          this.obDots = BX(this.visual.DOTS);
          this.obDiscount = BX(this.visual.DISCOUNT);
          
          this.obComment1 = BX(this.visual.PRICE_COMMENT1);
          
          this.obSkuChars = BX(this.visual.CHARS);
          
          var treeItems = this.obTree.querySelectorAll('li');
          
          for (i = 0; i < treeItems.length; i++) {
            BX.bind(treeItems[i], 'click', BX.delegate(this.selectOfferProp, this));
          }
          
          
          if (this.params.OFFER_SELECTED != "0") {
            this.offerNum = this.params.OFFER_SELECTED;
            /*this.firstLoad = false;*/
          }
          
          
        },
        
        deleteParameterURL: function (url, param) {
          var a = url.split('?');
          var re = new RegExp('(\\?|&)' + param + '=[^&]+', 'g');
          
          if (url == "undefined")
            url = "";
          
          url = ('?' + a[1]).replace(re, '');
          url = url.replace(/^&|\?/, '');
          
          if (url == "undefined")
            url = "";
          
          var dlm = (url == '') ? '' : '?';
          return a[0] + dlm + url;
        },
        
        addParameterToURL: function (param, value) {
          
          var url = window.location.href;
          
          
          if (history.replaceState) {
            var baseUrl = this.deleteParameterURL(url, param);
            baseUrl += (baseUrl.split('?')[1] ? '&' : '?') + param + "=" + value;
            history.replaceState(null, null, baseUrl);
          } else {
            console.warn('History API don`t support');
          }
        },
        
        callFastOrderForm: function () {
          
          var productID, mainID = null, isOffer = "N";
          
          switch (this.productType) {
            case "PRODUCT":
              productID = this.product.PRODUCT_ID;
              mainID = this.product.MAIN_ID;
              break;
            case "OFFERS":
              productID = this.product[this.offerNum].PRODUCT_ID;
              mainID = this.product[this.offerNum].MAIN_ID;
              isOffer = "Y";
              break;
            default:
              break;
          }
          
          var params = {
            "element_type": "CTL",
            "element_id": productID,
            "main_id": mainID,
            "isOffer": isOffer,
            "formId": this.formFastOrder,
            "action": "order"
          };
          
          callFormDialog(params);
        },
        
        add2Basket: function () {
          var productID = "", count = "", _this = this, mainID = "";
          
          switch (this.productType) {
            case "PRODUCT":
              productID = this.product.PRODUCT_ID;
              count = this.product.MIN_QUANTITY;
              mainID = this.product.MAIN_ID;
              break;
            case "OFFERS":
              productID = this.product[this.offerNum].PRODUCT_ID;
              count = this.product[this.offerNum].MIN_QUANTITY;
              mainID = this.product[this.offerNum].MAIN_ID;
              
              break;
            default:
              break;
          }
          
          add2Basket(productID, count, false, mainID, function () {
            _this.refreshBtnAdd2Basket();
            updateBasketPublicInfo();
          });
          
        },
        
        selectOfferProp: function () {
          var i = 0,
            strTreeValue = '',
            arTreeItem = [],
            rowItems = null,
            target = BX.proxy_context;
          
          
          if (target && target.hasAttribute('data-treevalue')) {
            if (BX.hasClass(target, 'active'))
              return;
            
            
            strTreeValue = target.getAttribute('data-treevalue');
            arTreeItem = strTreeValue.split('_');
            
            this.searchOfferPropIndex(arTreeItem[0], arTreeItem[1]);
            
            
            rowItems = BX.findChildren(target.parentNode, {tagName: 'li'}, false);
            
            
            if (rowItems && rowItems.length) {
              for (i = 0; i < rowItems.length; i++) {
                BX.removeClass(rowItems[i], 'active');
              }
            }
            
            
            BX.addClass(target, 'active');
            
          }
        },
        
        searchOfferPropIndex: function (strPropID, strPropValue) {
          var i = 0,
            j = 0,
            strName = '',
            arShowValues = false,
            arFilter = {};
          
          
          for (i = 0; i < this.treeProps.length; i++) {
            if (this.treeProps[i].ID === strPropID) {
              index = i;
              break;
            }
          }
          
          if (index > -1) {
            for (i = 0; i < index; i++) {
              strName = 'PROP_' + this.treeProps[i].ID;
              arFilter[strName] = this.selectedValues[strName];
            }
            
            strName = 'PROP_' + this.treeProps[index].ID;
            arFilter[strName] = strPropValue;
            
            
            for (i = index + 1; i < this.treeProps.length; i++) {
              strName = 'PROP_' + this.treeProps[i].ID;
              arShowValues = this.getRowValues(arFilter, strName);
              
              if (!arShowValues)
                break;
              
              if (this.selectedValues[strName] && BX.util.in_array(this.selectedValues[strName], arShowValues)) {
                arFilter[strName] = this.selectedValues[strName];
              } else {
                arFilter[strName] = arShowValues[0];
              }
              
              
              this.updateRow(i, arFilter[strName], arShowValues);
              
              
            }
            
            this.selectedValues = arFilter;
            
            
            this.changeInfo();
            
          }
          
        },
        
        setCurrent: function () {
          var i = 0,
            j = 0,
            strName = '',
            arShowValues = false,
            arFilter = {},
            current = this.product[this.offerNum].TREE;
          
          
          for (i = 0; i < this.treeProps.length; i++) {
            strName = 'PROP_' + this.treeProps[i].ID;
            arShowValues = this.getRowValues(arFilter, strName);
            
            if (!arShowValues)
              break;
            
            
            if (BX.util.in_array(current[strName], arShowValues) && current[strName])
              arFilter[strName] = current[strName];
            
            this.updateRow(i, arFilter[strName], arShowValues);
            
          }
          
          this.selectedValues = arFilter;
          
          this.changeInfo();
        },
        
        getRowValues: function (arFilter, index) {
          var arValues = [],
            i = 0,
            j = 0,
            boolSearch = false,
            boolOneSearch = true;
          
          if ($.isEmptyObject(arFilter)) {
            for (i = 0; i < this.product.length; i++) {
              if (!BX.util.in_array(this.product[i].TREE[index], arValues) && this.product[i].TREE[index]) {
                arValues[arValues.length] = this.product[i].TREE[index];
              }
            }
            boolSearch = true;
          } else {
            for (i = 0; i < this.product.length; i++) {
              boolOneSearch = true;
              
              for (j in arFilter) {
                if (arFilter[j] !== this.product[i].TREE[j]) {
                  boolOneSearch = false;
                  break;
                }
              }
              
              
              if (boolOneSearch) {
                if (!BX.util.in_array(this.product[i].TREE[index], arValues) && this.product[i].TREE[index]) {
                  arValues[arValues.length] = this.product[i].TREE[index];
                }
                
                
                boolSearch = true;
              }
            }
            
          }
          
          
          return (boolSearch ? arValues : false);
        },
        
        updateRow: function (intNumber, activeId, showId) {
          
          var i = 0,
            value = '',
            isCurrent = false,
            rowItems = null;
          
          
          var lineContainer = this.obTree.querySelectorAll(".sku-row");
          
          
          if (intNumber > -1 && intNumber < lineContainer.length) {
            rowItems = lineContainer[intNumber].querySelectorAll('li');
            
            for (i = 0; i < rowItems.length; i++) {
              value = rowItems[i].getAttribute('data-onevalue');
              isCurrent = value === activeId;
              
              if (isCurrent) {
                BX.addClass(rowItems[i], 'active');
              } else {
                BX.removeClass(rowItems[i], 'active');
              }
              
              rowItems[i].style.display = BX.util.in_array(value, showId) ? '' : 'none';
              
              if (isCurrent) {
                lineContainer[intNumber].style.display = (value == 0) ? 'none' : '';
              }
            }
          }
          
          if (showId.length === 0) {
            lineContainer[intNumber].style.display = 'none';
          }
          
        },
        
        setCurrentOfferNum: function () {
          var index = -1;
          
          for (i = 0; i < this.product.length; i++) {
            boolOneSearch = true;
            
            for (j in this.selectedValues) {
              
              if (this.selectedValues[j] !== this.product[i].TREE[j]) {
                boolOneSearch = false;
                break;
              }
              
            }
            
            if (boolOneSearch) {
              index = i;
              break;
            }
          }
          
          this.offerNumPrev = this.offerNum;
          
          this.offerNum = index;
        },
        
        changeInfo: function () {
          var j = 0,
            i = 0;
          
          this.setCurrentOfferNum();
          this.refreshBtnAdd2Basket();
          
          if (!this.firstLoad) {
            if (this.obName2Detail.hasAttribute("href")) {
              this.obName2Detail.setAttribute("href", this.product[this.offerNum].DETAIL_PAGE_URL);
            }
            this.drawGallery();
            this.drawPriceBlock();
            updateBasketPublicInfo();
          } else {
            this.firstLoad = false;
          }
          
          
        },
        
        refreshBtnAdd2Basket: function () {
          switch (this.productType) {
            case "PRODUCT":
              break;
            case "OFFERS":
              if (this.config.useAdd2Basket) {
                if (this.obBtnAdd2Basket.hasAttribute("data-product-id")) {
                  this.obBtnAdd2Basket.setAttribute("data-product-id", this.product[this.offerNum].PRODUCT_ID);
                }
                
                if (this.obWrBtnAdd2Basket) {
                  if (this.product[this.offerNum].CAN_BUY == "Y")
                    this.obWrBtnAdd2Basket.classList.remove("hidden");
                  else {
                    this.obWrBtnAdd2Basket.classList.add("hidden");
                  }
                }
                if (this.product[this.offerNum].IS_AVAILABLE === "N")
                  this.obWrBtnAdd2Basket.classList.add("hidden");
                else {
                  this.obWrBtnAdd2Basket.classList.remove("hidden");
                }
                
              }
              if (this.config.useFastOrder) {
                if (this.product[this.offerNum].CAN_BUY == "Y")
                  this.obWrBtnFastOrder.classList.remove("hidden");
                else {
                  this.obWrBtnFastOrder.classList.add("hidden");
                }
              }
              
              if (this.obBtn2Detail) {
                if (this.obBtn2Detail.hasAttribute("href"))
                  this.obBtn2Detail.setAttribute("href", this.product[this.offerNum].DETAIL_PAGE_URL);
              }
              
              
              break;
            default:
              break;
          }
        },
        
        drawSkuCharsBlock: function () {
          this.obSkuChars.innerHTML = "";
          
          if (this.product[this.offerNum].SKU_CHARS.length > 0) {
            var html = "";
            
            for (var i = 0; i < this.product[this.offerNum].SKU_CHARS.length; i++) {
              
              html +=
                "<table class=\"cart-char-table mobile-break show-hidden-child\">"
                + "<tr>"
                + "<td class=\"left\">" + this.product[this.offerNum].SKU_CHARS[i].NAME + "</td>"
                + "<td class=\"dotted\"><div class=\"dotted\"></div></td>"
                + "<td class=\"right bold\">" + this.product[this.offerNum].SKU_CHARS[i].VALUE + "</td>"
                + "</tr>"
                + "</table>";
            }
            
            this.obSkuChars.innerHTML = html;
          }
          
          
        },
        
        drawGallery: function () {
          if (this.obGallery) {
            var galleryContainer = this.obGallery.querySelector('.gallery-list'),
              galleryHTML = "";
            
            for (var i = 0; i < 1; i++) {
              galleryHTML += "<a href=\"" + this.product[this.offerNum].DETAIL_PAGE_URL + "\">"
                + "<img class=\"img-responsive center-block animate_to_box\" data-cart-id-img=\"" + this.product[this.offerNum].PRODUCT_ID + "\" title=\"" + this.product[this.offerNum].GALLERY[i].TITLE + "\" alt=\"" + this.product[this.offerNum].GALLERY[i].ALT + "\" src=\"" + this.product[this.offerNum].GALLERY[i].SMALL + "\">"
                + "</a>";
            }
            
            galleryContainer.innerHTML = galleryHTML;
          }
          
        },
        
        drawArticleAvailableText: function () {
          var article = false,
            available = false,
            text = false;
          
          this.product[this.offerNum].ARTICLE;
          this.product[this.offerNum].AVAILABLE.VALUE;
          this.product[this.offerNum].AVAILABLE.VALUE_XML_ID;
          this.product[this.offerNum].PREVIEW_TEXT;
          
          
          if (this.product[this.offerNum].ARTICLE.length)
            article = true;
          
          if (typeof this.product[this.offerNum].AVAILABLE.VALUE !== "undefined")
            available = true;
          
          if (this.product[this.offerNum].PREVIEW_TEXT.length)
            text = true;
          
          
          if (article || available || text)
            this.obArticleAvailableText.classList.remove('hidden');
          else {
            this.obArticleAvailableText.classList.add('hidden');
          }
          
          
          if (article) {
            this.obWrArticle.classList.remove('hidden');
            this.obArticle.innerHTML = BX.message('ARTICLE') + " " + this.product[this.offerNum].ARTICLE;
            this.obArticleAvailableText.classList.remove('no-article');
          } else {
            this.obWrArticle.classList.add('hidden');
            this.obArticle.innerHTML = "";
            this.obArticleAvailableText.classList.add('no-article');
          }
          
          if (available) {
            if (typeof this.product[this.offerNumPrev].AVAILABLE.VALUE !== "undefined")
              this.obAvailable.classList.remove(this.product[this.offerNumPrev].AVAILABLE.VALUE_XML_ID);
            
            this.obAvailable.classList.add(this.product[this.offerNum].AVAILABLE.VALUE_XML_ID);
            this.obAvailable.innerHTML = this.product[this.offerNum].AVAILABLE.VALUE;
            this.obWrAvailable.classList.remove('hidden');
          } else {
            this.obWrAvailable.classList.add('hidden');
            
            if (typeof this.product[this.offerNumPrev].AVAILABLE.VALUE !== "undefined")
              this.obAvailable.classList.remove(this.product[this.offerNumPrev].AVAILABLE.VALUE_XML_ID);
            
            this.obAvailable.innerHTML = "";
          }
          
          
          if (text) {
            this.obWrText.classList.remove('hidden');
            this.obText.innerHTML = this.product[this.offerNum].PREVIEW_TEXT;
            
          } else {
            this.obWrText.classList.add('hidden');
            this.obText.innerHTML = "";
          }
        },
        
        drawPriceBlock: function () {
          
          if (this.product[this.offerNum].CAN_BUY == "Y") {
            this.obPriceBlock.classList.remove('hidden');
            
            if (this.product[this.offerNum].REQUEST_PRICE == "Y") {
              this.obPrice.innerHTML = this.product[this.offerNum].PRICE.HTML;
              this.obPrice.classList.add('big');
              this.obPrice.classList.remove('hidden');
              this.obPrice.classList.remove('red-color');
              this.obOldPrice.classList.add('hidden');
              /*this.obPriceRequest.classList.remove('hidden');*/
            } else {
              /*this.obPriceRequest.classList.add('hidden');*/
              
              if (typeof this.product[this.offerNum].PRICE.VALUE !== "undefined") {
                
                this.obPrice.classList.remove('hidden');
                
                if (typeof this.product[this.offerNum].OLD_PRICE.VALUE !== "undefined") {
                  this.obPrice.classList.remove('big');
                  this.obPrice.classList.add('red-color');
                } else {
                  this.obPrice.classList.add('big');
                  this.obPrice.classList.remove('red-color');
                }
                
                this.obPrice.innerHTML = this.product[this.offerNum].PRICE.HTML;
              } else {
                this.obPrice.classList.add('hidden');
                this.obPrice.innerHTML = "";
              }
              
              
              if (typeof this.product[this.offerNum].OLD_PRICE.VALUE !== "undefined") {
                this.obOldPrice.classList.remove('hidden');
                this.obOldPrice.innerHTML = this.product[this.offerNum].OLD_PRICE.HTML;
              } else {
                this.obOldPrice.classList.add('hidden');
                this.obOldPrice.innerHTML = "";
              }
            }
          } else {
            this.obPriceBlock.classList.add('hidden');
          }
          
          
        }
        
        
      }
})(window);


function updateWidgetInPublicMob(action) {
  
  var url2Basket = $(".basket-count-control-widget-in-public-mob").find(".url2Basket"),
    url2Other = $(".basket-count-control-widget-in-public-mob").find(".url2Other");
  
  if (action) {
    $(".basket-count-control-widget-in-public-mob").addClass('no-empty');
    $(".basket-count-control-widget-in-public-mob").removeClass('cart-empty');
    
    if (url2Basket.length > 0)
      url2Basket.removeClass("hidden");
    
    if (url2Other.length > 0)
      url2Other.addClass("hidden");
  } else {
    $(".basket-count-control-widget-in-public-mob").removeClass('no-empty');
    $(".basket-count-control-widget-in-public-mob").addClass('cart-empty');
    
    if (url2Basket.length > 0)
      url2Basket.addClass("hidden");
    
    if (url2Other.length > 0)
      url2Other.removeClass("hidden");
  }
}

function updateWidgetInPublic(action) {
  
  
  var aBtn = $(".basket-count-control-widget-in-public").find(".cart_link");
  
  if (action) {
    $(".basket-count-control-widget-in-public").addClass('no-empty cart-show');
    $(".basket-count-control-widget-in-public").removeClass('cart-empty');
    
    if (aBtn.length > 0)
      aBtn.addClass("hidden");
  } else {
    $(".basket-count-control-widget-in-public").removeClass('no-empty cart-show');
    $(".basket-count-control-widget-in-public").addClass('cart-empty');
    
    if (aBtn.length > 0)
      aBtn.removeClass("hidden");
  }
}

function updateMiniWidgetInMenu(action) {
  
  var aBtn = $(".basket-count-control-mini-widget").find(".cart_link");
  
  if (action) {
    
    $(".basket-count-control-mini-widget").addClass('no-empty');
    $(".basket-count-control-mini-widget").removeClass('cart-empty');
    
    aBtn.addClass("cart-show").removeAttr("href");
  } else {
    $(".basket-count-control-mini-widget").removeClass('no-empty');
    $(".basket-count-control-mini-widget").addClass('cart-empty');
    
    if (typeof aBtn.attr("data-url") !== "undefined")
      aBtn.removeClass("cart-show").attr("href", aBtn.attr("data-url"));
  }
}

function updateBtnsAdd2Basket() {
  
  $(".btn-add2basket").removeClass("added");
  
  for (var i in globalBasketItems["ITEMS"]) {
    $(".btn-add2basket[data-product-id=\"" + globalBasketItems["ITEMS"][i].id + "\"]").addClass("added");
  }
}

function updateBasketPublicInfo() {
  if (globalBasketItems["COUNT"] > 0) {
    updateMiniWidgetInMenu(true);
    updateWidgetInPublic(true);
    updateWidgetInPublicMob(true);
  } else {
    updateMiniWidgetInMenu(false);
    updateWidgetInPublic(false);
    updateWidgetInPublicMob(false);
  }
  updateBtnsAdd2Basket();
  
  $(".basket-count-value").html(globalBasketItems["COUNT"]);
  
}

$(document).on("click", ".btn-add2basket.added", function () {
  openCart();
});

$(document).on("click", ".btn-fast-order", function () {
  var productID = 0,
    mainID = 0,
    isOffer = "N",
    formId = "N",
    params = {};
  
  
  if (typeof $(this).attr("data-product-id") != "undefined")
    productID = mainID = $(this).attr("data-product-id");
  
  if (typeof $(this).attr("data-main-id") != "undefined") {
    isOffer = "Y";
    mainID = $(this).attr("data-main-id");
  }
  
  if (typeof $(this).attr("data-form-id") != "undefined")
    formId = $(this).attr("data-form-id");
  
  
  if (productID && mainID && formId != "N") {
    params = {
      "element_type": "CTL",
      "element_id": productID,
      "main_id": mainID,
      "isOffer": isOffer,
      "formId": formId,
      "action": "order"
    };
    
    callFormDialog(params);
  }
});


$(document).on("click", ".callDialogForm", function () {
  var productID = 0,
    mainID = 0,
    isOffer = "N",
    formId = "N",
    elementType = "",
    action = "",
    params = {};
  
  
  if (typeof $(this).attr("data-product-id") != "undefined")
    productID = mainID = $(this).attr("data-product-id");
  
  if (typeof $(this).attr("data-main-id") != "undefined") {
    if (productID != $(this).attr("data-main-id")) {
      isOffer = "Y";
      mainID = $(this).attr("data-main-id");
    }
    
  }
  
  if (typeof $(this).attr("data-form-id") != "undefined")
    formId = $(this).attr("data-form-id");
  
  if (typeof $(this).attr("data-elementtype") != "undefined")
    elementType = $(this).attr("data-elementtype");
  
  if (typeof $(this).attr("data-action") != "undefined")
    action = $(this).attr("data-action");
  
  
  if (productID && mainID && formId != "N") {
    params = {
      "element_type": elementType,
      "element_id": productID,
      "main_id": mainID,
      "isOffer": isOffer,
      "formId": formId,
      "action": action
    };
    
    callFormDialog(params);
  }
});


function callFormDialog(params) {
  params = params || null;
  
  $('.google-spin-wrapper').addClass('active');
  
  $.post("/bitrix/tools/kraken/ajax/formmodal.php",
    Object.assign({
      "site_id": $("input.site_id").val()
    }, params)
    ,
    function (html) {
      $("body").addClass("modal-open");
      if (isIos) {
        $("body").addClass("modal-ios");
      }
      
      $('div.modalAreaForm').html(html);
      setTimeout(function () {
        $('div.modalAreaForm').find(".kraken-modal").addClass("active");
        $("input[name='url']").val(decodeURIComponent(location.href));
        $('div.modalAreaForm form.form .date').datetimepicker({
          timepicker: false,
          format: 'd/m/Y',
          scrollMonth: false,
          scrollInput: false,
          dayOfWeekStart: 1
        });
      }, 300);
      
      $('.google-spin-wrapper').removeClass('active');
      
    }
  );
}

function updateBasketFly(templ) {
  $.post('/bitrix/tools/kraken/ajax/cart/component_cart.php', {
      site_id: $("input.site_id").val(),
      templ: templ
    },
    function (html) {
      // $(".area_for_" + templ).html(html);
      
    });
}


function animateToBasket(id) {
  if ($("img[data-cart-id-img = '" + id + "']").length > 0) {
    
    if ($(".btn-add2basket[data-product-id = '" + id + "']").length > 0) {
      if (!$(".btn-add2basket[data-product-id = '" + id + "']").hasClass('added')) {
        
        var obj_img = $("img[data-cart-id-img = '" + id + "']");
        var mini_cart = $(".open-cart");
        
        if ($(window).width() < 767)
          mini_cart = $(".open-cart-mob");
        
        var width_parent_img = $(this).parents(".element").find(
          "td.parent_anim_img_area").width() / 2;
        var height_parent_img = $(this).parents(".element").find(
          "td.parent_anim_img_area").height() / 2;
        
        obj_img.clone().css({
          'width': 70 + 'px',
          'height': 70 + 'px',
          'position': 'absolute',
          'z-index': '9999',
          'borderRadius': 50 + '%',
          top: obj_img.offset().top + height_parent_img,
          left: obj_img.offset().left + width_parent_img
        }).appendTo("body").animate({
          opacity: 0.05,
          left: mini_cart.offset()['left'],
          top: mini_cart.offset()['top'],
          width: 20,
          height: 20
        }, 700, function () {
          $(this).remove();
        });
      }
      
    }
    
  }
}

function openCart() {
  $('.no-click-block').addClass('on');
  $('div.cart-parent').addClass('open');
  $('.wrapper').addClass('blur');
  $('body').addClass('modal-open');
  
  
  var cartOut = setTimeout(function () {
    $('div.cart-parent').addClass('on');
    clearTimeout(cartOut);
    
  }, 200);
  
  $('.lazyload', 'div.cart-parent').each(
    function (index, element) {
      $(element).attr("src", $(element).attr("data-src"));
      $(element).removeAttr('data-src');
    }
  );
}

function closeCart() {
  $('.wrapper').removeClass('blur');
  $('body').removeClass('modal-open');
  $('div.cart-parent').removeClass('on');
  $('.no-click-block').removeClass('on');
  var closeCartOut = setTimeout(function () {
    $('div.cart-parent').removeClass('open');
    clearTimeout(closeCartOut);
  }, 700);
}


function controlAjaxBasketInfo(params) {
  params = params || null;
  
  if (params === null)
    return false;
  
  
  if (params.action == "update") {
    $(".total-parent-preload-circleG").addClass('active');
    $(".parent-preload-circleG[data-product-id=\"" + params.idcartEl + "\"]").addClass('active');
  }
  
  $.ajax({
    url: "/bitrix/tools/kraken/ajax/cart/cart.php",
    dataType: 'json',
    method: 'POST',
    data: Object.assign({
      "site_id": $("input.site_id").val()
    }, params)
    ,
    success: function (json) {
      globalBasketItems = {};
      globalBasketItems = json.BASKET;
      
      
      if (params.action == "add") {
        animateToBasket(params.idcartEl);
        
        if ($(".first-click-show-basket").length > 0) {
          if (!$(".first-click-show-basket").hasClass("active")) {
            $(".first-click-show-basket").addClass("active");
            openCart();
          }
        }
        
        addGoal('ADD2BASKET');
      }
      
      
      if (typeof params.callback != "undefined")
        params.callback();
      
      
      if (json.EMPTY == "Y") {
        closeCart();
        if ($(".first-click-show-basket").length > 0) {
          if ($(".first-click-show-basket").hasClass("active"))
            $(".first-click-show-basket").removeClass("active");
          
        }
        
        if ($(".cart_page_wrap").length > 0)
          $(".cart_page_wrap").removeClass("cart-no-empty").addClass("cart-empty");
        
        
        if ($(".cart-first-block").length > 0) {
          $(".cart-page-inner-js").addClass('cart-empty');
        }
      }
      
      updateBasketFly("list");
      updateBasketFly("total");
      
      updateBasketPublicInfo();
    }
  });
}

function add2Basket(productID, count, maxCount, mainId, callback) {
  /*function add2Basket(productID, count, mainId, callback) {*/
  var params = {
    "action": "add",
    "idcartEl": productID,
    "countCart": count,
    "maxCount": maxCount,
    "main_id": mainId,
    "callback": callback
  };
  controlAjaxBasketInfo(params);
  
}


$(document).on('click', '.action-add2basket', function () {
  var productID = 0, count = 1, mainId = 0;
  
  if (typeof $(this).attr("data-product-id") != "undefined")
    productID = mainId = $(this).attr("data-product-id");
  
  if (typeof $(this).attr("data-main-id") != "undefined")
    mainId = $(this).attr("data-main-id");
  
  if (typeof $(this).attr("data-cart-quantity") != "undefined")
    count = $(this).attr("data-cart-quantity");
  
  if (productID && count && mainId)
    add2Basket(productID, count, false, mainId);
});

function updateBasket(productID, count, mainId, callback) {
  
  var params = {
    "action": "update",
    "idcartEl": productID,
    "countCart": count,
    "main_id": mainId
  };
  
  clearTimeout($.data(this, 'cart_count'));
  
  $.data(this, 'cart_count', setTimeout($.proxy(function () {
    controlAjaxBasketInfo(params);
  }, this), 700));
  
  
}


$(document).on('click', '.removeBasketProduct', function () {
  if (typeof $(this).attr("data-cart-id") != "undefined")
    deleteItemBasket($(this).attr("data-cart-id"));
});

$(document).on('click', '.action-clear-cart', function () {
  clearBasket();
});


function clearBasket() {
  var params = {
    "action": "clear"
  };
  // controlAjaxBasketInfo(params);
}

function deleteItemBasket(productID, callback) {
  
  var params = {
    "action": "delete",
    "idcartEl": productID
  };
  controlAjaxBasketInfo(params);
}

$(document).ready(function () {
  if ($(".fly-basket").length > 0) {
    updateBasketFly("list");
    updateBasketFly("total");
  }
  $("input[name='url']").val(decodeURIComponent(location.href));
});

$(document).on('click', '.wrapper-select-input', function () {
  console.log("here")
  if (!$(this).hasClass('open'))
    $(this).addClass('open');
  
  else {
    $(this).removeClass('open');
  }
  
});


$(document).on('click', '.section-with-hidden-items .head-filter',
  function () {
    var btn = $(this);
    var content = $(".content-animate-slide-down[data-show ='" + btn.attr("data-show") + "']");
    var btns = $(".click-animate-slide-down[data-show ='" + btn.attr("data-show") + "']");
    
    content.slideUp(400, function () {
        btns.addClass('noactive-mob').removeClass('active-mob');
        content.addClass('noactive-mob').removeClass('active-mob');
      }
    );
  }
);

$(document).on('click', '.click-animate-slide-down',
  function () {
    var btn = $(this);
    var content = $(".content-animate-slide-down[data-show ='" + btn.attr("data-show") + "']");
    
    if ($(window).width() > 768) {
      
      if (!btn.hasClass('active')) {
        content.slideDown(400, function () {
            btn.addClass('active').removeClass('noactive');
            content.addClass('active').removeClass('noactive');
          }
        );
        BX.setCookie($(".domen-url-for-cookie").val() + '_catalog_tab_' + btn.attr("data-show") + $("input.site_id").val(), 'active', {
          expires: 60 * 60 * 60 * 60,
          path: "/"
        });
      } else {
        content.slideUp(400, function () {
            btn.addClass('noactive').removeClass('active');
            content.addClass('noactive').removeClass('active');
          }
        );
        BX.setCookie($(".domen-url-for-cookie").val() + '_catalog_tab_' + btn.attr("data-show") + $("input.site_id").val(), 'noactive', {
          expires: 60 * 60 * 60 * 60,
          path: "/"
        });
      }
      
    } else {
      if (!btn.hasClass('active-mob')) {
        content.addClass('active-mob').removeClass('noactive-mob');
        content.slideDown(400, function () {
            btn.addClass('active-mob').removeClass('noactive-mob');
          }
        );
        
      } else {
        content.slideUp(400, function () {
            btn.addClass('noactive-mob').removeClass('active-mob');
            content.addClass('noactive-mob').removeClass('active-mob');
          }
        );
      }
    }
    
  }
);

if ($(window).width() > 1024) {
  
  $(".service-item")
    .mouseenter(function () {
      if ($(this).find(".panel-bottom").length > 0) {
        $(this).css({
          'height': ($(this).height() - $(this).find(".panel-bottom").outerHeight()) + 'px'
        });
      }
      
    })
    .mouseleave(
      function () {
        if ($(this).find(".panel-bottom").length > 0) {
          $(this).css({
            'height': 'auto'
          });
        }
        
      }
    );
}


$(document).on('click', '.open-dialog-window',
  function () {
    
    if ($(this).attr("data-typename")) {
      var params = {
        "typeName": $(this).attr("data-typename"),
        "elementID": $(this).attr("data-elementid"),
        "blockTitle": $(this).attr("data-blocktitle"),
        "iblockID": $("input.LAND_iblockID").val(),
        "iblockTypeID": $("input.LAND_iblockTypeID").val(),
        "site_id": $("input.site_id").val()
      };
      
      callDialogWindow(params);
    }
    
  }
);

function callDialogWindow(params) {
  
  params = params || null;
  
  if (params) {
    showProcessLoad();
    startBlurWrapperContainer();
    
    $.post("/bitrix/tools/kraken/ajax/modal.php", params,
      function (html) {
        closeProcessLoad();
        $(".modalAreaDetail").html(html);
        
        setTimeout(function () {
          $('div.modalAreaDetail').find('.kraken-modal').addClass('active');
        }, 100);
      });
  }
}

window.addEventListener("load", () => {
  const cartWidget = document.querySelector(".basket-count-control-widget-in-public")
  const mobileCart = document.querySelector(".mob-cart .open-cart-mob")
  
  async function getProductCountInBasket() {
    return await fetch("/ajax/getProductCountInBasket.php")
      .then(res => {
        if (res.ok) return res.json()
        else return false;
      })
      .then(data => {
        return data.count
      })
  }
  
  async function basketHandler() {
    const count = await getProductCountInBasket();
    if (count && count > 0) {
      cartWidget.classList.add("no-empty")
      cartWidget.querySelector(".basket-count-value").textContent = count
      mobileCart?.classList.add("no-empty")
    }
  }
  
  BX.addCustomEvent(
    "OnBasketChange",
    basketHandler
  );
  
  
})
