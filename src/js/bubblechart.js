 /*
 * Json must contain as mandatory only "data" attribute 
 * 
 * type -> bubble
 * style -> normal, glass
 * labelOrientation -> horizontal, vertical, diagonal, halfdiagonal
 * showLabels -> true means X labels are shown on X axis; we can use false if we want to show them in message tooltip with #x
 * message -> can have markup #val for value, #x for x value, #z for size value, #c for category value, #label for id label
 *         -> can contain <br> to split text on more lines
 * title.alignment -> center, left, right
 * styleGridX, styleGridY -> line, dot, dash
 * onClick -> is a javascript function like 'function doClick(value){ ...}' 
 * 
 * data contains : x, y, z 
 * labels contains ids array (as an exception of other charts, we will not draw them on X axis, but other labels obtained as X ticks from x data)
 * categories contains  categories array 
 * color contains colors only for distinct categories      
 * legend must be computed from categories (unique categories)      
 * 
 * { "type": "bubble"
 *   "style": "normal",
 *   "background" : "white",
 * 	 "data": [[80.66,79.84,78.6,72.73,80.05,72.49,68.09,81.55,68.6,78.09], [ 1.67, 1.36, 1.84, 2.78, 2, 1.7, 4.77, 2.96, 1.54, 2.05 ], [ 33739900, 81902307, 5523095, 79716203, 61801570, 73137148, 31090763, 7485600, 141850000, 307007000 ] ], 
 *   "labels": ["CAN", "DEU", "DNK", "EGY", "GBN", "IRN", "IRQ", "ISR", "RUS", "USA"],
 *   "categories": [ "North America", "Europe", "Europe", "Middle East", "Europe", "Middle East", "Middle East", "Middle East", "Europe", "North America" ]
 *   "labelOrientation": "horizontal",  
 *   "color": ["#004CB3","#A04CB3", "#7aa37a"], 
 *   "alpha" : 0.8, 
 *   "colorXaxis": "blue",
 *   "colorYaxis": "blue",
 *   "showGridX": true, 
 *   "showGridY": true, 
 *   "showLabels": true,
 *   "colorGridX": "rgb(248, 248, 216)", 
 *   "colorGridY": "rgb(248, 248, 216)", 
 *   "styleGridX": "line",
 *   "styleGridY": "line",
 *   "message" : "Value \: #val", 
 *   "showTicks" : true,
 *   "tickCount" : 5, 
 *   "startingFromZero" : false,
 *   "title" : {
 *   	"text": "Correlation between life expectancy, fertility rate and population", 
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
 *      "text": "Life Expectancy", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "yLegend" : {
 *      "text": "Fertility Rate",
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
 *   "onClick" : "function doClick(value){console.log("Call from function: " + value);}"
 * }
 * 
 */ 

