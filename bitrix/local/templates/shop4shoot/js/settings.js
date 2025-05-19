/*setting file-download*/

$(document).on("click", ".clearfile",
    function ()  
    {
        $(this).parents(".clearfile-parent").find('input.kraken_file_del').val('Y');
        $(this).parents(".clearfile-parent").find('.focus-anim').removeClass('focus-anim');
        $(this).parents(".clearfile-parent").find('.ex-file').html('');
        $(this).removeClass('on');
        $(this).parents(".clearfile-parent").find('input[type="file"]').val('');

    }
);

$(document).on('change', ".form-sets-js input[type='file']",
    function()
    {
        var inp = $(this);
        var btn = inp.parent();
        var lbl = btn.find("span.ex-file");
        var file_api = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;
    
        if (file_api && inp[0].files[0])
            file_name = inp[0].files[0].name;
        else{
            file_name = inp.val().replace("C:\\fakepath\\", '');
        }

        if (!file_name.length)
            return;

        if (lbl.is(":visible")) {
            lbl.text(file_name);

        }
        else{
            btn.text(file_name);
        }

        inp.parents(".clearfile-parent").find('input.kraken_file_del').val('');

        
        btn.addClass('focus-anim for-download');
        inp.parents(".clearfile-parent").find(".clearfile").addClass('on');
    }
);



$(document).on("click", "button.btn-submit.btn-submit-main-set", 
    function()
    {

        var form = $(this).parents("form.form-setting");
    
        /*var formData = new FormData(form.get(0));
        formData.append("send", "Y");*/
        
        var button = $("button[name='form-submit']", form);

        var load = $("div.load", form);
        var thank = $("div.thank", form);

      
        var error = 0;
        var count = 0;


        var formSendAll = new FormData();
        
        $("input.email", form).each(
            function()
            {
                
                if(count == 1)
                {
                    var destination = $(this).position().top; 
                    
                    if(destination <= 0)
                        destination = 0;                    
                    
                    jQuery("div.kraken-setting.list-set.on").animate(
                    {
                      scrollTop: destination
                    }, 700);
                }
 
            }
        );
        $("input[type='text'], input[type='password'], textarea", form).each(
            function(key, value)
            {
                if($(this).hasClass("require"))
                {
                    if($(this).val().length <= 0)
                    {
                        $(this).parent("div.input").addClass("has-error");
                        error = 1;
                    }
                }
            }
        );

        
        if(error == 0)
        {
            formSendAll.append("send", "Y");
            formSendAll.append("tmpl_path", $("input.tmpl_path").val());

            form_arr = $(form).find(':input,select,textarea').serializeArray();

            for (var i = 0; i < form_arr.length; i++)
            {
                
                formSendAll.append(form_arr[i].name, form_arr[i].value);
                
            };

      
            form.find('input[type=file]').each(function(key)
            {
                if($(this).parent().hasClass("for-download"))
                {
                    if($(this).parent().find(".kraken_file_del").val() != "Y")
                        formSendAll.append($(this).attr('name'), $(this)[0].files[0], $(this)[0].files[0].name);
                }

            });
            
            button.parents("div.part-cell").width(button.parents("div.part-cell").width());
            
            button.removeClass("active");
            load.addClass("active");
            
            
            $.ajax({
      
                url: "/bitrix/tools/kraken/ajax/settings/settings.php",
                type: "post",
                contentType: false, 
                processData: false, 
                data: formSendAll,
                dataType: 'json',
                success: function(json){

                    if(json.OK == "N")
                    {
                        button.addClass("active");
                        load.removeClass("active");

                    }
                    
                    if(json.OK == "Y")
                    {
                        location.href = location.href;
                    }
                    
                    
                }
            });
        }
    
    }
);


