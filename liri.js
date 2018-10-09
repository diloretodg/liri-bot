
// required npm modules
require("dotenv").config();
var inquirer = require("inquirer")
var fs = require('fs');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');

// API Keys stored here
var fileLog = './log.txt';
var omdb = keys.omdb.key;
var bandsInTown = keys.bandsInTown.key;



// Build Liri commands and allows defaulted values
var command = process.argv[2];
var commandParam = "";
var defaulted = {
  song: "Sinister Kid",
  artist: "Black Keys",
  movie: "Mr. Nobody",
  task:""
}
var commands = ["spotify-this-song", "movie-this", "concert-this", "do-what-it-says", "Never Mind" ]

// takes our process.argv[2] to call one of the liribot's functionality
function liriCommand(c, t){
  console.log(command);
  console.log(commandParam)
  // if neither are stated propts the user to select functionality
  if(!c && !t){
    selectFunction();
    // if no topic specified propts the user to select topic
  } else if (!t){
    selectCommand(c)  
    // if bot the command and topic are specified will run search with no prompts
  } else {
    switch(c){
      case "spotify-this-song":
      spotifyThis(t);
      break;
      case "movie-this":
      movieThis(t);
      break;
      case "concert-this":
      concertThis(t);
      break;
      case "do-what-it-says":
      break;

    }
  }
}

// builds search value for multiple word values
function buildTopic(arr){
  commandParam = "";
  for (var i = 3; i < arr.length; i++ ){
    commandParam = commandParam + arr[i] + " ";
  }
  console.log("Searching: " + commandParam);
  return commandParam;
}

// called when the user needs to be prompted f0r searches
function selectCommand(command){
  switch(command){
    case "spotify-this-song":
    spotifyCommand();
    break;
    case "movie-this":
    omdbCommand();
    break;
    case "concert-this":
    bandsInTownCommand();
    break;
    case "do-what-it-says":
    doWhatItSaysCommand();
    break;
    case "Never Mind":
    console.log("\nBye!")
    break;
  }
}

// in case of no commands this makes you pick one
function selectFunction(){
  inquirer.prompt([
    {
      type: "rawlist",
      message: "Please select what you would like me to search for you",
      choices: commands,
      name: "selection",
    }
  ]).then(function(answer){
    liriCommand(answer.selection)
  })
}

// Uses Spotify API to search for user requested info and comfirms the search 
function spotifyThis(song){
  var spotify = new Spotify(keys.spotify);
  spotify.search({ type: 'track', query: song })
  .then(function(data) {
    var index = 0;
    function printTrack(){
      var track = data.tracks.items[index];
      console.log(
        "\n-----------------------\n" +
        "Title: " + track.name + "\n" +
        "Artist: " + track.artists[0].name + "\n" +
        "Release Date: " + track.album.release_date +
        "\n-----------------------\n" 
        );
        // will cycle through top 3 songs if displayed song is not correct
        inquirer.prompt([
          {
            name: "song",
            type: "confirm",
            message: "is this the song you were looking for?"
          }
        ]).then(function(answer){
          if(!answer.song && index < 3){
            index++;
            printTrack()
          } else if (!answer.song && index >= 3) {
            console.log("Sorry. I couldn't find your Song..")
            anythingElse();
          } else {
            anythingElse()
          }
        })
      }
      printTrack()
  })
};

// when prompted will inquire search parameter if ignored will display default song "Sinister Kid by Black Keys"
function spotifyCommand(){
  inquirer.prompt([
    {
      name: "song",
      message:"What song would you like to search?"
    }
  ]).then(function(answer){
    if(answer.song === ""){
      spotifyThis(defaulted.song)
    } else {
      commandParam = answer.song;
      spotifyThis(commandParam);
    }
  })
}

// uses OMDB API to search for user requested movie and confirms if correct one
function movieThis(movie){
  var omdbQuery = 'http://www.omdbapi.com/?apikey='+ omdb + '&t=';
  axios.get(omdbQuery + movie)
  .then(function (response) {
    var movieSearch = response.data;
    console.log(
      "\n-----------------------\n" +
      "Title: " + movieSearch.Title + "\n" +
      "Director: " + movieSearch.Director + "\n" +
      "Actors: " + movieSearch.Actors + "\n" +
      "Rating: " + movieSearch.Rated + "\n" +
      "Release Date: " + movieSearch.Released + "\n" +
      "Synopsis: " + movieSearch.Plot + 
      "\n-----------------------\n" 
    );
    inquirer.prompt([
      {
        type: "confirm",
        message: "Is this the movie you were looking for?",
        name: "movie_check"
      }
    ]).then(function(answer){
      if(!answer.movie_check){
        console.log("\n----------------\n\n")
        omdbCommand();
      } else {
        anythingElse()
      }
    })
  })
}

//when prompted will specify search parameter. if ignored the search will run for "Mr. Nobody" 
function omdbCommand(){
  inquirer.prompt([
    {
      name: "movie",
      message:"What movie would you like to search?"
    }
  ]).then(function(answer){
    if(answer.movie === ""){
      movieThis(defaulted.movie);
    } else {
      commandParam = answer.movie;
      movieThis(commandParam);
    } 
  })
}

// Uses Bands in Town API to search user requested info
function concertThis(artist){
  var bandsInTownQuery = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bandsInTown;
  axios.get(bandsInTownQuery).then(function(response){
    console.log(response.data)
    for(var i = 0; i < response.data.length && i < 5; i ++){
        console.log(
          "\n-----------------------\n" +
          "Artist: " + artist + "\n" +
          "Venue: " + response.data[i].venue.name + "\n" +
          "Location: " + response.data[i].venue.city + ' ,' + response.data[i].venue.country + "\n" +
          "Date: " + response.data[i].datetime +
          "\n-----------------------\n" 
          );
        }
      anythingElse();
  })
};

// when called prompts the user for search parameter
function bandsInTownCommand(){
  inquirer.prompt([
    {
      name: "artist",
      message:"What artist would you like to search?"
    }
  ]).then(function(answer){
    if(answer.artist === ""){
      concertThis(defaulted.artist)
    } else {
      commandParam = answer.artist;
      concertThis(commandParam);
    }
  })
};

// Checks if there is any thing else that should be searched for the user
function anythingElse(){
  inquirer.prompt([
    {
      type: "confirm",
      name: "anything_else",
      message: "Can I look up anything else for you?"
    },
  ]).then(function(answer){
    if(answer.anything_else){
      inquirer.prompt([
        {
          message: "What can I do for you",
          name: "new_command",
        }
      ]).then(function(answer){
        var topic = answer.new_command.split(" ");
        topic.unshift("0", "1")
        command = topic[2];
        buildTopic(topic)
        liriCommand(command, commandParam);
      });
    };
  });
};

buildTopic(process.argv);
liriCommand(command,commandParam);

