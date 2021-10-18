
//Countries API (Application Programming Interface) URL (Uniform Resource Locator)
const URL = "https://countries.plaul.dk/api/countries/"

//Local in session Countries data cache
//To store country data from the API
function cache(){

    //Local array variable to carry in-session country data
    let countries = []

    return{

        //Operation to store Country object data
        addCountry : country => countries.push(country), 

        //Get all (countries) operation, implemented just in case
        getAll : () => countries,

        //Operation to retrieve (find) a country based on its matching initials (id)
        findByInitials : (initials) => countries.find( c => c.id == initials )

    }
}

//Global constant that contains an instance of the cache 
const localCountryData = cache()

//Initialize event handler function
function setupHandler(){
    document.getElementById("svg2").onclick = handleSVGTarget
}

//Call and run the handler
setupHandler()

function handleSVGTarget(event){

    //prevents the event from bubbling further (upwards in the HTML structure)
    event.stopPropagation()
    event.preventDefault()

    let _id = event.target.id

    let temp = document.getElementById("layer2").children

    for(let i = 0; i < temp.length; i++){
        document.getElementById(temp.item(i).id).style.fill = "#dcdcdc"
    }

    document.getElementById(_id).style.fill = "blue"  

    const options = {
        method : "GET",
        headers : {
        'accept' : 'application/json'
            }
        }

    //If the country data is already found to be stored in the local cache  
    //get that instead  
    if(localCountryData.findByInitials(_id+"")) return refreshInfobox(_id+"")
    else fetchSingleCountryData(_id,options)
    
}

function handleInfoboxResize(){

    const infobox = document.getElementById("infobox")

    //if(infobox.classList.contains("country-info-box-resize")) infobox.classList.remove("country-info-box-resize")

    //if(infobox.classList.contains("country-info-box-resize")) console.log(infobox.className = "country-info-box")

    console.log(infobox.style.height)

    //infobox.style.height = "200px"

    console.log("reached function")
    console.log("Bounding box rectangle height: "+infobox.getBoundingClientRect().height+"px")
    console.log("Computed style height: "+document.defaultView.getComputedStyle(infobox).height)
    console.log("OffsetHeight: "+infobox.offsetHeight)
    console.log("ScrollHeight: "+infobox.scrollHeight)

    //console.log(document.getElementsByClassName("country-info-box-resize").height)

    let sheet = document.styleSheets[0]
    //console.log(sheet)
    //console.log(sheet.insertRule(".toggle-height{ height:"+document.defaultView.getComputedStyle(infobox).height+"; }",0))
    //console.log(sheet.addRule(".toggle-height{ height:"+document.defaultView.getComputedStyle(infobox).height+"; }",0))
    //console.log(document.styleSheets.cssRules)

    let newHeight = document.defaultView.getComputedStyle(infobox).height
    //setTimeout( () => { if(newHeight >= "214.6px") infobox.className += " country-info-box-resize" }, 500)
    
}

//function to create a new country object
//and preserve it in the local cache
function createCountry(_country,id){

    //create empty country object
    let country = {}

    //the following define and place properties that belong to the country object
    country.id = id+"" 
    country.name = _country['name']['common']
    country.flag = _country['flag']
    //Checks if the the unMember value is "true/false" 
    //returns a "Yes" if true
    country.UnMember = _country['unMember'] ? "Yes" : "No"
    country.capital = _country['capital']
    country.language = _country['languages']
    country.borders = _country['borders']
    country.currencies = _country['currencies']

    //Store (save) the created object into the local cache
    localCountryData.addCountry(country)

}

//function to grab the JSON for 1 country
function fetchSingleCountryData(id,options){

    //fetch the API with the appened country initials (id)
    //options desribe the request (GET) 
    //URL = 'https://countries.plaul.dk/api/countries/'+'country-initials'
    //e.g: URL = "https://countries.plaul.dk/api/countries/dk" (if id = "dk")
    //e.g: URL = "https://countries.plaul.dk/api/countries/ru" (if id = "ru")
    //e.g: URL = "https://countries.plaul.dk/api/countries/pl" (if id = "pl")
    // etc. etc.
    fetch(URL+id,options)
    .then(response =>{
        
        //throw error if the country was not found (does not exist)
         if(response.status == 404) throw `the country id: ${id} was not found` 
        
         //return the response and read it as JSON if the request status is 'ok'
         return response.json()
        
        }).then(
            response => {  
            
            //Fill in the country data retrieved from the fetch
            //corresponding to the id (initials) of the inquired country
            createCountry(response,id)

            refreshInfobox(id)    

            }
        )
    .catch(
        //Catch the error if it occures and print it to the console
        error => console.log(error)
        )
}

