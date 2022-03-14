// importing the sass stylesheet for bundling
import "./../sass/styles.scss";
import { getXMLData } from "./Toolkit";

let citiesXML;

let cityWeatherXML;

//reference the city select
let cityList;

//number of cities
let cityCount;

let cityWeatherCount;

const SOURCE = "http://localhost:3000/cities.xml";

//PRIVATE METHODS

function populateContent()
{
    let txtClouds = cityWeatherXML.querySelectorAll("clouds")[0].getAttribute("name");
    console.log(txtClouds);

}

function populateList()
{
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
    
    if(cityWeatherCount == 1)
    {
        populateContent();
    }

}

//list event handler
function onListItemChanged(e)
{
    let option = cityList.selectedOptions[0];
    let apiURL = "http://api.openweathermap.org/data/2.5/weather?q=" + option.name + ",CA&mode=xml&appid=6983b0f0351df4922a129a07e4b832b9";
    getXMLData(apiURL,onApiLoaded,onError);
}

//when xml is loaded
function onLoaded(result)
{
    citiesXML = result;
     //number of cities
    cityCount = citiesXML.querySelectorAll("city").length;
    if (cityCount > 0)
    {
        populateList();
        onListItemChanged();
    }
    
}

//if an error occurs in getting the xml data
function onError(e)
{
    console.log("Error: Ajax request problem");
}

// ----------------------------------------------- main method
function main() 
{
    cityList = document.querySelector(".selector__city");

    //construct the XMLHttpRequest object
    getXMLData(SOURCE,onLoaded,onError);

}

main();