/*
 * Capture a list fo elements to a pdf document
 * 
 * This needs htlm2canvas and jspdf libraries
 * 
 * pdfSettings object contains following properties:
 * 	-	doc is a jspdf document
 * 	-	elements is the list of elements needed to be saved
 * 	-	position is the position used inside elements list (must be 1 if we have at least 2 elements, otherwise must not be set)
 * 	-	title a title shown on first page
 * 	-	showFooter if true will show Page x / y at the end of every page
 * 
 */

var capturePdf =  function(pdfSettings) {
		
var elementId; 
if (pdfSettings.position === undefined) {
	elementId = pdfSettings.elements[0];
} else {
	elementId = pdfSettings.elements[pdfSettings.position-1];
}
if ((pdfSettings.position === undefined) || (pdfSettings.position == 1)) {
	if (pdfSettings.title !== undefined) {
		centeredText(pdfSettings.doc, pdfSettings.title, 10);
	}
}
html2canvas($(elementId), {
          onrendered: function(canvas) {         
              var imgData = canvas.toDataURL('image/png');                    
              //console.log("**** elementId="+elementId + "  position="+pdfSettings.position);
              //console.log("     page width="+pdfSettings.doc.internal.pageSize.width);
              //console.log("     image width=" +$(elementId).width());
              var chartWidth = ($(elementId).width()*25.4)/96;
              var chartHeight = ($(elementId).height()*25.4)/96;	
                
              var scaledWidth = 0, scaledHeight = 0;
              if (chartHeight > pdfSettings.doc.internal.pageSize.height) {
              	if (chartWidth > pdfSettings.doc.internal.pageSize.width) {
              		if (chartHeight - pdfSettings.doc.internal.pageSize.height > chartWidth - pdfSettings.doc.internal.pageSize.width) {
              			scaledWidth = chartWidth*(pdfSettings.doc.internal.pageSize.height-20)/chartHeight;
                  		scaledHeight = pdfSettings.doc.internal.pageSize.height-20;
              		} else {
             			scaledWidth = pdfSettings.doc.internal.pageSize.width-20;
              			scaledHeight = chartHeight*(pdfSettings.doc.internal.pageSize.width-20)/chartWidth;
              		}
              	} else {
              		scaledWidth = chartWidth*(pdfSettings.doc.internal.pageSize.height-20)/chartHeight;
              		scaledHeight = pdfSettings.doc.internal.pageSize.height-20;
              	}
              } else if (chartWidth > pdfSettings.doc.internal.pageSize.width) {
              	scaledWidth = pdfSettings.doc.internal.pageSize.width-20;
      			scaledHeight = chartHeight*(pdfSettings.doc.internal.pageSize.width-20)/chartWidth;
              }
              
              if (scaledWidth > 0) {
              	var y = (pdfSettings.doc.internal.pageSize.height - scaledHeight) / 2;
              	if (y < 10) {
              		y = 10;
              	}
              	pdfSettings.doc.addImage(imgData, 'PNG', 10, y, scaledWidth, scaledHeight);
              } else {
              	var x = (pdfSettings.doc.internal.pageSize.width - chartWidth) / 2;
              	var y = (pdfSettings.doc.internal.pageSize.height - chartHeight) / 2;
              	pdfSettings.doc.addImage(imgData, 'PNG', x, y);
              }
              
              var page = 1;                
              var	size = pdfSettings.elements.length;                
              if (pdfSettings.position !== undefined) {
              	page = pdfSettings.position;
              }
                
                
              if (pdfSettings.showFooter) {            	  
            	  var text = "Page " + page + " / " + size;
            	  if (pdfSettings.footerText !== undefined) {
            		  text = pdfSettings.footerText;
            	  }

            	  centeredText(pdfSettings.doc, text, pdfSettings.doc.internal.pageSize.height-5, 150, 10);  
              }
                
                              
              if ((pdfSettings.position !== undefined) && (pdfSettings.position < size)) {
            	  pdfSettings.doc.addPage();
              	  pdfSettings.position = pdfSettings.position+1;
              	  capturePdf(pdfSettings);
              } else {
               	
            	  pdfSettings.doc.setProperties({
              			title: 'Dashboard',
              			subject: 'NextReports Dashboard',
              			author: 'NextCharts',
              			keywords: 'nextreports, dashboard, pdf',
              			creator: 'Mihai Dinca-Panaitescu'
               	  });                	                	
                	
            	  //console.log("**** SAVE");
            	  pdfSettings.doc.save('dashboard.pdf');
              }
        }
      });	    

function centeredText(doc, text, y, color, fontSize) {
	   if (color !== undefined) {
	   	  doc.setTextColor(color);
	   }
	   if (fontSize !== undefined) {
		   doc.setFontSize(fontSize);
	   }
	   var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
	   var textOffset = (doc.internal.pageSize.width - textWidth) / 2;	   
	   doc.text(textOffset, y, text);
}

}