//A small function to check and return a proper, corresponding value to that of the unMember property
//found in country object instead of "true/false"
//function unionMembership(check){
//    return check ? "Yes" : "No" 
//}

function refreshInfobox(id){

    let country = localCountryData.findByInitials(id+"")

    console.log(document.getElementsByClassName("country-info-box")[0].classList)

    if(document.getElementsByClassName("country-info-box")[0].classList.contains("country-info-box", "country-info-box-resize-height")){
        document.getElementsByClassName("country-info-box")[0].className = "country-info-box"    
    }
    
    setTimeout( () => {}, 500)

    console.log(document.getElementsByClassName("country-info-box")[0].classList)

    //Console print out purely for checking purposes
    console.log(country)

    //Variable to construct a HTML element 
    //with the data found in the country object
    //Adding ids to the tags just in case
    let countryInformation = 
    `<img id="country-flag" class="country-flag-img" src=${country.flag}>
    <p id="country-name"><span id="info-attribute">Country:</span> ${country.name} </p>
    <p id="country-un"><span id="info-attribute">UN member:</span> ${country.UnMember}</p>
    <p id="country-currency"><span id="info-attribute">Currency:</span> ${getProperties(country.currencies)['name']}${getProperties(country.currencies)['symbol'] ? " "+ getProperties(country.currencies)['symbol'] : ""}</p>
    <p id="country-capital"><span id="info-attribute">Capital:</span> ${country.capital}</p>
    <p id="country-language"><span id="info-attribute">Languages:</span> ${getProperties(country.language)}</p>
    <p id="country-borders"><span id="info-attribute">Borders:</span> ${commaSeperator(country.borders) ? commaSeperator(country.borders) : "none"}</p>`

    document.getElementById("infobox").innerHTML = countryInformation.toString()

    console.log(document.getElementById("infobox").offsetHeight)

    setTimeout(() => { 
        //handleInfoboxResize()
        document.getElementById("country-flag").className += " flag-visible"
        //if(document.getElementById("infobox").clientHeight)
        document.getElementsByClassName("country-info-box")[0].className += " country-info-box-resize-height" 
     }, 500);
}

//function to grab/parse the properties of deeper nested objects within a JSON object
//The function is limited by depth of : 1 nested object
function getProperties(object){

    //local variable to collect detected key(set)
    let localKeys = []

    //for-loop to run through possible keys in the object
    for(keys in object){ localKeys.push(keys) }

    //If there is only 1 key present, return the object attached of that key
    if(localKeys.length == 1){  return object[localKeys[0]] }

    //If there the keyset is larger than 1..
    if(localKeys.length > 1){
        let obj = []
        count = 0

        //..assign the corresponding values into an array, and return the values
        //in the form of an array
        while(count < localKeys.length){
            obj.push(object[localKeys[count]])
            count++
        }

        return obj
    }

}

//function purely made to create a proper comma seperation inbetween border abbreviations
//from the country.borders array
function commaSeperator(array){

    let rearrangedString = ""

    for(key in array){
        rearrangedString += array[key]+", " 
    }

    rearrangedString = rearrangedString.substring(0, rearrangedString.length-2)
    return rearrangedString
}

//Cleaning function to clear potentially malicious user input/injection
//Based on a snippet created by KEA lecturer
/*function sanitizer(string){
        string = ""+string
        string = string.replace(/&/g, "&amp;")
        string = string.replace(/>/g, "&gt;")
        string = string.replace(/</g, "&lt;")
        string = string.replace(/"/g, "&quot;")
        string = string.replace(/'/g, "&#039;")
        string = string.replace(/-/g, "&#045;")
        string = string.replace(/\//g, "&#092;")
        string = string.replace(/$/g, "&#36;")
        return string;
}*/ 
