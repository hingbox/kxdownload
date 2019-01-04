/**
 * User: hingbox@163.com
 * Date: 2018/12/31
 * Time: 11:35
 * Version:${1.0}
 */

//=================获取节目列表start=====
function getUrlPara(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}
var cid = getUrlPara("cid");//获取页面上传过来的节目id

var gContentDataList=[];
var forwardUrl = "http://47.104.220.221:8080/MiguApi";//TODO 线网需要修改为 此地址 http://pc.miguvideo.com/MiguApi
// 获取用户选择的码率 start
var uc = 55;
function getRate(that) {
    var rateTypeTemp = $(that).val();
    if (rateTypeTemp == 1) {
        uc = 54
    } else if (rateTypeTemp == 2) {
        uc = 55
    } else if (rateTypeTemp == 3) {
        uc = 91
    } else {
        uc = 92
    }
    uc = uc;
}
// 获取用户选择的码率 start

//加载节目列表

//获取节目列表
$.ajax({
    type: "get",
    url:forwardUrl+"/forwardapi/getContentInfo.ac?cid="+ cid,
    contentType: "application/json;charset=utf-8",
    dataType:"jsonp",
    jsonp:"jsoncallback",
    jsonpCallback:"getProgramList",
    success: function (data) {
        //console.log("成功")
    },error:function(error){
        //console.log("失败"+JSON.stringify(error))
    }
});

//获取节目列表回调函数
function getProgramList(data){
    gContentDataList = [];
    for (var i = 0; i < data.length; i++) {
        //console.log("mId"+data[i].SubSerial_IDS);
        var SubSerial_IDS = data[i].SubSerial_IDS;
        if (SubSerial_IDS !=='') {
            //表示是续集类节目
            var variety = data[i].Variety;
            var html='';
            var cid='';

            for (j in variety){
                cid = variety[j].contId;//节目id
                newName = variety[j].newName;//节目名称
                imgH = variety[j].imgH;//节目海报图
                detail = data[i].Detail;//节目详情
                timeLong = variety[j].CDuration;//节目时长
                gContentDataList.push(
                    {
                        "cid":cid,
                        "newName":newName,
                        "imgH":imgH,
                        "detail":detail,
                        "timeLong":timeLong,
                        "uc":uc,
                        "mediaSize":"",
                        "url":""
                    });

                html+='<input class="inputs" type="checkbox" name="content" onclick="checkboxOnclick(this)" value="'+cid+'" />'+newName+'<input name="img" type="hidden" value="'+imgH+'"/><br/>';
                $('#box').html(html);
                //console.log("contId"+contId+"newName:"+newName)
            }
        }else{
            var html = '';
            //表示是电影类节目
            cid = data[i].contId;
            newName = data[i].name;
            imgH = data[i].imgH;//节目海报图
            detail = data[i].Detail;//节目详情
            timeLong = data[i].timeLong;//节目时长

            gContentDataList.push(
                {
                    "cid":cid,
                    "newName":newName,
                    "imgH":imgH,
                    "detail":detail,
                    "timeLong":timeLong,
                    "uc":uc,
                    "mediaSize":"",
                    "url":""
                });

            html+='<input class="inputs" type="checkbox" name="content" onclick="checkboxOnclick(this)" value="'+cid+'" />'+newName+'<input name="img" type="hidden" value="'+imgH+'"/><br/>';
            $('#box').html(html);
            //console.log("contId"+cid+"newName:"+newName)
        }
    }
}

//=================获取节目列表end==========

//==============全选按钮 start ==========
// 全选
function allcheck(){
    document.getElementById('check_all').style.color = "#007AFF";
    document.getElementById('check_reverse').style.color = "#FFFFFF";
    $('input[type="checkbox"]').prop('checked','true');
    var check_list = ($("input[type='checkbox']:checked").length);
    $("#select_nums").html("共选择"+check_list+"个文件");
}
//=======全选按钮 end==========

