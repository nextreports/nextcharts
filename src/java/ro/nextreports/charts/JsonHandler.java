package ro.nextreports.charts;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

import java.io.IOException;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

public class JsonHandler extends AbstractHandler {
	
	private String jsonHBar =			 
			"{\"data\":[[16,66,24,30,80,52],[48,50,29,60,60,58],[30,40,28,52,34,50]]," + 
	         " \"labels\":[\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\"]," + 
			 " \"color\":[\"#004CB3\",\"#A04CB3\",\"rgb(40,75,75)\"]," +
	         " \"legend\":[\"2011 First year of work\",\"2012 Second year of work\",\"2013 Third year of work\"]," +
			 " \"alpha\":0.6, \"showGridX\":true, \"showGridY\":true, \"colorGridX\":\"rgb(0,198,189)\", \"colorGridY\":\"rgb(0,198,189)\"," + 
//	         " \"message\":\"Value #val from #total\"," + 
//			 " \"showTicks\":false, " +
			 " \"tickCount\":5, " +
			 " \"title\":{\"text\":\"Financial Analysis\", \"font\":{\"weight\":\"bold\", \"size\":16, \"family\":\"sans-serif\"}, \"color\":\"blue\", \"alignment\":\"center\"}," +
	         " \"labelOrientation\":\"vertical\"," +
//	         //" \"background\":\"rgb(231,254,254)\"," +
	         " \"type\":\"hstackedbar\"," +
	         " \"style\":\"cylinder\"," +
	         " \"yData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"xData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"yLegend\":{\"text\":\"Price\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}," +
	         " \"xLegend\":{\"text\":\"Month\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}" +
	         "}";
			
//			"{\"data\":[[16,66,24,42,49,8]], \"type\":\"hbar\" }";
			
//		"{\"data\":[[20.0,5.0,12.0]],\"type\":\"bar\",\"style\":\"glass\",\"background\":\"#ffffff\",\"labels\":[\"Dunn Brandon\",\"Frest Mark\",\"Winters John\"],\"labelOrientation\":\"horizontal\",\"color\":[\"#0000cc\"],\"legend\":[\"WRK\"],\"alpha\":0.5,\"colorXaxis\":\"#000000\",\"colorYaxis\":\"#000000\",\"showGridX\":true,\"showGridY\":true,\"tickCount\":5,\"showTicks\":true,\"title\":{\"text\":\"Next Reports Hours\",\"font\":{\"weight\":\"bold\",\"size\":16,\"family\":\"SansSerif\"},\"color\":\"#000000\",\"alignment\":\"center\"},\"xData\":{\"color\":\"#000000\",\"font\":{\"weight\":\"normal\",\"size\":12,\"family\":\"SansSerif\"}},\"yData\":{\"color\":\"#000000\",\"font\":{\"weight\":\"normal\",\"size\":12,\"family\":\"SansSerif\"}}}";
	
	private String jsonBar = 
			"{\"data\":[[16,66,24,30,80,52],[48,50,29,60,70,58],[30,40,28,52,74,50]]," + 
	         " \"labels\":[\"JANUARY\",\"FEBRUARY\",\"MARCH\",\"APRIL\",\"MAY\",\"JUNE\"]," + 
			 " \"color\":[\"#004CB3\",\"#A04CB3\",\"#7aa37a\"]," +
	         " \"legend\":[\"2011 First year of work\",\"2012 Second year of work\",\"2013 Third year of work\"]," +
			 " \"alpha\":0.8, \"showGridX\":false, \"showGridY\":true," + 
	         " \"message\":\"Value #val\", \"tickCount\":5, " +
			 " \"title\":{\"text\":\"Financial Analysis\", \"font\":{\"weight\":\"bold\", \"size\":16, \"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"labelOrientation\":\"horizontal\"," +
	         " \"type\":\"bar\"," +
	         " \"style\":\"glass\"," +
	         //" \"onclick\":\"function() console.log(\"Call from JS function\");\"" +
	         " \"onClick\":\"function doClick(value){ console.log('Call from function : ' + value);}\""+
	         "}";
	
	private String jsonStacked = 
			"{\"data\":[[16,66,24,30,80,52],[48,50,29,60,60,58],[20,40,28,52,34,50]]," + 
	         " \"labels\":[\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\"]," + 
			 " \"color\":[\"#004CB3\",\"#A04CB3\",\"rgb(40,75,75)\"]," +
	         " \"legend\":[\"2011 First year of work\",\"2012 Second year of work\",\"2013 Third year of work\"]," +
			 " \"alpha\":0.6, \"showGridX\":true, \"showGridY\":true, \"colorGridX\":\"rgb(0,198,189)\", \"colorGridY\":\"rgb(0,198,189)\"," +
			 //" \"colorXaxis\":\"blue\", \"colorYaxis\":\"red\"," +
	         " \"message\":\"Value #val <br>from #total\", \"tickCount\":5, " +
			 " \"title\":{\"text\":\"Financial Analysis\", \"font\":{\"weight\":\"bold\", \"size\":16, \"family\":\"sans-serif\"}, \"color\":\"blue\", \"alignment\":\"center\"}," +
	         " \"labelOrientation\":\"horizontal\"," +
	         " \"background\":\"rgb(231,254,254)\"," +
	         " \"type\":\"stackedbar\"," +
	         " \"style\":\"dome\"," +
	         " \"yData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"xData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"yLegend\":{\"text\":\"Price\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}," +
	         " \"xLegend\":{\"text\":\"Month\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}" +
	         "}";			
		
