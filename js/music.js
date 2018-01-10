//数据
var data=[
    {
        song:"Burn",
        singer:"Angelika Vee",
        src:"mp3/1Angelika Vee - Burn.mp3",
        img:'../img/singerimg/1.jpg',
        lyric:'burn'
    },
    {
        song:"自卑情结",
        singer:"朴经,银河",
        src:"mp3/2朴经,银河.mp3",
        img:'../img/singerimg/2.jpg',
        lyric:'zbqingjie'
    },
    {
        song:"Say It Again",
        singer:"Frances",
        src:"mp3/3Frances - Say It Again.mp3",
        img:'../img/singerimg/3.jpg',
        lyric:'sayitagain'
    },
    {
        song:"Cry Wolf",
        singer:"Luna Shadows",
        src:"mp3/4Luna Shadows - Cry Wolf.mp3",
        img:'../img/singerimg/4.jpg',
        lyric:'crywolf'
    },
    {
        song:"Panda",
        singer:"Desiigner",
        src:"mp3/5Desiigner - Panda.mp3",
        img:'../img/singerimg/5.jpg',
        lyric:'panda'
    },
    {
        song:"DuDuDu",
        singer:"Standing Egg",
        src:"mp3/6Standing Egg.mp3",
        img:'../img/singerimg/6.jpg',
        lyric:'dududu'
    },
    {
        song:"丑八怪",
        singer:"薛之谦",
        src:"mp3/7choubaguai.mp3",
        img:'../img/singerimg/7.jpg',
        lyric:'choubaguai'
    },
    {
        song:"天使",
        singer:"五月天",
        src:"mp3/8angel-wuyue.mp3",
        img:'../img/singerimg/8.jpg',
        lyric:'angel',
        offset:-1.6
    },
    {
        song:"知足",
        singer:"五月天",
        src:"mp3/9enough- wuyue.mp3",
        img:'../img/singerimg/9.jpg',
        lyric:'zhizu'
    },
    {
        song:"突然好想你",
        singer:"五月天",
        src:"mp3/10turan-wuyue.mp3",
        img:'../img/singerimg/10.jpg',
        lyric:'turan'
    },
    {
        song:"温柔",
        singer:"五月天",
        src:"mp3/11wenrou-wuyue.mp3",
        img:'../img/singerimg/11.jpg',
        lyric:'wenrou',
        offset:-0.9//歌词有延迟
    }
];

var timer;
var num = 1; //默认播放 图片转动
var isPlaying = true; //音频播放状态 true播放中
var $width = 0; //进度条的宽度
var slider = 10; //进度条总宽度 可移动的范围是（0-10rem）
var curmargin = 0.34;//进度条圆点本身的margin-left
var player = $("#audio")[0]; /*jquery对象转换成js对象*/
var container = document.querySelector('.item');
var $image = container.querySelectorAll('img')[0];
var $imagebg = container.querySelectorAll('img')[1];
var playingBtn = document.getElementById('playing_btn');

//歌词变量
var lyric={
    lyricStr:'',//储存当前歌曲歌词字符串数据
    unitHeight:1.6,//每个歌词li的高度
    lyricTop:5.88,//ul初始高度
    lyNum:0,//当前显示第几句歌词
    lyMTime:[],//每句歌词运动时间
    lyMtext:[],//每句歌词
    timer:null,//歌词自动滚动的定时器
    lyPreNum:-1,//上一句歌词下标
    color:'#fff',//改变当前播放歌词颜色
    offset:0,//歌词偏移（可以提前或延迟歌词滚动，负数提前正数延迟）
    draging:false//歌词是否拖拽
};
//-------点击轮播图页 开启播放器--------//

