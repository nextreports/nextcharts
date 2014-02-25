function nextChart(myjson, idCan, idTipCan) {	
	var can = document.getElementById(idCan);
	var tipCan = document.getElementById(idTipCan);		
	nextChart(myjson, idCan, idTipCan, can.width, can.height);	
}

function nextChart(myjson, idCan, idTipCan, canWidth, canHeight) {			
	var chartType = myjson.type;
	if (typeof chartType === "undefined") {
	    chartType = "line";
	}		
	
	//zoom
	if ((canWidth === "100%") && (canHeight === "100%")) {
		var can = document.getElementById(idCan);
		can.width = $(window).width();
		can.height = $(window).height();	  
	}
	
	if (isBar(chartType)) {
		barChart(myjson, idCan, idTipCan, canWidth, canHeight);
	} else if (isPie(chartType)) {
		pieChart(myjson, idCan, idTipCan, canWidth, canHeight);	
	} else {
		lineChart(myjson, idCan, idTipCan, canWidth, canHeight);
	}		
}	

function isBar(chartType) {
	return (chartType == "bar") || (chartType == "hbar") || (chartType == "stackedbar") || (chartType == "hstackedbar");
}

function isLine(chartType) {
	return (chartType == "line") || (chartType == "area");
}

function isPie(chartType) {
	return (chartType == "pie");
}