//=======反选按钮 start==========
//反选
function reversecheck(){
    document.getElementById('check_reverse').style.color = "#007AFF";
    document.getElementById('check_all').style.color = "#FFFFFF";
    $('input[type="checkbox"]').each(function () {
        $(this).prop("checked", !$(this).prop("checked"));
        //获取选择的数量
        var check_list = ($("input[type='checkbox']:checked").length);
        $("#select_nums").html("共选择"+check_list+"个文件");
    });
}
//=======反选按钮 start==========

//=======单选chekbox start==========
//点击checkbox
function checkboxOnclick(checkbox){
    document.getElementById('check_reverse').style.color = "#FFFFFF";
    document.getElementById('check_all').style.color = "#FFFFFF";
    if ( checkbox.checked == true){
        var check_list = ($("input[type='checkbox']:checked").length);
    }else{
        var check_list = ($("input[type='checkbox']:checked").length);
    }
    $("#select_nums").html("共选择"+check_list+"个文件");

}
//=======单选chekbox end==========

function onload(){
    updateFolder();
}
//获取用户信息
function getUserInfo(){
    return migu_app.getLoginInfo();
}

//=============点击下载按钮  start=============
var global_check_data =[];
function download() {
    //判断是否选择了 下载的节目
    var check_list = ($("input[type='checkbox']:checked").length);
    if (check_list <= 0) {
        $("#disappare").show().delay(1000).hide(300);
        return false;
    }
    document.getElementById("download_btn").style.background = "#007AFF";
    document.getElementById("cancel_btn").style.background = "#4C4C4C";
    var obj = document.getElementsByName("content");
    var check_val = [];
    var check_content = [];
    var check_data = new Array();
    for (k in obj) {
        if (obj[k].checked)
            check_val.push(obj[k].value);
        if (obj[k].checked) {
            check_content.push(obj[k].nextSibling.nodeValue)
        }
    }
    for (var k = 0; k < check_val.length; k++) {
        for (var i = 0; i < gContentDataList.length; i++) {
            if (gContentDataList[i].cid == check_val[k]) {
                check_data.push(gContentDataList[i]);
            }
        }
    }
    global_check_data = check_data;

    var check_vals = check_val.join(",");
    var check_contents = check_content.join(",");
    var check_datas = (JSON.stringify(check_data));
    console.log("用户选择节目id->" + check_vals);
    console.log("用户选择节目名称->" + check_contents);
    console.log("用户选择的数据->" + (check_datas));

    // 获取用户id 和userToken
    var userId = "";
    var userToken = "";
    var infoString = getUserInfo();//获取用户信息  userId,userToken
    if (infoString) {
        infoString = infoString.replace(/'/g, "\"");
        var info = JSON.parse(infoString);
        if (info) {
            userId = info.userId;
            userToken = info.userToken;
        }
    }
    //进行鉴权 鉴权通过 跳转到下载页面
    var cid = check_vals;//测试的电影节目id=649039736;续集节目id=649039777
    //var download_data = [];//存储 获取下载地址的数据
    //var downNewUrl ="http://47.104.220.221:8081/api/getDownUrl";
    var visitUrl = "http://pc.miguvideo.com";//调用节目下载生产地址
    $.ajax({
        type: "get",
        //url:"http://47.104.220.221:8080/MiguApi/forwardapi/getDownUrl.ac?uc=92&cid=650832943&userId=901785618&userToken=E7DCCC527ABB7D5DB2FD&visitUrl=http://pc.miguvideo.com",
        url: forwardUrl + "/forwardapi/getDownUrl.ac?uc=" + uc + "&cid=" + cid + "&userId=" + userId + "&userToken=" + userToken + "&visitUrl=" + visitUrl,
        contentType: "application/json;charset=utf-8",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        jsonpCallback: "getDownUrl",
        success: function (data) {
            //console.log("成功")
        }, error: function (error) {
            //console.log("失败"+JSON.stringify(error))
        }
    });
}
//获取地址 并且将数据传给C++
function getDownUrl(data){
    var download_data = [];
    if ("200" == data.code) {
        var body =data.body;
        for (var c in body){
            if ("200" == body[c].code){
                //解析文件大小，流地址
                download_data.push(body[c]);
                //获取下载地址url
                console.log("url->"+body[c].url);
            }else if ("403" == body[c].code){
                //TODO 表示拥护没有权限下载，跳转到支付界面
                console.log("没有权限下载")
                //关闭当前窗口
                migu_app.SetConfig("close","mini");
                //跳转到支付界面
                var callbackUrl = "miguplay://html/vodpage.html?playcid="+cid;
                migu_app.ShowMiniEPG("https://www.miguvideo.com/wap/resource/miguPC_client/payOrder.jsp",callbackUrl,760,450);
                break;
            } else if("401" == body[c].code){
                console.log("版权原因无法下载");
                //这个一般是非大陆的ip，才会提示
                migu_app.SetConfig("close","mini");
                migu_app.ShowMiniEPG("networkout.html?id=7",0);
                break;
            }else if("404" == body[c].code){
                console.log("未找到媒体文件");
                //传的节目id有问题，传的是续集壳的节目id，不是续集集数的节目id
                migu_app.SetConfig("close","mini");
                migu_app.ShowMiniEPG("networkout.html?id=8",0);
                break;
            }
        }
        var d = global_check_data;
        var customerSelectData=[];
        for(var i in d) {
            downdata = d[i];//JSON.parse(d[i]);
            for (x in download_data) {
                if (i == x) {
                    //console.log("url->"+download_datas[x].url+"mediaSize->"+download_datas[x].mediaSize)
                    downdata.mediaSize = parseInt(download_data[x].mediaSize);
                    downdata.url = download_data[x].url;
                    downdata.uc = download_data[x].usageCode;
                    customerSelectData.push(downdata)
                }
            }
        }
        migu_app.SetConfig("downloadData",JSON.stringify(customerSelectData));
        //点击下载  打开下载管理页面
        window.location = 'downmanager.html';
    }else {
        migu_app.SetConfig("close","mini");
        migu_app.ShowMiniEPG("networkout.html?id=1",0);
    }
}

//=============点击下载按钮  end=============

//========点击 更改下载目录  start=====
function updateDownloadDir(){
    //TODO 打开电脑系统文件夹
    migu_app.SetConfig("chooseFolder","updateFolder");
}
function updateFolder(){
    document.getElementById("path").value=migu_app.GetConfig("storepath");
    document.getElementById("pathsize").innerText= migu_app.GetConfig("storepathsize");
}

//========点击 更改下载目录  start=====

//========点击 取消按钮  start=====
function cancelBtn(){
    migu_app.SetConfig("close","mini");
}
function list_downloaded(str){
    document.getElementById("test").innerText = str;
}
//========点击 取消按钮  end=====

//======数据加蒙层区域 start=========
//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loadingDiv" style="display: none; "><div id="over" style=" position: absolute;top: 0;left: 0; width: 100%;height: 100%; background-color: #f5f5f5;opacity:0.5;z-index: 1000;"></div><div id="layout" style="position: absolute;top: 20%; left: 20%;width: 20%; height: 20%;  z-index: 1001;text-align:center;"><img src="" /></div></div>';
//呈现loading效果
document.write(_LoadingHtml);

//移除loading效果
function completeLoading() {
    document.getElementById("loadingDiv").style.display="none";
}
//展示loading效果
function showLoading()
{
    document.getElementById("loadingDiv").style.display="block";
}

//======数据加蒙层区域 结束=========

$('#open').change(function(){
    alert($(this).val());
});

$("input[name=open]").change(function() {
    alert($("input[name=open]").val())
})