var bubbleChart = function(myjson, idCan, idTipCan, canWidth, canHeight) {

var obj;
var data;
var labels = new Array(); 
var labelOrientation;
var globalAlpha;
var showGridX;
var showGridY;
var showLabels;
var background;
var message;
var tickCount;
var showTicks;
var startingFromZero;
var chartType;
var chartStyle;
var seriesColor;
var xData, yData;
var series;
var uniqueCategories = new Array();
var yStep;
var dotsK = new Array();
var max;
var min;
//space between 2 ticks
var tickStep;

var minValY;
var maxValY;
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
var realWidth;
var realHeight;
var canvas;  
var c; 
var tipCanvas;
var H = new Array();
var dotRadius = 3;
// space between X axis and first tick
var tickInit;
var resizeWidth = false;
var resizeHeight = false;
//by default chart title, legends and axis values strings have a defined font size
//if we want to have font size scaled accordingly with chart width then this property must be true 
//(such example may be when we want to show the chart on a big monitor)
var adjustableTextFontSize = false;

function drawBubble(myjson, idCan, idTipCan, canWidth, canHeight) {	
			
	canvas = document.getElementById(idCan);  
	if (canvas == null) {
		return;
	}
	tipCanvas = document.getElementById(idTipCan);
	c = canvas.getContext('2d');
	
	obj = myjson;
	chartType = obj.type;
	if (typeof chartType === "undefined") {
	    chartType = "bubble";
	}		
					
	background = obj.background;
	if (typeof background === "undefined") {	
		background = "white";
	}
		
	chartStyle = obj.style;
	// test for passing a wrong style
	if ((typeof chartStyle === "undefined") || (find(['normal', 'glass'],chartStyle) === false)) {	
		chartStyle = "normal";
	}	
	
	data = obj.data[0];
	for (var i=0;i<obj.categories.length;i++){
		var cat = obj.categories[i];
		if (find(uniqueCategories,cat) === false) {
			uniqueCategories.push(cat);
		}
		H.push(6);
	}
	obj.legend = uniqueCategories;
	series = uniqueCategories.length;		
	
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
	
	startingFromZero = obj.startingFromZero;
	if (typeof startingFromZero === "undefined") {
		startingFromZero = false;
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
		message = "#label<br>X: #x<br>Y: #val<br>Z: #z<br>Series: #c";		
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
	
	// compute Y min ,max values	    	
    max = Math.max.apply( Math, obj.data[1]);	         
    min = Math.min.apply( Math, obj.data[1]);
    if (startingFromZero && (min > 0)) {
    	min = 0;
    } 
    
    var objStep = calculateYStep(min, max, tickCount);
    yStep = objStep.yStep;
    minValY = objStep.minValY;
    maxValY = objStep.maxValY;
    
    // compute X labels
    var xmax = Math.max.apply( Math, obj.data[0]);	         
    var xmin = Math.min.apply( Math, obj.data[0]);
    var xobjStep = calculateYStep(xmin, xmax, tickCount);
    var x_yStep = xobjStep.yStep;
    var minValX = xobjStep.minValY;
    var maxValX = xobjStep.maxValY;
    for(var i=0; i<tickCount+1; i++) {        		
		var label;
		if (obj.tooltipPattern !== undefined) {
			// y labels can have more than two decimals
			var decimals = obj.tooltipPattern.decimals;
			var exp = Math.pow(10, decimals);
			label = Math.round((maxValX-i*x_yStep)*exp)/exp;
		} else {
			label = Math.round((maxValX-i*x_yStep)*100)/100;
		}
		labels.unshift(label);
    }	
    
    // compute hStep (for vertical labels and yLegend to fit) 
	hStep = computeHStep();	
        		
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
	}    
}


function animDraw() {      
    if (drawIt(H)) {          		    
        return false;
    }    
    for (var i=0;i<obj.categories.length;i++){
    	H[i] += 1+(realHeight-step-titleSpace-legendSpace)/30;
    }
    window.requestAnimFrame(animDraw);      
}    


// function called repetitive by animation
function drawIt(H) {    		
	
	// to redraw the entire canvas (it extends under drawn x axis)
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
	
	var lx0 = hStep + (realWidth - hStep - gap*2) / labels.length /2;
	var lxn = hStep + ((labels.length-1)*(realWidth-hStep )/labels.length)  + (realWidth - hStep - gap*2) / labels.length /2;
	var mx = (labels[labels.length-1]-labels[0]) / (lxn-lx0) ;
	var nx = (labels[0]*lxn -labels[1]*lx0) / (lxn-lx0);
	
	var ly0 = tickInit+titleSpace+legendSpace;
	var lyn = tickCount*tickStep+tickInit+titleSpace+legendSpace;
	var y0 = getYValue(0, maxValY, yStep)
	var yn = getYValue(tickCount, maxValY, yStep)
	var my = (yn - y0) / (lyn - ly0);
	var ny = (y0*lyn - yn*ly0) / (lyn - ly0); 		
	var maxRadius = tickStep*tickCount/4;	
	var maxZ = Math.max.apply( Math, obj.data[2]);	
				
	var radius = new Array();	
	for (var i=0; i<data.length; i++) {						
		var dataX = hStep + (obj.data[0][i] - nx) / mx + gap/2 - c.measureText("0").width / 2 -yLegendSpace/4;		  
		var dataY = (obj.data[1][i] - ny) / my;		
		radius[i] = obj.data[2][i]*(maxRadius/maxZ)*2/Math.PI+4;
		if (radius[i] < 3) {
			radius[i] = 3;
		}
			
		if (radius[i] < H[i]) {
	        H[i] = radius[i];
	        var test = false;
			for (var j=0; j<data.length; j++) {
				if (radius[j] >= H[j]) {
					test = true;
				}
			}
			if (test) {
				stop = false;
			}
		} else {
			stop = false;
		}				 
				
		var sColor = getSeriesColor(i);	
		c.strokeStyle = sColor;
		
		if (chartStyle == "glass") {	
			var gradient = c.createLinearGradient( dataX-2*H[i], dataY-2*H[i], 4*H[i], 4*H[i] );
			gradient.addColorStop( 0, "#ddd" );
			gradient.addColorStop( 1, sColor );
			c.fillStyle = gradient;	
		} else {
			c.fillStyle = sColor;	
		}
		
			
        c.beginPath();                
        c.arc(dataX, dataY, H[i], 0,Math.PI*2);                
        
        if (withFill) {
			c.globalAlpha = globalAlpha;
			c.fill();
			c.globalAlpha = 1;
			var oldStroke = c.strokeStyle;
			c.strokeStyle = "#fff";
			c.stroke();	  
			c.strokeStyle = oldStroke;
		} else {			
	    	if (c.isPointInPath(mousePos.x, mousePos.y)) {	    		
	    		var tValue = obj.data[1][i];
	    		if (obj.tooltipPattern !== undefined) {
	    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
	    		}	  
	    		var returnValue = obj.data[0][i]; // tValue
	    		if (withClick) {
	    			return returnValue;
	    		} else {
			    	var mes = String(message).replace('#val', tValue);	
			    	mes = mes.replace('#x', returnValue);
			    	mes = mes.replace('#z', obj.data[2][i]);
			    	mes = mes.replace('#c', obj.categories[i]);
			    	mes = mes.replace('#label', obj.labels[i]);
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
		
	if (withFill) {
		return stop;
	} else {
		// empty tooltip message
		return "";
	}
}

function getYValue(i, maxValY, yStep) {
	var label;
	if (obj.tooltipPattern !== undefined) {
		// y labels can have more than two decimals
		var decimals = obj.tooltipPattern.decimals;
		var exp = Math.pow(10, decimals);
		label = Math.round((maxValY-i*yStep)*exp)/exp;
	} else {
		label = Math.round((maxValY-i*yStep)*100)/100;
	}
	return label;
}

function getSeriesColor(i) {
	var cat = obj.categories[i];
	var ind = find(uniqueCategories,cat);
	if (ind === false) {
		return "white";
	}
	return seriesColor[ind];
}

function drawInit() {
	
	var font = c.font;
	
	//draw background (clear canvas)
	c.fillStyle = background; 	
	c.fillRect(0,0,realWidth,realHeight);			
	
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
			xTitle = hStep;
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
		
		c.fillText(obj.xLegend.text, realWidth/2- c.measureText(obj.xLegend.text).width/2 , realHeight - f.size );    
		c.font = font;   	
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
    	c.fillText(obj.yLegend.text,0, f.size);
    	c.restore();		    
		c.font = font;            
	} else {
		yLegendSpace = 0;
	}    

	// draw legend	
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;		
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
					
			c.fillText("---- " + obj.legend[k], x, legendY);
			     
			x = x + legendWidth;			
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
			if (obj.tooltipPattern !== undefined) {
				// y labels can have more than two decimals
				var decimals = obj.tooltipPattern.decimals;
				var exp = Math.pow(10, decimals);
				label = Math.round((maxValY-i*yStep)*exp)/exp;
			} else {
				label = Math.round((maxValY-i*yStep)*100)/100;
			}
			var labelWidth = c.measureText(label).width;   						
			
			c.fillText(label + "",hStep - 15 - labelWidth , i*tickStep+tickInit+titleSpace+legendSpace);
			
			c.lineWidth = 2.0; 
			c.beginPath();     
		    c.moveTo(hStep-15,i*tickStep+tickInit+titleSpace+legendSpace);     
		    c.lineTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);   
		    c.closePath();    
		    c.stroke();    	       	    
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
		    var middleX = hStep + i*(realWidth-hStep )/labels.length + (realWidth - hStep - gap*2)/labels.length/2;
		    		
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
			    c.fillText(labels[i],0, 16);
			    c.restore();		
			} else {
			   	// horizontal
			   	c.fillText(labels[i],middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/4);
			}
			
		}  
		c.font = font;
	}
	
}

