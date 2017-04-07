function init(){
  var canvas = document.getElementById('canvas');

  var stage = new createjs.Stage('canvas');
  createjs.Touch.enable(stage);
  var loadQ = new createjs.LoadQueue();
  loadQ.addEventListener('complete',preload);
  loadQ.loadManifest([
    {'id':'num','src':'img/intro/num.png'},
    {'id':'loading','src':'img/intro/loading.png'},
    {'id':'logo','src':'img/intro/logo.png'},
    {'id':'alCir','src':'img/alert/circle.png'},
    {'id':'alTip','src':'img/alert/tip.png'},
    {'id':'alTxt','src':'img/alert/txt1.png'},
    {'id':'alTxt2','src':'img/alert/txt2.png'}
  ]);


  function preload(){
    var startState,orientationState,queue;
    var prev = 0;
    var logo;

    var alertPage = new createjs.Container();     //提示页面
    var preloadPage = new createjs.Container();   //载入页面
    var page0 = new createjs.Container();  //封面


    stage.addChild(page0,preloadPage,alertPage);  //层级布局

    if(window.innerWidth<window.innerHeight){   //载入状态后，先检查屏幕状态，然后进行事件
      canvas.width = 640;
      canvas.height = 1008;
      alertPage.visible = true;
      orientationState = 'portrait';
    }else if(window.innerWidth>window.innerHeight){
      canvas.width = 1080;
      canvas.height = 640;
      alertPage.visible = false;
      orientationState = 'landscape';
    }

    window.addEventListener( "orientationchange", function( event ) {   //判断横屏，还是竖屏
      if(orientationState=='landscape'){
        canvas.width = 640;
        canvas.height = 1008;
        alertPage.visible = true;
        orientationState = 'portrait'
        console.log(orientationState);
      }else if(orientationState=='portrait'){
        canvas.width = 1008;
        canvas.height = 640;
        alertPage.visible = false;
        orientationState = 'landscape'
      }
    });

    (function confirm(){   //提示横屏页面
      var bg = new createjs.Shape();
      bg.graphics.beginFill('black').drawRect(0,0,640,1008);
      var mobileSheet = new createjs.SpriteSheet({
        'images':['img/alert/tip.png'],
        'frames':{
          'width':1000/5,
          'height':600/3,
          'count':14
        },
        'animations':{
          'mobileRun':[0,13,'mobileRun',0.3]
        }
      });
      var mobile = new createjs.Sprite(mobileSheet,'mobileRun');
      mobile.x = 640/2 - 200/2;
      mobile.y = 1008/2 - 200/2;
      var circle = new createjs.Bitmap(loadQ.getResult('alCir'));
      circle.regX = 250/2;
      circle.regY = 250/2;
      circle.x = 640/2 ;
      circle.y = 1008/2 ;
      createjs.Tween.get(circle,{'loop':true}).to({'rotation':360},5000);
      var text = new createjs.Bitmap(loadQ.getResult('alTxt'));
      text.x = 640/2 - 428/2;
      text.y = 1008/2 - 280;
      var textMin = new createjs.Bitmap(loadQ.getResult('alTxt2'));
      textMin.x = 640/2 - 245/2;
      textMin.y = 1008/2 - 220;
      alertPage.addChild(bg,mobile,circle,text,textMin);
      stage.update();
    })();

    (function start(){   //预加载页面
      startState = 'started';
      var firstNum = new createjs.SpriteSheet({
        images:['img/intro/num.png'],
        frames:{width:40,height:39,count:10},
        animations:{
          'run':[0,9,'run',0.1],
          'end':[9]
        }
      });
      var lastNum = new createjs.SpriteSheet({
        images:['img/intro/num.png'],
        frames:{width:40,height:39,count:10},
        animations:{
          'run':[0,9,'run',1],
          'end':[8]
        }
      });
      var first = new createjs.Sprite(firstNum,'run');
      var last = new createjs.Sprite(lastNum,'run');
      last.x = 44;
      var num = new createjs.Container();
      num.addChild(first,last);
      num.x = 1008/2 - 40/2;
      num.y = 640/2 - 40/2;

      var loadSheet = new createjs.SpriteSheet({
        'images':['img/intro/loading.png'],
        'frames':{
          'width':1800/9,
          'height':1000/5,
          'count':42
        },
        'animations':{
          'run':[0,41,'end',0.5],
          'end':[41]
        }
      })
      var load = new createjs.Sprite(loadSheet);
      logo = new createjs.Sprite(loadSheet,'end')
      load.x = 1008/2 - 1800/9/2;
      load.y = 640/2 - 1000/5/2;
      load.visible = false;
      var count = 0;
      var countRun = setInterval(function (){
        count++;
        if(count>=10){
          clearInterval(countRun);
          first.gotoAndPlay('end');
          last.gotoAndPlay('end');
          queue = new createjs.LoadQueue();
          createjs.Sound.alternateExtensions = ['mp3'];
          queue.installPlugin(createjs.Sound);
          queue.addEventListener('complete',content);
          queue.loadManifest(preloadList);
          function content(){
            createjs.Sound.play('bgMusic');  //play background music
            num.visible = false;
            load.visible = true;
            load.gotoAndPlay('run');
            setTimeout(function (){
              page0Fn();
            },4000);
          };
        };
      },40);
      preloadPage.addChild(num,load);
      stage.update();
    })();

    function page0Fn(){
        stage.removeChild(preloadPage);
        page0.a = new createjs.Bitmap(queue.getResult('page0a'));
        page0.a.y = 640 - 612;
        page0.a.x = 60;
        page0.txt = new createjs.Bitmap(queue.getResult('page0txt'));
        page0.txt.x = 1008/2;
        page0.txt.y = 100;
        page0.arrow = new createjs.Sprite(new createjs.SpriteSheet({
          'images':['img/0/arrow.png'],
          'frames':{
            width:'44',
            height:75/3,
            count:3
          },
          'animations':{
            'run':[0,2,'run',0.2]
          }
        }),'run');
        page0.arrow.x = 1008 - 20;
        page0.arrow.y = 640/2 - (75/3)/2;

        page0.addChild(logo,page0.a,page0.arrow,page0.txt);
        stage.update();
    };

    stage.addEventListener('stagemousedown',touchStart);

    function touchStart(){
        var dx;  //touch的步长
        source = new createjs.Point(stage.mouseX,stage.mouseY);
        stage.addEventListener('stagemousemove',touchMove);
        stage.addEventListener('stagemouseup',touchEnd);
        function touchMove(){
          dx = stage.mouseX - source.x ;
        }
        function touchEnd(){
          if(prev==0){
            if(page0.x<0){
              page0.x=0;
              stage.update();
              console.log(page0.x);
            }else{
            createjs.Tween.get(page0).to({x:dx},1000);
            }
            if(dx<0){
            createjs.Tween.get(page0.txt).to({x:1008/2-50},500);
            }else{
            createjs.Tween.get(page0.txt).to({x:1008/2+50},500);
            }
            stage.update();
          }
          stage.removeEventListener('stagemousemove',touchMove);
          stage.removeEventListener('stagemouseup',touchEnd);
        }
    };


  };

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick',function (){
    stage.update();
  });















};
