/*
 * Json must contain as mandatory only "data" attribute 
 * 
 * type -> piechart
 * message -> can have two markups #val for value, #percent for percent, #total for total value, #x for x label
 *         -> can contain <br> to split text on more lines
 * showLabels -> true means labels are shown on pie with lines; we can use false if we want to show them in message tooltip with #x        
 * title.alignment -> center, left, right
 * onClick -> is a javascript function like 'function doClick(value){ ...}'  *            
 * 
 * { "type": "pie",     
 *   "background" : "white",
 * 	 "data": [[ 16, 66, 24, 30, 80, 52 ]], 
 *   "labels": ["JANUARY","FEBRUARY","MARCH","APRIL","MAY", "JUNE"],     
 *   "color": ["#004CB3","#A04CB3", "#7aa37a", "#f18e9f", "#90e269", "#bc987b"],   
 *   "alpha" : 0.8,
 *   "showLabels": true,    
 *   "message" : "Value \: #val",     
 *   "title" : {
 *   	"text": "Analiza financiara", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "#000000",
 *      "alignment":"left"
 *   },    
 *   "xData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "tooltipPattern" : {
 *   	"decimals": 2,
 *   	"decimalSeparator" : ".",
 *      "thousandSeparator" : ","
 *   },
 *   "onClick : "function doClick(value){console.log("Call from function: " + value);}"
 * }
 * 
 */

