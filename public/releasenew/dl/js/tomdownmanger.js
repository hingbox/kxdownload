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
  }
};

$(function() {
  TabBlock.init();
});
function getUserInfo(){return migu_app.getLoginInfo();}
function getdownloadurl(cid,uc,mycallback){
		var userId = "";
		var userToken = "";
		var infoString = getUserInfo();//获取用户信息  userId,userName
		if(infoString){
			infoString = infoString.replace(/'/g, "\"");
			var info = JSON.parse(infoString);
			if(info){
				userId = info.userId;
				userToken = info.userToken;
			}
		}	
		
   //for test only
   	userId = "901785618";
   	userToken = "E7DCCC527ABB7D5DB2FD";
		var downNewUrl ="http://47.104.220.221:8081/api/getDownUrl";
		var visitUrl = "http://183.192.162.101:8084";//这个是请求调用获取播放地址，这个地方是预览地址，后面直接传生产地址即可
		var getUrlParams={
                "uc":uc,
                "cid":cid,
                "userId":userId,
                "userToken":userToken,
                "visitUrl":visitUrl
		};
		$.ajax({
			type: "post",
			url: downNewUrl,
			contentType: "application/json;charset=utf-8",
			dataType:"json",
			data:JSON.stringify(getUrlParams),
			success: function (data) {
                    console.log("data"+JSON.stringify(data));
                    var download_data=[];//存储 获取下载地址的数据
                    if ("200" == data.code) {
                        var body =data.body;
                        for (var c in body){
                            if ("200" == body[c].code){
                                //解析文件大小，流地址
                                download_data.push(body[c]);
                            }
                            else if ("403" == body[c].code){
                                //TODO 表示拥护没有权限下载，提示用户需要收费
                                console.log("没有权限下载")
                            } else if("401" == body[c].code){
                                console.log("版权原因无法下载");
                                //TODO 这个一般是非大陆的ip，才会提示
                            }else if("404" == body[c].code){
                                console.log("未找到媒体文件");
                                //TODO 传的节目id有问题，传的是续集壳的节目id，不是续集集数的节目id
                            }
                        }
                    }
          var tmpurl ="";
          if(download_data.length>0)tmpurl = download_data[0].url;
					mycallback(null,tmpurl);
      }
      ,error:function(error){
				console.log("请求失败"+JSON.stringify(error));
				mycallback(error,"");
      }
    });
}