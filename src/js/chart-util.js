// This function starts by creating a dummy <canvas> element which is never 
// attached to the page, so no one will ever see it. 
// As soon as we create the dummy <canvas> element, we test for the presence 
// of a getContext() method. This method will only exist if browser supports the canvas API.
// Finally, we use the double-negative trick to force the result to a Boolean value (true or false). 
function isCanvasEnabled() {
	return !!document.createElement('canvas').getContext;
}


function getParentWidth(id) {
	return document.getElementById(id).parentNode.offsetWidth;
}

function getWidth(element) {
	return element.offsetWidth;
}


function niceNum(range, round) {
    var exponent; /** exponent of range */
    var fraction; /** fractional part of range */
    var niceFraction; /** nice, rounded fraction */

    exponent = Math.floor(getBaseLog(10, range));
    fraction = range / Math.pow(10, exponent);

    if (round) {
      if (fraction < 1.5)
        niceFraction = 1;
      else if (fraction < 3)
        niceFraction = 2;
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    } else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}

//returns the logarithm of y with base x
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function calculateYStep(min, max, tickCount) {     
	if (min == max) {		
		max = min + 1;
	}
    var range = niceNum(max - min, false);      
    var tickSpacing = niceNum(range / (tickCount - 1), true);            
    var minValY = Math.floor(min / tickSpacing) * tickSpacing;
    var maxValY = Math.ceil(max / tickSpacing) * tickSpacing;    
    if ((minValY == min) && (minValY != 0)) {
    	minValY = minValY - tickSpacing;
    }
    return { minValY: minValY, maxValY: maxValY, yStep:(maxValY - minValY)/tickCount};    
}

function getMousePos(canvas, evt) {    
	// use jquery to be browser independent when computing scrollLeft and scrollTop
	var root = $(window);	
    // return relative mouse position
	var parent = $(canvas).parent();
	var mouseX, mouseY;
	if (parent.is('body')) {
	    mouseX = evt.clientX - canvas.offsetLeft  + root.scrollLeft();
	    mouseY = evt.clientY - canvas.offsetTop + root.scrollTop(); 
	} else {
		mouseX = evt.clientX - parent.offset().left  + root.scrollLeft();
		mouseY = evt.clientY - parent.offset().top  + root.scrollTop();
	}
   
    return {
       x: mouseX,
       y: mouseY
    };
}  

function posTop() {
    return typeof window.pageYOffset != 'undefined' ? window.pageYOffset: document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop? document.body.scrollTop:0;
}


function posLeft() {
    return typeof window.pageYOffset != 'undefined' ? window.pageYOffset: document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop? document.body.scrollTop:0;
}


// mousePos and tooltip are defined outside function implementation
var handleMouseEvent = {
		
  execute:function (canvas, tipCanvas, evt) {
		
	var tipCtx = tipCanvas.getContext('2d');			
	
    tipCanvas.style.left = (canvas.offsetLeft + this.mousePos.x) + "px";
    tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);    
    var textWidth = tipCtx.measureText(this.tooltip).width;
      
    var x = tipCanvas.width/2 - textWidth/2; 
    // gap between mouse cursor and tooltip
    var hgap = 40;
    var lines = this.tooltip.split("<br>");
    if (lines.length == 1) {   
    	// a single line of text (do not need to modify tipCanvas height)
        tipCanvas.width = textWidth + 20;
        tipCanvas.height = 25;
        x = tipCanvas.width/2 - textWidth/2;         
        tipCtx.fillText(this.tooltip, x, 15);
    } else {
    	// more lines inside tooltip we should compute canvas width and height
    	var rowsH = (lines.length-1)*12;
    	tipCanvas.height = 25 + rowsH;
    	hgap += rowsH;
    	var lineMaxWidth = 0;
    	for(var i=0; i < lines.length; i++) {    		
    		var lineWidth = tipCtx.measureText(lines[i]).width;
    		if (lineWidth > lineMaxWidth) {
    			lineMaxWidth = lineWidth;
    		}
    	}    		
    	if (tipCanvas.width <= lineMaxWidth) {
            tipCanvas.width = lineMaxWidth + 20;
        }    
    	x = tipCanvas.width/2 - lineMaxWidth/2;    
    	for(var i=0; i < lines.length; i++) {
    		tipCtx.fillText(lines[i], x, 15 + i*12);    		
    	}
    }
    // if tipCanvas surpasses canvas space then make it not to 
    var endTipCanvas = tipCanvas.offsetLeft + tipCanvas.width;
    var endCanvas = canvas.offsetLeft + canvas.width;    
    if (endTipCanvas > endCanvas) {
    	tipCanvas.style.left = tipCanvas.offsetLeft - (endTipCanvas-endCanvas) + "px";
    }
    
    tipCanvas.style.top = (canvas.offsetTop + this.mousePos.y - hgap) + "px";
    if (this.tooltip == "") {
       tipCanvas.style.left = "-2000px";
    }
	
  }
};