var pieChart = function(myjson, idCan, idTipCan, canWidth, canHeight) {

var obj;
var data;
var labels; 
var globalAlpha;
var showLabels;
var background;
var message;
var chartType;
var seriesColor;
var titleSpace = 0;
var realWidth;
var realHeight;
var canvas;  
var c; 
var tipCanvas;
var H = 6;
var line = 20;
var hline = 5;
var resizeWidth = false;
var resizeHeight = false;
// position computed if labels are outside canvas; used to shrink the radius
var delta = 0;
//by default chart title and legends strings have a defined font size
//if we want to have font size scaled accordingly with chart width then this property must be true 
//(such example may be when we want to show the chart on a big monitor)
var adjustableTextFontSize = false;

function drawPie(myjson, idCan, idTipCan, canWidth, canHeight) {	
			
	canvas = document.getElementById(idCan);  
	if (canvas == null) {
		return;
	}
	tipCanvas = document.getElementById(idTipCan);
	c = canvas.getContext('2d');
	
	obj = myjson;
	chartType = obj.type;
	if (typeof chartType === "undefined") {
	    chartType = "pie";
	}		
					
	background = obj.background;
	if (typeof background === "undefined") {	
		background = "white";
	}			
	
	data = obj.data[0];	
	// prevent negative values
	for (var i=0; i<data.length; i++) {
		if (data[i] < 0) {					
			data[i] = 0;
		}
	}
	
	labels = obj.labels; 			
	
	globalAlpha = obj.alpha;
	if (typeof globalAlpha === "undefined") {
        globalAlpha = 0.8;
    }
	
	showLabels = obj.showLabels;
	if (typeof showLabels === "undefined") {
        showLabels = true;
    }
			
	message = obj.message;
	if (typeof message === "undefined") {		
		message = "#val / #total<br>#percent% of 100%";		
	}
	
	adjustableTextFontSize = obj.adjustableTextFontSize;
	if (typeof adjustableTextFontSize === "undefined") {
		adjustableTextFontSize = false;
	}	
					
	seriesColor = obj.color;
	if (typeof seriesColor === "undefined") {
		seriesColor = distinctHexColors(data.length);
    }    
	// if less colors than data are specified, append more of them
	if (seriesColor.length < data.length) {
		seriesColor = seriesColor.concat(distinctHexColors(data.length-seriesColor.length));
	}
        										
	updateSize(canWidth, canHeight);
    
    canvas.addEventListener('mousemove', 
			function(evt) { 
				var hme = Object.create(handleMouseEvent);
				hme.mousePos = getMousePos(canvas, evt);				
				hme.tooltip = getTooltip(hme.mousePos);		
				hme.execute(canvas, tipCanvas, evt); 
			}, 
			false);     
    
    canvas.addEventListener ("mouseout", 
    		function(evt) {
    			tipCanvas.style.left = "-2000px";
    		}, 
    		false);
    
    canvas.addEventListener("click", onClick, false);
       
    if (resizeWidth || resizeHeight) {
    	window.addEventListener('resize', resizeCanvas, false);
    }

	drawChart();
}

function updateSize(canWidth, canHeight) {
	if (canWidth !== undefined) {
		if (isPercent(canWidth)) {
			var percent = canWidth.substring(0, canWidth.length-1);			
			//canvas.width = window.innerWidth*percent/100;
			var cl = canvas.parentNode;			
			canvas.width = cl.offsetWidth*percent/100;				
			resizeWidth = true;
		} else {
			canvas.width = canWidth;
		}
	}	 
	if (canHeight !== undefined) {
		if (isPercent(canHeight)) {
			var percent = canHeight.substring(0, canHeight.length-1);
			canvas.height = window.innerHeight*percent/100;
			//var cl = canvas.parentNode;	
			//canvas.height = cl.offsetHeight*percent/100;
			resizeHeight = true;
		} else {
			canvas.height = canHeight;
		}
	}		
	realWidth = canvas.width;
	realHeight = canvas.height;	
}


function animDraw() {      
    if (drawIt(H)) {          		    
        return false;
    }    
    H += 1+(realHeight-titleSpace)/30;    
    window.requestAnimFrame(animDraw);      
}    


// function called repetitive by animation
function drawIt(H) {    		
	
	drawInit();
					
	var stop = drawData(true, false, "");		
	 				
	return stop;
}

// withFill = false means to construct just the path needed for tooltip purposes
function drawData(withFill, withClick, mousePos) {
	var font = c.font;
	    
	//draw data 
	c.lineWidth = 1.0;
	var stop = true;	
	
	var pieData = [];
	var cx;
	var cy;
	if (showLabels) {
		cx = realWidth-2*getMaxLabelWidth()-2*line-20;
		cy = realHeight-titleSpace-getLabelHeight()-2*line-20;
	} else {
		cx = realWidth-2*line-20;
		cy = realHeight-titleSpace-2*line-20;
	}
	var center = [realWidth / 2, (realHeight+titleSpace) / 2];	
	var radius = Math.min(cx, cy) / 2;
	if (radius < 0) {
		radius = 20;
	}
	var total = 0;
	var lastPosition = 0;
	// total up all the data for chart
	for (var i in data) { total += data[i]; }
	
	if (radius-delta < H) {
        H = radius-delta;
    } else {
        stop = false;
    } 
	
	// populate arrays for each slice
	for(var i in data) {
		pieData[i] = [];
		pieData[i]['value'] = data[i];
		var percent = data[i]*100/total;		
		pieData[i]['percent'] = Math.round(percent*100)/100;
		pieData[i]['startAngle'] = 2 * Math.PI * lastPosition;
		pieData[i]['endAngle'] = 2 * Math.PI * (lastPosition + (data[i]/total));
		pieData[i]['labelAngle'] = pieData[i]['startAngle'] + Math.abs(pieData[i]['endAngle']-pieData[i]['startAngle'])/2;
		pieData[i]['middle'] = [center[0]+H*Math.cos(pieData[i]['labelAngle']), center[1]+H*Math.sin(pieData[i]['labelAngle'])];
		pieData[i]['labelpos'] = [pieData[i]['middle'][0] + line*Math.cos(pieData[i]['labelAngle']) ,pieData[i]['middle'][1] + line*Math.sin(pieData[i]['labelAngle'])];	
		lastPosition += data[i]/total;
	}	
	delta = adjustYLabels(pieData, center, H+line);	
			    
	for(var i=0; i<data.length; i++) {  	  		 	  	    		   	    	    	    	     
	    
		if (withFill) {
		    var gradient = c.createLinearGradient( 0, 0, realWidth, realHeight );
			gradient.addColorStop( 0, "#ddd" );
			gradient.addColorStop( 1, seriesColor[i] );
	
			// draw slices
			c.beginPath();
			if (pieData.length > 1) {
				c.moveTo(center[0],center[1]);
			}				
			c.arc(center[0],center[1],H,pieData[i]['startAngle'],pieData[i]['endAngle'],false);
			if (pieData.length > 1) {
				c.lineTo(center[0],center[1]);
			}
			c.closePath();
			c.fillStyle = gradient;
			c.fill();			
			c.lineWidth = 1;
			c.strokeStyle = "#fff";
			c.stroke();	  			
		
			// draw Labels	
			if (typeof labels !== "undefined") {
				drawLabels(i, pieData);
			}
			
		} else {
	    		    		    	
	    	var fromCenterX = mousePos.x - center[0];
			var fromCenterY = mousePos.y - center[1];
			var fromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2 ));

			if (fromCenter <= radius-delta) {
				var angle = Math.atan2(fromCenterY, fromCenterX);
				if (angle < 0) angle = 2 * Math.PI + angle; // normalize

				for (var slice in pieData) {
					if (angle >= pieData[slice]['startAngle'] && angle <= pieData[slice]['endAngle']) {
						var tValue = pieData[slice]['value'];
						var tTotal = total;
			    		if (obj.tooltipPattern !== undefined) {
			    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
			    			tTotal = formatNumber(tTotal, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
			    		}	  	
			    		
			    		var returnValue;
			    		if (labels === undefined) {
			    			returnValue = "";
			    		} else {
			    			returnValue = labels[slice]; // tValue
			    		}
			    		if (withClick) {
			    			return returnValue;
			    		} else {
					    	var mes = String(message).replace('#val', tValue);
					    	mes = mes.replace('#x', returnValue);
					    	mes = mes.replace('#total', tTotal);
					    	mes = mes.replace('#percent', pieData[slice]['percent']);
					    	if (obj.onClick !== undefined) {
					    		canvas.style.cursor = 'pointer';
					    	}
					        return mes;
			    		}
					} else {
						canvas.style.cursor = 'default';
					}
				}
			}	
	    					   
	    }
	   
	}   	
		
	if (withFill) {
		return stop;
	} else {
		// empty tooltip message
		return "";
	}
}

