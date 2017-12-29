/**
 * Created by shoutikeweb on 2017/11/27.
 */
fn();
function fn() {
    var html = document.getElementsByTagName("html")[0];  //获取html
    var width = html.getBoundingClientRect().width;  //获取html的宽度
    /*得出来的结果不能小于12  当设计图是750时  750/15  结果是50 1rem 是 50  占宽度的15分之一*/
    html.style.fontSize = width/15 + "px";
}