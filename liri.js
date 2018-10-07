

require("dotenv").config();
var inquirer = require("inquirer")
var fs = require('fs');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
// var log = require('simple-node-logger').createSimpleFileLogger(filename);
var fileLog = './log.txt';
var omdb = keys.omdb.key;
var omdbQuery = 'http://www.omdbapi.com/?apikey='+ omdb + '&t=';
var command = process.argv[2];
var commandParam = "";
var defaulted = {
  song: "Sinister Kid",
  artist: "Black Keys",
  movie: "Mr. Nobody",
  task:""
}
var commands = ["spotify-this-song", "movie-this", "concert-this", "do-what-it-says" ]
// takes our process.argv[2] to call one of the liribot's functionality
function liriCommand(command){
  switch(command){
    // case nothing:
    // selectfunction();
    // break;
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
    break;
  }
}

// in case of no commands this makes you pick one
function selectfunction(){
  inquirer.prompt([
    {
      type: "rawlist",
      message: "Please select what you would lie me to search for you",
      choices: commands,
      name: "selection",
    }
  ]).then(function(answer){

  })
}

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

function movieThis(movie){
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

function bandsInTownCommand(){};

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
          message: "What you would like me to search for you",
          name: "new_command",
        }
      ]).then(function(answer){
        liriCommand(answer.new_command);
      });
    };
  });
};

liriCommand(command);

