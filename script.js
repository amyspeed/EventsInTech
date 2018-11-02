'use strict';
//Link to meetup & Eventbrite APIs
const ebUrlEndPt='https://www.eventbriteapi.com/v3/events/search/?categories=102';
const ebOAuth='RH6RBMUD3MXBQB2TJWDA';

const meetUrlEndPt='';
const meetKey='';

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
    event.preventDefault;
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
            <option value="78704">Austin</option>
            <option value="94016">San Francisco</option>
            <option value="10001">New York City</option>
            <option value="otherZip">Other</option>
          </select>

          <label for="location-other">or input a 5-digit zip code</label>
          <input class="hidden" id="location-other" type="text" pattern="[0-9]" maxlength=5 minlength=5 placeholder="Zip code">

          <legend for="select-date">When?</legend>
          <select id="select-date">
            <option value="null">--Choose one--</option>
            <option value="null">Any Time!</option>
            <option value="this_month">This Month</option>
            <option value="next_month">Next Month</option>
            <option value="this_week">This Week</option>
            <option value="next_week">Next Week</option>
            <option value="this_weekend">This Weekend</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="enter-date">Enter Date</option>
          </select>  

          <input class="hidden" id="date-other" type="date">
          <br>
          
          <p>How many listing?</p>
          <label for="eb-max-results">Eventbrite max:</label>
          <input type="number" name="eb-max-results" id="js-eb-max-results" value="5">
          <br>
          <label for="mu-max-results">Meetup max:</label>
          <input type="number" name="mu-max-results" id="js-mu-max-results" value="5">
          <br>
          
          <input type="submit" value="Show Me!" id="form-submit">
        </form>  
      </div>`)
}



//Handle submit. Value of zipcode and date used to fetch Meetup and Eventbrite data.
function handleSubmit(){
  $('main').on('click', '#form-submit', function (event){
    event.preventDefault;
    //Send to Results or No-Results
    //appendNoResults();
    const maxEBResults = $('#js-eb-max-results').val();
    console.log(maxEBResults);
    fetchEBInfo(1, 2, 3, maxEBResults);
  })
}

//Fetch EB info
function fetchEBInfo(queryZip, queryWithin, queryWhen, maxEBResults){
  const paramsEB = {
    'sort_by': 'date',
    'location.address': 78704,//replace with queryZip,
    'location.within': '100mi',//queryWithin
    'categories': 102, //science and technology
    'start_date.keyword': 'this_week',//replace with queryWhen,
//Keyword options are "this_week", "next_week", "this_weekend", "next_month", "this_month", "tomorrow", "today"
    token: ebOAuth,
  };
    const queryStringEB = formatEBParams(paramsEB)
    const urlEB = ebUrlEndPt + '?' + queryStringEB;

    console.log(urlEB);
//    appendResults();

    fetch(urlEB)
      .then(responseEB => {
        if (responseEB.ok) {
          return responseEB.json();
        }
        throw new Error(responseEB.statusText);
      })
      .then(responseEBJson=> appendResultsPg(responseEBJson, maxEBResults));
      //.catch(errEB => {
        //work on this later
     // })

}

//string EB URL together
function formatEBParams(paramsEB) {
  const queryItems = Object.keys(paramsEB)
    .map(token => `${encodeURIComponent(token)}=${encodeURIComponent(paramsEB[token])}`)
  return queryItems.join('&');  
}

function appendNoResults(){
  //Remove home page
  $('.home').remove();
  //Reveal no-results page.
  $('main').append(noResults());
}

function noResults(){
  return `<div role="container" class="no-results">
        <header>
          <h2>Sorry! There are no events in the ${"(value of zipcode)"} area for ${"(value of date)"}</h2>
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
        <header>
          <h2>Results</h2>
        </header>
        <section role="region" id="eventbrite">
          <header><h3>Eventbrite Events</h3></header>
        </section  
          
        <section role="region" id="meetup">
          <header><h3>Meetup Events</h3></header>
        </section>  
        <form class="go-home">
          <button class="reset-search">Search Again</button>
        </form>
      </div>`);
  appendResults(responseEBJson, maxEBResults);
}

function appendResults(responseEBJson, maxEBResults) {
  console.log(maxEBResults);
  for (let i=0; i < responseEBJson.events.length && i < maxEBResults; i++){
  $('#eventbrite').append(
      `<h4><a href="${responseEBJson.events[i].url}" target="_blank">${responseEBJson.events[i].name.text}</a></h4>
            <p>${responseEBJson.events[i].start.local} to ${responseEBJson.events[i].end.local}</p>
             <img alt="event log" src="${responseEBJson.events[i].logo.original.url}">
            <p>${responseEBJson.events[i].description.text}</p>
            <a href="${responseEBJson.events[i].url}" target="_blank">${responseEBJson.events[i].vanity_url}</a>
            <a href="" target="_blank">Add to Google Calendar</a>`
  )};
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