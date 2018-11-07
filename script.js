'use strict';
//Link to Eventbrite API
const ebUrlEndPt='https://www.eventbriteapi.com/v3/events/search/?categories=102';
const ebOAuth='RH6RBMUD3MXBQB2TJWDA';

//Link to News:
const newsURL = 'https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=9d728f0139044cf3a54a15e546d1851e';

function fetchNews(responseJson){
  fetch(newsURL)
    .then(response => response.json())
    .then(responseJson => displayNews(responseJson))
  //  .catch(error => alert('Something went wrong. Try again later.'));
}

function displayNews(responseJson){
  for (let i=0; i<3; i++) {
    $('.news').append(
        `<h4><a href="${responseJson.articles[i].url}" target="_blank">${responseJson.articles[i].title}</a></h4>
        <img class="news-pic" src="${responseJson.articles[i].urlToImage}">
        <p>${responseJson.articles[i].description} <br>
        By ${responseJson.articles[i].author}<br>
        Source: ${responseJson.articles[i].source.name}</p>`
    )};
}

//Handle landing page submit to enter
function handleEnter() {
  $('.landing').on('click', '#enter-app', function(event){
    event.preventDefault();
    //Remove landing page
    $('.landing').remove();
    appendHome();
    handleSubmit();
    handleNewSearch();
  });
}

function appendHome() {
    //Append home (search) page
    $('main').append(
      `<div role="container" class="home">
        <header>
          <h2>Where and When?</h2>
        </header>
        <form id="main-form">
          <label for="select-location">Select your location</label>
          <select id="select-location" required>
            <option value="">--Choose one--</option>
            <option value="Austin">Austin</option>
            <option value="Boston">Boston</option>
            <option value="Dallas">Dallas</option>
            <option value="Denver">Denver</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="New York City">New York City</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Seattle">Seattle</option>
            <option value="Washington, DC">Washington, DC</option>
            <option value="">Other...</option>
          </select>

          <label for="location-other">or input a 5-digit zip code, city, or address</label>
          <input id="location-other" type="text" placeholder="e.g. 90210" value="">

          <p id="js-error-message" class="error-message"></p>
          
          <br>
          <label for="within">Within</label>
          <select id="within" required>
            <option value="5mi">5 miles</option>
            <option value="10mi">10 miles</option>
            <option value="25mi">25 miles</option>
            <option value="50mi">50 miles</option>
            <option value="100mi">100 miles</option>
          </select>  

          <label for="select-date">When?</label>
          <select id="select-date" required>
            <option value="this_month">This Month</option>
            <option value="next_month">Next Month</option>
            <option value="this_week">This Week</option>
            <option value="next_week">Next Week</option>
            <option value="this_weekend">This Weekend</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>  
        
          <label for="sort-by">Sort by</label>
          <select id="sort-by">
            <option value="date">Date</option>
            <option value="distance">Distance</option>
            <option value="best">Best</option>
          </select>

          <br>
          <p>How many listing?</p>
          <label for="eb-max-results">Maximum results:</label>
          <input type="number" name="eb-max-results" id="js-eb-max-results" value="5">
          <br>
          
          <input type="submit" value="Show Me!" id="form-submit">
        </form>
      </div>`)
}



//Handle submit. Value of zipcode and date used to fetch Meetup and Eventbrite data.
function handleSubmit(){
  $('main').on('click', '#form-submit', function (event){
    event.preventDefault();
    //Send to Results or No-Results
    const querySort = $('#sort-by').val();
    const queryWhere = chooseLoc();
    const queryWithin = $('#within').val();
    const queryWhen = $('#select-date').val();
    const maxEBResults = $('#js-eb-max-results').val();
    fetchEBInfo(querySort, queryWhere, queryWithin, queryWhen, maxEBResults);
  })
}

function chooseLoc(){
  let fillWhere = $('#location-other').val();
  let selectWhere = $('#select-location').val();
  if (fillWhere === "") {
    return selectWhere;
  }
  else {
    return fillWhere;
    }
}