//播放时点击回到上一级
$('.prevmenu').on('click',function(){
    $('.home').show();
    $('.music').hide();
});
//播放首页 点击回到主页
$('.prevhome').on('click',function(){
    window.location.href = '../index.html';
});
//选择播放哪一首歌曲
var thisnum ;
var name;
$('.swiper-wrapper .swiper-slide').each(function(){
    $(this).on('click',function(){
        $('.home').hide();
        $('.music').show();
        thisnum = $(this).attr('data-check');
        singClick(thisnum);
    });
});

//-------播放器--------//

//点击中间的 唱片或歌词 相互切换
$('.center').on('click',function(){
    if($(this).attr('data-lrc') == 'true'){
        $(this).attr('data-lrc','false');
        $('.record').hide();
        $('.lrc').show();
    }else{
        $(this).attr('data-lrc','true');
        $('.record').show();
        $('.lrc').hide();
    }
});
//暂停效果
playingBtn.addEventListener('click',function bindEvent(){
    if (num == 1){ /*如果已经播放*/
        player.pause();/*暂停*/
        clearInterval(timer);
        this.style.background = 'url("../img/icon/play_rdi_btn_play.png") no-repeat center';
        this.style.backgroundSize = '2.8rem 2.8rem';
        this.style.webkitBackgroundSize = '2.8rem 2.8rem';
        $('#play_needle').addClass('play_needle_trans');
        num++;
        pause();
        return num;
    }else {
        player.play(); /*播放*/
        fntimer();
        this.style.background = 'url("../img/icon/play_rdi_btn_pause.png") no-repeat center';
        this.style.backgroundSize = '2.8rem 2.8rem';
        this.style.webkitBackgroundSize = '2.8rem 2.8rem';
        $('#play_needle').removeClass('play_needle_trans');
        num=1;
        play();
        return num;
    }
});

//上一首歌曲
$('#prev_btn').on('click',function(){
    thisnum--;
    if(thisnum>=data.length)thisnum = 0;
    if(thisnum<0)thisnum = data.length-1;
    singClick(thisnum);
});
//下一首歌曲
$('#next_btn').on('click',function(){
    thisnum ++;
    if(thisnum>=data.length)thisnum = 0;
    if(thisnum<0)thisnum = data.length-1;
    singClick(thisnum);
});
//点击循环播放
$('#loop').on('click',function(){
    if($(this).attr('data-loop') == 'false'){
        $(this).attr('data-loop','true');
        $(this).addClass('loop_active');
        $('#audio').attr('loop','loop');
    }else{
        $(this).attr('data-loop','false');
        $(this).removeClass('loop_active');
        $('#audio').removeAttr('loop');
    }
});

//选集
$('.music_menu').on('click',function(){
    $('.footer').hide();
//	$('.mask_list').slideDown();
    $('.mask_list').show();
});

//点击播放列表效果
$('#list_wrap').on('click','.list',function(){
    thisnum = $(this).attr('data-check');
    singClick(thisnum);
    $('.footer').show();
    $('.mask_list').hide();
});

//选集菜单关闭
$('.lists_close').on('click',function(){
    $('.footer').show();
//	$('.mask_list').slideUp();
    $('.mask_list').hide();
});
//-------播放器函数封装--------//
//点击轮播图或者歌曲列表播放歌曲 函数
function singClick(nownum){
    listfn(nownum);
    $('.disk').find('.item').children().first().attr('src',data[nownum].img);
    $('.bg').css('background','url("'+data[nownum].img+'") no-repeat 0 50%');
    $('.bg').css('background-size','cover');
    $('.bg').css('-webkit-background-size','cover');
    name = data[nownum].lyric;
    $('#singing').html(data[nownum].song);
    $('#singer').html(data[nownum].singer);
    $('.bg_black').show();
    loadlrc(name);
    $('#audio').attr('src','http://cool.miaov.com/js201607/3/'+data[nownum].src);
    player.play(); /*播放*/
    fntimer();
    if(num != 1){
        $('#playing_btn').css('background','url("../img/icon/play_rdi_btn_pause.png") no-repeat center');
        $('#playing_btn').css('background-size','2.8rem 2.8rem');
        $('#playing_btn').css('-webkit-background-size','2.8rem 2.8rem');
        num = 1;
        return num;
    }
}

