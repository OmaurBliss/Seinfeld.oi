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


// var movie = "Tank Girl";

function callOMDB(movie){
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(data) {
      var Title = data.Title;
        //call render movie function
        renderMovie(data);
        //call GoogleBooks API
        //bookSearch(Title);
        //
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
        // $("#books").val(" ");
  };

  function renderMovie(data){
      console.log(data);
     
      var movieTitle = data.Title;
      var moviePosterURL = data.Poster; //attach to src attribute on image tag
      var genre = data.Genre;
      var releaseDate = data.Released;
      var plot = data.Plot;

      console.log("Movie title: "+movieTitle);
      console.log("Poster URL: "+moviePosterURL);
      console.log("Movie Genre: "+genre);
      console.log("Released: "+releaseDate);
      console.log("Plot: "+plot);
      var titleEl = $("<h1>");
      var genreEl = $("<p>");
      var plotEl = $("<p>");
      var imgEl = $("<img>");

      titleEl.text(movieTitle);
      genreEl.text(genre);
      plotEl.text(plot)
      imgEl.attr({"src": moviePosterURL, "alt": "movie poster"})


      $(".results").append(titleEl, genreEl, imgEl, plotEl)

  };
  
  function renderBooks(response){
    console.log(response);
    $(".results").empty();
    for(var i = 0; i < response.items.length; i++){
      
      var imageLink = response.items[i].volumeInfo.imageLinks.thumbnail;
      var previewLink = response.items[i].volumeInfo.previewLink
      var bookTitle = response.items[i].volumeInfo.title;
      //var bookCover = $("<img>").attr({"src": imageLink, "alt": "Book cover"})
      var author = response.items[i].volumeInfo.authors;
      var bookSummary = response.items[i].volumeInfo.description;

      var titleEl = $("<h1>");
      var authorEl = $("<p>");
      var summaryEl = $("<p>");
      var imgEl = $("<img>");

      titleEl.text(bookTitle);
      authorEl.text(author);
      summaryEl.text(bookSummary)
      imgEl.attr({"src": imageLink, "alt": "book cover"})


      $(".results").append(titleEl, authorEl, imgEl, summaryEl)
      // console.log("Book cover image link: "+imageLink);
      // console.log("Book title: "+bookTitle);
      // console.log("Author: "+author);
      // console.log("Book Summary: "+bookSummary);
    //   console.log(previewLink);
      //$(".results").append($("<h2>").text(response.items[i].volumeInfo.title));
      //$(".results").append(bookCover);
      // $(".results").append($("<img>").attr("src", previewLink));
      //$(".results").append($("<h3>").text(response.items[i].volumeInfo.authors));
      //$(".results").append($("<p>").text(response.items[i].volumeInfo.description));
    }
  }
  
  $("button").on("click", function(){

    var search = $("#books").val().trim();
    console.log(search);
    if(search){
      console.log(search);
      callOMDB(search);
    }else{
      alert("NOTHING!")
    };
  })
    
  