/**
 * User: hingbox@163.com
 * Date: 2018/12/31
 * Time: 12:35
 * Version:${1.0}
 */

var TabBlock = {
  s: {
    animLen: 200
  },
  
  init: function() {
    TabBlock.bindUIActions();
    TabBlock.hideInactive();
  },
  
  bindUIActions: function() {
    $('.tabBlock-tabs').on('click', '.tabBlock-tab', function(){
      TabBlock.switchTab($(this));
    });
  },
  
  hideInactive: function() {
    var $tabBlocks = $('.tabBlock');
    
    $tabBlocks.each(function(i) {
      var 
        $tabBlock = $($tabBlocks[i]),
        $panes = $tabBlock.find('.tabBlock-pane'),
        $activeTab = $tabBlock.find('.tabBlock-tab.is-active');
      
      $panes.hide();
      $($panes[$activeTab.index()]).show();
    });
  },
  
  switchTab: function($tab) {
    var $context = $tab.closest('.tabBlock');
    if (!$tab.hasClass('is-active')) {
      $tab.siblings().removeClass('is-active');
      $tab.addClass('is-active');
      TabBlock.showPane($tab.index(), $context);
    }
   },
  
  showPane: function(i, $context) {
    var $panes = $context.find('.tabBlock-pane');
    $panes.slideUp(TabBlock.s.animLen);
    $($panes[i]).slideDown(TabBlock.s.animLen);
    // i=1 表示是第二个tab（已下载），隐藏底部  "所有任务下载后自动关机"文字
    if (i == 1) {
      $(".auto-shutdown-div").css("display","none");
    }else {
      $(".auto-shutdown-div").css("display","block");
    }
  }
};

$(function() {
  TabBlock.init();
});


  //鼠标停留 文字变色(单个节目 暂停  下载)
$(".single_pause_span").mouseover(function(){
  $(this).css({
//      "border-color":"yellow",
    "color": "#007AFF"
  });
}).mouseout(function(){
  $(this).css({
//      "border-color":"",
    "color": "#CCCCCC "
  });
});
function formatFileSize(size){
  return parseInt((parseInt(size)/1048576.0));
}

function getdownloadurl(cid,uc,callback){
  var tmpnewurl ="";
  callback(0,tmpnewurl);
}
function download_start(id){
  //开始下载
  for(var i=0;i<g_downloadingdata.length;i++){
    if(g_downloadingdata[i].id==id){
      //获取新的下载地址，再正式下载
      var tmpstartjson = {"id":id,"cid":g_downloadingdata[i].cid,"url":g_downloadingdata[i].url};
      var tmpstartjsonstr = JSON.stringify(tmpstartjson);
      migu_app.SetConfig("download_start",tmpstartjsonstr);
      break;
    }
  }
}

// 默认是下载，点击暂停，显示下载图标(任务下载)，点击下载图标，任务暂停
function singlePause(that){
  var cid = $(that).attr('value');
  if($(that).attr('src').match("ic_l_pause_d.png")){
    $(that).attr('src','../images/ic_l_download_d.png');
//      $(that).parent('.div_parent').siblings('.mark').find('.texts').slideUp(0).siblings('.pause_span').slideDown(0);
    $(that).parent('.div_parent').siblings('.mark').find('.pause_span').text("暂停");
    $(that).parent('.div_parent').siblings('.mark').find('.file_size_before').hide();
    $(that).parent('.div_parent').siblings('.mark').find('.file_size_after').hide();
    $(that).siblings('.pause_down_span').text("下载")

    //暂停
    migu_app.SetConfig("download_pause",cid)
  } else {
    $(that).attr('src','../images/ic_l_pause_d.png');
//      $(that).parent('.div_parent').siblings('.mark').find('.texts').slideDown(0).siblings('.pause_span').slideUp(0);
    $(that).parent('.div_parent').siblings('.mark').find('.pause_span').text("");
    $(that).parent('.div_parent').siblings('.mark').find('.file_size_before').show();
    $(that).parent('.div_parent').siblings('.mark').find('.file_size_after').show();
    $(that).siblings('.pause_down_span').text("暂停")
    //开始下载
    //migu_app.SetConfig("download_start",cid)
    download_start(cid);
  }
}

//已下载节目列表中的删除按钮
function singleDelete(that){
  qikoo.dialog.confirm('你确定要删除下载任务吗?\t删除将无法恢复。',function(){
    var cid = $(that).attr('value');
    //删除
    migu_app.SetConfig("download_delete",cid);
    migu_app.SetConfig("list_downloading","showdownloading");//重新加载，或者代码判断刷新页面
  },function(){
  });
}

