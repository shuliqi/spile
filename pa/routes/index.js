var express = require('express');
  var router = express.Router();
  var http = require('http');
  var cheerio = require('cheerio');
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: '简单nodejs爬虫' });
   });
 router.get('/getJobs', function(req, res, next) { // 浏览器端发来get请求
 var page = req.query.page;  //获取get请求中的参数 page
 console.log("page: "+page);
 // var Res = res;  //保存，防止下边的修改
 //url 获取信息的页面部分地址
 var url = 'http://greenfavo.com/page/'+ page +'/';
 
 // http.get(url+page,function(res){  //通过get方法获取对应地址中的页面信息
 //     var chunks = [];
 //     var size = 0;
 //     res.on('data',function(chunk){   //监听事件 传输
 //         chunks.push(chunk);
 //        size += chunk.length;
 //        console.log("1")
 //     });
 //     res.on('end',function(){  //数据传输完
 //         // var data = Buffer.concat(chunks,size); 
 //         console.log(data); 
 //         // var html = data.toString();
 //     //    console.log(html);
 //         var $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
 //         var jobs = [];
 //         console.log("2");
 //         var jobs_list = $(".item_con_list li");
 //         $(".item_con_list>li").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
 //             console.log("3");
 //             var job = {};
 //             job.company = $(this).find(".company div").eq(0).find("a").html(); //公司名
 //             job.period = $(this).find(".company div").eq(1).html(); //阶段
 //             // job.scale = $(this).find(".hot_pos_r span").eq(2).html(); //规模
          
 //             job.name = $(this).attr("data-positionname"); //岗位名
 //             job.src = $(this).find(".position a").attr("href"); //岗位链接
 //             // job.city = $(this).find(".hot_pos_l .c9").html(); //岗位所在城市
 //             job.salary = $(this).find(".position span").eq(1).html(); //薪资
 //             job.exp = $(this).find("li_b_l").html(); //岗位所需经验
 //             job.time = $(this).find(".position span").eq(0).html(); //发布时间
 //             console.log("4");
 //             console.log(job.name);  //控制台输出岗位名
 //             jobs.push(job);  
 //         });
 //        Res.json({  //返回json格式数据给浏览器端
 //             jobs:jobs
 //         });
 //     });
 // }); 


download(url, function(data) {
    console.log(url);
    if (data) {
        console.log("有数据")
        var $ = cheerio.load(data);
        var jobs = [];
        // var jobs_list = $(".left section");
        $(".left section").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
            var job = {};
            job.title = $(this).find("h2 a").text(); //标题
            job.img = $(this).find("img").attr("src"); //图片地址
            job.jianjie = $(this).find(".entry p").eq(1).text(); //简介
            job.more = $(this).find(".more a").attr("href"); //更多
            console.log(job.title);  //控制台输出岗位名
            jobs.push(job); 
            // console.log(jobs);
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