function drawGrid() {		
			
	// draw  horizontal grid  (for Y labels)
	if (showGridY) {
		if (obj.styleGridY !== "undefined") {
			if (obj.styleGridY == "dot") {
				c.setLineDash([1, 3]);
			} else if (obj.styleGridY == "dash") {
				c.setLineDash([5, 8]);
			} 	
		}	
		for(var i=0; i<tickCount+1; i++) {        			    	    	    
	    	var xColor = c.strokeStyle;
	    	if (obj.colorGridY !== "undefined") {
	    		c.strokeStyle = obj.colorGridY;
	    	}
	    	c.lineWidth = 0.2;        
	        c.beginPath(); 
	        c.moveTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.lineTo(realWidth-10,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = xColor;
	    }   
		c.setLineDash([]);
	} 	
	
	// draw  vertical grid  (for X labels)
    if (showGridX) {
    	if (obj.styleGridX !== "undefined") {
			if (obj.styleGridX == "dot") {
				c.setLineDash([1, 3]);
			} else if (obj.styleGridX == "dash") {
				c.setLineDash([5, 8]);
			} 	
		}	
    	for(var i=0; i<labels.length; i++) {   
    		var middleX = hStep + i*(realWidth-hStep )/labels.length + (realWidth - hStep - gap*2)/labels.length/2;	    	    
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
    	c.setLineDash([]);
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
	
	c.lineTo(realWidth-5,realHeight-step);
	
	c.closePath();
	c.stroke();
	
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
function computeHStep() {	
	var result;
	var font = c.font;
	if (showTicks) {
		var maxLabelWidth = 0;	
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
	
	// take care for halfdiagonal, diagonal long labels
	// if they are too long hStep must be increased accordingly
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
		realWidth = canvas.width;		
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
			
			if (x + legendWidth > realWidth) {
				// draw legend on next line if does not fit on current one
				x = hStep;
				var lineSpace = 14;
				if (adjustableTextFontSize) {
					lineSpace = getAdjustableLabelFontSize();
				}	
				legendY = legendY + lineSpace;		
				var pad = 20;
				if (adjustableTextFontSize) {
					pad = getAdjustableLabelFontSize();
				}	
				_legendSpace += pad;			
			}    
											     
			x = x + legendWidth;			 
		} 
	}
	c.font = font;
	return _legendSpace;
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

drawBubble(myjson, idCan, idTipCan, canWidth, canHeight);

};