//下载中列表 界面 点击底部开始，列表中 图标变成暂停状态，同时文件大小隐藏，显示 暂停
//$("#bottom_start", "#bottom_start_span").bind("click", function() {
//  alert("进来了")
//  // 处理逻辑
//});
function bottom_starts(){
  //点击开始，校验checkbox是否为空
  var check_list = ($("input[type='checkbox']:checked").length);
  if (check_list<=0) {
    $("#disappare").show().delay(1000).hide(300);
    return false;
  }
  var obj = document.getElementsByName("cb");
  var check_val = [];
  for(k in obj){
    if(obj[k].checked)
      check_val.push(obj[k].value);
  }
  var check_vals = check_val.join(",");
  var strArry = check_vals.split(',');
  for (var index in strArry) {
    $(".single_pause_img").each(function(){
      var defaultCid = $(this).attr("value");
      if (strArry[index] == defaultCid) {
        $(this).attr("src","../images/ic_l_pause_d.png")
        $(this).siblings(".pause_down_span").text("暂停")
        $(this).parent('.div_parent').siblings('.mark').find('.pause_span').text("");
        $(this).parent('.div_parent').siblings('.mark').find('.file_size_before').show();
        $(this).parent('.div_parent').siblings('.mark').find('.file_size_after').show();
      }
    });
    console.log("开始要下载的节目id=>",strArry[index]);
    //migu_app.SetConfig("download_resume",strArry[index])
    download_start(strArry[index]);
  }
}

//下载中列表 界面 点击底部暂停，列表中 图标变成下载状态，同时文件显示大小，隐藏 暂停
function bottom_pauses(){
  //点击开始，校验checkbox是否为空
  var check_list = ($("input[type='checkbox']:checked").length);
  if (check_list<=0) {
    $("#disappare").show().delay(1000).hide(300);
    return false;
  }
  var obj = document.getElementsByName("cb");
  var check_val = [];
  for(k in obj){
    if(obj[k].checked)
      check_val.push(obj[k].value);
  }
  var check_vals = check_val.join(",");
  var strArry = check_vals.split(',');
  for (var index in strArry) {
    $(".single_pause_img").each(function(){
      var defaultCid =$(this).attr("value")
      if (strArry[index] == defaultCid) {
        $(this).attr("src","../images/ic_l_download_d.png")
        $(this).siblings(".pause_down_span").text("下载")
        $(this).parent('.div_parent').siblings('.mark').find('.pause_span').text("暂停");
        $(this).parent('.div_parent').siblings('.mark').find('.file_size_before').hide();
        $(this).parent('.div_parent').siblings('.mark').find('.file_size_after').hide();
      }
    });
    console.log("开始要暂停的的节目id=>",strArry[index]);
    migu_app.SetConfig("download_pause",strArry[index])
  }
}

//下载中列表 界面  底部删除
function bottom_deletes(){
  var check_list = ($("input[type='checkbox']:checked").length);
  if (check_list <= 0) {
    $("#disappare").show().delay(1000).hide(300);
    return false;
  }
  var obj = document.getElementsByName("cb");
  var check_val = [];
  for(k in obj){
    if(obj[k].checked)
      check_val.push(obj[k].value);
  }
  var check_vals = check_val.join(",");
  qikoo.dialog.confirm('你确定要删除下载任务吗?\t删除将无法恢复。',function(){
    //根据节目id 进行删除
    //遍历调用删除
    var strArry = check_vals.split(',');
    for (var index in strArry){
      console.log("要删除的节目id=>",strArry[index]);
      migu_app.SetConfig("download_delete",strArry[index]);
      //删除文件
      migu_app.SetConfig("list_downloading","showdownloading");
    }
    //window.location.reload();
  },function(){
  });
}

function chk(){
  var all = document.getElementById("all");
  var mychk = document.getElementsByName("cb");
  if(all.checked == true){
    if(mychk.length){
      for(var i=0;i<mychk.length;i++){
        mychk[i].checked = true;
      }
    }
    mychk.chcked=true;


  }else{
    if(mychk.length){
      for(var i=0;i<mychk.length;i++){
        mychk[i].checked = false;
      }
    }
  }

  cbObj = document.getElementsByName("cb");
  check_val_arr = [];
  for(k in cbObj){
    if(cbObj[k].checked)
      check_val_arr.push(cbObj[k].value);
  }
  temp_select_check_arr = check_val_arr
}