$(document).on("click", "button.btn-submit.btn-submit-page-list", 
    function()
    {

        var form = $(this).parents("form.form-page-list");
    
        /*var formData = new FormData(form.get(0));
        formData.append("send", "Y");*/
        
        var button = $("button[name='form-submit']", form);

        var load = $("div.load", form);
        var thank = $("div.thank", form);

      
        var error = 0;
        var count = 0;


        var formSendAll = new FormData();


        if(error == 0)
        {
            formSendAll.append("send", "Y");
            formSendAll.append("tmpl_path", $("input.tmpl_path").val());

            form_arr = $(form).find(':input,select,textarea').serializeArray();

            for (var i = 0; i < form_arr.length; i++)
            {
            
                formSendAll.append(form_arr[i].name, form_arr[i].value);
                
            };

            button.parents("div.part-cell").width(button.parents("div.part-cell").width());
            
            button.removeClass("active");
            load.addClass("active");
            
            
            $.ajax({
      
                url: "/bitrix/tools/kraken/ajax/settings/page_list.php",
                type: "post",
                contentType: false, 
                processData: false, 
                data: formSendAll,
                dataType: 'json',
                success: function(json){

                    if(json.OK == "N")
                    {
                        button.addClass("active");
                        load.removeClass("active");

                    }
                    
                    if(json.OK == "Y")
                        location.href = location.href;
                    
                    
                }
            });
        }
    
    }
);

$(document).on("click", "button.btn-submit.btn-submit-add-page", 
    function()
    {

        var form = $(this).parents("form.form-add-page");
    
        /*var formData = new FormData(form.get(0));
        formData.append("send", "Y");*/
        
        var button = $("button[name='form-submit']", form);

        var load = $("div.load", form);
        var thank = $("div.thank", form);

      
        var error = 0;
        var count = 0;

        

        var formSendAll = new FormData();
        
        $("input.email", form).each(
            function()
            {
                
                if(count == 1)
                {
                    var destination = $(this).position().top; 
                    
                    if(destination <= 0)
                        destination = 0;                    
                    
                    jQuery("div.hameleon-setting.list-set.on").animate(
                    {
                      scrollTop: destination
                    }, 700);
                }
 
            }
        );
        $("input[type='text'], input[type='password'], textarea", form).each(
            function(key, value)
            {

                if($(this).hasClass("require"))
                {
                    if($(this).val().length <= 0)
                    {
                        $(this).parent("div.input").addClass("has-error");
                        error = 1;
                    }
                }
            }
        );

        
        if(error == 0)
        {
            formSendAll.append("send", "Y");
            formSendAll.append("tmpl_path", $("input.tmpl_path").val());

            form_arr = $(form).find(':input,select,textarea').serializeArray();

            for (var i = 0; i < form_arr.length; i++)
            {
               
                formSendAll.append(form_arr[i].name, form_arr[i].value);
               
            };

            button.parents("div.part-cell").width(button.parents("div.part-cell").width());
            
            button.removeClass("active");
            load.addClass("active");
            
            
            $.ajax({
      
                url: "/bitrix/tools/kraken/ajax/settings/add_page.php",
                type: "post",
                contentType: false, 
                processData: false, 
                data: formSendAll,
                dataType: 'json',
                success: function(json){

                    if(json.OK == "N")
                    {
                        button.addClass("active");
                        load.removeClass("active");

                    }
                    
                    if(json.OK == "Y")
                        location.href = json.HREF;
                        
                        
                    
                }
            });
            
        }
        
    
    }
);


