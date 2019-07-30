var $=require("../../jquery"),store=require("../../store"),config=require("../../config"),roomServer=require("../../server/room"),eventEmitter=require("../../eventEmitter");Component({properties:{answerDisplayTime:{type:Number,value:0}},data:{showQuiz:!1,url:""},methods:{msgHandler:function(e){roomServer.submitQuiz(e.detail.data[0])},getUrl:function(e,t){var n=[];return $.each(t,function(e,t){n.push(e+"="+t)}),encodeURI(e+"?"+n.join("&"))}},ready:function(){var r,o=this,e=getCurrentPages()[0],t="/"+o.getUrl(e.route,e.options);o.namespace=".quiz"+Math.random(),eventEmitter.on(eventEmitter.CLASSROOM_CONNECT_SUCCESS+o.namespace,function(){var e=store.get("env","");r=o.getUrl(config["QUIZ_PATH"+e],{env:e.replace("_",""),token:store.get("token"),room_id:store.get("class.id"),user_number:store.get("user.number"),user_name:store.get("user.name"),from_page:encodeURIComponent(t)}),roomServer.getQuiz()}).on(eventEmitter.QUIZ_START+o.namespace,function(e,t){o.setData({url:r+"&quiz_id="+t.quizId+"#"+encodeURIComponent(JSON.stringify(t))})}).on(eventEmitter.QUIZ_END+o.namespace,function(){o.setData({url:""})}).on(eventEmitter.QUIZ_RES+o.namespace,function(e,t){t.forceJoin&&t.quizId&&!t.endFlag&&$.isEmptyObject(t.solution)&&o.setData({url:r+"&quiz_id="+t.quizId+"#"+encodeURIComponent(JSON.stringify(t))})}).on(eventEmitter.QUIZ_SOLUTION+o.namespace,function(e,t){var n=o.data.answerDisplayTime;0<n&&(o.setData({url:r+"&quiz_id="+t.quizId+"#"+encodeURIComponent(JSON.stringify(t))}),setTimeout(function(){o.setData({url:""})},n))})},beforeDestroy:function(){eventEmitter.off(this.namespace)}});