// 选择的checkbox 存起来 start
var temp_select_check_arr=[];
function checkboxOnclick(that){
  cbObj = document.getElementsByName("cb");
  check_val_arr = [];
  for(k in cbObj){
    if(cbObj[k].checked)
      check_val_arr.push(cbObj[k].value);
  }
  temp_select_check_arr = check_val_arr
}
// 选择的checkbox 存起来 end

//点击 底部 左下角 按钮【所有任务下载后自动关机】
function changeImage(){
  var element=document.getElementById('image');
  if (element.src.match("ic_sw_on")) {
    element.src="../images/ic_sw_off.png";
    $(".auto-down-span").css( "color","#999999");
    //TODO 需要调用系统的关机命令，用户下载完所有的视频，自动关机
  }
  else {
    element.src="../images/ic_sw_on.png";
    $(".auto-down-span").css( "color","#007AFF");
    //TODO 需要调用解除系统关机命令，如果用户点击了上面开关，然后关掉，此处要解除自动关机
  }
}

//点击 底部 右下角 文件存储 按钮
function openDir(){
  //打开文件路径
  migu_app.SetConfig("opendownloaddir","");

}
//点击 底部 右下角 设置按钮
function openSettings(){
  migu_app.SetConfig("settings","");
}

//已下载中 点击 播放
function play(that){
  var cid = $(that).attr('value');
  migu_app.SetConfig("download_play",cid);
}
var g_downloadingdata=[];
var g_downloadingdata_checklist=[];
function saveCheckList(){
	var check_list = ($("input[type='checkbox']:checked").length);
  var obj = document.getElementsByName("cb");
  g_downloadingdata_checklist = [];
  for(k in obj){
    if(obj[k].checked)
      g_downloadingdata_checklist.push(obj[k].value);
  }
}


$(function(){

	migu_app.SetConfig("list_downloading","showdownloading");
  migu_app.SetConfig("list_downloaded","showdownloaded");

});
function showdownloading(data){

  loadDatas = JSON.parse(data);
  $("#download_num").text(loadDatas.length);
  g_downloadingdata = loadDatas;
  var html="";
  if (loadDatas.length <= 0 || loadDatas<=0) {
    html = "<div style='text-align: center;;color: #666666'><p style='display: block;line-height: 240px'>点击右上角下载视频</p></div>";
    $('#mybox').html(html);
    $(".auto-shutdown-div").css('display','none');
    $(".start-stop-div").css('display','none');
  } else {
  	
    var content_width = "";
		
    console.log("用户选择了"+ g_downloadingdata_checklist.length+"集");
    if(loadDatas.length <=3){
      content_width = "460px";
    }else{
      content_width = "460px";
    }
    var percent=0;
    //动态添加 节目下载中列表
   	
    for(var i=0;i<loadDatas.length;i++){
      var loadData = loadDatas[i];
      if (loadData.mediasize > 0 && loadData.downloadsize<loadData.mediasize){
        percent = parseInt((loadData.downloadsize * 1.0)/ loadData.mediasize * 100 )
      }else if(loadData.downloadsize>=loadData.mediasize) {
        percent = 100;
      } else {
        percent = 0;
      }
			
      // 根据数据库返回的state 状态，显示列表中 暂停按钮或者是 下载按钮 start
      var state = loadData.state;
      var tempSrc;
      var tempText;
      var tempStatusText;
      var tempDownSize;
      var tempMediaSize;
      pausePic = "../images/ic_l_pause_d.png";
      pauseText = "暂停";
      pauseStatusText = "";
      pauseDownSize = formatFileSize(loadData.downloadsize)+'M/';
      pauseMediaSize = formatFileSize(loadData.mediasize)+'M';

      loadPic = "../images/ic_l_download_d.png";
      loadText = "下载";
      loadStatusText = "暂停";
      loadDownSize = "";
      loadMediaSize = "";
      if (0 == state || 1 == state){//未开始，下载中
        tempSrc = pausePic;
        tempText = pauseText;
        tempStatusText = pauseStatusText;
        tempDownSize=pauseDownSize;
        tempMediaSize=pauseMediaSize;
      }else if(2 == state){//暂停
        tempSrc = loadPic;
        tempText = loadText;
        tempStatusText=loadStatusText;
        //文字隐藏
        tempDownSize=loadDownSize;
        tempMediaSize = loadMediaSize;

      }
      tmpchecked = " ";
      
      for(var k=0;k<g_downloadingdata_checklist.length;k++){
      	if(g_downloadingdata_checklist[k]==loadData.id){
      		tmpchecked = " checked ";
      		break;
      	}
      }
      
      html +='<li>' +
          '<a href="javascript:;">'+
          '<div style="width: 600px;height: 60px;">' +
          '<div style="float: left">' +
          '<input class="cb" '+
          tmpchecked+
          ' name="cb" type="checkbox" value="'+loadData.id+'" onclick="checkboxOnclick(this)"/>' +
          '<img style="width: 50px;height: 50px;" src="'+loadData.img+'">' +
          '</div>'+
          '<div style="float: left;width: '+content_width+';margin-left: 10px;margin-top: -2px;">'+
          '<p class="content-name" style="display: inline-block;color: #CCCCCC">'+loadData.name+'</p>'+
          '<div class="div_parent" style="display: inline-block;float: right;margin-right: 20px;">'+
          '<img class="single_pause_img" onclick="singlePause(this)" value="'+ loadData.id +'" style="width: 20px;height: 20px;vertical-align: center" src="'+ tempSrc +'">&nbsp;&nbsp;'+
          '<span class="pause_down_span" style="color: #CCCCCC">'+ tempText+'</span>'+
          '</div>'+
          '<div style="line-height: 6px;margin-top: -5px;">'+
          '<progress value="'+ percent+'" max="100" style="height: 6px;width: 440px;"/>'+
          '</div>'+
          '<div style="color:#CCCCCC;" class="mark">'+
          '<span class="pause_span">'+tempStatusText+'</span>'+
          '<span class="file_size_before">'+ tempDownSize +'</span>'+
          '<span class="file_size_after">'+ tempMediaSize +'</span>'+
          '</div>'+
          '</div>'+
          '<div style="float: right;margin-top: 20px;margin-left: -4px;">'+
          '<span style="margin-top:3px;margin-right:10px;color: #CCCCCC;">'+ percent +'%</span>'+
          '<img class="" onclick="singleDelete(this)" src="../images/ic_delete.png" value="'+ loadData.id +'" style="width: 22px;height: 22px;"/>'+
          '</div>'+
          '</div>'+
          '<a/>'+
          '</li>';
      }
      $('#mybox').html(html);
  }
  
}

