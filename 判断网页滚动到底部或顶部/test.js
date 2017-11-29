//判断是否加载到当前页面头部或者底部:条件：scrollHeight == scrollTop+clientHeight
//scrollHeight是总内容的高度，包含滚动条滚上去的内容，scrollTop是网页被卷上去的高度
//获取可视区域高度:window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
//document.documentElement获取到html节点
var clientHeight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
function isPageTopOrBottom(){
    //兼容写法,ie chrome不一样
    var scrollTop =  document.body.scrollTop + document.documentElement.scrollTop;
    var pageTotalHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
    if(pageTotalHeight == scrollTop + clientHeight){
        alert('到底部啦')
    }else if(scrollTop == 0){
        alert('到顶部啦')
    }
}
window.onscroll = isPageTopOrBottom;