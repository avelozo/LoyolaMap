

function getBuildings(){

var newJSON =  [];

    $.getJSON("data/buildings.json", function(data){
          $.each(data.buildings, function(i,item){
            
          var aux = {};       
          aux.label = item.name;
          aux.value = item.id;
          aux.description = item.description;
          aux.img = item.img;
          aux.xmin=item.xmin;
          aux.ymin=item.ymin;
          aux.xmax= item.xmax;
          aux.ymax= item.ymax;

          newJSON.push(aux)
    });       
    });
             
              return newJSON;
}


function addMarker(x,y) {
              var img = document.createElement("img");
              img.src = "img/marker.png";
              img.id="marker";
              var point = new OpenSeadragon.Point(x+0.03, y+ 0.03);
              viewerOpen.viewport.panTo(new OpenSeadragon.Point(x+0.09, y+ 0.1)).zoomTo(3);
              viewerOpen.removeOverlay("marker");             
              viewerOpen.addOverlay(img, point);
          }


function addSearch(){

     new $.nd2Search({
          placeholder : "Search",
          defaultIcon : "globe-alt",
          source : getBuildings() ,
          fn : function(x,y) {
              addMarker(x,y);
          }
        });

   }


   function clickTracker(buildings){

  viewerOpen.addHandler('canvas-click', function(event) {

    // Temporary tracker for testing
        var tracker = new OpenSeadragon.MouseTracker({
                 element: viewerOpen.container,
                  moveHandler: function(event) {
                    var point = viewerOpen.viewport.pointFromPixel(event.position);
                    document.getElementById("test").innerHTML = '<br><br>Viewport:<br>' + point.toString() ; ;
        }});      
         tracker.setTracking(true);  
   // Temporary tracker end
   

            var webPoint = event.position;
            var viewportPoint = viewerOpen.viewport.pointFromPixel(webPoint);
            var imagePoint = viewerOpen.viewport.viewportToImageCoordinates(viewportPoint);
            var zoom = viewerOpen.viewport.getZoom(true);
            var imageZoom = viewerOpen.viewport.viewportToImageZoom(zoom);


          $.each(buildings, function(i,item){
            
            // Verify if the clicked position is a building
            if ((viewportPoint.x< item.xmax && viewportPoint.x> item.xmin) && (viewportPoint.y<item.ymax && viewportPoint.y> item.ymin)) {
                // Open a new building as a dialog
                $(":mobile-pagecontainer").pagecontainer("change", "buildings.html", {
                  changeHash: true,
                  });
            
                $(document).on("pageshow", "#buildings", function( event ) {
                  $("#buildingName").html(item.label);
                  $("#bximages").html("<li><img src="+ item.img + "></li><li><img src="+ item.img + "></li>");
                  $("#buildingDescription").html(item.description);
                  $('#bximages').bxSlider();
               });
          
              return false;
            }
          });
        });
   }


   function getMyLocation(){

      navigator.geolocation.getCurrentPosition(function geolocationSuccess(position) {
            var x= Math.abs(((position.coords.latitude  - (-87.6601)) * 1.1/ 0.005166));
            var y= Math.abs(((position.coords.longitude  - 42.0035) * 1.73)/-0.009223);
            addMarker(x,y);
                  alert('Latitude: '          + position.coords.latitude          + '\n' +
                        'Longitude: '         + position.coords.longitude         + '\n' +
                        'x '          + x          + '\n' +
                        'y: '          + y         + '\n' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                        'Heading: '           + position.coords.heading           + '\n' +
                        'Speed: '             + position.coords.speed             + '\n' +
                        'Timestamp: '         + position.timestamp                + '\n');
                  });



   }