	private String jsonStackLine = 
			"{\"data\":[[16,66,24,30,80,52],[48,50,29,60,60,58],[30,40,28,52,34,50]]," + 
	         " \"lineData\":[[31.33, 52, 27, 47.33, 74.66, 53.33],[100, 120, 53, 190, 40, 130]],"+
	         " \"labels\":[\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\"]," + 
			 " \"color\":[\"#004CB3\",\"#A04CB3\",\"rgb(40,75,75)\"]," +
	         " \"lineColor\":[\"#270283\", \"#CC6633\"]," +
	         " \"legend\":[\"2011\",\"2012\",\"2013\"]," +
	         " \"lineLegend\":[\"Average\", \"Profit\"]," +
			 " \"alpha\":0.6, \"showGridX\":true, \"showGridY\":true, \"colorGridX\":\"rgb(0,198,189)\", \"colorGridY\":\"rgb(0,198,189)\"," + 
	         " \"message\":\"Value #val from #total\", \"tickCount\":5, " +
			 " \"title\":{\"text\":\"Financial Analysis\", \"font\":{\"weight\":\"bold\", \"size\":16, \"family\":\"sans-serif\"}, \"color\":\"blue\", \"alignment\":\"center\"}," +
	         " \"labelOrientation\":\"horizontal\"," +
	         //" \"background\":\"rgb(231,254,254)\"," +
	         " \"type\":\"stackedbar\"," +
	         " \"style\":\"glass\"," +
	         " \"yData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"xData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"yLegend\":{\"text\":\"Price\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}," +
	         " \"xLegend\":{\"text\":\"Month\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}" +
	         "}";
			
			/** bar line */
//			"{\"data\":[[2,3,2,3,2,1],[1,2,1,2,3,1]]," + 
//	         " \"lineData\":[[2,1,3,2,3,2]],"+	
//	         " \"labels\":[\"4\",\"10\",\"6\",\"5\",\"4\",\"9\"]," + 
//	         " \"color\":[\"#7C7CD2\",\"#FB7C6C\"]," +
//	         " \"lineColor\":[\"#8BE2A0\"]," +
//	         " \"legend\":[\"One\",\"Two\"]," +
//	         " \"lineLegend\":[\"Three\"]," +
//			 " \"alpha\":1, \"showGridX\":true, \"showGridY\":true, \"colorGridX\":\"#F5E1AA\", \"colorGridY\":\"#F5E1AA\"," + 
//	         " \"message\":\"Value #val from #total\", \"tickCount\":5, " +			 	         
//	         " \"background\":\"#F8F8D8\"," +
//	         " \"type\":\"bar\"," +
//	         " \"style\":\"normal\"" +	         
//	         "}";
	
			/** bar line - bet index */
//			"{\"data\":[[6205, 6090, 6220, 6350, 6140, 6560, 6230, 6165, 6180, 6175, 6235, 6210]]," + 
//		    " \"lineData\":[[6490, 6455, 6485, 6500, 6550, 6600, 6575, 6510, 6530, 6540, 6560, 6555]],"+	
//		    " \"labels\":[\"3\",\"6\",\"7\",\"8\",\"9\",\"10\",\"13\",\"14\",\"15\",\"16\",\"17\",\"20\"]," + 
//		    " \"color\":[\"#004CB3\"]," +
//		    " \"lineColor\":[\"#A04CB3\"]," +
//		    " \"legend\":[\"Valoare tranzactii (mil RON)\"]," +
//		    " \"lineLegend\":[\"Indice BET (puncte)\"]," +
//			 " \"alpha\":1, \"showGridX\":false, \"showGridY\":true, \"colorGridX\":\"red\", \"colorGridY\":\"rgb(0,198,189)\"," + 
//		    " \"message\":\"#val\", \"tickCount\":5, " +			 	         		    
//		    " \"type\":\"bar\"," +
//		    " \"style\":\"glass\"" +	         
//		    "}";
	
	
	
