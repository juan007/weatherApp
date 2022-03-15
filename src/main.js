// importing the sass stylesheet for bundling
import "./../sass/styles.scss";
import "./../sass/weather-icons.scss";

import { getXMLData } from "./Toolkit";

let citiesXML;

let cityWeatherXML;

//reference the city select
let cityList;

//number of cities
let cityCount;

let cityWeatherCount;

const SOURCE = "http://localhost:3000/cities.xml";

let temperature = 0.00;

let precipitationMode;

//PRIVATE METHODS

//function to convert K to C
function convertToC(myK)
{
    temperature = myK - 273.15;
    return temperature.toFixed(2);
}


//function that populates content according to chosen city
function populateContent()
{
    //OUTPUT DATA according to selected city
    
    //get cloud dinamically according to weather number
    let weatherNumber = cityWeatherXML.querySelectorAll("weather")[0].getAttribute("number");
    document.querySelector(".weather-desc>i").className = "wi wi-owm-" + weatherNumber + " wi-fw";
    
    //align cloud left
    document.querySelector(".weather-desc>i").style = "text-align: left;";
    
    document.querySelector(".weather-desc__description").innerHTML = cityWeatherXML.querySelectorAll("clouds")[0].getAttribute("name");
    document.querySelector(".weather-desc__city").innerHTML = cityList.selectedOptions[0].text;
    temperature = parseFloat(cityWeatherXML.querySelectorAll("temperature")[0].getAttribute("value"));
    document.querySelector(".main-content__temperature__current").innerHTML = convertToC(temperature) + " °C Current";
    temperature = parseFloat(cityWeatherXML.querySelectorAll("temperature")[0].getAttribute("min"));
    document.querySelector(".main-content__temperature__low").innerHTML = convertToC(temperature) + " °C Low";
    temperature = parseFloat(cityWeatherXML.querySelectorAll("temperature")[0].getAttribute("max"));
    document.querySelector(".main-content__temperature__high").innerHTML = convertToC(temperature) + " °C High";
    temperature = parseFloat(cityWeatherXML.querySelectorAll("feels_like")[0].getAttribute("value"));
    document.querySelector(".main-content__temperature__feels").innerHTML = "Feels like " + convertToC(temperature) + " °C";
    
    //store precipitation mode
    precipitationMode = cityWeatherXML.querySelectorAll("precipitation")[0].getAttribute("mode");
    
    //show 0 if precipitation mode is 0 else show mm of precipitation
    if (precipitationMode =="no")
    {
        document.querySelector(".main-content__precipitation__value").innerHTML = "0 mm";    
    }
    else
    {
        document.querySelector(".main-content__precipitation__value").innerHTML = cityWeatherXML.querySelectorAll("precipitation")[0].getAttribute("value") + "mm";
    }

    document.querySelector(".main-content__humidity__value").innerHTML = cityWeatherXML.querySelectorAll("humidity")[0].getAttribute("value") + " %";
    
    document.querySelector(".main-content__pressure__value").innerHTML = cityWeatherXML.querySelectorAll("pressure")[0].getAttribute("value") + " hPa";
    document.querySelector(".main-content__wind__direction").innerHTML = cityWeatherXML.querySelectorAll("direction")[0].getAttribute("name") + " wind";
    document.querySelector(".main-content__wind__strength").innerHTML = cityWeatherXML.querySelectorAll("speed")[0].getAttribute("name");
    let speedKMH = cityWeatherXML.querySelectorAll("speed")[0].getAttribute("value") * (36/10);
    document.querySelector(".main-content__wind__speed").innerHTML = speedKMH.toFixed(2) + " km/h speed";
}

//Function to populate select
function populateList()
{
    //add options to select and set properties
    for (let i = 0; i < cityCount; i++)
    {
        let option = document.createElement("option");
        option.text = citiesXML.querySelectorAll("name")[i].textContent + ", " + citiesXML.querySelectorAll("province")[i].textContent;
        option.name = citiesXML.querySelectorAll("name")[i].textContent;
        cityList.add(option);
    }
    cityList.addEventListener("change",onListItemChanged);
}


// ----------------------------------EVENT HANDLERS
//Function called when API loads
function onApiLoaded(result)
{
    cityWeatherXML = result;
    cityWeatherCount = cityWeatherXML.querySelectorAll("current").length;
    console.log(cityWeatherXML);
    if(cityWeatherCount == 1)
    {
        populateContent();
    }

}

//select event handler
function onListItemChanged(e)
{
    
    //hide error and show content
    document.querySelector(".error").style.display="none";
    document.querySelector(".main-content").style.display="flex";
    document.querySelector(".weather-desc").style.display="block";
    
    let option = cityList.selectedOptions[0];
    let apiURL = "http://api.openweathermap.org/data/2.5/weather?q=" + option.name + ",CA&mode=xml&appid=6983b0f0351df4922a129a07e4b832b9";
    getXMLData(apiURL,onApiLoaded,onError);
}

//when xml is loaded
function onLoaded(result)
{
    citiesXML = result;

    console.log("test" + citiesXML.querySelectorAll("Alberta")[1]);
     //number of cities
    cityCount = citiesXML.querySelectorAll("city").length;
    if (cityCount > 0)
    {
        populateList();
        onListItemChanged();
    }
    
}

//if an error occurs in getting the xml data or api
function onError(e)
{
    //show error
    document.querySelector(".main-content").style.display="none";
    document.querySelector(".weather-desc").style.display="none";
    document.querySelector(".error").style.display="block";
    console.log("Error: Ajax request problem");
}

// ----------------------------------------------- main method
function main() 
{
    //stablish select element
    cityList = document.querySelector(".selector__city");

    //construct the XMLHttpRequest object
    getXMLData(SOURCE,onLoaded,onError);
}

main();