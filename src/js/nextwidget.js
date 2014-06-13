function nextWidget(type, myjson, id, zoom, useParentWidth) {				
				
	if (type == "indicator") {
		indicator(id, myjson, zoom, useParentWidth);
	} else if (type == "display") {
		display(id, myjson, zoom, useParentWidth);
	} else if (type == "alarm") {
		alarm(id, myjson, zoom, useParentWidth);
	}
}	
