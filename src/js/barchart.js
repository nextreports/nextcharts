/*
 * Json must contain as mandatory only "data" attribute 
 * 
 * type -> bar, stackedbar, hbar, hstackedbar
 *     For bar and stackedbar we can have combo line series specified by lineData, lineColor and lineLegend
 * style -> normal, glass, cylinder, dome, parallelepiped
 * labelOrientation -> horizontal, vertical, diagonal, halfdiagonal
 * showLabels -> true means X labels are shown on X axis; we can use false if we want to show them in message tooltip with #x
 * message -> can have two markups #val for value, #total for total value (stackedbar) , #x for x label
 *         -> can contain <br> to split text on more lines
 * title.alignment -> center, left, right
 * y2Count -> number of last series represented on dual y2 axis
 * onClick -> is a javascript function like 'function doClick(value){ ...}'  *            
 * 
 * 
 * { "type": "bar",
 *   "style": "glass",
 *   "background" : "white",
 * 	 "data": [[ 16, 66, 24, 30, 80, 52 ], [ 48, 50, 29, 60, 70, 58 ], [ 30, 40, 28, 52, 74, 50 ]], 
 *   "lineData": [[31.33, 52, 27, 47.33, 74.66, 53.33]],
 *   "labels": ["JAN","FEB","MAR","APR","MAY", "JUN"],
 *   "labelOrientation": "horizontal",  
 *   "color": ["#004CB3","#A04CB3", "#7aa37a"], 
 *   "lineColor": [red],
 *   "legend": ["2011 First year of work" , "2012 Second year of work", "2013 Third year of work"],
 *   "lineLegend": [Average],
 *   "alpha" : 0.8, 
 *   "colorXaxis": "blue",
 *   "colorYaxis": "blue",
 *   "showGridX": true, 
 *   "showGridY": false, 
 *   "showLabels": true,
 *   "colorGridX": "rgb(248, 248, 216)", 
 *   "colorGridY": "rgb(248, 248, 216)", 
 *   "message" : "Value \: #val", 
 *   "showTicks" : true,
 *   "tickCount" : 5, 
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
 *   "yData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "xLegend" : {
 *      "text": "Month", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "yLegend" : {
 *      "text": "Sales",
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
 *   "dualYaxis": true, 
 *   "colorY2axis": "blue",
 *   "y2Legend" : {
 *      "text": "Sales",
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "y2Count" : 1,
 *   "onClick" : "function doClick(value){ console.log("Call from function: " + value); }"
 * }
 * 
 */

