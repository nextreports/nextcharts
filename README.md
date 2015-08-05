#NextCharts

NextCharts is an open source HTML5 charts library which uses the canvas tag for drawing. This library is used by [NextReports](https://github.com/nextreports/nextreports) from version 7.

Following types of charts & styles can be defined (where h stands for horizontal):  
  
* __bar__ : normal, glass, dome, cylinder, parallelepiped, combo with lines  
* __stackedbar__ : normal, glass, dome, cylinder, parallelepiped  
* __hbar__ : normal, glass, dome, cylinder, parallelepiped  
* __hstackedbar__ : normal, glass, dome, cylinder, parallelepiped  
* __line__ : normal, soliddot, hollowdot, anchordot, bowdot, stardot  
* __area__ : normal, soliddot, hollowdot, anchordot, bowdot, stardot  
* __pie__  
* __bubble__

![alt tag](http://2.bp.blogspot.com/-ouJicYwR4D0/Uv3pAiWORgI/AAAAAAAAJDo/a6RxWpXU3QM/s1600/NextServerCharts-white.png)

NextCharts supports dual axis definition and it allows to have a combo chart with bars and lines. As opposite to other charts libraries, tooltips are seen only on real selection of elements (and not on any position) and they are following the mouse cursor to allow for a smooth visualization. Other charts libraries have a fixed position for tooltips when entering the selection and user cannot move the mouse to  a position which is under the tooltip, making the interaction more clumsy.

A small number of widgets is also contained by this library. This set includes alarm (status), indicator (gauge), display (value & comparison)

![alt tag](http://2.bp.blogspot.com/-1lSssWLMPOs/U5hWOr0pwWI/AAAAAAAAJf8/Eof9uAbvvm4/s1600/a2.png)

##Samples

Some samples (to see how json properties must be specified) can be found in src/html:

1. main-test.html, main-test-dualAxis.html    independent chart tests
2. main-jetty-test.html                       jetty chart test (must run ro.nextreports.charts.JsonHandler to start server)
3. main-widget-test.html                      independent widget test   

##Articles

* [Origins](http://blog.next-reports.com/2014/02/nextcharts-new-html5-library-for.html)
* [How To Use](http://blog.next-reports.com/2014/02/nextcharts-developer-perspective.html)
* [Styles](http://blog.next-reports.com/2014/02/nextcharts-styles.html)
* [Tooltips](http://blog.next-reports.com/2014/03/nextcharts-tooltip-messages.html)
* [Dual Y Axis](http://blog.next-reports.com/2014/10/nextcharts-dual-y-axis.html)
* [Combo Bar & Lines](http://blog.next-reports.com/2014/02/nextcharts-combo-bar-line-charts.html)
* [Bubble Chart](http://blog.next-reports.com/2014/03/nextreports-creating-bubble-chart.html)
* [Indicator](http://blog.next-reports.com/2014/05/nextcharts-indicator.html)
* [Display](http://blog.next-reports.com/2014/05/nextcharts-display-widget.html)
* [Display-2](http://blog.next-reports.com/2014/08/display-revisited.html)
* [Alarm](http://blog.next-reports.com/2014/06/nextcharts-alarm-widget.html)

##Read more

You can find information about NextCharts on following links:

1. NextReports Blog: http://blog.next-reports.com/
2. NextReports Site: http://next-reports.com/

