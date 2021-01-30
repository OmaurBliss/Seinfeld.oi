//pseudo-coding out the javascript
//user enters a move title into an input field and clicks a button.
//on click-- if there is a value in the input field, call 'callOMDB' and pass value as parameter, if not, let user know we need a value, or just return.

//decide when to push value is saved to an empty array, and when value should be saved to local storage. 

//callOMDB will pull movie info from the API, call the renderMovie function, call the generate button/list item function, and call the bookSearch function.

//bookSearch will call the GoogleBooks API  and will pass the results to the renderBooks function

//renderMovie--will display information about the movie (should there be a "go-back" button that will clear results & local storage(last entry) in case the movie the user entered wasn't the one they meant?)

//renderBooks--will display the books that are related to the movie that the user entered.  What next?  User can click on a book title and then....what happens?  Book is saved to a my library list?  Book title will pass through callOMDB to let the user see if there's a movie based off of the book they clicked?



//NOT BUILT YET BUT---we need a myResults function that will add elements to where ever we plan on holding the user's previous searches (drop down list from navbar) etc.  Also possibly render the previous search list,  user can select an item from that list and the value of the item will pass through to the call API functions and paint the page
//also renderButtons or renderListItems--will hold previous search values and allow user to toggle back and forth between searches

//should we include a "My Library" html page that the user can link to off of the Navbar that will display the most recent title they looked up along with their book/movie history?




function callOMDB(movie){
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(data) {
      var Title = data.Title;
        //call render movie function
        renderMovie(data);
    });
  };
 

//calls GoogleBooks API
function bookSearch(Title){
    var search = Title //$("#books").val().trim();
  
  // var API_KEY = "AIzaSyDwKeamH8RwfRQQ9fG7dA2j1KTOVqGcv3A";
  var queryURL = "https://www.googleapis.com/books/v1/volumes?q="+search;
  
        $.ajax({
          url: queryURL,
          dataType: "json",
  
          success: function(response){
            renderBooks(response);
          },
          type: "GET"
        });
        
  };

  //render info from OMDB API to modal
  function renderMovie(data){
      console.log(data);
      $(".modal-body").empty();
      var movieTitle = data.Title;
      var moviePosterURL = data.Poster;
      var genre = data.Genre;
      var releaseDate = data.Released;
      var plot = data.Plot;
      var titleEl = $("h5");
      var genreEl = $("<p>");
      var plotEl = $("<p>");
      var imgEl = $("<img>");
      var releasedEl = $("<p>")

      titleEl.text(movieTitle);
      genreEl.text(genre);
      plotEl.text(plot)
      imgEl.attr({"src": moviePosterURL, "alt": "movie poster"})
      releasedEl.text("Released: "+releaseDate);

      $("#findBooks").attr("data-movie", movieTitle);
      $(".modal-body").append(genreEl, imgEl, plotEl, releasedEl)
    $("#movieModal").modal("show");
  };
  
  //render info from Google Books API to results container
  function renderBooks(response){
    console.log(response);
    $(".results").empty();
    for(var i = 0; i < 4; i++){
      var imageLink = response.items[i].volumeInfo.imageLinks.thumbnail;
      var bookTitle = response.items[i].volumeInfo.title;
      // var bookCover = $("<img>").attr({"src": imageLink, "alt": "Book cover"})
      var author = response.items[i].volumeInfo.authors;
      var bookSummary = response.items[i].volumeInfo.description;
      // var imgAttr = attr({"src": imageLink, "alt": "book cover"})
      var bookHtml = `<div class="container">
      <div class="card-group vgr-cards">
      <div class="card">
      <div class="card-img-body">
      <img class="card-img test"  src=${imageLink} alt="book cover">
      </div>
      <div class="card-body">
        <h4 class="card-title">${bookTitle}</h4>
        <p class="card-text">${author}</p>
        <p class="card-text">${bookSummary}</p>
        <a href="#" class="btn btn-outline-primary">Primary</a>
      </div>
      </div>`;    
      
      $(".book-container").append(bookHtml);
    }
  }


  //click-event handlers
  //initialize search
  $("#firstSearch").on("click", function(){
     var search = $("#books").val().trim();
    if(search){
      callOMDB(search);
      $("#firstSearch").val("");
    }else{
      return;
    };
  })

//call GoogleBooks within Modal
 $("#findBooks").on("click", function(){
  bookSearch($(this).attr("data-movie"));
  
  $("#movieModal").modal("hide");
 });

  //close modal
  $(".closeModal").on("click", function(){
    $("#firstSearch").val("");
    $("#movieModal").modal("hide");
    
  });
    
  