function nextWidget(type, myjson, id, zoom) {				
				
	if (type == "indicator") {
		indicator(id, myjson, zoom);
	} else if (type == "display") {
		display(id, myjson, zoom);
	}
}	