	private String jsonLine = 
			"{\"data\":[[16,66,24,30,80,52],[48,50,29,60,60,58],[30,40,28,52,34,50]]," + 
	         " \"labels\":[\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\"]," + 
			 " \"color\":[\"#004CB3\",\"#A04CB3\",\"rgb(40,75,75)\"]," +
	         " \"legend\":[\"2011 First year of work\",\"2012 Second year of work\",\"2013 Third year of work\"]," +
			 " \"alpha\":0.4, \"showGridX\":true, \"showGridY\":true, \"colorGridX\":\"rgb(0,198,189)\", \"colorGridY\":\"rgb(0,198,189)\"," + 
	         " \"message\":\"Value #val\", \"tickCount\":5, " +
			 " \"title\":{\"text\":\"Financial Analysis\", \"font\":{\"weight\":\"bold\", \"size\":16, \"family\":\"sans-serif\"}, \"color\":\"blue\", \"alignment\":\"center\"}," +
	         " \"labelOrientation\":\"horizontal\"," +
	         //" \"background\":\"rgb(231,254,254)\"," +
	         " \"type\":\"area\"," +
	         " \"style\":\"soliddot\"," +
	         " \"yData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"xData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"yLegend\":{\"text\":\"Price\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}," +
	         " \"xLegend\":{\"text\":\"Month\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}" +
	         "}";
	
	private String jsonPie = 
			"{\"data\":[[16,66,24,30,80,52]]," + 
	         " \"labels\":[\"JANUARY\",\"FEBRUARY\",\"MARCH\",\"APRIL\",\"MAY\",\"JUNE\"]," + 
			 " \"color\": [\"#004CB3\",\"#A04CB3\", \"#7aa37a\", \"#f18e9f\", \"#90e269\", \"#bc987b\"]," +	         
			 " \"alpha\":0.4," + 
	         " \"message\":\"Value #val from #total<br>#percent% of 100%\"," +
			 " \"title\":{\"text\":\"Financial Analysis\", \"font\":{\"weight\":\"bold\", \"size\":16, \"family\":\"sans-serif\"}, \"color\":\"blue\", \"alignment\":\"center\"}," +	         
	         //" \"background\":\"rgb(231,254,254)\"," +
	         " \"xData\":{\"font\":{\"weight\":\"bold\",\"size\":16,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	         " \"type\":\"pie\"" +	         
	         "}";
	
	private String jsonBubble = 
			"{\"data\":[[80.66,79.84,78.6,72.73,80.05,72.49,68.09,81.55,68.6,78.09],[1.67,1.36,1.84,2.78,2,1.7,4.77,2.96,1.54,2.05],[33739900,81902307,5523095,79716203,61801570,73137148,31090763,7485600,141850000,307007000],[\"North America\",\"Europe\",\"Europe\",\"Middle East\",\"Europe\",\"Middle East\",\"Middle East\",\"Middle East\",\"Europe\",\"North America\"]]," + 	    
	        " \"labels\":[\"CAN\",\"DEU\",\"DNK\",\"EGY\",\"GBN\",\"IRN\",\"IRQ\",\"ISR\",\"RUS\",\"USA\"]," + 
			" \"color\":[\"#004CB3\",\"#A04CB3\",\"#7aa37a\"]," +	 
			" \"categories\":[\"North America\",\"Europe\",\"Europe\",\"Middle East\",\"Europe\",\"Middle East\",\"Middle East\",\"Middle East\",\"Europe\",\"North America\"]," +	
			" \"alpha\":0.6," + 
			" \"showGridX\":true," + 
			" \"showGridY\":true," +			 
			" \"colorGridX\":\"rgb(0,198,189)\"," + 
			" \"colorGridY\":\"rgb(0,198,189)\"," + 
	        " \"message\":\"#label<br>Life Expectancy: #x<br>Fertility Rate: #val<br>Region: #c<br>Population: #z\"," + 
	        " \"tickCount\":4, " +
			" \"title\":{\"text\":\"Population Correlation\", \"font\":{\"weight\":\"bold\", \"size\":14, \"family\":\"sans-serif\"}, \"color\":\"blue\", \"alignment\":\"center\"}," +
	        " \"labelOrientation\":\"horizontal\"," +			        
	        " \"type\":\"bubble\"," +
	        " \"style\":\"normal\"," +
	        " \"yData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	        " \"xData\":{\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"blue\"}," +
	        " \"yLegend\":{\"text\":\"Fertility Rate\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}," +
	        " \"xLegend\":{\"text\":\"Life Expectancy\",\"font\":{\"weight\":\"bold\",\"size\":14,\"family\":\"sans-serif\"}, \"color\":\"#993366\"}" +
	        "}";    
						
	public void handle(String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		
		String type = request.getParameter("type");		
		response.setContentType("application/json");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setStatus(HttpServletResponse.SC_OK);
		baseRequest.setHandled(true);
		if (type.equals("hbar")) {
			response.getWriter().println(jsonHBar);
		} else if (type.equals("bar")) {
			response.getWriter().println(jsonBar);	
		} else if (type.equals("stackedbar")) {
			response.getWriter().println(jsonStacked);
		} else if (type.equals("line")) {
			response.getWriter().println(jsonLine);
		} else if (type.equals("pie")) {
			response.getWriter().println(jsonPie);
		} else if (type.equals("bubble")) {
			response.getWriter().println(jsonBubble);	
		} else {
			response.getWriter().println(jsonStackLine);
		}					
	}

	public static void main(String[] args) throws Exception {
		Server server = new Server(8080);
		server.setHandler(new JsonHandler());

		server.start();
		server.join();
	}
}