//进度条移动
fnslider();
function fnslider(){
    $('#cur-btn').on('touchstart',function(e){
        var disx = 0;
        var movedisx = 0;
        var nowtime = 0;
        var nowleft = $width;
        clearInterval(timer);
        //点击圆点时 当前的left值
        disx = e.originalEvent.targetTouches[0].pageX*2/50;
        $('.wrap').on('touchmove',function(e){
            //鼠标或者手指移动的距离
            movedisx = e.originalEvent.targetTouches[0].pageX*2/50;
            $width  = movedisx - disx + nowleft;
            if($width < 0)$width = 0;
            if($width > slider)$width = slider;
            $('#process-cur').css('width',$width+'rem');
            $('#cur-btn').css('left',$width+'rem');
            //根据移动的距离计算出需要播放的当前时间
            nowtime = $width/slider*player.duration;
            sToM(nowtime,$('#currentTime'));
        });
        $('.wrap').on('touchend',function(e){
            //return false;
            //鼠标手指抬起时 设置改变当前播放时间
            var $currentTime = $width/slider*player.duration;
            player.currentTime = $currentTime;
            if('fastSeek' in player){
                player.fastSeek($currentTime);//改变audio.currentTime的值
                //alert(player.currentTime);
            }else if(player.seekable.start(0)<= $currentTime <=player.seekable.end(0)){
                //获得第一个以秒计的音频可寻址范围（部分）：
                player.currentTime = $currentTime;
            }else{
                //如果以上都不满足 就设置播放时间为缓冲到最大位置的时间
                //player.buffered表示音频已缓冲部分的
                player.currentTime = player.buffered.end(player.buffered.length-1);
            }
            fntimer();
            $('.wrap').off('touchmove');
            $('.wrap').off('touchend');
        });
    });

    $('#process-bar').on('click',function(e){

        var w = e.originalEvent.targetTouches[0].pageX;
        //alert(w);

    });

}

//加载歌曲列表
function listfn(listindex){
    $('#list_wrap').empty();
    for(var i = 0;i<data.length;i++){
        $('<li class="list '+(i==listindex?"audio_active":"")+'" data-check="'+(i)+'"><a href="javascript:;"><div class="lis ellipsis">'+data[i].song+'--'+data[i].singer+'</div><i></i></a></li>').appendTo('#list_wrap');
    }
}
//每隔一秒获取当前播放时间 放到页面
function fntimer(){
    timer = setInterval(function(){
        //当前时间转成分秒
        sToM(player.currentTime,$('#currentTime'));
        sToM(player.duration,$('#total-time'));
        //进度条
        $width = player.currentTime/player.duration*slider;
        $('#process-cur').css('width',$width+'rem');
        $('#cur-btn').css('left',$width+'rem');
        if(player.currentTime == player.duration){
            clearInterval(timer);
//			$(this).css('background-position-y','-13.98rem');
            alert('播放结束跳转下一页');
            thisnum ++;
            if(thisnum>=data.length)thisnum = 0;
            if(thisnum<0)thisnum = data.length-1;
            singClick(thisnum);
        }
    },1000);
}

//将秒换算成分钟 换算后放入相应标签里函数
function sToM (sec,name) {
    var m=Math.floor(sec/60);
    var s=Math.floor(sec%60);
    name.html(toZero (m)+':'+toZero (s));
}
//分钟转化成秒
function minToSec (StrTime) {
    var arr=StrTime.split(':');
    var sec=parseFloat((parseFloat(arr[0])*60+parseFloat(arr[1])).toFixed(2));
    return sec;
}
//补零函数
function toZero(n){
    return n<10? '0'+n:''+n;
}