var barChart = function(myjson, idCan, idTipCan, canWidth, canHeight) {

var obj;
var data;
var labels; 
var labelOrientation;
var globalAlpha;
var showGridX;
var showGridY;
var showLabels;
var background;
var message;
var tickCount;
var showTicks;
var chartType;
var chartStyle;
var seriesColor;
var xData, yData;
var series;
var yStep;
var maxK = new Array(); 
var minK = new Array();
var maxSum = new Array();
var dotsK = new Array();
var max;
var min;
//space between 2 ticks
var tickStep;
var minValY;
var maxValY;
//for dual Y axis
var y2Step;
var maxK2 = new Array(); 
var minK2 = new Array();
var max2;
var min2;
var minValY2;
var maxValY2;
var hStep2 = 0;
var y2LegendSpace = 0;
var y2Count = 1;
// bottom vertical space (to fit X labels and X legend)
var step = 0;
var gap = 40;
// left horizontal space (to fit bigger Y labels and Y legend)
var hStep = 60;
var titleSpace = 0;
var legendSpace = 0;
var xLegendSpace = 0;
var yLegendSpace = 0;
var xaxisY = 0;
var cornerRadius = 6;
var realWidth;
var realHeight;
var canvas;  
var c; 
var tipCanvas;
var H = cornerRadius;
// space between X axis and first tick
var tickInit;
var resizeWidth = false;
var resizeHeight = false;
// by default chart title, legends and axis values strings have a defined font size
// if we want to have font size scaled accordingly with chart width then this property must be true 
// (such example may be when we want to show the chart on a big monitor)
var adjustableTextFontSize = false;
var maxLabelWidth = 0;	

function drawBar(myjson, idCan, idTipCan, canWidth, canHeight) {	
					
	canvas = document.getElementById(idCan);
	if (canvas == null) {
		return;
	}
	
	tipCanvas = document.getElementById(idTipCan);
	c = canvas.getContext('2d');
	
	obj = myjson;
	chartType = obj.type;
	if (typeof chartType === "undefined") {
	    chartType = "bar";
	}	
	
	if (isH(chartType) || (isStacked(chartType) && (obj.lineData === undefined)) ) {
		obj.dualYaxis = false;
	}
					
	background = obj.background;
	if (typeof background === "undefined") {	
		background = "white";
	}
		
	chartStyle = obj.style;
	// test for passing a wrong style
	if ((typeof chartStyle === "undefined")  || (find(['normal', 'glass', 'cylinder', 'dome', 'parallelepiped'],chartStyle) === false)) {	
		chartStyle = "normal";
	}	
	
	data = obj.data[0];
	series = obj.data.length;
	
	labels = obj.labels; 
	if (typeof labels === "undefined") {
		labels = [];
		for (var i=0; i<data.length; i++) {
			labels.push("");
		}
	}
	
	labelOrientation = obj.labelOrientation;
	if (typeof labelOrientation === "undefined") {
    	labelOrientation = "horizontal";
    }
	
	globalAlpha = obj.alpha;
	if (typeof globalAlpha === "undefined") {
        globalAlpha = 0.8;
    }
	
	showTicks = obj.showTicks;
	if (typeof showTicks === "undefined") {
		showTicks = true;
	}	
	
	showGridX = obj.showGridX;
	if (typeof showGridX === "undefined") {
        showGridX = true;
    }
        
	showGridY = obj.showGridY;
	if (typeof showGridY === "undefined") {
        showGridY = true;
    }
	
	showLabels = obj.showLabels;
	if (typeof showLabels === "undefined") {
        showLabels = true;
    }
	
	message = obj.message;
	if (typeof message === "undefined") {
		if (isStacked(chartType)) {
			message = "#val / #total";
		} else {
			message = "#val";
		}
	}
	
	adjustableTextFontSize = obj.adjustableTextFontSize;
	if (typeof adjustableTextFontSize === "undefined") {
		adjustableTextFontSize = false;
	}	
	
	tickCount = obj.tickCount;
	if (typeof tickCount === "undefined") {
        tickCount = 5;        
    }    
			
	seriesColor = obj.color;
	if (typeof seriesColor === "undefined") {
		seriesColor = distinctHexColors(series);
    }    
	
	y2Count = obj.y2Count;
	if (typeof y2Count === "undefined") {	
		y2Count = 1;
	}
	// must have at least one series on first Y axis
	if ((y2Count >= series) && (obj.lineData === undefined)) {
		y2Count = series-1;
	}
	
	// compute min ,max values
	// take care if we also have combo lines
	var countNo = series;
	if ((countNo > 1) && obj.dualYaxis && (obj.lineData === undefined)) {
		countNo = series-y2Count;
	}
	for (var k=0; k<countNo; k++) {
		maxK[k] = Math.max.apply( Math, obj.data[k] );
		minK[k] = Math.min.apply( Math, obj.data[k] ); 
	}    		
	if (isStacked(chartType)) {
        for (var i=0; i<data.length; i++) {
            var sum = 0;
            for (var k=0; k<series; k++) {
                sum += obj.data[k][i];
            }    
            maxSum[i] = sum;
        }    
        max = Math.max.apply( Math, maxSum);        
    }  else {
        max = Math.max.apply( Math, maxK);	    
    }  
    min = Math.min.apply( Math, minK);
    if (obj.lineData !== undefined) {
    	var lineMaxK = new Array(); 
    	var lineMinK = new Array();
    	var countNo = obj.lineData.length;
    	if (obj.dualYaxis) {
    		if (y2Count > obj.lineData.length) {
    			y2Count = obj.lineData.length;
    		}
    		countNo = obj.lineData.length - y2Count;    		
    	}
    	if (countNo > 0) {
	    	for (var k=0; k<countNo; k++) {
	    		lineMaxK[k] = Math.max.apply( Math, obj.lineData[k] );
	    		lineMinK[k] = Math.min.apply( Math, obj.lineData[k] ); 
	    	}      	
	    	var lineMin = Math.min.apply( Math, lineMinK);
	    	var lineMax = Math.max.apply( Math, lineMaxK);
	    	if (lineMin < min) {
	    		min = lineMin;
	    	}
	    	if (lineMax > max) {
	    		max = lineMax;
	    	}
    	}
	}
    
    var objStep = calculateYStep(min, max, tickCount);
    yStep = objStep.yStep;
    minValY = objStep.minValY;
    maxValY = objStep.maxValY;
    
    // compute hStep (for vertical labels and yLegend to fit) 
    hStep = computeHStep(maxValY, yStep, true);	    
    
    // for y dual axis
	if (obj.dualYaxis) {
		if (obj.lineData === undefined) {
			//max2 = Math.max.apply( Math, obj.data[series-1]);	         
			//min2 = Math.min.apply( Math, obj.data[series-1]);
			
			if (countNo == series) {
				countNo = series-1;
			}
			
			for (var k=countNo; k<series; k++) {
				maxK2[k-countNo] = Math.max.apply( Math, obj.data[k] );
				minK2[k-countNo] = Math.min.apply( Math, obj.data[k] ); 
			}    	
		    max2 = Math.max.apply( Math, maxK2);	         
		    min2 = Math.min.apply( Math, minK2);
			
			
		} else {
			//max2 = Math.max.apply( Math, obj.lineData[obj.lineData.length-1]);	         
			//min2 = Math.min.apply( Math, obj.lineData[obj.lineData.length-1]);
			
			for (var k=countNo; k<obj.lineData.length; k++) {
				maxK2[k-countNo] = Math.max.apply( Math, obj.lineData[k] );
				minK2[k-countNo] = Math.min.apply( Math, obj.lineData[k] ); 
			}    	
		    max2 = Math.max.apply( Math, maxK2);	         
		    min2 = Math.min.apply( Math, minK2);
		}
		
		var objStep2 = calculateYStep(min2, max2, tickCount);
	    y2Step = objStep2.yStep;
	    minValY2 = objStep2.minValY;
	    maxValY2 = objStep2.maxValY; 
	    
	    hStep2 = computeHStep(maxValY2, y2Step, false);		    
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
    
    canvas.addEventListener('click', onClick, false);
        
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
	
	if (isH(chartType)) {    			
    	if (typeof obj.legend !== "undefined") {   
    		computeVStep();    		
    	}	
    	realHeight = canvas.width;
    	realWidth = canvas.height - hStep/2;
    	if (typeof obj.title !== "undefined") {	
    		realWidth = realWidth - getTitleSpace();
    	}
    	if (typeof obj.legend !== "undefined") {  
    		realWidth = realWidth - getLegendSpace();
    	}    	
						
		xLegendSpace = getXLegendSpace();		
				
		c.translate(canvas.width, canvas.height);
		// flip context horizontally (mirror transformation)
		c.scale(-1,1);
		c.rotate(-90*Math.PI/180);		
		
	} else {
		realWidth = canvas.width;
		realHeight = canvas.height;
	}
		
	// adjust the  x gap between elements (should be smaller for smaller widths)
	gap = realWidth/10 - 10;
						
	tickInit = realHeight/12;	
    
	// space between 2 ticks
	tickStep = (realHeight-step-tickInit)/tickCount;
	
	if (adjustableTextFontSize) {						
	    var objStep = calculateYStep(min, max, tickCount);
	    yStep = objStep.yStep;
	    minValY = objStep.minValY;
	    maxValY = objStep.maxValY;
	    
	    // compute hStep (for vertical labels and yLegend to fit) 
	    hStep = computeHStep(maxValY, yStep, true);
	    
	    if (obj.dualYaxis) {
	    	var objStep2 = calculateYStep(min2, max2, tickCount);
		    y2Step = objStep2.yStep;
		    minValY2 = objStep2.minValY;
		    maxValY2 = objStep2.maxValY; 
		    
		    hStep2 = computeHStep(maxValY2, y2Step, false);		    
	    }		   
	}
}


function animDraw() {      
    if (drawIt(H)) {          		    
        return false;
    }    
    H += 1+(realHeight-step-titleSpace-legendSpace)/30;    
    window.requestAnimFrame(animDraw);      
}    


// function called repetitive by animation
function drawIt(H) {    		
	
	// for cylinder we need to redraw the entire canvas (it extends under drawn x axis)
	drawInit();
			
	// if we clear only the rectangle containing the chart (without title , legends, labels)
	// clear the drawn area (if drawInit is called in drawChart)
	//	c.fillStyle = background; 
	//	c.fillRect(hStep-10,titleSpace+legendSpace,width, realHeight-step-titleSpace-legendSpace-2);
	
	var stop = drawData(true, false, "");
	
	drawGrid();
	drawAxis();
	 				
	return stop;
}

// withFill = false means to construct just the path needed for tooltip purposes
function drawData(withFill, withClick, mousePos) {
	var font = c.font;
	    
	//draw data 
	c.lineWidth = 1.0;
	var stop = true;
	var acc = new Array();
	for(var i=0; i<data.length; i++) { 
		acc[i] = realHeight-step;
	}	
			    
	var barTooltip = "";
	var barValue;
	var abort = false;
	for(var k=0; k<series && !abort; k++) {  
	  for(var i=0; i<data.length && !abort; i++) { 		  
	    var dp = obj.data[k][i];
	    if (isStacked(chartType)) {	    
	    	if (k > 0) {
	    		for (var m=0; m<k; m++) {
	    			dp += obj.data[m][i];
	    		}
	    	}
	    }
	    var rectX = hStep + i*(realWidth-hStep-hStep2)/data.length;       
	    var Yheight = realHeight-step-(dp-minValY)*tickStep/yStep;    
	    if (obj.dualYaxis && (y2Count > 0) && (k >= series-y2Count) && (obj.lineData === undefined)) {
	    	Yheight = realHeight-step-(dp-minValY2)*tickStep/y2Step;  
	    }
	    var rectY = realHeight-step-H;     	    	    
	    if (rectY <= Yheight) {
	        rectY = Yheight;
	    } else {
	        stop = false;
	    }        
	    if (rectY+2 > xaxisY) {
	        rectY = xaxisY-1;
	        cornerRadius = 1;
	    } else {
	        cornerRadius = 6;
	    }	    
	    	   
	    var rectWidth;
	    if (isStacked(chartType)) {	    		    	 	    
	        rectWidth =  (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length; 	        
	    } else {     
	        rectWidth =  (realWidth - hStep -hStep2 - gap*(1+Math.sqrt(series)))/data.length/series;
	        rectX = rectX + k*rectWidth; 
	    }  	    
	    
	    var lColor = colorLuminance(seriesColor[k],1.3);
	    var grad = c.createLinearGradient(rectX, realWidth-hStep-hStep2 , rectX + rectWidth , realWidth-hStep-hStep2);       
	    grad.addColorStop(0,lColor); // light color  
	    grad.addColorStop(1,seriesColor[k]);    
	    
	    var inverseGrad = c.createLinearGradient(rectX, realWidth-hStep-hStep2 , rectX + rectWidth , realWidth-hStep-hStep2); 		      
	    inverseGrad.addColorStop(0,seriesColor[k]);
	    inverseGrad.addColorStop(1,lColor); // light color
	    	  	    	    	    
	    if (chartStyle == "glass") {	    	 		    
	    	acc[i] = drawGlass(k, i, rectX, rectY, rectWidth, grad, acc[i], withFill);
	    } else if (chartStyle == "cylinder") {	    
	    	acc[i] = drawCylinder(k, i, rectX, rectY, rectWidth, grad, inverseGrad, acc[i], withFill);
	    } else if (chartStyle == "dome") {			    	
	    	acc[i] = drawDome(k, i, rectX, rectY, rectWidth, inverseGrad, stop, acc[i], withFill);
	    } else if (chartStyle == "parallelepiped") {			    	
	    	acc[i] = drawParallelipiped(k, i, rectX, rectY, rectWidth, grad, inverseGrad, stop, acc[i], withFill);
	    } else {	    	
	    	// normal style
	    	acc[i] = drawRectangle(k, i, rectX, rectY, rectWidth, acc[i], withFill);
	    }   	    	    
	    
	    if (!withFill) {
	    	if (c.isPointInPath(mousePos.x, mousePos.y)) {  	    		
	    		var tValue = obj.data[k][i];
	    		if (obj.tooltipPattern !== undefined) {
	    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
	    		}	    			    		
	    		var returnValue = labels[i]; // returnValue = tValue;
	    		if (withClick) {
	    			barValue = tValue;
	    			// if there is a combo line we test first to see if point for line was clicked
	    			// that's why we do not return the bar clicked value
	    			if (obj.lineData !== undefined) {
			        	abort = true;
			        } else {
			        	return returnValue;
			        }
	    		} else {
			    	var mes = String(message).replace('#val', tValue);
			    	mes = mes.replace('#x', returnValue);
				    mes = mes.replace('#total', maxSum[i]);
				    if (obj.onClick !== undefined) {
				    	canvas.style.cursor = 'pointer';
				    }
			        barTooltip = mes;
   			        // if there is a combo line we test first to see if point for line was clicked
	    			// that's why we do not return the bar tooltip
			        if (obj.lineData !== undefined) {
			        	abort = true;
			        } else {
			        	return mes;
			        }
	    		}
		    } else {
		    	canvas.style.cursor = 'default';
		    }    					   
	    }
	  } 
	}   
	
	// combo line chart
	if (obj.lineData !== undefined) {
		for(var k=0; k<obj.lineData.length; k++) {  
			  dotsK[k] = [];	
			  for(var i=0; i<obj.lineData[0].length; i++) { 		  
			    var dp = obj.lineData[k][i];	
			    var width =  (realWidth - hStep -hStep2 - gap*(1+Math.sqrt(obj.lineData.length)))/obj.lineData[0].length;
			    var dotX = hStep + i*(realWidth-hStep-hStep2)/obj.lineData[0].length + width/2;       
			    var Yheight = realHeight-step-(dp-minValY)*tickStep/yStep;   
			    if (obj.dualYaxis && (y2Count > 0) && (k >= obj.lineData.length-y2Count)) {
			    	Yheight = realHeight-step-(dp-minValY2)*tickStep/y2Step;  
			    }
			    var dotY = realHeight-step-H;
			    var dotX2 = dotX;
			    var dotY2 = dotY;
			    var Yheight2 = Yheight;
			    if (i < obj.lineData[0].length-1) {
			    	dotX2 = hStep + (i+1)*(realWidth-hStep-hStep2)/obj.lineData[0].length + width/2;
			    	dotY2 = realHeight-step-H;
			    	Yheight2 = realHeight-step-(obj.lineData[k][i+1]-minValY)*tickStep/yStep;
			    	if (obj.dualYaxis && (y2Count > 0) && (k >= obj.lineData.length-y2Count)) {
			    		Yheight2 = realHeight-step-(obj.lineData[k][i+1]-minValY2)*tickStep/y2Step;
			    	}
			    }
			    	    	    
			    if (dotY <= Yheight) {
			        dotY = Yheight;
			    } else {
			        stop = false;
			    }  
			    if (dotY+2 > xaxisY) {
			        dotY = xaxisY-1;	        
			    } 	
			    if (i < obj.lineData[0].length-1) {
				    if (dotY2 <= Yheight2) {
				        dotY2 = Yheight2;
				    } else {
				        stop = false;
				    }  
				    if (dotY2+2 > xaxisY) {
				        dotY2 = xaxisY-1;	        
				    } 	    
			    }
			    	   	    
			    dotsK[k].push({x:dotX, y:dotY});
			    
			    var lineSeriesColor = obj.lineColor;
				if (obj.lineColor === undefined) {
					lineSeriesColor = distinctHexColors(obj.lineData[0].length);
			    }   
			    
			    var savedStroke = c.strokeStyle;			    
			    drawLineElements(c, "normal", "line", 2, lineSeriesColor, dotsK, obj.lineData[0].length, xaxisY, globalAlpha, k, i, dotX, dotY, dotX2, dotY2, withFill);			    
			    c.strokeStyle = savedStroke;
			    
			    if (!withFill) {
			    	if (c.isPointInPath(mousePos.x, mousePos.y)) {  
			    		var tValue = obj.lineData[k][i];			    		
			    		if (obj.tooltipPattern !== undefined) {
			    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
			    		}	 
			    		var returnValue = labels[k]; // returnValue = tValue;
			    		if (withClick) {
			    			return returnValue;
			    		} else {
			    			var lineMessage = "#val";
					    	var mes = String(lineMessage).replace('#val', tValue);
					    	mes = mes.replace('#x', returnValue);
					    	if (obj.onClick !== undefined) {
					    		canvas.style.cursor = 'pointer';
					    	}
					        return mes;
			    		}
				    } else {	
				    	if (abort == true) {
				    		if (obj.onClick !== undefined) {
				    			canvas.style.cursor = 'pointer';
				    		}
				    	} else {
				    		canvas.style.cursor = 'default';
				    	}
				    }    					   
			    }
			  }
		}	  
    }
		
	if (withFill) {
		return stop;
	} else {		
		if (withClick) {
    		if (barValue !== undefined) {
    			return barValue;
    		}
    	}
		// empty tooltip message if click outside bot line and bar
		return barTooltip;
	}
}

function drawRectangle(k, i, rectX, rectY, rectWidth, acci, withFill) {	
	c.beginPath();	
	c.moveTo(rectX, rectY);
	c.lineTo(rectX+rectWidth, rectY);
	c.lineTo(rectX+rectWidth, acci);
	c.lineTo(rectX,acci);
	c.lineTo(rectX, rectY);        	    	
	if (isStacked(chartType)) {		    				    	 
	    acci = rectY;	    	
	}
	if (withFill) {
		c.fillStyle = seriesColor[k];
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;
	}
	return acci;
}

function drawCylinder(k, i, rectX, rectY, rectWidth, grad, inverseGrad, acci, withFill) {	
	if (withFill) { 
	    c.beginPath();	 
	    // must compute for arc : starting x, y and radius
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    // arc drawn from right to left
	    c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    if (isStacked(chartType)) {	
	    	c.lineTo(rectX , acci) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);		    		 
	    	acci = rectY;	    	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    c.lineTo(rectX+rectWidth , rectY) ;	
	    c.stroke();
	    c.closePath();
	    
	    if (withFill) {    	
	    	c.fillStyle = inverseGrad;
		    // apply alpha only for fill (not to the border stroke)!
		    c.globalAlpha = globalAlpha;
		    c.fill();  
		    c.globalAlpha = 1;
	    }
	    
	    // cylinder upper part with inverted gradient
	    // we stroke only the upper part of circle	    
	    c.beginPath();	
	    if (isStacked(chartType)) {	
	    	c.arc(rectX+rectWidth/2, acci+radius*Math.cos(Math.PI/8), radius, 11*Math.PI/8 , 13*Math.PI/8);
	    	c.stroke();
	    	c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    } else {
	    	c.arc(rectX+rectWidth/2, rectY+radius*Math.cos(Math.PI/8), radius, 11*Math.PI/8 , 13*Math.PI/8);
	    	c.stroke();
	    	c.arc(rectX+rectWidth/2,rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    }
	    c.closePath();		    		   
	   		    		    
	      
	    c.fillStyle = grad;
		// apply alpha only for fill (not to the border stroke)!
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;
    } else {    	
    	// draw only the outside border
    	c.beginPath();	 			    
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    // change from drawCylinder withFill
	    if ((series == 1) || (k == series-1)) {
	    	c.arc(rectX+rectWidth/2, rectY+radius*Math.cos(Math.PI/8), radius, 13*Math.PI/8 , 11*Math.PI/8, true);		    	
	    } else {
	    	c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    }
	    // same
	    if (isStacked(chartType)) {	
	    	c.lineTo(rectX , acci) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);		    		 
	    	acci = rectY;	    	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    c.lineTo(rectX+rectWidth , rectY) ;	
    }
    return acci;
}

function drawGlass(k, i, rectX, rectY, rectWidth, grad, acci, withFill) {
	if (withFill) {
		c.fillStyle = grad;
	}
	// instead of a rectangle draw a path with rounded corners
    c.beginPath();	    
    if (rectWidth <= 2*cornerRadius*series) {
        cornerRadius = 2;
    }    
    c.moveTo(rectX+cornerRadius, rectY);
    c.lineTo(rectX + rectWidth - cornerRadius , rectY);
    if (!isStacked(chartType) || (k == series-1) ) {	
    	c.arcTo(rectX + rectWidth, rectY, rectX + rectWidth , rectY + cornerRadius, cornerRadius);
    } else {
    	c.lineTo(rectX + rectWidth , rectY);
    }
    if (isStacked(chartType)) {		    	
    	c.lineTo(rectX + rectWidth, acci) ;
    	c.lineTo(rectX , acci) ;	 
    	acci = rectY;	    	
    } else {
    	c.lineTo(rectX + rectWidth, realHeight-step) ;
    	c.lineTo(rectX , realHeight-step) ;
    }
    if (!isStacked(chartType) || (k == series-1) ) {	
    	c.lineTo(rectX , rectY+cornerRadius) ;
    	c.arcTo(rectX, rectY, rectX + rectWidth - cornerRadius , rectY , cornerRadius);
    } else {
    	c.lineTo(rectX , rectY) ;
    }
    if (withFill) {
	    c.closePath();		    		   
	    c.stroke();
	    		    
	    // apply alpha only for fill (not to the border stroke)!
	    c.globalAlpha = globalAlpha;
	    c.fill();  
	    c.globalAlpha = 1;
    }
    
    return acci;
}

function drawDome(k, i, rectX, rectY, rectWidth, inverseGrad, stop, acci, withFill) {
	if (withFill) {
		c.fillStyle = inverseGrad;
		
	    c.beginPath();	 
	    // must compute for arc : starting x, y and radius
	    var topRadius = rectWidth/2;
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    var value = (obj.data[k][i]-minValY)*tickStep/yStep;
	    var  maxValue = (maxSum[i]-minValY)*tickStep/yStep;
	    var isEllipse = false;            
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {	
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius <= value) {
				    // arc drawn from right to left	    		
		    		c.arc(rectX+rectWidth/2, rectY+topRadius,  topRadius, 2*Math.PI , Math.PI, true);	    		
		    	} else {
		    		drawUpperEllipse(c, rectX, rectY, rectWidth, 2*value);
		    		isEllipse=true;
		    	}
	    	}
	    } else {		    	
	    	c.arc(rectX+rectWidth/2, rectY+radius*Math.cos(Math.PI/8), radius, 13*Math.PI/8 , 11*Math.PI/8, true);	
	    }		    
	    		    
	    if (isStacked(chartType)) {			    	
	    	if (isEllipse == true) {
		    	// arc drawn from right to left (because ellipse is drawn from left to right)
	    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    	} else {
		    	// arc drawn from left to right
	    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);
	    	}
	    	acci = rectY;	    	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius <= value) {				    		
		    		c.lineTo(rectX+rectWidth , rectY+topRadius) ;		    		
		    	} else {
		    		c.lineTo(rectX , rectY+value) ;		
		    	}
	    	}
	    } else {
	    	c.lineTo(rectX+rectWidth , rectY) ;
	    }        		   		    		    
	    
    	c.stroke();
        c.closePath();
    	
	    // apply alpha only for fill (not to the border stroke)!
	    c.globalAlpha = globalAlpha;
	    c.fill();  
	    c.globalAlpha = 1;
	} else {		
	    c.beginPath();	 
	    // must compute for arc : starting x, y and radius
	    var topRadius = rectWidth/2;
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    var value = (obj.data[k][i]-minValY)*tickStep/yStep;
	    var isEllipse = false;            	    
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {	
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius < value) {
				    // arc drawn from right to left	    		
		    		c.arc(rectX+rectWidth/2, rectY+topRadius,  topRadius, 2*Math.PI , Math.PI, true);	    		
		    	} else {
		    		drawUpperEllipse(c, rectX, rectY, rectWidth, 2*value);
		    		isEllipse=true;
		    	}
	    	}
	    } else {		    	
	    	c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    		   	    
	    if (isStacked(chartType)) {
	    	if ((series == 1) || (k == series-1)) {
		    	if (isEllipse == true) {
			    	// arc drawn from right to left (because ellipse is drawn from left to right)
		    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
		    	} else {
			    	// arc drawn from left to right
		    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);
		    	}
		    	acci = rectY;	    	
	    	} else {
	    		if (isEllipse == true) {
	    			c.lineTo(rectX , acci) ;
	    			// arc drawn from right to left
			    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 13*Math.PI/8 , 11*Math.PI/8, true);	
	    		} else {
	    			c.lineTo(rectX+rectWidth , acci) ;
	    			// arc drawn from left to right
			    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 ,5*Math.PI/8);	
	    		}
		    	
		    }	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius <= value) {			    	
	    			c.lineTo(rectX+rectWidth , rectY+topRadius) ;
		    	} // else there is no line to draw
	    	}
	    } else {
	    		c.lineTo(rectX , rectY) ;
	    }      	   
	}
    
    return acci;
}

