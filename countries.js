
//Countries API (Application Programming Interface) URL (Uniform Resource Locator)
const URL = "https://countries.plaul.dk/api/countries/"

//Local in session Countries data cache
//To store country data from the API
function cache(){

    //Local array variable to carry in-session country data
    let countries = []

    return{

        //Operation to store Country object data
        //and attach an id onto the object for lookup
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

    //Console print out purely for checking purposes
    console.log(country)

    //Variable to construct a HTML element 
    //with the data found in the country object
    let countryInformation = 
    `<img id="country-flag" class="country-flag-img" src=${country.flag}>
    <p id="country-name">Country: ${country.name} </p>
    <p id="country-un">UN member: ${country.UnMember}</p>
    <p id="country-currency">Currency: ${getProperties(country.currencies)['name']}${getProperties(country.currencies)['symbol'] ? ","+ getProperties(country.currencies)['symbol'] : ""}</p>
    <p id="country-capital">Capital: ${country.capital}</p>
    <p id="country-language">Languages: ${getProperties(country.language)}</p>
    <p id="country-borders">Borders: ${commaSeperator(country.borders) ? commaSeperator(country.borders) : "none"}</p>`

    document.getElementById("infobox").innerHTML = countryInformation.toString()

    setTimeout(() => { 
        document.getElementById("country-flag").className += " flag-visible"
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

    //If there the keyset is higher than 1..
    if(localKeys.length > 1){
        let obj = []
        count = 0

        //..assign the corresponding values into an array, and return its values
        //in form of an array
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