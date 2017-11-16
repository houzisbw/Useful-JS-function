/**
 * Created by Administrator on 2017/11/16.
 */
//使用jQuery实现星级评分
//匿名闭包，所有变量都成为局部变量，防止和其他的冲突 
(function(){
    var curClickIndex = 0;
    //初始化
    var initialNum = 1;
    $('.rating-star').each(function(index,item){
        if(index<=initialNum){
            $(item).css('background-image',"url('./image/red.png')");
        }else{
            $(item).css('background-image',"url('./image/yellow.png')");
        }
    })

    //绑定mouseove事件
    $('.rating-star').mouseover(function(e){
        var curIndex = $('.rating-star').index(e.target);
        $('.rating-star').each(function(index,item){
            if(index<=curIndex){
                $(item).css('background-image',"url('./image/red.png')");
            }else{
                $(item).css('background-image',"url('./image/yellow.png')");
            }
        })
    }).click(function(e) {
        curClickIndex = $('.rating-star').index(e.target);
    })

    $('#rating').mouseout(function(){
        $('.rating-star').each(function(index,item){
            if(index<=curClickIndex){
                $(item).css('background-image',"url('./image/red.png')");
            }else{
                $(item).css('background-image',"url('./image/yellow.png')");
            }
        })
    })
})() ;
