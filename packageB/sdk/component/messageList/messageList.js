var chatServer=require("../../server/chat"),stringifyTime=require("../../function/stringifyTime"),isSameChannel=require("../../function/isSameChannel"),util=require("../../util"),config=require("../../config"),userData=require("../../data/user"),parser=require("../../parser"),$=require("../../jquery"),string=require("../../string"),eventEmitter=require("../../eventEmitter"),auth=require("../../auth"),store=require("../../store"),language=require("../../language/main")(),info=require("../../info"),getDocumentImageDimension=require("../../function/getDocumentImageDimension");function isSelf(e){return e.number===store.get("user.number")}function needDivider(e,t){var a=2*config.MINUTE;if(a)return!t||e.time-t.time>a}$.extend(language,require("./language/main")()),Component({properties:{channel:{type:"string"},maxCount:{type:"number",value:200},historySize:{type:"number",value:10},shortContentSize:{type:"number",value:80},styleInfo:{type:"Object",value:{messageBackground:"white",fromColor:"#9E9DA0",contentColor:"black"}}},data:{data:[],language:language,hasMore:!0,fetching:!1,showImageMask:!1,zoomImage:{}},ready:function(){var n=this;n.namespace=".message_list"+Math.random();var i=function(e){var t=e&&e.content;if(t&&util.is.string(t))return 0<=t.indexOf("<img ")},r=function(){};eventEmitter.on(eventEmitter.MESSAGE_PULL_RES+n.namespace,function(e,t){if(n.isSameChannel(t.channel)){n.setData({fetching:!1,hasMore:t.hasMore});n.data.data.length;util.array.each(t.messageList,function(e){i(n.prependMessage(e))&&!0})}}).on(eventEmitter.MESSAGE_RECEIVE+n.namespace,function(e,t){var a;n.isSameChannel(t.channel)&&(a=n.appendMessage(t))&&i(a)&&r()}).on(eventEmitter.MESSAGE_LIST_CLEAR+n.namespace,function(e,t){n.isSameChannel(t.channel)&&n.set("data",[])}),n.fetchMore()},methods:{fetchMore:function(e){var t=this,a=t.data,n=chatServer.socket;n&&n.isOpen()?a.hasMore&&!a.fetching&&(t.setData({fetching:!0}),eventEmitter.trigger(eventEmitter.MESSAGE_PULL_REQ,{channel:a.channel,count:a.historySize,next:e})):t.waiting||(t.waiting=!0,eventEmitter.one(eventEmitter.CHAT_SERVER_LOGIN_SUCCESS,function(){t.waiting=!1,t.fetchMore(e)}))},validate:function(e){return $.trim(e.content)&&e.from.status===config.USER_STATUS_ONLINE},format:function(e){var t,a,n=this,i=e.from,r=e.data,o=e.content,s=e.custom,u=e.to;n.data.renderContent;var m,g,h=(m=$.extend(!0,{},i),g=m.type,(auth.isTeacher(g)||auth.isAssistant(g))&&(m.roleName="teacher"),auth.isStudent(g)&&(m.roleName="student"),isSelf(i)&&(m.name=language.ME,m.roleName="self"),m);if(u){var c=userData.find(u);c&&(t=c.name)}if(!s)if(r&&r.type)e.type=r.type,"emoji"===r.type?(e.key=r.key,e.url=r.url||parser.getEmojiUrlByKey(r.key)):"image"===r.type&&(e.url=r.url,e.height=r.height,e.width=r.width),a=o="";else if(e.type="text",o=$.trim(o),parser.isPureText(o)){var d=auth.isSelf(i.id)?language.ME:h.name,f=string.size(d);a=string.cut(o,n.data.shortContentSize-(12<f?12:f))}else{var l=parser.parseEmoji(o);l.url&&(e.url=l.url,e.type="emoji");var v=parser.parseImage(o);v&&(e.url=v,e.type="image"),a=""}var p=e.channel;return"string"!==$.type(p)&&(p=$.type(p)),r={id:e.id,type:e.type,url:e.url,number:p+(e.id||""+Math.random()),user:h,receiver:t,time:e.time?1e3*e.time:$.now(),custom:s,content:o,key:e.key,width:e.width,height:e.height,shortContent:a,fromColor:n.data.styleInfo.fromColor}},prependMessage:function(e){var t=this;if(t.validate(e)){var a=t.data.data,n=a[0];if(!n||e.id!=n.id)return e=t.format(e),a.unshift(e),t.setData({data:a}),t.triggerEvent("addMessage",{message:e}),e}},appendMessage:function(e){var t=this;if(t.validate(e)){var a=t.data.data,n=a[a.length-1];if(e.to!==config.MESSAGE_TO_ALL||!n||e.id!=n.id){(e=t.format(e)).needDivider=needDivider(e,a[a.length]),a.push(e);var i=t.data.maxCount;return 0<i&&a.length>i&&(a=a.slice(1)),t.setData({data:a}),t.triggerEvent("addMessage",{message:e}),e}}},isSameChannel:function(e){return isSameChannel(this.data.channel,e)},onImageMaskTap:function(){this.setData({showImageMask:!1})},onZoomImageError:function(){info.alert("image load fail"),info.hideLoading()},onZoomImageLoad:function(){info.hideLoading()},imageTap:function(e){var t=e.target.dataset,a=wx.getSystemInfoSync(),n=(this.data.zoomImage.url,getDocumentImageDimension(a.windowWidth,a.windowHeight,t.width,t.height,config.DOC_FIT_VIEW,!0,1));this.setData({showImageMask:!0,zoomImage:{url:t.src+"?v="+(new Date).getTime(),width:n.width,height:n.height}})}}});