function drawParallelipiped(k, i, rectX, rectY, rectWidth, grad, inverseGrad, stop, acci, withFill) {
	var p = gap/4;	 
	var value = (obj.data[k][i]-minValY)*tickStep/yStep;
	if (withFill) {
		c.fillStyle = grad;
		
		// background lines (will be seen if a globalAlpha < 1 is set
		c.lineWidth = 0.2;
		c.moveTo(rectX+p, rectY);
		c.lineTo(rectX+p, acci);				
		if (k == 0) {
			c.lineTo(rectX, acci+p);	
			c.moveTo(rectX+p, acci);
			c.lineTo(rectX+rectWidth+p, acci);
		}
		c.stroke();
		
		c.lineWidth = 0.5;	
		// draw front
		c.beginPath();	
		c.moveTo(rectX, rectY+p);
		c.lineTo(rectX+rectWidth, rectY+p);
		c.lineTo(rectX+rectWidth, acci+p);
		c.lineTo(rectX,acci+p);
		c.lineTo(rectX, rectY+p);        	    	
		
		c.closePath();
		c.stroke();   		
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;		
	    
	    // draw top		
		c.fillStyle = inverseGrad;		
	    c.beginPath();	
		c.moveTo(rectX, rectY+p);
		c.lineTo(rectX+p, rectY);
		c.lineTo(rectX+rectWidth+p,rectY);
		c.lineTo(rectX+rectWidth, rectY+p);
		c.lineTo(rectX, rectY+p);
		c.closePath();
		c.stroke();    			
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;		
		
		// draw aside
		c.fillStyle = inverseGrad;		
	    c.beginPath();	
		c.moveTo(rectX+rectWidth+p,rectY);
		if (isStacked(chartType)) {	
			var m = H;
			if (m > value) {
				m = value;
			}
			c.lineTo(rectX+rectWidth+p, rectY+m);
			c.lineTo(rectX+rectWidth,  rectY+p+m);
		} else {
			c.lineTo(rectX+rectWidth+p, acci);
			c.lineTo(rectX+rectWidth, acci+p);
		}
		
		c.lineTo(rectX+rectWidth, rectY+p);
		c.lineTo(rectX+rectWidth+p,rectY);	
		c.closePath();
		c.stroke();    			
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;				
		
		if (isStacked(chartType)) {		    				    	 
		    acci = rectY;	    	
		}
		
	} else {		
		c.beginPath();	
		c.moveTo(rectX, rectY+p);
		if ((series == 1) || (k == series-1) || (chartType=="bar")) {		
			c.lineTo(rectX+p, rectY-p);
			if ((chartType=="bar") && (series > 1) && (k < series-1)) {
				var nextValue = (obj.data[k+1][i]-minValY)*tickStep/yStep;
				if (value<=nextValue) {
					c.lineTo(rectX+rectWidth,rectY-p);
				} else {
					c.lineTo(rectX+rectWidth+p,rectY-p);
				}
			}  else {
				c.lineTo(rectX+rectWidth+p,rectY-p);
			}
		} else {
			c.lineTo(rectX+rectWidth, rectY);
			c.lineTo(rectX+rectWidth+p, rectY-p);
		}
		
		if ((chartType=="bar") && (series > 1) && (k < series-1)) {		
			var nextValue = (obj.data[k+1][i]-minValY)*tickStep/yStep;
			if (value <= nextValue) {
				c.lineTo(rectX+rectWidth, acci+p);
			} else {
				c.lineTo(rectX+rectWidth+p, acci-nextValue-p);
				c.lineTo(rectX+rectWidth, acci-nextValue);
				c.lineTo(rectX+rectWidth, acci+p);
			}
		} else {
			c.lineTo(rectX+rectWidth+p, acci);
			c.lineTo(rectX+rectWidth, acci+p);
		}
		
		c.lineTo(rectX,acci+p);		
		c.lineTo(rectX, rectY+p);    
		if (isStacked(chartType)) {		    				    	 
		    acci = rectY;	    	
		}
	}
	return acci;
	
}