//Fetch EB info
function fetchEBInfo(querySort, queryWhere, queryWithin, queryWhen, maxEBResults){
  console.log(querySort, queryWhere, queryWithin, queryWhen, maxEBResults);
  const paramsEB = {
    'sort_by': querySort,
    'location.address': queryWhere,
    'location.within': queryWithin,
    'categories': 102, //science and technology
    'start_date.keyword': queryWhen,
//Keyword options are "this_week", "next_week", "this_weekend", "next_month", "this_month", "tomorrow", "today"
    token: ebOAuth,
  };
    const queryStringEB = formatEBParams(paramsEB)
    const urlEB = ebUrlEndPt + '?' + queryStringEB;

    console.log(urlEB);

    fetch(urlEB)
      .then(responseEB => {
        if (responseEB.ok) {
          return responseEB.json();
        }
        throw new Error(responseEB.statusText);
      })
      .then(responseEBJson=> checkResults(responseEBJson, maxEBResults, queryWhere, queryWithin))
      .catch(errEB => {
        alert(`Oops! Please select or enter a different location. Your current location entry is creating this error message: ${errEB.message}.`);
      });
}

//string EB URL together
function formatEBParams(paramsEB) {
  const queryItems = Object.keys(paramsEB)
    .map(token => `${encodeURIComponent(token)}=${encodeURIComponent(paramsEB[token])}`)
  return queryItems.join('&');  
}

function checkResults(responseEBJson, maxEBResults, queryWhere, queryWithin){
  if (responseEBJson.events.length > 0) {
    appendResultsPg(responseEBJson, maxEBResults);
  }
  else {
    appendNoResults(queryWhere, queryWithin);
  }
}

function appendNoResults(queryWhere, queryWithin){
  //Remove home page
  $('.home').remove();
  //Reveal no-results page.
  $('main').append(noResults(queryWhere, queryWithin));
}

function noResults(queryWhere, queryWithin){
  return `<div role="container" class="no-results">
        <header>
          <h2>Sorry!</h2> 
          <p>Eventbrite does not feature any events within ${queryWithin} of ${queryWhere} for the time you selected. Try another search!</p>
        </header>  
        <form class="go-home">
          <button class="reset-search">Search Again</button>
        </form>
      </div>`
}

function appendResultsPg(responseEBJson, maxEBResults){
  //Remove home page
  $('.home').remove();
  //Generate results page.
  $('main').append(`<div role="container" class="results">
        <nav role="navigation">
          <form class="go-home">
            <button class="reset-search">Search Again</button>
          </form>
        </nav>  
        <header>
          <h2>Results</h2>
        </header>
        <section role="region" id="eventbrite">
          <header><h3>Your Events from <a href="https://www.eventbrite.com/">Eventbrite.com</a></h3></header>
        </section  
           
        <form class="go-home">
          <button class="reset-search">Search Again</button>
        </form>
      </div>`);
  appendResults(responseEBJson, maxEBResults);
}

function appendResults(responseEBJson, maxEBResults){
  for (let i=0; i < responseEBJson.events.length & i < maxEBResults; i++){
    const responseKey = responseEBJson.events[i];
    const vanURL = handleVanUrl(responseKey);
    console.log(responseKey.name.text);
  $('#eventbrite').append(
      `<h4><a href="${responseKey.url}" target="_blank">${responseKey.name.text}</a></h4>
            
             <img alt="event log" src="${responseKey.logo.original.url}">
            <p>${responseKey.description.text}</p>
            <a href="${responseKey.url}" target="_blank">${vanURL}</a>`
  )};
}

function handleVanUrl(responseKey){
      if(responseKey.vanity_url == null){
        return responseKey.url;
      }
      else {
        return responseKey.vanity_url;
      }
}    

    //Handle "Search Again"
function handleNewSearch(){
  $('main').on('click', '.reset-search', function(event){
    event.preventDefault;
    $('.no-results').remove();
    $('.results').remove();
    appendHome();
  })
}

handleEnter(); 
fetchNews();   