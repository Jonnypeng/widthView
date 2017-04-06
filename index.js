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
    var startState,orientationState;

    var alertPage = new createjs.Container();
    var preloadPage = new createjs.Container();

    stage.addChild(preloadPage,alertPage);  //层级布局

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
        'run':[0,9,'run',0.01],
        'end':[0]
      }
    });
    var lastNum = new createjs.SpriteSheet({
      images:['img/intro/num.png'],
      frames:{width:40,height:39,count:10},
      animations:{
        'run':[0,9,'run',0.1],
        'end':[0]
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
    load.x = 1008/2 - 1800/9/2;
    load.y = 640/2 - 1000/5/2;
    load.visible = false;
    var count = 0;
    var countRun = setInterval(function (){
      count++;
      if(count>=90){
        clearInterval(countRun);
        first.gotoAndPlay('end');
        last.gotoAndPlay('end');
    num.visible = false;
    load.visible = true;
    load.gotoAndPlay('run');
      };
      //console.log(count);
    },40);
    preloadPage.addChild(num,load);
    stage.update();
  })();


  };

  createjs.Ticker.setFPS(24);
  createjs.Ticker.addEventListener('tick',function (){
    stage.update();
  });















};
