var express = require('express');
  var router = express.Router();
  var http = require('http');
  var cheerio = require('cheerio');
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: '哆啦A梦-叮当猫' });
   });
 router.get('/getJobs', function(req, res, next) { // 浏览器端发来get请求
 var page = req.query.page;  //获取get请求中的参数 page
 console.log("page: "+page);
 // var Res = res;  //保存，防止下边的修改
 //url 获取信息的页面部分地址
 var url = null;
 if (page == 1) {
     url =  'http://greenfavo.com/';
 }else{
     url = 'http://greenfavo.com/page/'+ page +'/';
 }
download(url, function(data) {
    console.log(url);
    if (data) {
        var $ = cheerio.load(data);
        var jobs = [];
        // var jobs_list = $(".left section");
        $(".left section").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
            var job = {};
            job.title = $(this).find("h2 a").text(); //标题
            job.img = $(this).find("img").attr("src"); //图片地址
            job.jianjie = $(this).find(".entry p").eq(1).text(); //简介
            job.more = $(this).find(".more a").attr("href"); //更多
            download(job.more,function(date){
               var $ = cheerio.load(data);
               var text = {}
               var se = $(".left section").eq(0);
                  text.title = se.find("h2").text();
                  text.content = se.find(".entry").text();
              // job.push(text); 
              console.log(text);
            })
            jobs.push(job); 
        });
        res.json({  //返回json格式数据给浏览器端
             jobs:jobs
         });
    }
});
});


function download(url, callback) {

  http.get(url, function(res) {

    var data = "";

    res.on('data', function (chunk) {

      data += chunk;

    });

    res.on("end", function() {

      callback(data);

    });

  }).on("error", function() {

    callback(null);

  });
}
 module.exports = router;