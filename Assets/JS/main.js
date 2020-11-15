// This is our API key
const API_KEY = "93f9fe3c09bbe43ec2c0a485b0a0261d";

// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
"q=Bujumbura,Burundi&appid=" + API_KEY;
var lat, lon;

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
    url: queryURL,
    method: "GET"
})
// We store all of the retrieved data inside of an object called "response"
.then(function(response) {

    // Log the queryURL
    console.log(queryURL);

    // Log the resulting object
    console.log(response);

    // Transfer content to HTML
    $(".city").html("<h6 class=\"card-title\">" + response.name + " (" + moment().format('M/D/YYYY') + ")</h6>");
   
    // Convert the temp to fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;

    // add temp content to html
    $(".tempF").text("Temperature: " + tempF.toFixed(2) + " " + String.fromCharCode(176) + "F");
    $(".humidity").text("Humidity: " + response.main.humidity);
    $(".wind").text("Wind Speed: " + response.wind.speed);

    // Log the data in the console as well
    console.log("Wind Speed: " + response.wind.speed);
    console.log("Humidity: " + response.main.humidity);
    console.log("Temperature (F): " + tempF);

    lat = response.coord.lat;
    lon = response.coord.lon;

    queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +
            "&appid=" + API_KEY;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)

        $(".uvi").html("<p>UV Index: <span class=\"badge badge-secondary\">" + response.value + "</span></p>")

        // Set the color of the badge
        if(parseInt(response.value) >= 11)
            $(".badge-secondary").attr("style", "background-color: #B567A4");
        if(parseInt(response.value) >= 8 && parseInt(response.value) <= 10)
            $(".badge-secondary").attr("style", "background-color: #E53210");
        if(parseInt(response.value) >= 6 && parseInt(response.value) <= 7)
            $(".badge-secondary").attr("style", "background-color: #F18B00");
        if(parseInt(response.value) >= 3 && parseInt(response.value) <= 5)
            $(".badge-secondary").attr("style", "background-color: #FFF300");
        if(parseInt(response.value) >= 0 && parseInt(response.value) <= 2)
            $(".badge-secondary").attr("style", "background-color: #3EA72D");    

        console.log("UV Index: " + response.value);
    });
});