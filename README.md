#NextCharts
     _   _           _   _____ _                _       
    | \ | |         | | /  __ \ |              | |      
    |  \| | _____  _| |_| /  \/ |__   __ _ _ __| |_ ___ 
    | . \ |/ _ \ \/ / __| |   | '_ \ / _` | '__| __/ __|
    | |\  |  __/>  <| |_| \__/\ | | | (_| | |  | |_\__ \
    \_| \_/\___/_/\_\\__|\____/_| |_|\__,_|_|   \__|___/
                                                                                                        
Open source HTML5 charts using the canvas tag. This library is used by [NextReports](https://github.com/nextreports/nextreports) from version 7.

Following type of charts & styles can be defined (where h is for horizontal):  
  
* __bar__ : normal, glass, dome, cylinder, parallelepiped, combo with lines  
* __stackedbar__ : normal, glass, dome, cylinder, parallelepiped  
* __hbar__ : normal, glass, dome, cylinder, parallelepiped  
* __hstackedbar__ : normal, glass, dome, cylinder, parallelepiped  
* __line__ : normal, soliddot, hollowdot, anchordot, bowdot, stardot  
* __area__ : normal, soliddot, hollowdot, anchordot, bowdot, stardot  
* __pie__  
* __bubble__

NextCharts supports dual axis definition and it allows to have a combo chart with bars and lines. 

![alt tag](http://2.bp.blogspot.com/-ouJicYwR4D0/Uv3pAiWORgI/AAAAAAAAJDo/a6RxWpXU3QM/s1600/NextServerCharts-white.png)

A small number of widgets is also contained by this library. This set includes alarm (status), indicator (gauge), display (value & comparison)

![alt tag](http://2.bp.blogspot.com/-1lSssWLMPOs/U5hWOr0pwWI/AAAAAAAAJf8/Eof9uAbvvm4/s1600/a2.png)

##Samples

Some samples (to see how json properties must be specified) can be found in src/html:

1. main-test.html, main-test-dualAxis.html    independent chart tests
2. main-jetty-test.html                       jetty chart test (must run ro.nextreports.charts.JsonHandler to start server)
3. main-widget-test.html                      independent widget test   

##Read more

You can find information about NextCharts on following links:

1. NextReports Blog: http://blog.next-reports.com/
2. NextReports Site: http://next-reports.com/
