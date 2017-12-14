$(document).ready(function(){

    $("#buttonElevation").click(getElevation);
    $("#buttonDistanceMatrix").click(getDistance);
    $("#buttonHPGloe").click(getLinks);
    $("#buttonFlickr").click(getPhotos);
    $("#buttonGeo").click(getGeo);

});

function getElevation(){

     // Create an ElevationService
  elevator = new google.maps.ElevationService();
    var locations = new Array();
    var loc = new google.maps.LatLng($("#latitudElevation").val(),$("#longitudElevation").val());
    locations[0] = loc;

      var positionalRequest = {
        'locations': locations
      };

    elevator.getElevationForLocations(positionalRequest, function(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

      // Retrieve the first result
      if (results[0]) {
          $("#resultadoelevation").html(results[0].elevation);
      } else {
        alert("No results found");
      }
    }

  });

}

function getDistance(){

    var origin =[];
    origin[0]= new google.maps.LatLng($("#posiOrigenLat").val(),$("#posiOrigenLng").val());

    var destination = [];
    destination[0] =new google.maps.LatLng($("#posiDestinoLat").val(),$("#posiDestinoLng").val());

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: origin,
        destinations: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      }, callback);

    function callback(response, status) {
      // See Parsing the Results for
      // the basics of a callback function.
        $("#resultadoDistanceMatrix").empty();
        $("#resultadoDistanceMatrix").append("<b>Direccion del Origen:</b>"+response.originAddresses[0]+"<br/>");
        $("#resultadoDistanceMatrix").append("<b>Direccion Destino:</b>"+response.destinationAddresses[0]+"<br/>");
                          $("#resultadoDistanceMatrix").append("<b>Distancia: </b>"+response.rows[0].elements[0].distance.text);
      /*  console.log(response);
        console.log(response.rows[0].elements[0].distance.text);*/
    }

}

function getLinks(){
    var url = "http://www.hpgloe.com/json/getrec";
    var dataSendLinks = {
        lat: $("#latitudLinks").val(),
        lon:$("#longitudLinks").val(),
    };
    $.getJSON( url ,dataSendLinks ,  function(datalinks){
        alert(datalinks);
    });
}

function getPhotos(){
    var url = "http://api.flickr.com/services/rest";

    var dataPhotos = {
        method : "flickr.photos.search",
        api_key : "bd43d341334eebd67679609201dc7feb" ,
        format: "json", nojsoncallback: 1,
        bbox: $("#esquinaIzquierda").val()+","+$("#esquinaDerecha").val()
    };

    var src;
    $.getJSON(url, dataPhotos, function (data) {
        console.log(data);
        $.each(data.photos.photo, function (i, item) {
            src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";

            $('#resultadoFlickr').append(
                        $('<img/>').attr('src', src));

            if (i == 3) return false;
        });
    });

}

function getGeo(){
    var url = "https://maps.google.com/maps/api/geocode/json";
    var dataGeo = {
        address: $("#inputGeolocation").val(),
        sensor : false
    };
    $.getJSON(url,dataGeo, function (data) {
        $("#resultadoGeo").empty();
        $("#resultadoGeo").append("<b>Lugar</b> : "+data.results[0].formatted_address+"<br/>");
                                  $("#resultadoGeo").append("<b>Localizacion</b> : "+data.results[0].geometry.location.lat+","+data.results[0].geometry.location.lng);
    });
}