function drawEllipseByCenter(ctx, cx, cy, w, h) {
	drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawUpperEllipseByCenter(ctx, cx, cy, w, h) {
	drawUpperEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
	var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle
	
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
}

function drawUpperEllipse(ctx, x, y, w, h) {
	var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
}

function findControlPoint(s1, s2, s3) {
    var // Unit vector, length of line s1,s3
        ux1 = s3.x - s1.x,
        uy1 = s3.y - s1.y,
        ul1 = Math.sqrt(ux1*ux1 + uy1*uy1),
        u1 = { x: ux1/ul1, y: uy1/ul1 },
 
        // Unit vector, length of line s1,s2
        ux2 = s2.x - s1.x,
        uy2 = s2.y - s1.y,
        ul2 = Math.sqrt(ux2*ux2 + uy2*uy2),
        u2 = { x: ux2/ul2, y: uy2/ul2 },
 
        // Dot product
        k = u1.x*u2.x + u1.y*u2.y,
 
        // Project s2 onto s1,s3
        il1 = { x: s1.x+u1.x*k*ul2, y: s1.y+u1.y*k*ul2 },
 
        // Unit vector, length of s2,il1
        dx1 = s2.x - il1.x,
        dy1 = s2.y - il1.y,
        dl1 = Math.sqrt(dx1*dx1 + dy1*dy1),
        d1 = { x: dx1/dl1, y: dy1/dl1 },
 
        // Midpoint
        mp = { x: (s1.x+s3.x)/2, y: (s1.y+s3.y)/2 },
 
        // Control point on s2,il1
        cpm = { x: s2.x+d1.x*dl1, y: s2.y+d1.y*dl1 },
 
        // Translate based on distance from midpoint
        tx = il1.x - mp.x,
        ty = il1.y - mp.y,
        cp = { x: cpm.x+tx, y: cpm.y+ty };
 
    return cp;
}

// draw a curve through three points
function drawCurve(ctx, p1, p2, p3) {   
   var cp = findControlPoint(p1, p2, p3);    
   ctx.moveTo(p1.x, p1.y);
   ctx.quadraticCurveTo(cp.x,cp.y,p3.x,p3.y);   
}

function formatNumber(num, decimals, decimalSeparator, thousandSeparator) {
	 var nStr = num.toFixed(decimals);
	 nStr = nStr.replace('.', decimalSeparator);
	 return addThousandSeparator(nStr, decimalSeparator, thousandSeparator);
}

function addThousandSeparator(nStr, decimalSeparator, thousandSeparator) {
	nStr += '';
	x = nStr.split(decimalSeparator);
	x1 = x[0];
	x2 = x.length > 1 ? decimalSeparator + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + thousandSeparator + '$2');
	}
	return x1 + x2;
}

function getParameterValueFromURL(url, name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( url ); 
	if( results == null ) return "";  
	else return results[1];
}

function isPercent(value) {
	if (value === undefined) {
		return false;
	}
	var index = value.indexOf("%");
	if (index == value.length-1) {
		return true;
	}
	return false;
}

function find(array, v) {
	for (i=0;i<array.length;i++){
		if (array[i]==v) return i;
	}
	return false;
}



