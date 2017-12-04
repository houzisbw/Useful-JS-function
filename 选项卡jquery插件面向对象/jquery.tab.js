/**
 * Created by Administrator on 2017/12/4.
 */
;(function($){
    //TAB构造函数,参数是tab所在的div
    var Tab = function(tab){
        var _this = this;
        //保存tab组件
        this.tab = tab;
        //默认配置参数
        this.config = {
            //鼠标触发类型,mouseover || click
            'triggerType':'mouseover',
            //默认切换效果
            'effect':'default',
            //默认第一个tab显示
            'invoke':1,
            //5000ms切换下一个tab
            'auto':'5000'
        };
        //如果配置参数存在，扩展掉默认的参数
        if(this.getConfig()){
            $.extend(this.config,this.getConfig());
        }
        //获取到tab里面的li以及对应的div,选取class为tab-nav的ul元素下面的li
        this.tabItems = this.tab.find('ul.tab-nav li');
        this.contentItems = this.tab.find('.content-item');

        var config = this.config;
        //传递参数错误也是触发mouseover
        if(config.triggerType === 'mouseover' || config.triggerType!=='click'){
            this.tabItems.bind('mouseover',function(){
                //执行切换操作,参数是点击的li
                _this.invoke($(this));
            });
        }else if(config.triggerType === 'click'){
            //这样绑定而不是直接写.click
            this.tabItems.bind(config.triggerType,function(){
                _this.invoke($(this));
            });
        }
        //当配置了时间，就自动切换
        if(config.auto){
            //定时器
            this.timer = null;
            //计数器
            this.loop = 0;
            //执行自动播放
            this.autoPlay();
            //鼠标移动到tab上时清除自动播放，移出时恢复
            this.tab.hover(function(){
                clearInterval(_this.timer);
            },function(){
                _this.autoPlay();
            })
        }
        //默认显示第几个tab
        var initTabIndex = _this.config.invoke;
        this.tabItems.eq(initTabIndex).addClass('active');
        this.contentItems.eq(initTabIndex).addClass('current');
    };

    //在tab原型上添加方法
    Tab.prototype = {
        //获取配置参数
        getConfig:function(){
            //获取元素节点上的参数,注意this.tab是jquery对象
            var config = this.tab.attr('data-config');
            if(config && config!==''){
                //将json字符串转化为js对象
                return $.parseJSON(config);
            }else{
                return null;
            }
        },
        //切换时的调用函数
        invoke:function(currentTab){
            var _this = this;
            //切换tab内容，根据effect参数来决定动画效果
            currentTab.addClass('active').siblings().removeClass('active');
            //对应div的切换
            var index = $(currentTab).index();
            //获取切换效果
            var effect = this.config.effect;
            if(effect === 'default' || effect !=='fade'){
                this.contentItems.eq(index).addClass('current').siblings().removeClass('current');
            }else if(effect === 'fade'){
                this.contentItems.eq(index).fadeIn().siblings().fadeOut();
            }
            //人为触发click时要设置计数器，防止自动播放错乱
            if(this.config.auto) {
                this.loop = index;
            }
        },
        autoPlay:function(){
            var tabItems = this.tabItems;
            //获取对象长度,tab个数
            var tabLength = tabItems.size();
            var _this = this;

            this.timer = setInterval(function(){
                _this.loop++;
                if(_this.loop >= tabLength){
                    _this.loop = 0;
                }
                tabItems.eq(_this.loop).trigger(_this.config.triggerType)

            },parseInt(_this.config.auto,10))

        }
    };
    //注册为jquery方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            });
            //链式调用
            return $(this);
        }
    });
    //注册,在js里可以直接使用new Tab
    window.Tab = Tab;
})(jQuery);