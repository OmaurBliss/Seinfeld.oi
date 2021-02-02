


//NOT BUILT YET BUT---we need a myResults function that will add elements to where ever we plan on holding the user's previous searches (drop down list from navbar) etc.  Also possibly render the previous search list,  user can select an item from that list and the value of the item will pass through to the call API functions and paint the page
//also renderButtons or renderListItems--will hold previous search values and allow user to toggle back and forth between searches


//global variables for local storage and session storage
var userLibrary = JSON.parse(localStorage.getItem('myBooks'))|| [];
var storedMovieSearches = []

function callOMDB(movie){
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(data) {
      var Title = data.Title;
        //call render movie function
        renderMovie(data);
        storeSearch (Title);
    });
  };
 

//calls GoogleBooks API
function bookSearch(Title){
    var search = Title 

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
    
    $(".results").empty();
    for(var i = 0; i < 4; i++){
      var imageLink = response.items[i].volumeInfo.imageLinks.thumbnail;
      var bookTitle = response.items[i].volumeInfo.title;
      var author = response.items[i].volumeInfo.authors;
      var bookSummary = response.items[i].volumeInfo.description;
      var bookHtml = `<section class="container">
      <div class="container">
      <div class="card-group vgr-cards">
      <div class="card">
      <div class="card-img-body">
      <img class="card-img"  src=${imageLink} alt="book cover">
      </div>
      <div class="card-body">
        <h4 class="card-title">${bookTitle}</h4>
        <p class="card-text author">${author}</p>
        <p class="card-text summary">${bookSummary}</p>
        <button class="btn btn-color btn-book" data-book="${bookTitle}">Add to My Library</button>
      </div>
      </div>
      </section>`;
      
           
      $(".results").append(bookHtml);
    }

    //setting to and retrieving from local storage
    $(".btn-book").on("click", function(e){
      e.preventDefault
      var savedBook = {
        "Title": $(this).attr("data-book"),
        "Author": $(this).siblings(".author").html(),
        "Summary": $(this).siblings(".summary").html(),
        "Cover": $(this).parent().siblings(".card-img-body").children(".card-img").attr("src")
      }

      userLibrary.unshift(savedBook);
      storeBooks();
    });

  }

    function storeBooks(){
    localStorage.setItem("myBooks", JSON.stringify(userLibrary));
  }

  
  //called when libraryindex.html loads
  function loadMyLibrary(){

      for(var j = 0; j < userLibrary.length; j++){
        var savedTitle = userLibrary[j].Title;
        var savedAuthor = userLibrary[j].Author;
        var savedSummary = userLibrary[j].Summary;
        var savedCover = userLibrary[j].Cover;

        var savedHtml = `<section class="container">
        <div class="container">
        <div class="card-group vgr-cards">
        <div class="card">
        <div class="card-img-body">
        <img class="card-img"  src=${savedCover} alt="book cover">
        </div>
        <div class="card-body">
          <h4 class="card-title">${savedTitle}</h4>
          <p class="card-text author">${savedAuthor}</p>
          <p class="card-text summary">${savedSummary}</p>
          <button class="btn btn-color btn-book" data-book="${savedTitle}">Add to My Library</button>
        </div>
        </div>
        </section>`;

        $(".myLibrary").append(savedHtml);
      }
    
  };
  

  //click-event handlers
  //initialize search
  $("#firstSearch").on("click", function(e){
    e.preventDefault;
     var search = $("#books").val().trim();
    if(search){
      callOMDB(search);
    }else{
      return;
    };
    $("#books").val("");
    // storeSearch (search);
  });
  
  function storeSearch (search) {
    storedMovieSearches.unshift(search)
    sessionStorage.setItem("recent",JSON.stringify (storedMovieSearches))
 console.log(sessionStorage.getItem("recent"))  
}


//modal click events
 $("#findBooks").on("click", function(){
  bookSearch($(this).attr("data-movie"));
  $("#movieModal").modal("hide");
 });

  //close modal
  $(".closeModal").on("click", function(){
    $("#firstSearch").val("");
    $("#movieModal").modal("hide");
  });

  //clear search results field
$("#clear-search").on("click", function(){
  $(".results").empty();
})
  