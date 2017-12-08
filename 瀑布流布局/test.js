//保存各列高度的数组
var hArr = [];
//图片总数
var totalPicNum = 89;
//初始一个页面内要加载的图片数量
var initPicDataNum = 40;
//获取box的宽度以及列数
var boxParam = getBoxWidthAndColNum();
//初始化hArr
for(var i=0;i<boxParam.col;i++){
    hArr.push(0);
}

//已经加载图片的数量,初始化加载
var loadedPicNum = loadPic(0,initPicDataNum,totalPicNum);

$(window).on('scroll',function(){
    //可以加载下一页
    if(checkScrollSlide()){
        //遍历要加载的数据项
        if(loadedPicNum > totalPicNum) return;
        loadedPicNum = loadPic(loadedPicNum,initPicDataNum,totalPicNum);
    }
});

function getBoxWidthAndColNum(){
    var box = $('<div></div>').addClass('box');
    var pic = $('<div></div>').addClass('pic');
    var img = $('<img>');
    pic.append(img);
    box.append(pic);
    box.css('display','none');
    $(document.body).append(box);
    var w = box.outerWidth();
    //获取列数
    var cols = Math.floor($(window).width() / w);
    box.remove();
    return {
        w:w,
        col:cols
    }
}

function loadPic(startIndex,picNum,totalPicNum){
    for(var i=startIndex;i<picNum+startIndex;i++){
        //如果小于图片总数
        if(i<=totalPicNum) {
            var box = $('<div></div>').addClass('box');
            var pic = $('<div></div>').addClass('pic');
            var img = $('<img>').attr('src', './image/' + i + '.jpg');
            pic.append(img);
            box.append(pic);
            (function(box){
                //如果不在图片加载完成时调用瀑布流方法，那么在图片未完成加载时就会
                //调用瀑布流方法，而图片未加载时div高度为很小的值，那么图片会重叠在一起，因为是绝对定位
                img.on('load',function(){
                    $('#main').append(box);
                    //将新的图片添加到原来的div里面去
                    waterFall(hArr,box);
                })
            })(box);
        }
    }

    return startIndex+picNum;
}

//检查是否需要加载图片
//原理，找出最后一张图片距离窗口顶部的距离，如果小于窗口的高度则加载
function checkScrollSlide(){
    //获取最后一张图,last方法
    var $lastBox = $('#main > div').last();
    //获取这张图的一半 + 到页面顶部的距离(不是窗口)
    var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.outerHeight()/2);
    //窗口滚动距离
    var scroll = $(window).scrollTop();
    //窗口高度
    var windowHeight = $(window).innerHeight();
    return lastBoxDis - scroll <= windowHeight;

}

function waterFall(hArr,box){
    //设置main的宽度,居中
    $('#main').width(boxParam.col * boxParam.w).css('margin','0 auto');
    //找出最小的高度来放置下一张图片
    var min = Math.min.apply(null,hArr);
    //求出这张图的index,第一个参数是要找的值，第二个是数组，找不到返回-1，否则返回index
    var minIndex = $.inArray(min,hArr);
    box.css({
        'position':'absolute',
        'top':min+'px',
        "left":boxParam.w * minIndex+'px'
    });
    //更新最短列高度
    hArr[minIndex]+=box.outerHeight();
}