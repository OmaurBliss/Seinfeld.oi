


var movie = "Ender's Game";
var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
function callOMDB(movie){
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(data) {
      var Title = data.Title;
        //call render movie function
        renderMovie(data);
        //call GoogleBooks API
        bookSearch(Title);
        //
    });
  };
  callOMDB(movie);

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

      console.log("Book cover image link: "+imageLink);
      console.log("Book title: "+bookTitle);
      console.log("Author: "+author);
      console.log("Book Summary: "+bookSummary);
    //   console.log(previewLink);
      //$(".results").append($("<h2>").text(response.items[i].volumeInfo.title));
      //$(".results").append(bookCover);
      // $(".results").append($("<img>").attr("src", previewLink));
      //$(".results").append($("<h3>").text(response.items[i].volumeInfo.authors));
      //$(".results").append($("<p>").text(response.items[i].volumeInfo.description));
    }
  }
  
//   $("button").on("click", bookSearch);