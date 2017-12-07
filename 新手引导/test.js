//新手引导效果
var index = 0;
var guideTitle = ['1','2','3','4','5','6'],
    guideContent = [
        '这里是左边栏的第一块部分',
        '这里是左边栏的第二块部分',
        '这里是中栏的第一块部分',
        '这里是中栏的第二块部分',
        '这里是右侧栏的第一块部分',
        '这里是右侧栏的第二块部分'
    ],
    guideElementClass = [
        '.area-1',
        '.area-2',
        '.area-3',
        '.area-4',
        '.area-5',
        '.area-6'
    ];

//如果首次登陆
if(!checkCookie('intro')){
    //设置cookie,30秒失效
    setCookie("intro",'sbw',30);
    //开启遮罩
    $('#mask').show();
    //开启指引对话框
    $('.searchTip').show();
    //设置对话框初始位置,首先获取第一个要指引的元素的位置，然后设置对话框位置位元素位置偏移
    var offset = $(guideElementClass[index]).offset();
    $('.searchTip').offset({left:offset.left+20+$(guideElementClass[index]).width(),top:offset.top});
    //显示包裹层
    $('.high-light-wrapper').show();
    //设置包裹层的大小
    $('.high-light-wrapper').width($(guideElementClass[index]).width());
    $('.high-light-wrapper').height($(guideElementClass[index]).height());
    //设置包裹层位置
    $('.high-light-wrapper').offset({left:$(guideElementClass[index]).offset().left-5,top:$(guideElementClass[index]).offset().top-5});
    $(guideElementClass[index]).addClass('highLight');
    //绑定click事件
    $('.searchTip .searchTip-next').click(function(){
        index++;
        if(index<=guideTitle.length-1){
            //最后一步了
            if(index === guideTitle.length-1){
                $(this).text('关闭');
            }
            //设置包裹层
            $('.high-light-wrapper').width($(guideElementClass[index]).width());
            $('.high-light-wrapper').height($(guideElementClass[index]).height());
            $('.high-light-wrapper').offset({left:$(guideElementClass[index]).offset().left-5,top:$(guideElementClass[index]).offset().top-5});
            //设置内容
            $('.searchTip-title').text(guideTitle[index]);
            $('.searchTip-content').text(guideContent[index]);
            //高亮显示对应元素
            $(guideElementClass[index]).addClass('highLight');
            //移除前一个高亮
            $(guideElementClass[index-1]).removeClass('highLight');
            //设置位置
            var offset = $(guideElementClass[index]).offset();
            $('.searchTip').offset({left:offset.left+20+$(guideElementClass[index]).width(),top:offset.top});
        }else{
            //点击的话隐藏引导
            $('.searchTip').hide();
            $('#mask').hide();
            //除去最后一个元素的高亮
            $(guideElementClass[index-1]).removeClass('highLight');
            //隐藏包裹层
            $('.high-light-wrapper').hide();
        }
    });
    //窗口改变时也要修正对话框位置
    $(window).resize(function(){
        if($('#mask').is(':visible')) {
            var offset = $(guideElementClass[index]).offset();
            $('.searchTip').offset({left: offset.left + 20 + $(guideElementClass[index]).width(), top: offset.top});
        }
    });
}


//cookie函数,注意这里的cookie设置是添加，并没有覆盖哦
function setCookie(name,value,expireSeconds)
{
    var exp = new Date();
    //getTime返回毫秒数,设置过期时间多少秒
    exp.setTime(exp.getTime() + 1000*expireSeconds);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function checkCookie(value)
{
    var username=getCookie(value)
    if (username!=null && username!="")
    {
        return true;
    }
    else
    {
        return false;
    }
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}