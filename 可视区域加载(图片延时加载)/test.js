//可视区域加载:当元素滑动到当前可视区域时，才触发加载事件
//获取可视区域高度:window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
//document.documentElement获取到html节点
var clientHeight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
var divs = $('.red');
function showDiv(){
    divs.each(function(index,ele){
        //获取元素到可视区域顶部的距离，left,bottom,right
        if(ele.getBoundingClientRect().top <= clientHeight){
            //图片延迟加载页也写在这里: img.src=xxxx
            $(ele).addClass('div-fade');
        }
    });
}
//绑定滑动方法
window.onscroll = showDiv;