function drawInit() {	
	
	var font = c.font;
	
	//draw background (clear canvas)
	c.fillStyle = background; 
	if (isH(chartType)) {
		// realWidth is modified for hbar (but we need to clear the entire surface)
		c.fillRect(0,0,realWidth+getTitleSpace()+step,realHeight);		
	} else {
		c.fillRect(0,0,realWidth,realHeight);
	}			
	
	// adjust step with X label space (x label can have different orientations) and X legend space
	var xLabelWidth = computeVStep();

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
		if (!isH(chartType)) {
			var titlePadding = 20;
			if (adjustableTextFontSize) {
				titlePadding = getAdjustableTitleFontSize()/2;
			}
			titleSpace = +titlePadding + +f.size;				
		} else {			
			titleSpace = 10;
			if (yLegendSpace == 0) {
				titleSpace = 20;
			}
			if (adjustableTextFontSize) {
				titleSpace = getAdjustableTitleFontSize()/4;
			}
		}
		var alignment = obj.title.alignment;
		if (alignment === undefined) {
			alignment = "center";
		}
		var xTitle;
		if (alignment == "left") {
			xTitle = hStep;
		} else if (alignment == "right") {
			xTitle = canvas.width - c.measureText(obj.title.text).width - 10;
		} else {
			// center
			xTitle = canvas.width/2- c.measureText(obj.title.text).width/2;
		}
		
		if (isH(chartType)) {		
			c.save();
			c.translate(0, realHeight/2);
			c.scale(1, -1);
			var xoff = 0;			
			if (chartType == "hstackedbar") {
				xoff = 11;
			} else {				
				xoff = 11;
			}
			var leg = 0;
			if (typeof obj.legend !== "undefined") {  
				leg = getLegendSpace();
			}
			if (showTicks == false) {
				var titlePadding = 20;
				if (adjustableTextFontSize) {
					titlePadding = getAdjustableTitleFontSize()/2;
				}
				leg = leg + titleSpace + titlePadding;
			}
			c.translate(realWidth+hStep+titleSpace+xoff-yLegendSpace+leg, -realHeight/2);			
			c.rotate(Math.PI/2);
		}		
		
		var titlePadding = 20;
		if (isH(chartType) && (yLegendSpace == 0)) {
			titlePadding = 40;
		}
		if (adjustableTextFontSize) {
			titlePadding = getAdjustableTitleFontSize()/2;
		}
		c.fillText(obj.title.text, xTitle , titlePadding+titleSpace/2 );    
		c.font = font;   
		
		if (isH(chartType)) {		
			c.restore();						
		}
	} else {
		titleSpace = 10;
	}    
	
	
	//draw X legend	
	if (typeof obj.xLegend !== "undefined") {
						
		var xLegendColor = obj.xLegend.color;
		if (xLegendColor === undefined) {
			xLegendColor = '#000000';
		}
		c.fillStyle = xLegendColor;
		var b = " ";
		var f = obj.xLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
        if (adjustableTextFontSize) {
			f.size = getAdjustableLabelFontSize();
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;   
		var legendPadding = 20;
		if (adjustableTextFontSize) {
			legendPadding = getAdjustableLabelFontSize()/2;
		}
		xLegendSpace = +legendPadding + +f.size;             
		
		if (isH(chartType)) {		
			c.save();
			c.translate(0, realHeight);
			c.scale(1,-1);
			var x = 0;
			if (typeof obj.legend !== "undefined") {   
				x = c.measureText(obj.xLegend.text).width/2;
			} else if (typeof obj.title !== "undefined") {
				x = titleSpace;
			}
			c.translate(x, -realHeight + f.size/2 + xLegendSpace);
		}			
		
		c.fillText(obj.xLegend.text, realWidth/2- c.measureText(obj.xLegend.text).width/2 , realHeight - f.size );    
		c.font = font;   
		
		if (isH(chartType)) {		
			c.restore();						
		}
	} else {
		xLegendSpace = 0;
	}    
	
	//draw Y legend	
	if (typeof obj.yLegend !== "undefined") {
		var yLegendColor = obj.yLegend.color;
		if (yLegendColor === undefined) {
			yLegendColor = '#000000';
		}
		var b = " ";
		var f = obj.yLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
        if (adjustableTextFontSize) {
			f.size = getAdjustableLabelFontSize();
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		c.fillStyle = yLegendColor;		
		c.save();	    	
    	c.translate(10  , realHeight/2);
    	c.rotate(-Math.PI/2);
    	c.textAlign = "center";	    	 
    	if (isH(chartType)) {					
			c.translate(0, realHeight);
			c.scale(1, -1);	
			var ypos = realHeight -  f.size / 2 - xLegendSpace/2;
			if ((typeof obj.title === "undefined") && (xLegendSpace == 0)) {
				ypos = ypos - f.size;
			}
			c.translate(0, ypos);
		}		
    	c.fillText(obj.yLegend.text,0, f.size);
    	c.restore();		    
		c.font = font;            
	} else {
		yLegendSpace = 0;
	}    
	
	// draw Y2 legend
	if (obj.dualYaxis && (typeof obj.y2Legend !== "undefined")) {
		var y2LegendColor = obj.y2Legend.color;
		if (y2LegendColor === undefined) {
			y2LegendColor = '#000000';
		}
		var b = " ";
		var f = obj.y2Legend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
        if (adjustableTextFontSize) {
			f.size = getAdjustableLabelFontSize();
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		c.fillStyle = y2LegendColor;		
		c.save();	    	
    	c.translate(realWidth - f.size - 10  , realHeight/2);
    	c.rotate(-Math.PI/2);
    	c.textAlign = "center";	    	     	
    	c.fillText(obj.y2Legend.text,0, f.size);
    	c.restore();		    
		c.font = font;            
	} else {
		y2LegendSpace = 0;
	}    

	// draw legend	
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;
		if (isH(chartType)) {	
			x = step;
		}
		c.font = "bold 10px sans-serif";
        if (adjustableTextFontSize) {
			c.font = "bold " + getAdjustableLabelFontSize() + "px sans-serif";
		}		 
		var legendPadding = 20;		
		if (adjustableTextFontSize) {
			legendPadding = getAdjustableLabelFontSize();
		}	
		legendSpace = legendPadding;
		var legendY = titleSpace+legendPadding;
		c.globalAlpha = globalAlpha;
		for (var k=0; k<series; k++) {        
			c.fillStyle = seriesColor[k];        
			var legendWidth = c.measureText("---- " + obj.legend[k]).width + 24;             
			
			if (isH(chartType)) {					
				if (x + legendWidth > realHeight) {
					// draw legend on next line if does not fit on current one
					x = step;
					var lineSpace = 14;
					if (adjustableTextFontSize) {
						lineSpace = getAdjustableLabelFontSize();
					}				
					legendY = legendY + lineSpace;					
				}	
				c.save();
				c.translate(0, realHeight/2);
				c.scale(1, -1);		
				var xoff = 0;			
				if (chartType == "hstackedbar") {
					xoff = 24;
					if (typeof obj.title === "undefined") {
						xoff = 4;
					}
				} else {				
					xoff = 23;
					if (typeof obj.title === "undefined") {
						xoff = 3;
					}
				}
				c.translate(realWidth+hStep/2+xoff - yLegendSpace/2+legendSpace, -realHeight/2);
				c.rotate(Math.PI/2);
			} else {
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					var lineSpace = 14;
					if (adjustableTextFontSize) {
						lineSpace = getAdjustableLabelFontSize();
					}
					legendY = legendY + lineSpace;
					if (!isH(chartType)) {
						var legendPadding = 20;		
						if (adjustableTextFontSize) {
							legendPadding = getAdjustableLabelFontSize();
						}
						legendSpace += legendPadding;
					}
				}    
			}		
			c.fillText("---- " + obj.legend[k], x, legendY);
			     
			x = x + legendWidth;
			if (isH(chartType)) {				
				c.restore();						
			} 
		}  
		if ((obj.lineLegend !== undefined) && (obj.lineData !== undefined)) {
			var lineSeriesColor = obj.lineColor;
			if (obj.lineColor === undefined) {
				lineSeriesColor = distinctHexColors(obj.lineData[0].length);
		    }   			   
			for (var k=0; k<obj.lineData.length; k++) {   
				c.fillStyle = lineSeriesColor[k];     
				var legendWidth = c.measureText(obj.lineLegend[k]).width + 24;   
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					var lineSpace = 14;
					if (adjustableTextFontSize) {
						lineSpace = getAdjustableLabelFontSize();
					}	
					legendY = legendY + lineSpace;	
					var legendPadding = 20;		
					if (adjustableTextFontSize) {
						legendPadding = getAdjustableLabelFontSize();
					}
					legendSpace += legendPadding;					
				}  
				c.fillText("---- " + obj.lineLegend[k], x, legendY);
				x = x + legendWidth;
			}				
		}
		c.globalAlpha = 1;
		c.font = font;
	}    	
	
	
	
	c.font = font;

    
	// adjust tickStep depending if title or legend are present or not
	tickStep = (realHeight-step-titleSpace-legendSpace-tickInit)/tickCount; 	

	// compute Y value for xAxis
	xaxisY = tickCount*tickStep+tickInit+titleSpace+legendSpace; 	
	
	drawLabels(xLabelWidth);
}


