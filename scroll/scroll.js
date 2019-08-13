/* 滚动效果封装方法 */
(function ($) {
    //无缝滚动
    $.fn.myScroll = function (options) {
        //默认配置
        var defaults = {
            speed: 40, //滚动速度,值越大速度越慢
            rowHeight: 24 //每行的高度
        };

        var opts = $.extend({}, defaults, options),
            intId = [];

        function marquee(obj, step) {

            obj.find("ul").animate({
                marginTop: '-=1'
            }, 0, function () {
                var s = Math.abs(parseInt($(this).css("margin-top")));
                if (s >= step) {
                    $(this).find("li").slice(0, 1).appendTo($(this));
                    $(this).css("margin-top", 0);
                }
            });
        }

        this.each(function (i) {
            var sh = opts["rowHeight"],
                speed = opts["speed"],
                _this = $(this);
            intId[i] = setInterval(function () {
                if (_this.find("ul").height() <= _this.height()) {
                    clearInterval(intId[i]);
                } else {
                    marquee(_this, sh);
                }
            }, speed);

            _this.hover(function () {
                clearInterval(intId[i]);
            }, function () {
                intId[i] = setInterval(function () {
                    if (_this.find("ul").height() <= _this.height()) {
                        clearInterval(intId[i]);
                    } else {
                        marquee(_this, sh);
                    }
                }, speed);
            });

        });

    }

    //分屏滚动
    $.fn.extend({
        Scroll: function (opt, callback) {
            //参数初始化
            if (!opt) var opt = {};
            var _btnUp = $("#" + opt.up); //Shawphy:向上按钮
            var _btnDown = $("#" + opt.down); //Shawphy:向下按钮
            var timerID;
            var _this = this.eq(0).find("ul:first");
            var lineH = _this.find("li:first").height(), //获取行高
                line = opt.line ? parseInt(opt.line, 10) : parseInt(this.height() / lineH, 10), //每次滚动的行数，默认为一屏，即父容器高度
                speed = opt.speed ? parseInt(opt.speed, 10) : 500; //卷动速度，数值越大，速度越慢（毫秒）
            timer = opt.timer //?parseInt(opt.timer,10):3000; //滚动的时间间隔（毫秒)
            if (line == 0) line = 1;
            var upHeight = 0 - line * lineH;
            //滚动函数
            var scrollUp = function () {
                _btnUp.unbind("click", scrollUp); //Shawphy:取消向上按钮的函数绑定
                _this.animate({
                    marginTop: upHeight
                }, speed, function () {
                    for (i = 1; i <= line; i++) {
                        _this.find("li:first").appendTo(_this);
                    }
                    _this.css({
                        marginTop: 0
                    });
                    _btnUp.bind("click", scrollUp); //Shawphy:绑定向上按钮的点击事件
                });

            }
            //Shawphy:向下翻页函数
            var scrollDown = function () {
                _btnDown.unbind("click", scrollDown);
                for (i = 1; i <= line; i++) {
                    _this.find("li:last").show().prependTo(_this);
                }
                _this.css({
                    marginTop: upHeight
                });
                _this.animate({
                    marginTop: 0
                }, speed, function () {
                    _btnDown.bind("click", scrollDown);
                });
            }
            //Shawphy:自动播放
            var autoPlay = function () {
                if (timer) timerID = window.setInterval(scrollUp, timer);
            };
            var autoStop = function () {
                if (timer) window.clearInterval(timerID);
            };
            //鼠标事件绑定
            _this.hover(autoStop, autoPlay).mouseout();
            _btnUp.css("cursor", "pointer").click(scrollUp).hover(autoStop, autoPlay); //Shawphy:向上向下鼠标事件绑定
            _btnDown.css("cursor", "pointer").click(scrollDown).hover(autoStop, autoPlay);
        }
    })
})(jQuery);
