var eventEmitter=require("../../eventEmitter"),userData=require("../../data/user"),store=require("../../store"),info=require("../../info"),$=require("../../jquery"),auth=require("../../auth"),language=require("../../language/main")(),hasTiped=!1;$.extend(language,require("./language/main")()),Component({properties:{showName:{type:Boolean,value:!0},styleInfo:{type:Object,value:{fontSize:12}},stopPlay:{type:Boolean,value:!1},fullScreen:{type:Boolean,value:!1},coverImage:{type:String,value:"/sdk/component/player/image/closeCamera.png"}},data:{userInfo:{}},ready:function(){var n=this;hasTiped=!1,eventEmitter.on(eventEmitter.MEDIA_PUBLISH,function(e,t){var a=t.user;auth.isTeacher(a.type)&&(n.setData({userInfo:a}),n.triggerEvent("setUserInfo",{user:a}))}).on(eventEmitter.MEDIA_REPUBLISH,function(e,t){var a=t.user;auth.isTeacher(a.type)&&(n.setData({userInfo:a}),n.triggerEvent("setUserInfo",{user:a}))}).on(eventEmitter.USER_OUT,function(e,t){var a=t.user;auth.isTeacher(a.type)&&(a.audioOn=!1,a.videoOn=!1,a.name="",a.canPlay=!userData.isAudioSpeex(a),n.setData({userInfo:a}),n.triggerEvent("setUserInfo",{user:a}))})},methods:{onPlayerTap:function(e){console.log("on teacher player tap");this.triggerEvent("teacherPlayerTap",e.detail)},onPlayerAVStatusChange:function(e){var t=e.detail.changeInfo,a="";console.log("onPlayerAVStatusChange"),console.log(t),!0===t.audioTo&&hasTiped&&(a=language.TEACHER_OPEN_AUDIO),!1===t.audioTo&&(a=language.TEACHER_CLOSE_AUDIO),!1===t.videoTo&&hasTiped&&(a=language.TEACHER_CLOSE_VIDEO),!0===t.videoTo&&(a=language.TEACHER_OPEN_VIDEO),a&&info.tip(a),hasTiped||(hasTiped=!0),this.triggerEvent("AVStatusChange",e.detail)},onSupportedChanged:function(e){this.triggerEvent("isSupportedChanged",e.detail)},onNetStatus:function(e){this.triggerEvent("netStatus",e.detail)}}});