function drawLabels(xLabelWidth) {
	
	var font = c.font;
			
	//draw Y labels and small lines 	
	if (showTicks) {
		c.fillStyle = "black"; 
		if (obj.yData !== undefined) {
			c.fillStyle = obj.yData.color; 
			var b = " ";
			var yfont = obj.yData.font;
	        if (adjustableTextFontSize) {
				yfont.size=getAdjustableLabelFontSize();
			}
			c.font = yfont.weight + b + yfont.size + "px" + b + yfont.family;  
		}
		for(var i=0; i<tickCount+1; i++) {        		
			var label;
			var label2;
			if (obj.tooltipPattern !== undefined) {
				// y labels can have more than two decimals
				var decimals = obj.tooltipPattern.decimals;
				var exp = Math.pow(10, decimals);
				label = Math.round((maxValY-i*yStep)*exp)/exp;
				if (obj.dualYaxis) { 
					label2 = Math.round((maxValY2-i*y2Step)*exp)/exp;
				}
			} else {
				label = Math.round((maxValY-i*yStep)*100)/100;
				if (obj.dualYaxis) { 
					label2 = Math.round((maxValY2-i*y2Step)*100)/100;
				}
			}
			var labelWidth = c.measureText(label).width;   
			
			if (isH(chartType)) {	   
				c.save();
				var size = 0;
				if (obj.yData !== undefined) {					
			        if (adjustableTextFontSize) {
						size=getAdjustableLabelFontSize();
					}
				}
				c.scale(-1,1);						
				var m = yLegendSpace;
				if (m == 0) {
					m = 0;							
				} else if (xLegendSpace != 0) {
					m = 30;					
				}					
				var t = 0;
				if ((obj.title === undefined) && (yLegendSpace == 0)) {	
					t = maxLabelWidth/3;
				}
				c.translate(-realHeight + step - maxLabelWidth/2 - m  + (tickCount-i)*tickStep, i*tickStep +  tickInit + hStep + 1 - labelWidth/3 -yLegendSpace/4-t  + step - xLabelWidth - xLegendSpace + legendSpace - size/4);	
				c.rotate(-Math.PI/2);							
			}
			
			c.fillText(label + "",hStep - 15 - labelWidth , i*tickStep+tickInit+titleSpace+legendSpace);
			if (isH(chartType)) {	   
				c.restore();
			}
			
			c.lineWidth = 2.0; 
			c.beginPath();     
		    c.moveTo(hStep-15,i*tickStep+tickInit+titleSpace+legendSpace);     
		    c.lineTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);   
		    c.closePath();    
		    c.stroke();    	    
		    
		    if (obj.dualYaxis) { 
		    	var labelWidth2 = c.measureText(label2).width;   						
				
				c.fillText(label2 + "",realWidth-hStep2+5 , i*tickStep+tickInit+titleSpace+legendSpace);
				
				c.lineWidth = 2.0; 
				c.beginPath();     
			    c.moveTo(realWidth-hStep2,i*tickStep+tickInit+titleSpace+legendSpace);     
			    c.lineTo(realWidth-hStep2+5,i*tickStep+tickInit+titleSpace+legendSpace);   
			    c.closePath();    
			    c.stroke();    
		    }
		} 
		c.font = font;
	}

	//draw X labels 
	if (showLabels) {
		c.fillStyle = "black"; 
		if (obj.xData !== undefined) {
			c.fillStyle = obj.xData.color; 
			var b = " ";
			var xfont = obj.xData.font;
	        if (adjustableTextFontSize) {
				xfont.size=getAdjustableLabelFontSize();
			}
			c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
		}		
		for(var i=0; i<labels.length; i++) {   
		    var middleX = hStep + i*(realWidth-hStep-hStep2 )/data.length + (realWidth - hStep -hStep2 - gap*(1+Math.sqrt(series)))/data.length/2;
		    if (isH(chartType)) {	    	
				c.save();
				
				// X labels are transformed to appear on Y axis (they are vertical) 
				c.scale(1,-1);
				c.translate(0, -2*realHeight+ xLabelWidth + 3*xLegendSpace/2 );
				var size = 20;
				if (adjustableTextFontSize) {
					size=getAdjustableLabelFontSize();
				}
				if (obj.xData !== undefined) {
					size = obj.xData.font.size;
			        if (adjustableTextFontSize) {
						size=getAdjustableLabelFontSize();
					}
				}						
										
				// rotate X labels to appear horizontal			
				c.translate(realHeight-step-size/2+middleX+xLabelWidth/2+xLegendSpace/2, realHeight-middleX- c.measureText(labels[i]).width/2 - size/2 -xLegendSpace/2);						
				c.rotate(Math.PI/2);				
							
				c.fillText(labels[i],middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2 - 2);					
				c.restore();			
			} else {		
				var xLabelSpace = computeXLabelSpace(labels[i]);
			    if (labelOrientation == "vertical") {
			    	c.save();	    				    	
			    	c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/2);
			    	c.rotate(-Math.PI/2);
			    	c.textAlign = "center";	    	 
			    	c.fillText(labels[i],0, c.measureText(labels[i]).width / 2 + 6 );
			    	c.restore();
			     } else if (labelOrientation == "diagonal") {
			    	c.save();	    				    	
			    	c.translate(middleX  - (c.measureText(labels[i]).width / 2)* Math.cos(Math.PI/4), realHeight-step + (c.measureText(labels[i]).width / 2)* Math.sin(Math.PI/4));
			    	c.rotate(-Math.PI/4);
			    	c.textAlign = "center";	    	 
			    	c.fillText(labels[i],0, 16);
			    	c.restore();	
			     } else if (labelOrientation == "halfdiagonal") {
				    c.save();	    					    
				    c.translate(middleX  - (c.measureText(labels[i]).width / 2)* Math.cos(Math.PI/8), realHeight-step + (c.measureText(labels[i]).width / 2)* Math.sin(Math.PI/8));
				    c.rotate(-Math.PI/8);
				    c.textAlign = "center";	    	 
				    c.fillText(labels[i],0, 16 );
				    c.restore();		
			    } else {
			    	// horizontal			    				    	
			    	c.fillText(labels[i],middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/4);
			    }
			}
		}  
		c.font = font;
	}
	
}

