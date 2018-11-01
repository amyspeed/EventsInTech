//Link to meetup & Eventbrite APIs

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
      $('main').append(homePage());
      console.log('appendHome');
  }
  
  function homePage(){
    return `<div role="container" class="home">
          <header>
            <h2>Where and When?</h2>
          </header>
          <form id="main-form">
            <label for="select-location">Select your location</label>
            <select id="select-location">
              <option value="">--Choose one--</option>
              <option value="78704">Austin</option>
              <option value="94016">San Francisco</option>
              <option value="10001">New York City</option>
              <option value="">Other</option>
            </select>
  
            <label for="location-other">or input a 5-digit zip code</label>
            <input id="location-other" type="number" maxlength=5 minlength=5 placeholder="Zip code">
  
            <legend for="select-date">When?</legend>
            <select id="select-date">
              <option value="">--Choose one--</option>
              <option value="today">Today</option>
              <option value="Week">This Week</option>
              <option value="">Other</option>
            </select>  
  
            <label for="date-other">select a date</label>
            <input id="date-other" type="date">
            <br>
            <input type="submit" value="Show Me!" id="form-submit">
          </form>  
        </div>
  `
  }
  
  //location: Handle select "other": show hidden zipcode input
  //Date: Handle select "other": show hidden date input
  
  //Handle submit. Value of zipcode and date used to fetch Meetup and Eventbrite data.
  
  function handleSubmit(){
    $('main').on('click', '#form-submit', function (event){
      event.preventDefault;
      //boolean. Send to Results or No-Results
      //appendNoResults();
      appendResults();
    })
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
  
  function appendResults(){
    //Remove home page
    $('.home').remove();
    //Reveal results page.
    $('main').append(results());
    console.log('appendResults');
  }
  
  function results(){
    return `<div role="container" class="results">
          <header>
            <h2>Results</h2>
          </header>
          <section role="region" id="meetup">
            <header><h3>Meetup Events</h3></header>
            <h4><a href="" target="_blank">Example</a></h4>
              <p>Description XXXXX</p>
              <a href="" target="_blank">RSVP Here</a>
              <a href="" target="_blank">Add to Google Calendar</a>
          <section role="region" id="eventbrite">
            <header><h3>Eventbrite Events</h3></header>
            <h4><a href="" target="_blank">Example</a></h4>
              <p>Description XXXXX</p>
              <a href="" target="_blank">RSVP Here</a>
              <a href="" target="_blank">Add to Google Calendar</a>
          <form class="go-home">
            <button class="reset-search">Search Again</button>
          </form>
        </div>`
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