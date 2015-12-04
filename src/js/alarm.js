
/*
 * Alarm (status)
 * 
 * {
 * 		"text" : "Project is on track.",
 * 		"color" : "green",
 * 		"background" : "white",
 * 		"shadow" : true
 * }
 * 
 */
function alarm(id, myjson, zoom, useParentWidth) {
		
	if (useParentWidth) {			
		window.addEventListener('resize', resizeAlarmCanvas, false); 
	}
		
	drawAlarm(true);
	
	function drawAlarm(animate) {
		
		var can = document.getElementById(id);
		if (can == null) {
			return;
		}
		var ctx = can.getContext('2d');  	
		    
		if (zoom == true) {	  
		    can.width = $(window).width();
			can.height = $(window).height();	  
		}
		
		if (useParentWidth) {
			can.width = can.parentNode.offsetWidth;				 
		}
		
		var canWidth = can.width;
		var canHeight = can.height;		
		var textSize = canHeight/10;	
		
		var text = myjson.text;
		if (typeof text === "undefined") {
		    text = "";
		}
		
		var color = myjson.color;
		if (typeof color === "undefined") {
			color = "green";
		}
		
		var background = myjson.background;
		if (typeof background === "undefined") {	
			background = "white";
		}
		
		var shadow = myjson.shadow;
		if (typeof shadow === "undefined") {
			shadow = false;
		}	
		
		if (shadow) {
			ctx.shadowColor = "rgba(0,0,0,0.15)";
			ctx.shadowOffsetX = 3; 
			ctx.shadowOffsetY = 3; 
			ctx.shadowBlur = 2;
		}
		
		var size = canWidth;
		if (canHeight < canWidth) {
			size = canHeight;
		}
		var left = canWidth/20;        // left padding
		var x = Math.pow(size,1.1)/8;  // top-bottom padding
		var d = 2;                     // distance between circle and border
		var radius = (size - 2 * x) / 2;
		var fontSize = Math.log(size/20)*9;
		
		// clear canvas
		ctx.clearRect(0, 0, can.width, can.height);
		ctx.fillStyle = background; 	
		ctx.fillRect(0, 0, can.width, can.height);	
		    
		//text
		ctx.fillStyle = "black";
		ctx.font=fontSize  + "px Arial";
		
		var xText = 3*left/2+ 2*radius;
		var yText = canHeight/2+ fontSize/4;
		var textWidth = ctx.measureText(text).width + left;  
		var lines = new Array();
				
		if (xText + textWidth > canWidth) {				
			// text fills multiple lines		
			var res = text.split(" ");
			var words = res.length;
			var line = "";
			for (var k=0; k<words; k++) {				
				var sline = line + res[k] + " ";
				var accWidth = ctx.measureText(sline).width + left;
				if (xText + accWidth > canWidth) {
					lines.push(line);				
					line = res[k] + " ";				
				} else {
					line = sline;
				}
			}		
			lines.push(line);
			var linesNo = lines.length;
			var odd = ((linesNo % 2) != 0);
			var mid = Math.floor(linesNo/2);		
			
			if (odd) {
				for (var line=0; line<mid; line++) {
					var y = yText -(mid-line)*fontSize  ;					
					ctx.fillText(lines[line],xText,y);
				}
				ctx.fillText(lines[mid],xText,yText);
				for (var line=mid+1; line<linesNo; line++) {
					var y = yText  + (line-mid)*fontSize ;					
					ctx.fillText(lines[line],xText,y);
				}	
			} else {
				for (var line=0; line<mid; line++) {
					var y = yText - fontSize/2-(mid-line-1)*fontSize  ;					
					ctx.fillText(lines[line],xText,y);
				}	
				for (var line=mid; line<linesNo; line++) {
					var y = yText  + fontSize/2 + (line-mid)*fontSize ;					
					ctx.fillText(lines[line],xText,y);
				}	
			}				
			
		} else {
			// single line of text
			ctx.fillText(text,xText,yText);
		}
		
		//reset shadow
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0; 
		ctx.shadowOffsetY = 0; 
				
		// animate using jQuery
		var x = left+radius;
		var y = canHeight/2;
		var r = radius;
		var from = 1;
		var to = r-2*d;		
		var grd = ctx.createLinearGradient(left, canHeight/2-radius/2*Math.sin(3*Math.PI/8), left+2*radius, canHeight/2+radius*Math.sin(3*Math.PI/8));
		grd.addColorStop(0, "white");    
		grd.addColorStop(1, color); 
		if (animate) {
		    $({ n: from }).animate({ n: to}, {
		       duration: 1000,    
		       step: function(now, fx) {
		          drawAlarmCircle(id,x,y,now,d, grd);       
		       },
		       complete: function() {
		    	   
		       }
		    }); 
		} else {
			drawAlarmCircle(id,x,y,to,d, grd); 
		}
	}
    
    function drawAlarmCircle(id,x,y,r,d,grd) {
    	
    	if (r <= 0) {
    		return;
    	}
    	
    	var can = document.getElementById(id);
    	var ctx = can.getContext('2d');  
    	
    	// clear circle (a little bigger)
    	ctx.beginPath();
    	ctx.arc(x,y,r+2,2* Math.PI , 0, false);
    	ctx.closePath();
    	ctx.fillStyle="white";
    	ctx.fill();
    	
    	// outer circle
    	ctx.strokeStyle = "gray";  
    	ctx.beginPath();
    	ctx.arc(x,y,r,2* Math.PI , 0, false);
    	ctx.closePath();    	
    	ctx.stroke();     	
    	
    	// inner circle
    	if (r > 2*d) {
	    	ctx.beginPath();	
	    	ctx.arc(x,y,r-2*d,2* Math.PI , 0, false);
	    	ctx.closePath();
	    	ctx.stroke(); 			
	    	ctx.fillStyle = grd;
	    	ctx.fill();
    	}
    }
    
    function resizeAlarmCanvas() {	   
    	var can = document.getElementById(id);
    	if (can != null) {
    		drawAlarm(false);
    	}
    }	        
			
}