function drawGrid() {		
			
	// draw  horizontal grid  (for Y labels)
	if (showGridY) {
		for(var i=0; i<tickCount+1; i++) {        			    	    	    
	    	var xColor = c.strokeStyle;
	    	if (obj.colorGridY !== "undefined") {
	    		c.strokeStyle = obj.colorGridY;
	    	}
	    	c.lineWidth = 0.2;        
	        c.beginPath(); 	        
	        c.moveTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);
	        var diff = 10;
	        if (obj.dualYaxis) {
	        	diff = hStep2;
	        }
	        c.lineTo(realWidth-diff,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = xColor;
	    }    
	} 	
	
	// draw  vertical grid  (for X labels)
    if (showGridX) {
    	for(var i=0; i<labels.length; i++) {   
    		var middleX = hStep + i*(realWidth-hStep-hStep2 )/data.length + (realWidth - hStep - hStep2 - gap*(1+Math.sqrt(series)))/data.length/2;	    	    
	    	var yColor = c.strokeStyle;
	    	if (obj.colorGridX !== "undefined") {
	    		c.strokeStyle = obj.colorGridX;
	    	}
	        c.lineWidth = 0.2;        
	        c.beginPath(); 
	        c.moveTo(middleX,10+titleSpace+legendSpace);  
	        c.lineTo(middleX,realHeight-step);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = yColor;
	    }    
	}  	
	
}

