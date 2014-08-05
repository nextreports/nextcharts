
/*
 * Display a formatted value
 * 
 * Only value is mandatory to display it.
 * If previous is defined, an arrow up/down will be shown if value is bigger/less than previous.
 * Arrow's color is green or red, depending on shouldRise parameter:
 *   shouldRise=true -> up=green and down=red
 *   shouldRise=false -> up=red and down=green
 *   
 * up=true  (value>previous)
 * up=false (value<previous) 
 * 
 * shouldRise=true means up arrow will be green, otherwise down arrow will be green
 * 
 * titleAlignment can be center or alignToValue
 * 
 * { "title" : "Avg time in site",   
 *   "titleAlignment" : "center",
 *   "value" : "6m57s",    
 *   "previous" : "7m10s"  // or "5.35%"
 *   "up" : false,
 *   "shadow" : true,
 *   "titleColor" : "green",
 *   "valueColor" : "black",
 *   "previousColor" : "gray",
 *   "shouldRise" : true, 
 *   "background" : "white"
 * }  
 * 
 */
function display(id, myjson, zoom, useParentWidth) {
		
	if (useParentWidth) {			
		window.addEventListener('resize', resizeDisplayCanvas, false); 
	}
	
	drawDisplay(true);
	
	function drawDisplay(animate) {
		
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
		if (canHeight > canWidth) {
			canHeight = canWidth;
		}
		var valSize = canHeight/5;	
		var titleSize = canHeight/10;	
		
		var background = myjson.background;
		if (typeof background === "undefined") {	
			background = "white";
		}
		var shadow = myjson.shadow;
		if (typeof shadow === "undefined") {
			shadow = false;
		}	
		var value = myjson.value;
		if (typeof value === "undefined") {
			value = "NA";
		}	
		var valueColor = myjson.valueColor;
		if (typeof valueColor === "undefined") {
			valueColor = "black";
		}	
		var title = myjson.title;
		var titleColor = myjson.titleColor;
		if (typeof titleColor === "undefined") {
			titleColor = "black";
		}
		
		var titleAlignment = myjson.titleAlignment;
		if (typeof titleAlignment === "undefined") {
			titleAlignment = "alignToValue";
		}
		
		var previous = myjson.previous;
		
		ctx.clearRect(0, 0, can.width, can.height);
		ctx.fillStyle = background; 	
		ctx.fillRect(0,0,can.width, can.height);	
		
		if (shadow) {
			ctx.shadowColor = "rgba(0,0,0,0.15)";
			ctx.shadowOffsetX = 3; 
			ctx.shadowOffsetY = 3; 
			ctx.shadowBlur = 2;
		}
				
		// draw value
		ctx.fillStyle = valueColor;
		ctx.font="bold " + valSize  + "px Arial";
		var xValue = canWidth/2-ctx.measureText(value).width/2;
		ctx.fillText(value,xValue,canHeight/2+valSize/4);
		
		// draw title
		if (typeof title !== "undefined") {
			ctx.fillStyle = titleColor;
			ctx.font="bold " + titleSize  + "px Arial";
			var xTitle = xValue;
			if (titleAlignment === "center") {
				xTitle = canWidth/2-ctx.measureText(title).width/2;
			}
			ctx.fillText(title,xTitle,2*titleSize);
		}
		
		// draw previous
		if (typeof previous !== "undefined") {
			var previousColor = myjson.previousColor;
			if (typeof previousColor === "undefined") {
				previousColor = "gray";
			}
			var up = myjson.up;
			if (typeof up === "undefined") {
				up = true;
			}		
			var shouldRise = myjson.shouldRise;
			if (typeof shouldRise === "undefined") {
				shouldRise = true;
			}			
			drawDisplayArrow(ctx, xValue+valSize/4, canHeight-2*titleSize, up, valSize, shouldRise);
			
			ctx.fillStyle = previousColor;
			ctx.font="bold " + valSize/2  + "px Arial";		
			ctx.fillText(previous,xValue+valSize/1.5,canHeight-2*titleSize+valSize/16);
		}
	}
	
	function resizeDisplayCanvas() {	
		var can = document.getElementById(id);
    	if (can != null) {
    		drawDisplay(false);
    	}
    }	
	
}

function drawDisplayArrow(c, dotX, dotY, up, size, shouldRise) {
	var d = size/1.5;
	c.beginPath();
	if (up) {
		c.moveTo(dotX-d/2, dotY+Math.sqrt(3)*d/6);
		c.lineTo(dotX, dotY-2*Math.sqrt(3)*d/6);
		c.lineTo(dotX+d/2, dotY+Math.sqrt(3)*d/6);
		c.lineTo(dotX-d/2, dotY+Math.sqrt(3)*d/6);
	} else {
		c.moveTo(dotX-d/2, dotY-2*Math.sqrt(3)*d/6);		
		c.lineTo(dotX+d/2, dotY-2*Math.sqrt(3)*d/6);
		c.lineTo(dotX, dotY+Math.sqrt(3)*d/6);
		c.lineTo(dotX-d/2, dotY-2*Math.sqrt(3)*d/6);		
	}
	c.closePath();
	
	var color = "red";	
	if ((shouldRise && up) || (!shouldRise && !up)) {
		color = "green";
	}
	c.fillStyle=color;
	c.fill();
	c.strokeStyle="gray";
	c.stroke();
}