//暂停图片动画
function pause() {
    var iTransform = getComputedStyle($image).transform;
    var iTransform = getComputedStyle($imagebg).transform;
    var cTransform = getComputedStyle(container).transform;
    container.style.transform = cTransform === 'none'? iTransform: iTransform.concat(' ', cTransform);
    $image.classList.remove('anmiting');
    $imagebg.classList.remove('anmiting');
}
function play() {
    $image.classList.add('anmiting');
    $imagebg.classList.add('anmiting');
}

//歌词
//歌词运动
function lrcMove(arry){
    $.each(arry,function(i,val){
        console.log(val);

    });
}

//根据点击的歌曲名称 加载歌词
function loadlrc(name){
    lyric.lyricStr=lyrics[name]; //当前歌曲对应的歌词字符串 lyrics歌词数据对象名称
    lyric.lyMTime=returnTimeLyric(lyric.lyricStr)[0];
    lyric.lyMtext=returnTimeLyric(lyric.lyricStr)[1];
    $('.lrclist').empty();
    for (var i = 0; i < lyric.lyMtext.length; i++) {
        var li1=document.createElement('li');
        if (lyric.lyMtext[i]=='') {
            li1.innerHTML='&nbsp;';
        }else {
            li1.innerHTML=lyric.lyMtext[i];
        }
        $('.lrclist').append(li1);
    }
    //lrcMove(lyric.lyMTime);
}

//19.歌词清除样式,ul回到顶部(切换歌曲调用，歌词复位)
function lyReset () {
    lyric.lyPreNum=-1;//上一句复位
    lyric.lyNum=0;//当前句复位
    lyricUl.style.top=lyric.lyricTop+'rem';//ul初始高度
}
//20.歌词根据播放时间滚动
function lyMoveTo (time) {
    var last=true;//是否是最后一句
    for (var i = 0; i < lyric.lyMTime.length; i++) {
        if(lyric.lyMTime[i]>(time-lyric.offset)){
            lyric.lyNum=i-1;
            last=false;
            break;//显示第i个
        }
    }
    if (last) {
        lyric.lyNum=lyric.lyMTime.length-1;
    }
    if (lyric.lyNum<0) {
        lyric.lyNum=0;
    }
    if (!lyricLi[lyric.lyNum]) {
        return;
    }
    if (lyric.lyPreNum==lyric.lyNum) {
        return;
    }else {
        if (lyric.lyPreNum>-1) {
            lyricLi[lyric.lyPreNum].className="";
            lyricLi[lyric.lyPreNum].style.cssText='';
        }
        lyric.lyPreNum=lyric.lyNum;
    }
    lyricLi[lyric.lyNum].className="active";
    lyricLi[lyric.lyNum].style.color=lyric.color;
    move(lyricUl,{top:lyric.lyricTop-lyric.unitHeight*lyric.lyNum},150,'easeIn');
}
//21.主要给歌词根据播放时间滚动加判断
function lyricTimer () {
    clearInterval(lyric.timer);
    lyric.timer=setInterval(function () {
        if (lyric.draging) {
            return;
        }
        if(curDraging){
            return;
        }
        if (!playBtn.onOff) {
            clearInterval(lyric.timer);
            return;
        }
        if (!Audio1.currentTime) {
            return;
        }
        lyMoveTo(Audio1.currentTime);
    }, 150);
}

//拆分歌词的时间和每句歌词 进行匹配
function returnTimeLyric (lyric) {
    var arr=lyric.split('[');
    var arrTime=[]; //每句歌词的时间
    var arrLyric=[]; //每句歌词
    var arrTemp=[];
    for (var i = 1; i < arr.length; i++) {
        arrTime.push(minToSec(arr[i].split(']')[0]));
        arrLyric.push(arr[i].split(']')[1]);
    }
    arrTemp.push(arrTime,arrLyric);
    //console.log(arrTime);
    console.log(arrTemp);
    return arrTemp;
}