function drawLabels(i, pieData) {
	
	if (showLabels) {
		var x = pieData[i]['middle'][0];
		var y = pieData[i]['middle'][1];
		var x1 = pieData[i]['labelpos'][0];
		var y1 = pieData[i]['labelpos'][1];	
		
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(x1, y1);
		
		var writeFrom = true;	
		if ((pieData[i]['labelAngle'] == Math.PI) || (pieData[i]['labelAngle'] == 2*Math.PI)) {
			// no horizontal line to draw	
			if ((pieData[i]['labelAngle'] == Math.PI) || (pieData.length == 1)) {
				writeFrom = false;
			}
		} else if (pieData[i]['labelAngle'] <= Math.PI/2) {		
			x1 = x1+hline;				
		} else if (pieData[i]['labelAngle'] < Math.PI) {
			x1 = x1-hline;
			writeFrom = false;
		} else if (pieData[i]['labelAngle'] <= 3*Math.PI/2) {
			x1 = x1-hline;
			writeFrom = false;
		} else if (pieData[i]['labelAngle'] < 2*Math.PI) {
			x1 = x1+hline;
		}
		c.lineTo(x1, y1);	
		
		c.strokeStyle = seriesColor[i];
		c.stroke();
		
		c.fillStyle = seriesColor[i];
		var fontHeight = 12;
		if (obj.xData !== undefined) {
			//c.fillStyle = obj.xData.color; 
			var b = " ";
			var xfont = obj.xData.font;
			fontHeight = xfont.size;
			if (adjustableTextFontSize) {
				fontHeight=getAdjustableTitleFontSize();
				xfont.size=fontHeight;
			}
			c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
		} else {	
			var fs = 12; 		
			if (adjustableTextFontSize) {
				fs = getAdjustableTitleFontSize();
			}
			c.font = "bold " + fs + "px sans-serif";
		}	   			
			
		if (writeFrom) {
			c.fillText(labels[i],x1+5, y1 + fontHeight/2);
		} else {
			var size = c.measureText(labels[i]).width+5;
			c.fillText(labels[i],x1-size, y1 + fontHeight/2);
		}
	}
}


