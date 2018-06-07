window.onload = function() {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");

var rads, center_x, center_y, radius, radius_old, deltarad, shockwave,
  bars, bar_x, bar_y, bar_x_term, bar_y_term, bar_width;
bars = 200;
react_x = 0;
react_y = 0;
radius = 0;
deltarad = 0;
shockwave = 0;
rot = 0;
intensity = 0;

var alpha = 0.5,   /// current alpha value
    delta = 0.01;
    oldpos_x =0;
    oldpos_y =0;
    oldsize =0;
  file.onchange = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();

    var context = new (window.AudioContext || window.webkitAudioContext)();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();    

    src.connect(analyser);
    analyser.connect(context.destination);

    var bufferLength = analyser.frequencyBinCount*44100/context.sampleRate|0;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);
    console.log(dataArray)
    var img=new Image()
    img.src="osulogo.png"
    var imgbg=new Image()
    imgbg.src="menu-background-2.jpg"
    function frameLooper() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
      // grd.addColorStop(0, "rgba(180, 140, 230, 1)");
      // grd.addColorStop(1, "rgba(102, 102, 255, 1)");
      ctx.drawImage(imgbg,0,0, canvas.width, canvas.height);

      // ctx.fillStyle = grd;
      // ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "rgba(255, 255, 255, " + (intensity * 0.0000125 - 0.4) + ")";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
        
      // rot = rot + intensity * 0.0000001;
      react_x = 0;
      react_y = 0;
            
      intensity = 0;
            
      analyser.getByteFrequencyData(dataArray);
      for(var j = 0; j < 5; j++){
        for(var i = 0;i < bars/5;i++){
          rads = Math.PI * 2 / bars;
          bar_height =dataArray[Math.round(bufferLength*(i+bars/5+j)/bars)]*0.5;
          // console.log(dataArray[Math.round(bufferLength*(i+bars/5*j)/bars)])
          bar_width = 8;
          bar_x = center_x;
          bar_y = center_y;        
          bar_x_term = center_x + Math.cos(rads * (i+bars/5*j) + rot) * (radius + bar_height) ;
          bar_y_term = center_y + Math.sin(rads * (i+bars/5*j) + rot) * (radius + bar_height) ;
          ctx.save();
                
          var lineColor = "rgba(255,255,255,0.5)";
                  
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = bar_width;
          ctx.beginPath();
          ctx.moveTo(bar_x,bar_y );
          ctx.lineTo(bar_x_term, bar_y_term);
          ctx.stroke();
                
          react_x += Math.cos(rads * i + rot) * (radius + bar_height);
          react_y += Math.sin(rads * i + rot) * (radius + bar_height);
                
          intensity += bar_height*3;
        }
      }
            
      center_x = canvas.width / 2 ;
      center_y = canvas.height / 2 ;
            
      radius_old = radius;
      radius =  300 + (intensity * 0.001);
      deltarad = radius - radius_old;
            
      ctx.fillStyle = "rgba(253, 123, 181,1)";
      ctx.beginPath();
      ctx.arc(center_x, center_y, radius + 2, 0, Math.PI * 2, false);
      
      ctx.fill();
      var size=(radius + 16);
      ctx.drawImage(img,center_x-size, center_y-size, size*2,size*2);
      var stepx = oldpos_x - (center_x-size);
      var stepy = oldpos_x - (center_y-size);
      alpha -= delta;
      if (alpha>=0 && oldpos_x !=0 && oldpos_y !=0) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(img,oldpos_x, oldpos_y, oldsize,oldsize);
      }else{
        alpha=0.4
        oldpos_x = center_x-size;
        oldpos_y = center_y-size;
        oldsize = size*2;
      }
      
      // shockwave effect     
      shockwave += 60;
            
      // ctx.lineWidth = 15;
      // ctx.strokeStyle = "rgb(255, 255, 255)";
      // ctx.beginPath();
      // //ctx.arc(center_x, center_y, shockwave + radius, 0, Math.PI * 2, false);
      // ctx.stroke();
            
            
      if (deltarad > 15) {
        shockwave = 0;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        rot = rot + 0.4;
      }
      requestAnimationFrame(frameLooper);
    }
    audio.play();
    frameLooper();
  };
  
};