function drawAxis() {
	c.fillStyle = "black"; 
	c.lineWidth = 2.0; 
	var axisColor = c.strokeStyle;	
	
	// y axis
	if (obj.colorYaxis !== "undefined") {
		c.strokeStyle = obj.colorYaxis;
	}
	c.beginPath();     		
	c.moveTo(hStep-10,titleSpace+legendSpace); 
	c.lineTo(hStep-10,realHeight-step); 
	c.closePath();
	c.stroke();
	
	// x axis
	if (obj.colorXaxis !== "undefined") {
		c.strokeStyle = obj.colorXaxis;
	}	
	c.beginPath(); 
	c.moveTo(hStep-10,realHeight-step); 
	if (isH(chartType)) {
		c.lineTo(realWidth,realHeight-step);
	} else {
		var diff = 5;
		if (obj.dualYaxis) {
			diff = hStep2 - 5;
		}
		c.lineTo(realWidth-diff,realHeight-step);
	}
	c.closePath();
	c.stroke();
	
	// second y axis
	if (obj.dualYaxis) {
		if (obj.colorY2axis !== "undefined") {
			c.strokeStyle = obj.colorY2axis;
		}
		c.beginPath(); 
		c.moveTo(realWidth-hStep2,titleSpace+legendSpace); 	
		c.lineTo(realWidth-hStep2,realHeight-step);	
		c.closePath();
		c.stroke();
	}
	
	c.strokeStyle = axisColor;
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

//compute hStep (for vertical labels and yLegend to fit) 
function computeHStep(maxValY, yStep, takeCare) {	
	var result;
	var font = c.font;
	if (showTicks) {
		maxLabelWidth = 0;	
		if (typeof obj.yData !== "undefined") {	 		
			var yfont = obj.yData.font;		
	        if (adjustableTextFontSize) {
				yfont.size=getAdjustableLabelFontSize();
			}
			var b = " ";
			c.font = yfont.weight + b + yfont.size + "px" + b + yfont.family;
		}
		for(var i=0; i<tickCount+1; i++) {        
			var label = Math.round((maxValY-i*yStep)*100)/100;
			var labelWidth = c.measureText(label).width;
			if (labelWidth > maxLabelWidth) {
				maxLabelWidth = labelWidth;
			}   
		}      	
		result = maxLabelWidth + 20;
	} else {
		result = 20;
	}	
	c.font = font;
	
	if (obj.dualYaxis && !takeCare) {
		if (typeof obj.y2Legend !== "undefined") {		
			var b = " ";
			var f = obj.y2Legend.font;
			if (f === undefined) {
				f.weight = "bold";
				f.size = 12;
				f.family = "sans-serif";
			}
            if (adjustableTextFontSize) {
				f.size = getAdjustableLabelFontSize();
			}	
			c.font = f.weight + b + f.size + "px" + b + f.family;      
			y2LegendSpace = f.size;		    
			c.font = font;            
			result += y2LegendSpace;
		}
	}
				
	// take care for halfdiagonal, diagonal long labels
	// if they are too long hStep must be increased accordingly
	// for dual Y axis we do not need this
	if (takeCare) {	
		if (typeof obj.yLegend !== "undefined") {		
			var b = " ";
			var f = obj.yLegend.font;
			if (f === undefined) {
				f.weight = "bold";
				f.size = 12;
				f.family = "sans-serif";
			}
			if (adjustableTextFontSize) {
				f.size = getAdjustableLabelFontSize();
			}	
			c.font = f.weight + b + f.size + "px" + b + f.family;    
			var legendPadding = 20;		
			if (adjustableTextFontSize) {
				legendPadding = getAdjustableLabelFontSize();
			}
			yLegendSpace = +legendPadding + +f.size;		    
			c.font = font;            
			result += yLegendSpace;
		} 		
		
		var cf = c.font;
		if (obj.xData !== undefined) {		
			var b = " ";
			var xfont = obj.xData.font;
	        if (adjustableTextFontSize) {
				xfont.size=getAdjustableLabelFontSize();
			}
			c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
		}		
		var minPos = new Array();
		for(var i=0; i<labels.length; i++) {
			if (isH(chartType)) {    				    	
		    	realWidth = canvas.height - result/2;
		    	if (typeof obj.title !== "undefined") {	
		    		realWidth = realWidth - getTitleSpace();
		    	}
		    	if (typeof obj.legend !== "undefined") {  
		    		realWidth = realWidth - getLegendSpace();
		    	}    	
			} else {
				realWidth = canvas.width;
			}
			var middleX = result + i*(realWidth-result )/data.length + (realWidth - result - gap*(1+Math.sqrt(series)))/data.length/2;
			var angle;
			if (labelOrientation == "diagonal") {
				angle = Math.PI/4;	    			
		     } else if (labelOrientation == "halfdiagonal") {		    	
			    angle = Math.PI/8;		
		    } 
			if (angle !== undefined) {
				var len = middleX - c.measureText(labels[i]).width * Math.cos(angle);
				minPos.push(len);				    	
			}		
		}		
		var len = Math.min.apply( Math, minPos );
		if (minPos.length > 0) {			
	    	if (len < 10) {
	    		result += (10 - len);
	    	}	 
		}
	}
	return result;
}

// computes vertical step needed 
// returns maximum width for x labels
function computeVStep() {
	var xLabelWidth = 0;
	if (typeof obj.xData !== "undefined") {	 		
		var xfont = obj.xData.font;		
        if (adjustableTextFontSize) {
			xfont.size=getAdjustableLabelFontSize();
		}
		var b = " ";
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  		
	}
	if (showLabels) {
		for(var i=0; i<labels.length; i++) {            
		    var labelWidth = computeXLabelSpace(labels[i]);
		    if (labelWidth > xLabelWidth) {
		        xLabelWidth = labelWidth;
		    }   
		} 
	}
	var _xLegendSpace = 0;
	if (typeof obj.xLegend !== "undefined") {				
		var f = obj.xLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}		    
        if (adjustableTextFontSize) { 
			f.size = getAdjustableLabelFontSize();
		}
        var legendPadding = 20;		
		if (adjustableTextFontSize) {
			legendPadding = getAdjustableLabelFontSize();
		}
		_xLegendSpace = +legendPadding + +f.size;  
	}			
	if ((step < xLabelWidth+_xLegendSpace) || adjustableTextFontSize) {    
	    step = xLabelWidth+_xLegendSpace;	    		
	}	
	return xLabelWidth;
}