function drawInit() {
	
	var font = c.font;
	
	//draw background (clear canvas)
	c.fillStyle = background; 	
	c.fillRect(0,0,realWidth,realHeight);			

	//draw title		
	if (typeof obj.title !== "undefined") {
		var titleColor = obj.title.color;
		if (titleColor === undefined) {
			titleColor = '#000000';
		}
		c.fillStyle = titleColor;
		var b = " ";
		var f = obj.title.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		if (adjustableTextFontSize) {
			f.size=getAdjustableTitleFontSize();
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;   		
		var titlePadding = 20;
		if (adjustableTextFontSize) {
			titlePadding = getAdjustableTitleFontSize()/2;
		}
		titleSpace = +titlePadding + +f.size;		
		 
		var alignment = obj.title.alignment;
		if (alignment === undefined) {
			alignment = "center";
		}
		var xTitle;
		if (alignment == "left") {
			xTitle = 10;
		} else if (alignment == "right") {
			xTitle = canvas.width - c.measureText(obj.title.text).width - 10;
		} else {
			// center
			xTitle = canvas.width/2- c.measureText(obj.title.text).width/2;
		}				
		
		var titlePadding = 20;
		if (adjustableTextFontSize) {
			titlePadding = getAdjustableTitleFontSize()/2;
		}
		c.fillText(obj.title.text, xTitle , titlePadding+titleSpace/2 );    
		c.font = font;   				
	} else {
		titleSpace = 0;
	}    
			
	c.font = font;   
}

function getTooltip(mousePos) {	
	return drawData(false, false, mousePos);	 	  	 
}      

function onClick(evt) {
	var v = drawData(false, true, getMousePos(canvas, evt));	
	if ((v !== "") && (obj.onClick !== undefined)) {		
		var f = obj.onClick;				
		eval(f);
		doClick(v);
	}	
	return v;
}

function drawChart() {	
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000/60);
              };
    })();                
            
    window.requestAnimFrame(animDraw); 
}  

function getTitleSpace() {
	var space = 0;
	if (typeof obj.title !== "undefined") {		
		var f = obj.title.font;
		if (f === undefined) {			
			f.size = 12;			
		}		      
		if (adjustableTextFontSize) {
			f.size=getAdjustableTitleFontSize();
		}
        var titlePadding = 20;
        if (adjustableTextFontSize) {
        	titlePadding = getAdjustableTitleFontSize();
        }
		space = +titlePadding + +f.size; 
	} 
	return space;
}

function getLabelHeight() {
	var fontHeight = 12;
	if (obj.xData !== undefined) {		
		fontHeight = obj.xData.font.size;			
	}
	if (adjustableTextFontSize) {
		fontHeight=getAdjustableTitleFontSize();
	}
	return fontHeight;
}