function showdownloaded(data){
  var loadedHtml="";
  var loadedDatas = $.parseJSON(data);
  $("#downloaded_num").text(loadedDatas.length);
  if (loadedDatas.length <= 0) {
    loadedHtml = "<div style='text-align: center;color: #666666'><p style='display: block;line-height: 240px'>点击右上角下载视频</p></div>";
    $('#my_second_box').html(loadedHtml);
  }else {
    for(var i=0;i<loadedDatas.length;i++){
      //获取下载完成的任务数据
      var loadedData = loadedDatas[i];
      console.log("loadedData=>","[cid]=",loadedData.cid,"[name]=",loadedData.name,"[detail]=",loadedData.detail,"[img]=",loadedData.img);
      loadedHtml+='<li>' +
          '<a href="javascript:;">'+
          '<div style="height: 60px;line-height: 20px;">'+
          '<div style="float: left;">'+
          '<img style="width: 50px;height: 50px;" src="'+loadedData.img+'">'+
          '</div>'+
          '<div>'+
          '<div style="float: left;width: 520px;height: 50px;margin-left:10px">'+
          '<div style="height: 27px;">'+
          '<p class="content-name" style="display: inline-block;color: #CCCCCC">'+loadedData.name+'</p>'+
          '<div class="div_parents" style="display: inline-block;float: right;margin-right: 20px;">'+
          '<img class="single_pause_imgs" onclick="play(this)" value="'+ loadedData.id +'" style="width: 20px;height: 20px;vertical-align: center" src="../images/play.png">&nbsp;&nbsp;'+
          '<span class="pause_down_spans" style="color: #CCCCCC">播放</span>'+
          '</div>'+
          '</div>'+
          '<div style="float: bottom;color:#CCCCCC;"><p class="line-limit-length">'+ loadedData.detail +'</p>' +
          '</div>'+
          '</div>'+
          '</div>'+
          '<div style="float: left;margin-top: 10px;margin-left: 8px;">'+
          '<img class="" onclick="singleDelete(this)" value="'+loadedData.id+'" src="../images/ic_delete.png" style="width: 22px;height: 22px;"/>'+
          '</div>'+
          '</div>'+
          '</a>'+
          '</li>';
    }
    $('#my_second_box').html(loadedHtml);
  }
}
setInterval(function(){
	saveCheckList();
  migu_app.SetConfig("list_downloading","showdownloading");
  migu_app.SetConfig("list_downloaded","showdownloaded");
},5000);

