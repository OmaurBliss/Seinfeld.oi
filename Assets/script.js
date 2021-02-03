//global variables for local storage and session storage
var userLibrary = JSON.parse(localStorage.getItem("myBooks")) || [];
var storedMovieSearches = [];

//call OMDB API
function callOMDB(movie) {
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET",
    success: function (data) {
      if (data.Response === "False") {
        var errMssg = data.Error;
        $("#errorText").text(
          errMssg + " Please check your spelling and try again."
        );
        $("#errorModal").modal("show");
      } else {
        var Title = data.Title;

        renderMovie(data);
        storeSearch(Title);
      }
    },
  });
}

//call OMDB from drop-down buttons
function recallOMDB(movie) {
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET",
    success: function (info) {
      renderMovie(info);
    },
    error: function (info) {
      console.log(info);
    },
  });
}

//calls GoogleBooks API
function bookSearch(Title) {
  var search = Title;

  var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + search;

  $.ajax({
    url: queryURL,
    dataType: "json",
    type: "GET",
    success: function (response) {
      renderBooks(response);
    },
    error: function (response) {
      console.log(response);
    },
  });
}

//render info from OMDB API to modal
function renderMovie(data) {
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
  var releasedEl = $("<p>");

  titleEl.text(movieTitle);
  genreEl.text(genre);
  plotEl.text(plot);
  imgEl.attr({ src: moviePosterURL, alt: "movie poster" });
  releasedEl.text("Released: " + releaseDate);

  $("#findBooks").attr("data-movie", movieTitle);
  $(".modal-body").append(genreEl, imgEl, plotEl, releasedEl);
  $("#movieModal").modal("show");
}

//render info from Google Books API to results container
function renderBooks(response) {
  $(".results").empty();
  for (var i = 0; i < 4; i++) {
    var imageLink = response.items[i].volumeInfo.imageLinks.thumbnail;
    var bookTitle = response.items[i].volumeInfo.title;
    var author = response.items[i].volumeInfo.authors;
    var bookSummary = response.items[i].volumeInfo.description;
    var bookHtml = `<section style="margin-bottom: 40px; padding: 30px; background-color:  rgb(128, 0, 0);" class="container">
      <div class="container ">
      <div class="card-group vgr-cards">
      <div  class="card">
      <div class="card-img-body">
      <img style="max-width: 125px; padding-top: 20px" class="card-img"  src=${imageLink} alt="book cover">
      </div>
      <div "card-body">
        <h4 class=" card-title">${bookTitle}</h4>
        <p class="card-text author">${author}</p>
        <p style= "font-size: 15px;" class="card-text summary">${bookSummary}</p>
        <button class="btn btn-color btn-size btn-book" data-book="${bookTitle}">Add to My Library</button>
      </div>
      </div>
      </section>`;

    $(".results").append(bookHtml);
  }
}

//setting to and retrieving from session storage
function storeSearch(search) {
  storedMovieSearches.unshift(search);
  sessionStorage.setItem("recent", JSON.stringify(storedMovieSearches));
}

function renderSearches() {
  $(".dropdown-menu").empty();
  for (var k = 0; k < storedMovieSearches.length; k++) {
    var searchHTML = `<button id="movieBtn" class="dropdown-item sub-menu" type ="button" data-recent="${storedMovieSearches[k]}">${storedMovieSearches[k]}</button>`;

    $(".dropdown-menu").append(searchHTML);
  }
}

//setting to and retrieving from local storage
$(document).on("click", ".btn-book", function (e) {
  e.preventDefault;
  var savedBook = {
    Title: $(this).attr("data-book"),
    Author: $(this).siblings(".author").html(),
    Summary: $(this).siblings(".summary").html(),
    Cover: $(this)
      .parent()
      .siblings(".card-img-body")
      .children(".card-img")
      .attr("src"),
  };

  userLibrary.unshift(savedBook);
  storeBooks();
});

function storeBooks() {
  localStorage.setItem("myBooks", JSON.stringify(userLibrary));
}

//called when libraryindex.html loads
function loadMyLibrary() {
  for (var j = 0; j < userLibrary.length; j++) {
    var savedTitle = userLibrary[j].Title;
    var savedAuthor = userLibrary[j].Author;
    var savedSummary = userLibrary[j].Summary;
    var savedCover = userLibrary[j].Cover;

    var savedHtml = `<section style="margin-bottom: 40px; padding: 30px; background-color:  rgb(128, 0, 0);" class="container">
    <div class="container ">
    <div class="card-group vgr-cards">
    <div  class="card">
    <div class="card-img-body">
    <img style="max-width: 125px; padding-top: 20px" class="card-img"  src=${savedCover} alt="book cover">
    </div>
    <div "card-body">
      <h4 class=" card-title">${savedTitle}</h4>
      <p class="card-text author">${savedAuthor}</p>
      <p style= "font-size: 15px;" class="card-text summary">${savedSummary}</p>
    </div>
    </div>
    </section>`;

    $(".myLibrary").append(savedHtml);
  }
}

//click-event handlers

//initialize search
$("#firstSearch").on("click", function (e) {
  e.preventDefault;
  var search = $("#books").val().trim();
  if (search) {
    callOMDB(search);
  } else {
    return;
  }
  $("#books").val("");
});

//modal click events
$("#findBooks").on("click", function () {
  bookSearch($(this).attr("data-movie"));
  $("#movieModal").modal("hide");
});

//close modal
$(".closeModal").on("click", function () {
  $("#firstSearch").val("");
  $("#movieModal").modal("hide");
});

//clear search results field
$("#clear-search").on("click", function () {
  $(".results").empty();
});

//clear local storage/My Library
$(".clearLibrary").on("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  location.reload();
});

//call renderSearches function to render session storage
$("#recent-searches").on("click", function (e) {
  e.preventDefault();
  if (!storedMovieSearches.length) {
    return;
  }
  renderSearches();
});

$("#more-recent-searches").on("click", function (e) {
  e.preventDefault();
  if (!storedMovieSearches.length) {
    return;
  }
  renderSearches();
});

//call OMDB from dropdown link
$(document).on("click", "#movieBtn", function (e) {
  e.preventDefault;
  recallOMDB($(this).attr("data-recent"));
});