$(document).on("click", "button.btn-submit.btn-submit-form-seo", 
    function()
    {

        var form = $(this).parents("form.form-seo");
    
        /*var formData = new FormData(form.get(0));
        formData.append("send", "Y");*/
        
        var button = $("button[name='form-submit']", form);

        var load = $("div.load", form);
        var thank = $("div.thank", form);

      
        var error = 0;
        var count = 0;
        

        var formSendAll = new FormData();
        
        if(error == 0)
        {

            formSendAll.append("send", "Y");
            formSendAll.append("tmpl_path", $("input.tmpl_path").val());

            form_arr = $(form).find(':input,select,textarea').serializeArray();

            for (var i = 0; i < form_arr.length; i++)
            {
                formSendAll.append(form_arr[i].name, form_arr[i].value);
            };

            form.find('input[type=file]').each(function(key)
            {
                if($(this).parent().hasClass("for-download"))
                {
                    if($(this).parent().find(".kraken_file_del").val() != "Y")
                        formSendAll.append($(this).attr('name'), $(this)[0].files[0], $(this)[0].files[0].name);
                }

            });
            
            button.parents("div.part-cell").width(button.parents("div.part-cell").width());
            
            button.removeClass("active");
            load.addClass("active");
            
            
            $.ajax({
      
                url: "/bitrix/tools/kraken/ajax/settings/seo.php",
                type: "post",
                contentType: false, 
                processData: false, 
                data: formSendAll,
                dataType: 'json',
                success: function(json){

                    if(json.OK == "N")
                    {
                        button.addClass("active");
                        load.removeClass("active");

                    }
                    
                    if(json.OK == "Y")
                    {
                        location.href = location.href;
                        
                    }
                        
                        
                    
                }
            });
        }
        
    
    }
);

function showTooltip(elem, msg) 
{
    $(elem).parents(".parent_copy").find(".copy-success").addClass("active");
    setTimeout(
        function()
        {
            $(elem).parents(".parent_copy").find(".copy-success").removeClass("active");
        },3000
    );
}

function initPanelSettings(){
    
    
    var clipboardDemos = new ClipboardJS(".list-copy");
    
    clipboardDemos.on('success', function(e) {
        e.clearSelection();
        showTooltip(e.trigger);

   
    });
    clipboardDemos.on('error', function(e) {
    });


    if($("#panel_head_bg_color").length>0)
        $.farbtastic('#panel_head_bg_color').linkTo('#picker_head_bg_color');

    if($("#panel_menu_bg_color_panel").length>0)
        $.farbtastic('#panel_menu_bg_color_panel').linkTo('#picker_menu_bg_color');

    if($("#panel_main_color").length>0)
        $.farbtastic('#panel_main_color').linkTo('#picker_main_color');

    if($("#panel_footer_color_bg").length>0)
        $.farbtastic('#panel_footer_color_bg').linkTo('#picker_footer_color_bg');
}



$(document).on("click", "div.kraken-btn",
    function ()  
    { 

        if(typeof($('div.tool-settings')) != "undefined")
            $('div.tool-settings').addClass('on');

        if(typeof($('.change-colls')) != "undefined")
            $('.change-colls').addClass('on');

        $('div.kraken-main-setting').addClass('off');
        setTimeout(
            function()
            {
                $('.kraken-main-setting').addClass('hide');
            }, 500

        );

        $('div.kraken-sets-list-wrap').addClass('on');
        setTimeout(
            function()
            {
                $('div.kraken-sets-list-wrap.on').addClass('view');
            }, 50

        );

        BX.setCookie('_kraken_menu_open', 'Y', {expires: 60*60*60*60, path: "/"});


    }
);

$(document).on("click", "div.kraken-sets-list-close",
    function ()  
    { 
        if(typeof($('div.tool-settings')) != "undefined")
            $('div.tool-settings').removeClass('on');

        if(typeof($('.change-colls')) != "undefined")
            $('.change-colls').removeClass('on');

        $('div.kraken-sets-list-wrap').removeClass('view');
        setTimeout(
            function()
            {
                $('div.kraken-sets-list-wrap').removeClass('on');
            }, 200
        );

        $('div.kraken-main-setting').removeClass('hide');

        setTimeout(
            function()
            {
                $('div.kraken-main-setting').removeClass('off');
            }, 200
        );

        BX.setCookie('_kraken_menu_open', 'N', {expires: 60*60*60*60, path: "/"});

    }
);

