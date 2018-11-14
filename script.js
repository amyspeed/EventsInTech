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
    .catch(error => $('#error-message').text(`Sorry! Something went wrong in accessing the news.`));
}

function displayNews(responseJson){
  for (let i=0; i<3; i++) {
    $('.news-post').append(
        `<div class="col-4">
            <div class="box news-box">
              <h3><a class="title" href="${responseJson.articles[i].url}" target="_blank">${responseJson.articles[i].title}</a></h3>
              <img class="news-pic" src="${responseJson.articles[i].urlToImage}">
              <p>${responseJson.articles[i].description} 
              <br>
              By ${responseJson.articles[i].author}<br>
              Source: ${responseJson.articles[i].source.name}</p>
            </div>
          </div>`
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
      `<div role="container" class="home row">
          <div class="col-12">
            <header>
              <h2>Where and When?</h2>
            </header>
            <form id="main-form">
             <label for="select-location">Select your location</label>
             <select id="select-location" required>
                <option value="">--Choose one--</option>
                <option value="Atlanta">Atlanta</option>
                <option value="Austin">Austin</option>
                <option value="Boston">Boston</option>
                <option value="Boulder">Boulder</option>
                <option value="Chicago">Chicago</option>
                <option value="Dallas">Dallas</option>
                <option value="Denver">Denver</option>
                <option value="Detroit">Detroit</option>
                <option value="Las Vegas">Las Vegas</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Miami">Miami</option>
                <option value="Minneapolis">Minneapolis</option>
                <option value="New York City">New York City</option>
                <option value="Oakland">Oakland</option>
                <option value="Orlando">Orlando</option>
                <option value="Philadelphia">Philadelphia</option>
                <option value="Pheonix">Pheonix</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Seattle">Seattle</option>
                <option value="">Other...</option>
              </select>

              <br>
              <label for="location-other">or enter a 5-digit zip code, city, or address</label>
              <input id="location-other" type="text" placeholder="e.g. 90210" value="">

              <br>
              <label for="within">Within</label>
              <select id="within" required>
                <option value="5mi">5 miles</option>
                <option value="10mi">10 miles</option>
                <option value="25mi">25 miles</option>
                <option value="50mi">50 miles</option>
               <option value="100mi">100 miles</option>
              </select>  

              <br>
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
          
              <br>
              <label for="sort-by">Sort by</label>
              <select id="sort-by">
               <option value="date">Date</option>
               <option value="distance">Distance</option>
               <option value="best">Best</option>
              </select>

             <br>
             <label for="eb-max-results">Maximum results:</label>
             <input type="number" name="eb-max-results" id="js-eb-max-results" value="5">
             <br>
          
              <input class="go search" type="submit" value="Show Me!" id="form-submit">
            </form>
          </div>
      </div>`)
}



//Handle submit.
function handleSubmit(){
  $('main').on('click', '#form-submit', function (event){
    event.preventDefault();
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
  const paramsEB = {
    'sort_by': querySort,
    'location.address': queryWhere,
    'location.within': queryWithin,
    'categories': 102, //science and technology
    'start_date.keyword': queryWhen,
    token: ebOAuth,
  };
    const queryStringEB = formatEBParams(paramsEB)
    const urlEB = ebUrlEndPt + '?' + queryStringEB;

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
      <div class="row content no-result"
        <div class="col-12">
          <header>
            <h2>Sorry!</h2> 
            <p>Eventbrite does not feature any events within ${queryWithin} of ${queryWhere} for the time you selected. Try another search!</p>
          </header>    
          <form class="go-home bottom-form">
           <button class="reset-search go bottom-button">Search Again</button>
          </form>
        </div>
      </div>  
    </div>`
}

function appendResultsPg(responseEBJson, maxEBResults){
  //Remove home page
  $('.home').remove();
  //Generate results page.
  $('main').append(
      `<div role="container" class="results">
        <nav class="hidden" role="navigation">
          <form class="go-home nav-form">
            <button class="reset-search go">Search Again</button>
          </form>
        </nav>
        <section role="region" id="eventbrite">   
          <div class="row banner">
            <div class="col-12">
              <header>
                <h2>Your Results from <a id="eb-link" target="_blank" href="https://www.eventbrite.com/">eventbrite</a></h2>
              </header>
            </div>
          </div>
              
        </section>
        <form class="go-home bottom-form">
        <button class="reset-search go bottom-button">Search Again</button>
        </form>
      </div>`);
  appendResults(responseEBJson, maxEBResults);
}

function appendResults(responseEBJson, maxEBResults){
  for (let i=0; i < responseEBJson.events.length & i < maxEBResults; i++){
    const responseKey = responseEBJson.events[i];
    const vanURL = handleVanUrl(responseKey);
  $('#eventbrite').append(
      `<div class="row">
        <div class="col-12 results-contain">
          <div class="box results-box">
            <h4><a class="title" href="${responseKey.url}" target="_blank">${responseKey.name.text}</a></h4>
            
            <img alt="event logo" src="${responseKey.logo.original.url}">
            <p class="event-describe">${responseKey.description.text}</p>
            <p><a class="title" href="${responseKey.url}" target="_blank">${vanURL}</a></p>
          </div>
        </div>
      </div>`
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