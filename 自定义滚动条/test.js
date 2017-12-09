//滚动条思路：1,鼠标移动距离 == 滑块移动距离
//          2,滑块可以移动的距离 == 滚动条高度 - 滑块高度


//这样写自调用匿名函数的目的是防止变量方法名和已有的冲突
//由于在闭包内，所以都是局部变量
;(function(win,doc,$){
    //构造函数，自定义滚动条
    function CusScrollBar(options){
        //调用初始化方法
        this._init(options);
        this._initDomEvent();


    }
    //在构造函数原型上添加方法，所有实例都共享方法
    // CusScrollBar.prototype = {
    //     //初始化方法
    //     _init:function(){
    //         console.log('t')
    //     }
    // }

    //将_init方法添加到原型上,extend第一个参数为true时会进行递归合并
    //原型就是一个对象，所以可以用extend
    $.extend(CusScrollBar.prototype,{
        _init:function(options){
            var self = this;
            //默认配置
            self.options = {
                scrollDir:"y", //滚动方向
                contSelector:'',//滚动内容区选择器名称
                barSelector:'',//滚动滑块选择器名称
                sliderSelector:''//滚动条选择器名称
            };
            //将用户传入的配置覆盖掉默认的
            $.extend(true,self.options,options||{});
            return self;
        },
        //初始化滑动块高度、
        _initSliderHeight:function(){
            var self = this;
            //获取内容区域的总高度,$cont[0]是dom对象，所以能有scrollHeight属性注意了
            var contentScrollHeight = self.$cont[0].scrollHeight;
            //获取内容区域可见高度
            var contentClientHeight = self.$cont.height();
            //如果内容区域只有一屏大小，隐藏滚动条
            if(contentScrollHeight <= contentClientHeight){
                self.$bar.hide();
            }
            //计算滑块高度:滑动条整个高度 * 内容可见区域高度/内容总高度
            var sliderHeight = self.$bar.height() * (self.$cont.height() / self.$cont[0].scrollHeight);
            self.$slider.css('height',sliderHeight+'px');
        },
        //初始化标签
        _initTabEvent:function(){
            var self  = this;
            self.$tabItem.on('click',function(e){
                e.preventDefault();
                var index = $(this).index();
                self.changeTabSelect(index);
                //定位到指定文章
                var pos= self.getAnchorPositon(index);
                if(pos !== -1) {
                    self.scrollTo(self.$cont[0].scrollTop + pos);
                }
            })
        },
        changeTabSelect:function(index){
            var self = this;
            var active = self.options.tabActiveClass;
            self.$tabItem.eq(index).addClass(active).siblings().removeClass(active)
        },
        //初始化dom引用
        _initDomEvent:function(){
            var opt = this.options;
            //滚动内容区对象
            this.$cont = $(opt.contSelector);
            this.$slider = $(opt.sliderSelector);
            this.$bar = $(opt.barSelector);
            this.$tabItem = $(opt.tabItemSelector);
            this.$anchor = $(opt.anchorSelector);
            //文档对象
            this.$doc = $(doc);
            //初始化滑块拖动功能
            this._initSliderHeight();
            this._initSliderDragEvent();
            this._bindContScroll();
            this._bindMouseWheel()
            this._initTabEvent()
        },
        //初始化滑块拖动功能
        _initSliderDragEvent:function(){
            var self = this;
            var slider = self.$slider;
            var sliderElement = slider[0];
            if(sliderElement){
                var doc = self.$doc,
                    dragStartPagePosition,
                    dragStartScrollPosition,
                    dragContBarRate;
                function mousemoveHandler(e){
                    e.preventDefault();
                    if(!dragStartPagePosition) return;
                    //移动内容区域
                    self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition)*dragContBarRate);
                    //移动滑块区域

                }
                //给滑块绑定鼠标按下事件
                slider.on('mousedown',function(e){
                    e.preventDefault();
                    //获取鼠标点击滑块点距离文档顶部距离,page就是页面，不是可视区域哈
                    dragStartPagePosition = e.pageY;
                    //获取内容区域已经滚上去的高度,注意这里是$cont[0]而不是$cont
                    dragStartScrollPosition = self.$cont[0].scrollTop;
                    //获取移动比率,也就是内容可移动距离/滑块可移动距离
                    dragContBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
                    //绑定mousemove事件，注意是在doc上绑定，因为鼠标移出滑块也可以滑动
                    //后面的是命名空间
                    doc.on('mousemove.namespace',mousemoveHandler).on('mouseup.namespace',function(e){

                        //移除2个事件，很关键
                        //注意直接移除doc的事件会有风险，所以引入命名空间移除其上的事件
                        //doc.off('mousemove mouseup');
                        doc.off('.namespace');
                    })
                })

            }
        },
        //获取锚点高度
        getAnchorPositon:function(index){
            //position()获取元素相对于最近被定位过的父元素坐标(left,top)
            if(this.$anchor.eq(index).length)
                 return  this.$anchor.eq(index).position().top;
            return -1;
        },
        //获取内容可滚动高度:内容总高度(scrollHeight) - 内容可视区高度,如果总高度小于可视区，可滚动高度为0
        getMaxScrollPosition:function(){
            var self = this;

            return Math.max(self.$cont[0].scrollHeight , self.$cont.height()) - self.$cont.height();
        },
        //获取滑块可移动距离
        getMaxSliderPosition:function(){
            var self = this;

            return self.$bar.height() - self.$slider.height();
        },
        //移动内容区域的函数
        scrollTo:function(val){
            var self = this;
            //jquery方法，垂直移动元素
            self.$cont.scrollTop(val);
        },
        //监听内容滚动，同步滑块位置
        _bindContScroll:function(){
            var self = this;
            self.$cont.on('scroll',function(){
                var slider = self.$slider;
                if(slider){
                    //设置滑块的top
                    slider.css('top',self.getSliderPosition()+'px');
                }
            })
        },
        //获取滑块位置
        getSliderPosition:function(){
            var self = this;
            var maxSliderPos = self.getMaxSliderPosition();
            return Math.min(maxSliderPos, maxSliderPos * self.$cont[0].scrollTop / self.getMaxScrollPosition());
        },
        //绑定鼠标滚轮事件
        _bindMouseWheel:function(){
            var self = this;
            //DOMMouseScroll是针对火狐浏览器兼容,mousewheel是小写
            self.$cont.on('mousewheel DOMMouseScroll',function(e){
                e.preventDefault();
                //获取jquery封装的原生事件
                var originEvent = e.originalEvent;
                //如果存在wheelDelta属性
                var wheelRange = originEvent.wheelDelta ? -originEvent.wheelDelta / 120 : (originEvent || 0)/3;
                self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep);
            })
        }
    });

    new CusScrollBar({
        scrollDir:"y", //滚动方向
        contSelector:'.scroll-content',//滚动内容区选择器名称
        barSelector:'.scroll-bar',//滚动条选择器名称
        sliderSelector:'.scroll-slide',//滚动滑块选择器名称
        wheelStep:10,//滚轮步长
        tabItemSelector:'.tab-item',
        tabActiveClass:'tab-active',
        anchorSelector:'.anchor'

    })
})
(window,document,jQuery);

//注意在外面访问不到里面的构造函数