$(document).ready(
    function()
    {
        var menu_open = BX.getCookie('_kraken_menu_open');

        if(menu_open == 'Y')
        {
            if(typeof($('div.tool-settings')) != "undefined")
                $('div.tool-settings').addClass('on');

            if(typeof($('.change-colls')) != "undefined")
                $('.change-colls').addClass('on');

            $('div.kraken-main-setting').addClass('off');
                setTimeout(
                    function()
                    {
                        $('.kraken-main-setting').addClass('hide');
                    }, 500

                );

                $('div.kraken-sets-list-wrap').addClass('on');
                setTimeout(
                    function()
                    {
                        $('div.kraken-sets-list-wrap.on').addClass('view');
                    }, 50

                );
        }
        else
        {
            if(typeof($('div.tool-settings')) != "undefined")
                $('div.tool-settings').removeClass('on');

            if(typeof($('.change-colls')) != "undefined")
                $('.change-colls').removeClass('on');

                $('div.kraken-sets-list-wrap').removeClass('view');
                setTimeout(
                    function()
                    {
                        $('div.kraken-sets-list-wrap').removeClass('on');
                    }, 200
                );

                $('div.kraken-main-setting').removeClass('hide');

                setTimeout(
                    function()
                    {
                        $('div.kraken-main-setting').removeClass('off');
                    }, 200
                );
        }
    }
);

function minHeightEditSets(thisblock, height, height1, height2)
{
    if(height2 === 'NULL')
        height2 = 0;

    var total = height - height1 - height2;


    thisblock.find('table.sides').css('min-height', total+'px');   

}

/*$(document).on("click", "a.kraken-sets-open",
    function ()  
    { 
        var attr = $(this).attr('data-open-set');


        $('body').addClass('modal-open');
        $('.wrapper').addClass('blur');
        $('div.kraken-sets-list-wrap').addClass('blur');
        $('div.sets-shadow').addClass('on');



        $('div.kraken-setting.'+attr).addClass('open');
        setTimeout(
            function()
            {
                $('div.kraken-setting.'+attr).addClass('on');
                minHeightEditSets($('div.kraken-setting.'+attr), $('div.kraken-setting.'+attr).height(), $('div.kraken-setting.'+attr).find('.kraken-set-head').outerHeight(), $('div.kraken-setting.'+attr).find('.kraken-set-top').outerHeight());

            }, 200
        );


    }
);
$(document).on("click", "a.new_page",
    function ()  
    {
        var attr = $(this).attr('data-open-set');

        $('div.kraken-setting.'+attr).addClass('open');
        setTimeout(
            function()
            {
                $('div.kraken-setting.'+attr).addClass('on');

            }, 200
        );
    }
);*/
/*$(document).on("click", ".kraken-set-close",
    function ()  
    { 
        var btn = $(this);

        if(!(btn.parents('div.kraken-setting')).hasClass('newpage'))
        {
            $('body').removeClass('modal-open');
            $('.wrapper').removeClass('blur');
            $('div.kraken-sets-list-wrap').removeClass('blur');
            $('div.sets-shadow').removeClass('on');
        }

        

        btn.parents('div.kraken-setting').removeClass('on');
        setTimeout(
            function()
            {
                btn.parents('div.kraken-setting').removeClass('open');
            }, 700
        );
    }
);*/


function minHeightEditSets(thisblock, height, height1, height2)
{
    if(height2 === 'NULL')
        height2 = 0;

    var total = height - height1 - height2;


    thisblock.find('table.sides').css('min-height', total+'px');   

}

function showContentSettings (panel)
{
    panel = panel || "";

    if(!panel)
        return;


    if(panel != "newpage")
    {
        startBlurWrapperContainer();
        $('div.kraken-sets-list-wrap').addClass('blur');
        $('div.sets-shadow').addClass('on');
    }
    

    $('div.kraken-setting.'+panel).addClass('open');
    setTimeout(
        function()
        {
            $('div.kraken-setting.'+panel).addClass('on');
            minHeightEditSets($('div.kraken-setting.'+panel), $('div.kraken-setting.'+panel).height(), $('div.kraken-setting.'+panel).find('.kraken-set-head').outerHeight(), $('div.kraken-setting.'+panel).find('.kraken-set-top').outerHeight());

        }, 200
    );
}

