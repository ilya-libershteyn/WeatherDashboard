// This is our API key
const API_KEY = "93f9fe3c09bbe43ec2c0a485b0a0261d";

var searchBtn = $("#search");
var searchFld = $("#search_field");
var display = $("#display");
var citiesList = $("#cities");
var cities = [];

// Here we are building the URL we need to query the database
function queryAPI(city)
{
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
    "q=" + city + "&appid=" + API_KEY;
    var lat, lon;

    if(display.hasClass("hide"))
    {
        display.removeClass("hide");
    }

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

        var output = response.list[2];

        // Transfer content to HTML
        $(".city").html("<h6 class=\"card-title\">" + response.city.name + " (" 
        + moment().format('M/D/YYYY') + ") <img src=\"http://openweathermap.org/img/w/" 
        + output.weather[0].icon + ".png\"/></h6>");
    
        // Convert the temp to fahrenheit
        var tempF = (output.main.temp - 273.15) * 1.80 + 32;

        // add temp content to html
        $(".tempF").text("Temperature: " + tempF.toFixed(2) + " " + String.fromCharCode(176) + "F");
        $(".humidity").text("Humidity: " + output.main.humidity + "%");
        $(".wind").text("Wind Speed: " + output.wind.speed);

        // Log the data in the console as well
        //console.log("Wind Speed: " + output.wind.speed);
        //console.log("Humidity: " + output.main.humidity);
        //console.log("Temperature (F): " + tempF);

        lat = response.city.coord.lat;
        lon = response.city.coord.lon;

        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +
                "&appid=" + API_KEY;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            //console.log(response)

            $(".uvi").html("<p>UV Index: <span class=\"badge badge-secondary\">" + response.value + "</span></p>")

            // Set the color of the badge
            if(parseInt(response.value) >= 11)
                $(".badge-secondary").attr("style", "background-color: #B567A4"); // Violet
            if(parseInt(response.value) >= 8 && parseInt(response.value) <= 10)
                $(".badge-secondary").attr("style", "background-color: #E53210"); // Red
            if(parseInt(response.value) >= 6 && parseInt(response.value) <= 7)
                $(".badge-secondary").attr("style", "background-color: #F18B00"); // Orange
            if(parseInt(response.value) >= 3 && parseInt(response.value) <= 5)
                $(".badge-secondary").attr("style", "background-color: #FFF300"); // Yellow
            if(parseInt(response.value) >= 0 && parseInt(response.value) <= 2)
                $(".badge-secondary").attr("style", "background-color: #3EA72D"); // Green

            //console.log("UV Index: " + response.value);
        });

        var forecast = $("#5day");
        var day = 1;

        for(var i = 3; i < response.list.length; i += 8)
        {
            //$("#day" + day).children().children().children().text(response.list[i].dt_txt);
            $("#title" + day).html(moment(response.list[i].dt_txt).format('MM/DD/YYYY') 
            + " <img src=\"http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png\"/>");

            var tempD = (response.list[i].main.temp - 273.15) * 1.80 + 32;

            $("#temp" + day).text("Temp: " + tempD.toFixed(2) + String.fromCharCode(176) + "F");
            $("#hum" + day).text("Humidity: " + response.list[i].main.humidity + "%");

            day++;
        }
    });
}

function queryLastCity()
{
    input = localStorage.getItem("lastCity");
    //console.log(input);
    if(input)
    {
        queryAPI(input);
    }

    citiesReloaded = JSON.parse(localStorage.getItem("cities"));
    console.log(citiesReloaded)
    if(citiesReloaded)
    {

        for(var i = 0; i < citiesReloaded.length; i++)
        {
            var newBtn = $("<button>").attr("id", "city");
            newBtn.attr("type", "submit");
            newBtn.text(citiesReloaded[i]);
            newBtn.addClass("btn btn-rounded");
            citiesList.append(newBtn);
        }
    }
}

queryLastCity();

searchBtn.on("click", function(event)
{
    event.preventDefault();

    input = searchFld.val();
    //console.log(input);

    if(input.length == 0)
    {
        return;
    }

    searchFld.val('');
    localStorage.setItem("lastCity", input);
    // Ensure it doesn't create buttons for the same city
    if(jQuery.inArray(input, cities) == -1)
    {
        var newBtn = $("<button>").attr("id", "city");
        newBtn.attr("type", "submit");
        newBtn.text(input);
        newBtn.addClass("btn btn-rounded");
        citiesList.append(newBtn);
        
        cities.push(input);

        localStorage.setItem("cities", JSON.stringify(cities));
    }

    queryAPI(input);
});

citiesList.on("click", $("#city"), function(event)
{
    event.preventDefault();

    input = $(event.target).text();
    console.log(input);
    localStorage.setItem("lastCity", input);

    queryAPI(input);
});