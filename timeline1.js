(function(root, factory) {
    /* CommonJS */
    if (typeof exports == "object") module.exports = factory();
    /* AMD module */
    else if (typeof define == "function" && define.amd) define(factory);

    /* 修改: 将 wwclassName 改为元素标识 */
    else root.timeline1 = factory();
}(this, function() {
    "use strict";

    /* 修改: 将 wwclassName 改为元素标识 */
    var wwclassName = /*INSBEGIN:WWCLSNAME*/
        "timeline1"
    /*INSEND:WWCLSNAME*/
    ;

    // BEGIN: 加载依赖部分
    // 无依赖资源请使用本函数
    function loadDependence(fncallback) {
        if (typeof fncallback === "function") {
            fncallback();
        }
    }

    // 有依赖资源使用本函数
    // 使用方式:
    //  - 将"插件名"设置为具体插件标识, 通常就是插件名称, 不可为中文. 如: swiper
    //  - 如libs中无该插件, 则申请添加该插件
    //  - 将"插件路径"设置为具体插件路径, 通常为js文件, 省略路径中, 开头的"/"和结尾的".js". 如: "/libs/qrcodejs/qrcode.js" 应写为 "libs/qrcodejs/qrcode"
    //  - require 函数第一个参数, 传入依赖资源数组. 通常为config中配置的`插件名`. 可能还包括css文件
    //   - css文件的格式, 以"css!"开头, 省略路径开头的"/"和路径结尾的".css". 如: "/libs/noty/lib/noty.css" 应写为 ""css!libs/noty/lib/noty""
    //  - require 函数第二个参数是个回调函数, 该函数可能会传入参数. 参数与前面数组位置对应. 如不清楚, 自行查阅 (requirejs)[http://requirejs.org/] 文档

    var loadDependence = function(fncallback) {
        // 本模板只支持一个依赖库，如果需要多个依赖库，需要改进。
        if (!window.wwload.timeline) {
            window.wwload.timeline = "wait";
            requirejs.config({
                paths: {
                    "timeline": "libs/TimelineJS3/compiled/js/timeline-min" // 示例: libs/qrcodejs/qrcode
                }
            });
            require(["timeline", "css!libs/TimelineJS3/compiled/css/timeline"], function() {
                window.wwload.timeline = true;
                replace();
                fncallback();
            });
        } else if (window.wwload.timeline === "wait") {
            setTimeout(function() {
                loadDependence(fncallback);
            }, 100);
        } else {
            replace();
            fncallback();
        }

        function replace() {
            loadDependence = function(fncallback) {
                fncallback();
            };
        }
    };
    //
    // END: 加载依赖部分

    /*
    //*/


    // BEGIN: 元素处理类初始化。下方函数只在依赖被加载完毕后，执行一次。后续无论处理多少个元素，不再调用本函数。
    var init = function() {
        // 重写初始化函数
        init = function() {
            return true;
        };
        $.wwclass.addEvtinHandler(wwclassName, evtInHandler);

        /*如果是逻辑元素，需要监听所有新加元素的时间，请打开下方注释。与process的区别是： process传入的参数一定有wwclass，而checker是更低级的事件处理，如果依赖wwclass，则事件在这里被处理，在process也会被处理。相当于被调用了两次，因此，checker处理的内容，不要包括wwclass，实际上，你可以利用checker构建一个wwclass体系。
         简单来说： 不用wwclass又希望有代码附加在某类(使用特定样式类，特定属性，特定标签等等)元素上，就使用本机制。
        //$newRootElement是新加入的元素。includeSelf指示是否包含$container自身
        function checker($newRootElement, includeSelf){
          //每次有新元素加入时，无论其类型，都会调用本方法。页面的根container($(".container[-fluid]"))
         //下文的例子，用来示例如何探测所有新加入的input并加以处理，类似的可以处理图片等等。
         var $inputElement = includeSelf ? $newRootElement.find("input[data-xxx]").addBack("input") : $newRootElement.find("[input]");
         if($inputElement.length > 0){ //新加入的元素有input。
         }
        }
        $.wwclass.getwwchecker().push(checker);
        //*/

        // 如有初始化动作, 请在下方添加
    };
    // END: 元素首次初始化处理


    /*
     * @description 元素平滑:
     * 1. 页面显示元素时,如果元素出现明显的闪现现象,需要做如下处理:
     *  1. 编辑器: 添加设置项:`禁用平滑加载`.对应属性`data-disabled-smooth`.该属性只允许设置值为true,否则元素删除该属性
     *  2. 编译期: 添加处理:当属性`data-disabled-smooth`值为`非true`时,元素添加平滑处理.平滑处理目的是使得页面元素的加载更加自然.例如swiper1:将图片添加类hide隐藏,只显示第一张图片,去除元素加载闪现现象
     *  3. 运行期: 添加处理:元素初始化完毕之后,即属性`data-x-inited`属性值为true时,平滑处理的相关元素恢复.例如swiper1:将图片hide类删除,恢复图片正常显示
     *  4. 示例元素可查看轮播图(swiper1)元素
     *  5. 类似imagefill等,平滑处理后,只遗留一个空壳,此时添加处理类`转圈`.加载完毕之后,去掉该类.
    //*/
    /*
     * @description 元素加载状态:
     * 页面显示元素时,如果元素出现明显的有无到有现象,需要做如下处理:
     *  1. 编辑器: 添加设置项:`禁用自动添加加载状态`.对应属性`data-noblock`.该属性只允许设置值为true,否则元素删除该属性
     *  2. 编译期: 添加处理:当属性`data-noblock`值为`非true`时,元素添加加载状态.即设置`data-block="true"`
     *  3. 运行期: 添加处理:元素初始化完毕之后,即属性`data-x-inited`属性值为true时,元素放开加载状态.即设置`data-block="false"`
     *  4. 需要处理的元素，类似view、imagefill、qrcode等元素效果
    //*/
    /* @description 错误信息输出格式:
     *   $.wwclass.syslog(message,category,severity,from,opt);
     * 参数解释：
     *   message; // 必填: 日志信息
     *   from // 选填: 日志来源. 默认值为: 当前页地址
     *   category // 选填: category,日志类型(日志分类标识). 默认值为: fe,即 front end
     *   severity //  选填: severity,日志级别. 默认值为: debug.可选值为:emergency,alert,critical,error,warning,notice,info,debug
     *   opt //选填：参数为json格式的字符串
    //*/
    /*
     * @description 初始化每个元素
     * @param {jQuery object} $ele - 需要初始化的元素
     */
    function timeline($ele) {
        // var timelinedata = $ele.attr("data--timelinedata")
        var timelinedata = $.wwclass.helper.getJSONprop($ele, "data-timelinedata") ;
        var timelinetitle = $.wwclass.helper.getJSONprop($ele, "data-timelinetitle") ;
     
        var timeline_json = {
            "title": {
                // "start_date":{
                //   "year":"",
                //    "month": "",
                //    "day": ""
                // },
                // "end_date":{
                //  "year":"",
                //    "month": "",
                //    "day": ""
                // },
                "text": {
                    "headline": "",
                    "text": ""
                },
                "media": {
                    "url": "",
                    "caption": "",
                    "thumbnail": "",
                    "credit": ""
                },
                "background": {
                    "url": "",
                    "color": ""
                }
            },
            "events": []
        };
        if (timelinetitle) {
            if (timelinetitle.length > 0) {
                // var timestart=timelinetitle[0].start_date.split("-");
                // var timeend=timelinetitle[0].end_date.split("-");
                // timeline_json.title.start_date.year= timestart[0];
                // timeline_json.title.start_date.month= timestart[1];
                // timeline_json.title.start_date.day= timestart[2];

                // timeline_json.title.end_date.year= timeend[0];
                // timeline_json.title.end_date.month= timeend[0];
                // timeline_json.title.end_date.day= timeend[0];
                if (timelinetitle[0].text.headline) {
                    timeline_json.title.text.headline = timelinetitle[0].text.headline;
                }
                if (timelinetitle[0].text.text) {
                    timeline_json.title.text.text = timelinetitle[0].text.text.split("\n").join("<br/>");
                }
                if (timelinetitle[0].media.url) {
                    timeline_json.title.media.url = timelinetitle[0].media.url;
                }
                if (timelinetitle[0].media.caption) {
                    timeline_json.title.media.caption = timelinetitle[0].media.caption;
                }
                if (timelinetitle[0].media.thumbnail) {
                    timeline_json.title.media.thumbnail = timelinetitle[0].media.thumbnail;
                }
                if (timelinetitle[0].media.credit) {
                    timeline_json.title.media.credit = timelinetitle[0].media.credit.split("\n").join("<br/>");
                }
                if (timelinetitle[0].background.url) {
                    timeline_json.title.background.url = timelinetitle[0].background.url;
                }
                if (timelinetitle[0].background.color) {
                    timeline_json.title.background.color = timelinetitle[0].background.color;
                }
            }
        }
  
        if (timelinedata == undefined  || timelinedata.length == 0 ){
            console.log('请绑定时间轴的事件');
        }else {
        // if (timelinedata || timelinedata!=undefined) {
            for (var i = 0; i < timelinedata.length; i++) {
                var data_json = {
                    "events": [{
                        "start_date": {
                            "year": "",
                            "month": "",
                            "day": "",
                        },
                        "end_date": {
                            "year": "",
                            "month": "",
                            "day": "",
                        },
                        "text": {
                            "headline": "",
                            "text": ""
                        },
                        "media": {
                            "url": "",
                            "caption": "",
                            "thumbnail": "",
                            "credit": ""

                        },
                        "background": {
                            "url": "",
                            "color": ""
                        }
                    }]

                }
                if (timelinedata[i].start_date) {
                  var startime=timelinedata[i].start_date;
                    var num = timelinedata[i].start_date.indexOf("T");
                    if (num > 0) {
                         startime = timelinedata[i].start_date.substring(0, num);
                    }
                    var eventstart = startime.split("-");
                    data_json.events[0].start_date.year = eventstart[0];
                    data_json.events[0].start_date.month = eventstart[1];
                    data_json.events[0].start_date.day = eventstart[2];

                }

                if (timelinedata[i].end_date) {
                  var endtime = timelinedata[i].end_date;
                    var num = timelinedata[i].end_date.indexOf("T");
                    if (num > 0) {
                         endtime = timelinedata[i].end_date.substring(0, num);
                    } 
                    var eventend = endtime.split("-");
                    data_json.events[0].end_date.year = eventend[0];
                    data_json.events[0].end_date.month = eventend[1];
                    data_json.events[0].end_date.day = eventend[2];
                    }
               
                
                if (timelinedata[i].text.headline) {
                    data_json.events[0].text.headline = timelinedata[i].text.headline;
                }
                if (timelinedata[i].text.text) {
                    data_json.events[0].text.text = timelinedata[i].text.text.split("\n").join("<br/>");
                }
                if (timelinedata[i].media.url) {
                    data_json.events[0].media.url = timelinedata[i].media.url;
                }
                if (timelinedata[i].media.caption) {
                    data_json.events[0].media.caption = timelinedata[i].media.caption;
                }
                if (timelinedata[i].media.thumbnail) {
                    data_json.events[0].media.thumbnail = timelinedata[i].media.thumbnail;
                }
                if (timelinedata[i].media.credit) {
                    data_json.events[0].media.credit = timelinedata[i].media.credit.split("\n").join("<br/>");
                }
                if (timelinedata[i].background.url) {
                    data_json.events[0].background.url = timelinedata[i].background.url;
                }
                if (timelinedata[i].background.color) {
                    data_json.events[0].background.color = timelinedata[i].background.color;
                }
                timeline_json.events.push(data_json.events[0]);
            }

            var timeline_str = JSON.stringify(timeline_json);
            var options = {
                "zoom_sequence": [],
                "is_embed": true
            };
            if ($ele.attr("data-width")) {
                $("#timeline-embed").width($ele.attr("data-width"));
            }
            if ($ele.attr("data-height")) {
                $("#timeline-embed").height($ele.attr("data-height"));
            }
            if ($ele.attr("data-dragging") == "false") {
                options.dragging = false;
            }
            options.default_bg_color = $ele.attr("data-bg_color") || "white";
            options.scale_factor = parseFloat($ele.attr("data-scale_factor")) || 1;
            options.timenav_position = $ele.attr("data-timenav_position") || "bottom";
            options.optimal_tick_width = parseInt($ele.attr("data-optimal_tick_width")) || 100;
            options.timenav_height = parseInt($ele.attr("data-timenav_height")) || 150;
            options.marker_padding = parseInt($ele.attr("data-marker_padding")) || 5;

            options.start_at_slide = parseInt($ele.attr("data-start_at_slide")) || 0;
            options.slide_padding_lr = parseInt($ele.attr("data-slide_padding_lr")) || 100;
            options.language = $ele.attr("data-language");
            options.script_path = "https://cdn.knightlab.com/libs/timeline3/latest/js";
            options.duration = parseInt($ele.attr("data-duration")) || 1000;
            var str = JSON.parse(timeline_str);
            var timeline = new TL.Timeline("timeline-embed", str, options);
        }
    }

    function processElement($ele) {
        
        setTimeout(function() {
          timeline($ele);
            $.wwclass.helper.updateProp($ele, "data-x-inited", true);
            // $("#timeline-embed").removeClass("hidden");
            // $ele.css({"overflow":"","height":""});
        }, 800);
        /* 如果本元素废弃, 请解开此处注释, 并完成代码
        console.error("扩展元素(" + $ele.attr("data--wwclass") + ")已废弃, 找对应产品更换为xxx实现本功能", $ele);
        //*/
        // 对 $ele 元素做对应处理
        /* @TODO:重要提示:在元素初始化完毕时，需要更新属性`data-x-inited`的值为true，初始值(默认)为false，并同时发出事件wwinited
        $.wwclass.helper.updateProp($ele, "data-x-inited", true);
        $.wwclass.helper.anijsTrigger($ele, "wwinited");
        //*/
        /* @TODO:所有正式发布的元素，请认真排查代码:不要带测试输出，只有出现异常，才允许输出错误.需要输出时，请解开此处注释，并完成代码。函数说明请查看上方
        $.wwclass.syslog(message,category,severity,from,opt);
        //*/
    }

    /*
     * @description 析构每个元素, 也就是该元素该删除时的处理代码
     * @param {jQuery object} $ele - 需要处理的元素
     */
    function finalizeElement($ele) {
        // 对 $ele 元素做对应处理
        /*
        @TODO: 销毁元素，destroy
        @TODO: 存入$ele.data()中的值清空。
        $ele.data("存入的键","");
        //*/
    }

    // BEGIN: 监听属性处理
    /*
     * @description 监听函数, 元素的控制属性(data--)改变时处理
     * @param {jQuery object} $ele - 控制属性改变的元素
     * @param {string} attribute - 控制属性的名称
     * @param {string} value - 控制属性改变为何值
     */
    var evtInHandler = function($ele, attribute, value) {
        switch (attribute) {
            // case "data--timelinedata":
            //   // 处理动作

            //   break;
            case "finalize":
                finalizeElement($ele);
                break;
            default:
                console.info("监听到 \"" + $ele.attr("data-wwclass") + "\" 元素的 \"" + attribute + "\" 属性值改变为 \"" + value + "\", 但是无对应处理动作.");
        }
    };
    // END: 监听属性处理

    // 以下部分不需要修改
    if (!$.wwclass) {
        console.error("Can not use without wwclass.js");
        return false;
    }

    var ret = /*INSBEGIN:WWCLSHANDLER*/
        function(set) {
            if (set.length > 0) {
                loadDependence(function() {
                    init();
                    $(set).each(function(index, targetDom) {
                        processElement($(targetDom));
                    });
                });
            }
        }
    /*INSEND:WWCLSHANDLER*/
    ;

    return ret;

}));