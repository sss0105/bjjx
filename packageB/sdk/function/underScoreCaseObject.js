var $=require("../jquery"),underScoreCase=require("./underScoreCase");function underScoreCaseObject(e){var c=$.isArray(e)?[]:{};return $.each(e,function(e,r){($.isPlainObject(r)||$.isArray(r))&&(r=underScoreCaseObject(r)),c[underScoreCase(e)]=r}),c}module.exports=underScoreCaseObject;