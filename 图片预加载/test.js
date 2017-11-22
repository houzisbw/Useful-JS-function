//预加载，原理是建立一个加载页面，利用Image对象的onload事件
//<img> 标签每出现一次，一个 Image 对象就会被创建。

var imgs=[
    'http://img.article.pchome.net/00/44/23/20/pic_lib/wm/2.jpg',
    'http://lcd.yesky.com/imagelist/2009/044/404q4y8g4m0p.jpg',
    'http://lcd.yesky.com/imagelist/2009/044/cgro54wt2t2x.jpg'
];

//当前第几张图
var index = 0,
    len = imgs.length,
    count = 0,
    $progress = $('.progress'),
    imageList = [];

//加载一次后图片就在缓存里面了，下次打开页面不用再loading
$.each(imgs,function(index,item){
    //预加载利用img对象的load事件
    var imgObj = new Image();
    //图片加载完成后触发的事件
    $(imgObj).on('load',function(){
        console.log('加载完成');
        if(count>=len-1){
            //所有图加载完成,隐藏loading页面
            $('.loading').hide();
            document.title = '1/'+len;
        }
        count++;
        $progress.html(Math.round((count/len)*100)+'%');

    });
    //开始加载图片,load事件代表加载完成
    imgObj.src = item;
    //保存image对象,便于以后使用
    imageList.push(imgObj);
});

$('#img').attr('src',imageList[0].src);
//按钮
$('.btn').on('click',function(){
    //data方法获取到data属性
    //上一张
    if($(this).data('control') === 'prev'){
        index--;
        if(index<0){
            index=len-1;
        }
    }else{
        index++;
        if(index>=len){
            index=0;
        }
    }
    document.title = '当前是第'+(index+1)+'张图片';
    $('#img').attr('src',imageList[index].src);
})