$(document).on("click", "a.kraken-sets-open",
    function ()  
    {

        var _this = $(this),
            panel = $(this).attr('data-open-set'),
            path = "/bitrix/tools/kraken/ajax/settings/show_settings.php",
            currentSectionId = "";

            if($("input[name='currentSectionId']").length>0)
                currentSectionId = $("input[name='currentSectionId']").val();



        if(!$(this).hasClass('init') && panel != "seo")
        {
            showProcessLoad();

            $.post(path, 
            {
                site_id: $("input.site_id").val(),
                panel: panel,
                currentSectionId: currentSectionId
            }, 
            function(html)
            {
                _this.addClass('init');
                $('div.kraken-setting.'+panel).html(html);
                showContentSettings(panel);
                closeProcessLoad();
                $('[data-toggle="tooltip"]').tooltip({
                    html:true
                });

                initPanelSettings();
            });
        }
        else
        {
            showContentSettings(panel);
        }
    }
);

$(document).on("click", ".kraken-set-close",
    function ()  
    { 
        var btn = $(this);

        if(!(btn.parents('div.kraken-setting')).hasClass('newpage'))
        {
            stopBlurWrapperContainer();
            $('div.kraken-sets-list-wrap').removeClass('blur');
            $('div.sets-shadow').removeClass('on');
        }


        btn.parents('div.kraken-setting').removeClass('on');
        setTimeout(
            function()
            {
                btn.parents('div.kraken-setting').removeClass('open');
            }, 700
        );
    }
);




$(document).on('click', 'ul.set-tabs li:not(.active)', 
    function() 
    {
        $(this).parents('ul.set-tabs').find('li').removeClass('active');
        $(this).addClass('active');
        $(this).parents('.sides').find('.set-content').removeClass('active');
        $(this).parents('.sides').find('.set-content[data-set="'+$(this).attr('data-set')+'"]').addClass('active');
    }
);

$(document).on("click", ".open_edit",
    function ()  
    {
        $(this).parents('div.button-wrap').addClass('off');
        $(this).parents('div.kraken-set-content').find('div.more_edit').addClass('on');
        $(this).parents('div.kraken-set-content').find('div.more_set').addClass('on');
    }
);

$(document).on("click", ".close_edit",
    function ()  
    {
        $(this).parents('div.more_edit').removeClass('on');
        $(this).parents('div.kraken-set-content').find('div.button-wrap').removeClass('off');
        $(this).parents('div.kraken-set-content').find('div.more_set').removeClass('on');
    }
);

$(document).on("click", "span.toggle-indicator",
    function ()  
    {

        if($(this).parents('div.ignite').hasClass('on'))
        {
            $(this).parents('form.form-page-list').find('input[name="page_active'+$(this).attr('data-page-id')+'"]').val('N');
            $(this).parents('div.ignite').removeClass('on');
        }
        
        else
        {
            $(this).parents('form.form-page-list').find('input[name="page_active'+$(this).attr('data-page-id')+'"]').val('Y');
            $(this).parents('div.ignite').addClass('on');
        }
    }
);



function showHideOptions(check, block, type)
{

    if(type =='checkbox')
    {
        if(check.prop("checked"))
            block.slideDown(200);
        
        else{
            block.slideUp(200);
        }
    }

    else if(type =='radio')
    {
        if(!block.hasClass('active'))
        {
            check.parents('.parent-more-option').next().find('.more-option').removeClass('active');
            block.addClass('active');
            check.parents('.parent-more-option').next().find('.more-option').slideUp(200);
        }
        
        block.slideDown(200);
        
    }

    else if(type =='open'){
        block.slideDown(200);
    }
    
    else if(type =='close'){
        block.slideUp(200);
    }
    
    
}