// depends on label orientation
function computeXLabelSpace(label) {
	var _labelWidth = c.measureText(label).width + 10; // vertical
    if (!isH(chartType)) {
	    if (labelOrientation === "horizontal") {
	    	if (typeof obj.xData !== "undefined") {	 	
	    		_labelWidth =  obj.xData.font.size + 20;
  		        if (adjustableTextFontSize) {
		    		_labelWidth=getAdjustableLabelFontSize() + 20;
		    	}
	    	} else {
	    		_labelWidth = 12 + 20;
	    	}	
	    } else if (labelOrientation === "halfdiagonal") {
	    	_labelWidth = c.measureText(label).width * Math.sin(Math.PI/8) + 20;
	    } else if (labelOrientation === "diagonal") {
	    	_labelWidth = c.measureText(label).width * Math.sin(Math.PI/4) + 20;
	    }
	}
    return _labelWidth;
}

function getTitleSpace() {	
	var space = 10;
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

function getXLegendSpace() {	
    var _xLegendSpace = 0;
	if (typeof obj.xLegend !== "undefined") {						
		var f = obj.xLegend.font;
		if (f === undefined) {			
			f.size = 12;			
		}	
		var legendPadding = 20;
        if (adjustableTextFontSize) {  
			f.size = getAdjustableLabelFontSize();
			legendPadding = getAdjustableLabelFontSize();
		}        				
		_xLegendSpace = +legendPadding + +f.size;
	}
	return _xLegendSpace;
}

function getLegendSpace() {
	var font = c.font;
	var _legendSpace = 20;
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;
		if (isH(chartType)) {	
			x = step;
		}
		c.font = "bold 10px sans-serif";
        if (adjustableTextFontSize) {
			c.font ="bold " + getAdjustableLabelFontSize() + "px sans-serif"; 
		}
        var legendPadding = 20;
		if (adjustableTextFontSize) {
			legendPadding = getAdjustableLabelFontSize()/2;
		}
		var legendY = getTitleSpace()+legendPadding;		
		for (var k=0; k<series; k++) {        			        
			var legendWidth = c.measureText(obj.legend[k]).width + 24;             			
			if (isH(chartType)) {					
				if (x + legendWidth > realHeight) {
					// draw legend on next line if does not fit on current one
					x = step;
					var lineSpace = 14;
					if (adjustableTextFontSize) {
						lineSpace = getAdjustableLabelFontSize();
					}	
					legendY = legendY + lineSpace;					
				}					
			} else {
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					var lineSpace = 14;
					if (adjustableTextFontSize) {
						lineSpace = getAdjustableLabelFontSize();
					}	
					legendY = legendY + lineSpace;
					if (!isH(chartType)) {
						var pad = 20;
						if (adjustableTextFontSize) {
							pad = getAdjustableLabelFontSize();
						}	
						_legendSpace += pad;
					}
				}    
			}								     
			x = x + legendWidth;			 
		} 
		if (obj.lineLegend !== undefined) {
			for (var k=0; k<obj.lineData.length; k++) {        			        
				var legendWidth = c.measureText(obj.lineLegend[k]).width + 24;   
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					var lineSpace = 14;
					if (adjustableTextFontSize) {
						lineSpace = getAdjustableLabelFontSize();
					}	
					legendY = legendY + lineSpace;					
					_legendSpace += lineSpace;					
				}  
			}	
			x = x + legendWidth;
		}
	}
	c.font = font;
	return _legendSpace;
}

function isStacked(chartType) {
	return (chartType == "stackedbar") || (chartType == "hstackedbar");
}

function isH(chartType) {
	return (chartType == "hbar") || (chartType == "hstackedbar");
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

function getAdjustableTitleFontSize() {
	return canvas.width/25;	
}

function getAdjustableLabelFontSize() {
	return canvas.width/45;	
}

drawBar(myjson, idCan, idTipCan, canWidth, canHeight);

};