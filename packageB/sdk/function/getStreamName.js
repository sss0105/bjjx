var live=require("../server/live"),userData=require("../data/user");module.exports=function(e){return userData.isAudioSpeex(e)||!e.audioOn&&!e.videoOn?"":live.getDownlinkStreamName(e.id,e.publishIndex)};