$(document).on("click", ".open_more_options",
    function ()  
    {

        showHideOptions($(this), $('.more-option[data-show-options="'+$(this).attr('data-show-options')+'"]'), $(this).attr('type'));
    }
);

$(document).on("click", "div.edit_land span.change",
    function ()  
    {
        $(this).parent().addClass('off');
        $(this).parents('.edit_land').find('input').removeAttr('disabled').focus();
    }
);

$(document).on("keydown", "div.edit_land input",
    function (e)  
    { 
        if(e.which == 191)
            return false;
    }
);


$(document).on("keyup", "div.edit_land input",
    function (e)  
    { 

        if($(this).val().length > 0)
            $(this).parents('div.edit_land').find('span.backslash').removeClass('off');
        else{
            $(this).parents('div.edit_land').find('span.backslash').addClass('off');
        }

        $(this).parents('div.edit_land').find('span.new_url').html($(this).val()); 
    }
);

$('div.edit_land input').focusout(function(){
    $(this).attr('disabled', 'disabled');
    $(this).parents('.edit_land').find('div.wrap-change').removeClass('off');
});




$(document).on('click', '.call_picker', 
    function() 
    {
        $(this).parents('div.input').find('div.picker-wrap').addClass('on');
    }
);
$(document).on('click', '.picker_panel', 
    function() 
    {
        $(this).parents('.parent-clearcolor').find('.clearcolor').addClass('on');
    }
);
$(document).on('click', '.picker-close', 
    function() 
    {
        $(this).parent('div.picker-wrap').removeClass('on');
    }
);
$(document).mouseup(
    function (e)
    { 
        var div = $("div.picker-wrap.on"); 

        if (!div.is(e.target) && div.has(e.target).length === 0) 
        {
            div.removeClass('on');
        }
    }
);
$(document).on("click", ".clearcolor",
    function ()  
    {
        $(this).parents('.parent-clearcolor').find('.picker_color').val(' ').removeAttr('style');
        $(this).removeClass('on');
    }
);



$(document).on("click", ".addrow",
    function ()  
    {
        var template_clone = $(this).parents('.parent-row').find(".empty-template").find('.row-for-copy').clone();
        var count = $(this).parents('.parent-row').find('.rows-copy').find('.row-for-copy').length;
        var count2 = count + 1;

        var name1 = $(this).parents('.parent-row').find(".empty-template").find('.for-copy-1').attr('name');
        
        count = String(count);
        count2 = String(count2);
        
        name1 = name1.replace('[n'+count, '[n'+count2);
        
        $(this).parents('.parent-row').find('.rows-copy').append(template_clone);
        $(this).parents('.parent-row').find(".empty-template").find('.for-copy-1').attr('name', name1);
        

        if($(this).hasClass('multy'))
        {
            var name2 = $(this).parents('.parent-row').find(".empty-template").find('.for-copy-2').attr('name');
            name2 = name2.replace('[n'+count, '[n'+count2);
            $(this).parents('.parent-row').find(".empty-template").find('.for-copy-2').attr('name', name2);
        }

        
    }
);
 
$(document).on("click", ".on-save",
    function ()  
    {
       $(this).parents('.kraken-setting').find('div.kraken-set-foot').removeClass('off');
    }
);

$(document).on("change", ".on-save",
    function ()  
    {
       $(this).parents('.kraken-setting').find('div.kraken-set-foot').removeClass('off');
    }
);

$(document).on("focus", ".on-save",
    function ()  
    {
       $(this).parents('.kraken-setting').find('div.kraken-set-foot').removeClass('off');
    }
);

$(document).on("click", "div.seo-more_info",
    function ()  
    {
        if($(this).hasClass('on'))
        {
            $(this).removeClass('on');
            $(this).parents('.kraken-set-top').find('.progress-info').slideUp(200);

        }
        else
        {
            $(this).addClass('on');
            $(this).parents('.kraken-set-top').find('.progress-info').slideDown(200);
        }
       

    }
);



