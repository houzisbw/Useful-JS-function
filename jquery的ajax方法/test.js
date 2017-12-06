//ajax的load加载服务器上的html文件
$('#load').click(function(){
    $('.container .loaded').load('./ajax-content/ajax-load.html');
});

//ajax加载json，json的key，value必须双引号，单引号不行
$('#get-json').click(function(){
    //直接读取服务器json，data是返回的json数据
    $.getJSON('./ajax-content/ajax.json',function(data){
        $.each(data,function(index,ele){
            var p = $('<p></p>');
            p.text(ele["name"]+' '+ele["age"]);
            $('.container .json-loaded').append(p);
        })
    })
});

//加载js
$('#get-js').click(function(){
    $.getScript('./ajax-content/ajax.js',function(){
        $('.js-loaded').text('js加载完毕')
    })
});
//post
$('#post').click(function(){
    $.post('./ajax-content/a.php',{name:'lqy'},function(data){
        $('.post').text(data);
    })
});