function getMaxLabelWidth() {
	if (typeof labels === "undefined") {
		return 0;
	}
	var font = c.font;
	var max = 0;	
	if (obj.xData !== undefined) {		 
		var b = " ";
		var xfont = obj.xData.font;		
		if (adjustableTextFontSize) {
			xfont.size=getAdjustableTitleFontSize();
		}
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
	} else {	
		var fs = 12;
		if (adjustableTextFontSize) {
			fs=getAdjustableTitleFontSize();
		}
		c.font = "bold " + fs + "px sans-serif";
	}	   					
	for(var i=0; i<labels.length; i++) {   
		var size = c.measureText(labels[i]).width+5;		
		if (size > max) {
			max = size;
		}
	}
	c.font = font;	
	return max;
}

// test if label text are overlapping on Y axis
// if yes we modify ylabel position and compute a delta to update pie radius (if position is outside canvas)
function adjustYLabels(pieData, center, R) {
	var f = getFontHeight();
	var d = 0;
	for(var i=1; i<pieData.length; i++) {
		var y1 = pieData[i-1]['labelpos'][1];
		var y2 = pieData[i]['labelpos'][1];		
		if (isRightCadran(i, pieData) && isRightCadran(i-1, pieData)) {
			if ( ((y1 <= y2) &&  (y1 + f/2 > y2 - f/2)) ||
			     (y1 > y2)  ) {				
					pieData[i]['labelpos'][1] = y1 + f/2 + 5;	
					var m = Math.pow(R,2) - Math.pow(pieData[i]['labelpos'][1]-center[1],2);
					if (m > 0) {
						pieData[i]['labelpos'][0] = center[0] + Math.sqrt(m);
					} else {
						pieData[i]['labelpos'][0] = center[0] - Math.sqrt(-m);
					}
					if (pieData[i]['labelpos'][1] > realHeight-titleSpace) {					
						d += f;						
					}
			}	
		} else if (!isRightCadran(i, pieData) && !isRightCadran(i-1, pieData)) {
			if ( ((y1 >= y2) &&  (y1 - f/2 < y2 + f/2)) ||
				     (y1 < y2)  ) {				
						pieData[i]['labelpos'][1] = y1 - f/2 - 5;	
						var m = Math.pow(R,2) - Math.pow(pieData[i]['labelpos'][1]-center[1],2);
						if (m > 0) {
							pieData[i]['labelpos'][0] = center[0] - Math.sqrt(m);
						} else {
							if (pieData[i]['labelAngle'] > 3*Math.PI/2) {
								pieData[i]['labelpos'][0] = center[0] + Math.sqrt(-m);
							}
						}							
						if (pieData[i]['labelpos'][1] < titleSpace + f) {					
							d += f;						
						}
				}	
		}
	}
	return d;
}

function resizeCanvas() {
	var can = document.getElementById(idCan);
	if (can != null) {		
		var w = canWidth;
		if (resizeWidth) {
			if (!isPercent(w)) {
				w = "100%";
			}
		}
		var h = canHeight;
		if (resizeHeight) {
			if (!isPercent(h)) {
				h = "100%";
			}
		}
		updateSize(w, h);
		drawChart();
	}
}

function getFontHeight() {
	var fontHeight = 12;	
	if (obj.xData !== undefined) {		 		
		var xfont = obj.xData.font;
		fontHeight = xfont.size;		  
	}    	
	if (adjustableTextFontSize) {
		fontHeight = getAdjustableTitleFontSize();
	}
	return fontHeight;
}

function isRightCadran(i, pieData) {
	var yes = true;	
	if (pieData[i]['labelAngle'] <= Math.PI/2) {		
		yes = true;						
	} else if (pieData[i]['labelAngle'] <= 3*Math.PI/2) {		
		yes = false;
	} else if (pieData[i]['labelAngle'] <= 2*Math.PI) {
		yes = true;	
	}
	return yes;
}

function getAdjustableTitleFontSize() {
	return canvas.width/25;	
}

function getAdjustableLabelFontSize() {
	return canvas.width/45;	
}

drawPie(myjson, idCan, idTipCan, canWidth, canHeight);

};