$(document).on("click", "div.for-copy .change",
    function ()  
    {
        $(this).parents('.wrap-change').addClass('off');
        $(this).parents('.parent-seo-copy').find('.seo-clone').html($(this).parents('.for-copy').find('.disabled_texarea span').html()).val($(this).parents('.for-copy').find('.disabled_texarea span').html());
    }
);
$(document).on("click", "div.seo-cancel",
    function ()  
    {

        $(this).parents('.parent-seo-copy').find('.wrap-change').removeClass('off');

        if($(this).parents('.parent-seo-copy').find("textarea.seo-clone").attr("data-fill") == "Y")
            $(this).parents('.parent-seo-copy').find("textarea.seo-clone").val($(this).parents('.parent-seo-copy').find("div.disabled_texarea span").html());
        else{
            $(this).parent().find('.seo-clone').html('').val('');
        }
    }
);

$(document).on("click", ".addrow-seo",
    function ()  
    {

        var template_clone = $(this).parents('.parent-row').find(".empty-template").children().clone();
        var count = $(this).prev().children().length;
        var count2 = count + 1;
        var name1 = $(this).parents('.parent-row').find(".empty-template").find('.seo-name').attr('name');

        count = String(count);
        
        name1 = name1.replace('[n'+count, '[n'+count2);


        $(this).parents('.parent-row').find('.area-for-clone').append(template_clone);

        $(this).parents('.parent-row').find(".empty-template").find('.seo-name').attr('name', name1);


        
    }
);


$(document).on('click', '.change-colls', 
    function() 
    {
        var view = 0;
        var type = $(this).attr('data-type');

        if(!($(this).parents('.big-parent-colls').find('.change-colls-info').hasClass('active')))
            $(this).parents('.big-parent-colls').find('.change-colls-info').addClass('active');
        
        if($(this).parents('.parent-change-cools').hasClass('middle') && $(this).parents('div.block').hasClass('small'))
        {
            $(this).parents('.parent-change-cools').removeClass('col-lg-8 col-md-8 middle').addClass('col-lg-4 col-md-4 small');
            view = $(this).parents('.parent-change-cools').find('input.colls_small').val();
        }

        else if($(this).parents('.parent-change-cools').hasClass('middle') && !($(this).parents('div.block').hasClass('small')))
        {
            $(this).parents('.parent-change-cools').removeClass('col-lg-6 col-md-6 middle').addClass('col-lg-3 col-md-3 small');
            view = $(this).parents('.parent-change-cools').find('input.colls_small').val();
        }

        else if($(this).parents('.parent-change-cools').hasClass('small') && $(this).parents('div.block').hasClass('small'))
        {
            $(this).parents('.parent-change-cools').removeClass('col-lg-4 col-md-4 small').addClass('col-lg-8 col-md-8 middle');
            view = $(this).parents('.parent-change-cools').find('input.colls_middle').val();
        }

        else if($(this).parents('.parent-change-cools').hasClass('small') && !($(this).parents('div.block').hasClass('small')))
        {
            $(this).parents('.parent-change-cools').removeClass('col-lg-3 col-md-3 small').addClass('col-lg-6 col-md-6 middle');
            view = $(this).parents('.parent-change-cools').find('input.colls_middle').val();
        }


        $.post("/bitrix/tools/kraken/ajax/settings/new_colls.php", 
        { 
            element_id: $(this).attr('data-element-id'),
            view: view,
            type: type,
            code: $(this).parents('.parent-change-cools').find('input.colls_code').val(),
            site_id: site_id,
            send: "Y"
        });
        
    }
);


$(document).on('click', '.open-main-menu', 
    function() 
    {
        $('div.kraken-sets-list-wrap').removeClass('view');
    }
);
$(document).on('click', '.close-menu', 
    function() 
    {

        $('div.kraken-sets-list-wrap').addClass('view');
    }
);