


/////////////////////////////////////////////////////////////////////////////////////


//Required NPM modules
//-------------------

//Requires dotenv to gain access to secret api keys

//requires the NPM modules for accessing the spotify API

//requires the information contained in the keys.js file to access spotify API

//requires the Node Module fs for accessing do-what-it-says

//requires the Node Module axios for accessing ombd API and bands in town API

//Output file for logs

//NPM module used for logging solution

//All log information is allowed in log.txt
log.setLevel('all');

//Controllers and required params
//-------------------------------

//requests action
var action = process.argv[2];
//Argument to request specific information
//Based on above action type
var argument = "";

//Controller function that determines the action taken and the specific data needed for the action
handleAction(action, argument);

//switch function to determine which action to take
function handleAction(action, argument) {
  argument = getArgument();

  switch (action) {
    //concert this
    case "concert-this":
    //Grabs the artistName arguement
    var artistName = argument;
    //If artistName is not provided defaults to Avatar
    if (artistName === "") {
      lookupAvatar();
    } else {
      //Gets the event info for artist name
      getEventInfo(artistName);
    }
    break;
    //Gathers song information from spotify API
    case "spotify-this-song":
    //Grabs the songTitle argument
    var songTitle = argument;
    //if no songTitle is provided then defaults to "All the small things"
    if (songTitle === "") {
      lookupSpecificSong();
    } else {
      //Gets the song info for the specified song
      getSongInfo(songTitle);
    }
    break;
    //Gets Movie information
    case "movie-this":
    //Grabs the movieTitle argument
    var movieTitle = argument;
    //If no movieTitle is provided then defaults to "Mr. Nobody"
    if (movieTitle === "") {
      lookupSpecificMovie();
    } else {
      //Gets the movie info for the specific movie
      getMovieInfo(movieTitle);
    }
    break;
    //do what it says
    case "do-what-it-says":
    //Performs the action indicated in the random.txt file
    doWhatItSays();
    break;
  }
}

//Returns the argument
//Example being returns the artist's name when requesting concert information
function getArgument() {
  
  //Stores all arguments in an array
  argumentArray = process.argv;

  //Loops through all the items within the node argument
  for (var i = 3; i < argumentArray.length; i++) {
    argument += argumentArray[i];
  }
  return argument;
}

//concert-this
//-------------------
function getEventInfo(artistName){
  //calls the bandsintown api to look for events by artist name
  axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp")
  .then(function (response) {
    //for loop to iterate along the response.data
    for (var i = 0; i < 3; i++) {
    //Logs the command used, venue name, location and date of the show for the artist name
    logOutput("Command: node liri.js concert-this " + artistName);
    logOutput("Venue Name: " + response.data[i].venue.name);
    logOutput("Location: " + response.data[i].venue.city + ' ,' + response.data[i].venue.region);
    logOutput("Date: " + response.data[i].datetime);
    logOutput("------------");
    }
})
.catch(function (error) {
  //Logs any errors to the log.txt files
  logOutput(error);
});
}

function lookupAvatar(){
  //calls the bandsintown api to look for events by Avatar if no artist is input
  axios.get("https://rest.bandsintown.com/artists/avatar/events?app_id=codingbootcamp")
  .then(function (response) {
    //for loop to iterate along the response.data
    for (var i = 0; i < 3; i++) {
    //Logs the command used, venue name, location and date of the show for the artist name
    logOutput("Command: node liri.js concert-this");
    logOutput("Venue Name: " + response.data[i].venue.name);
    logOutput("Location: " + response.data[i].venue.city + ' ,' + response.data[i].venue.region);
    logOutput("Date: " + response.data[i].datetime);
    logOutput("------------");
    }
})
.catch(function (error) {
  //Logs any errors to the log.txt files
  logOutput(error);
});
}


//Spotify-this-song
//-------------------

//Calls spotify API to retrieve the song information for songTitle
function getSongInfo(songTitle) {

  //sets spotify equal to the key info to call the spotify API
  var spotify = new Spotify(SpotifyKeys.spotify);

  spotify
    .search({ type: 'track', query: songTitle})
    .then(function(response) {

    //Default search on the spotify API returns 20 objects
    //Going to attempt to find documentation regarding limit on npm later to render this solution unneeded
    var artistsArray = response.tracks.items[0].album.artists;
    
    //Array to hold artists names, for songs that return multiple artists
    var artistNames = [];
    
    //Goes down the length of the array and pushes the artists names for each song
    for (var i = 0; i < artistsArray.length; i++) {
      artistNames.push(artistsArray[i].name);
    }

    //Converts the array into a string
    var artists = artistNames.join(", ");
    
    //Console.logs the response from the Spotify API for Artist, Song title, URL, and Album name
    logOutput("Command: spotify-this-song " + response.tracks.items[0].name);
    logOutput("Artist: " + artists);
    logOutput("Song: " + response.tracks.items[0].name);
    logOutput("Spotify preview URL: " + response.tracks.items[0].preview_url);
    logOutput("Album name: " + response.tracks.items[0].album.name);
    logOutput("------------");
  })
    .catch(function(err) {
    //console.logs any caught errors
    console.log(err);
    logOutput(err);
  });

}

//When no song title is provided return "The Sign" by Ace of Base
function lookupSpecificSong() {

//sets spotify equal to the key info to call the spotify API
var spotify = new Spotify(SpotifyKeys.spotify);

//searches the spotify API by track name 
spotify
  .request( 'https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc' )
  .then(function(response) {
    //Console.logs the response from the Spotify API for Artist, Song title, URL, and Album name
    logOutput("Command: spotify-this-song " + response.name);
    logOutput("Artist: " + response.artists[0].name);
    logOutput("Song: " + response.name);
    logOutput("Spotify preview URL: " + response.preview_url);
    logOutput("Album name: " + response.album.name);
    logOutput("------------");
  })
  .catch(function(err) {
    //console.logs any caught errors
    console.log(err);
    logOutput(err);
  });
}

//movie-this
//-------------------

function getMovieInfo(movieTitle) {
  //Calls on the OMDB api to get data for var movieTitle
  axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' +movieTitle)
  .then(function (response) {
  //Node command
  logOutput('Command: node liri.js movie-this ' + movieTitle);
  //Title of the movie.
  logOutput('Title: ' + response.data.Title);
  //Year the movie came out.
  logOutput('Year: ' + response.data.Year);
  //IMDB Rating of the movie.
  logOutput('IMDB Rating: ' + response.data.Ratings[0].Value);
  //Rotten Tomatoes Rating of the movie.
  logOutput('Rotton Tomatoes Rating ' + response.data.Ratings[1].Value);
  //Country where the movie was produced.
  logOutput('Country ' + response.data.Country);
  //Language of the movie.
  logOutput('Language ' + response.data.Language);
  //Plot of the movie.
  logOutput('Plot ' + response.data.Plot);
  //Actors in the movie.
  logOutput('Actors ' + response.data.Actors);
  logOutput("------------");
})
.catch(function (error) {
  //Logs any errors to the log.txt files
  logOutput(error);
});
}

//Function to return the movie Mr. Nobody if no movie title is input
function lookupSpecificMovie () {
  //Calls upon the OMDB api to get data related to the 2009 movie MR. Nobody
  axios.get('http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody')
  .then(function (response) {
  //Node command
  logOutput('Command: node liri.js movie-this ' + response.data.Title);
  //Title of the movie.
  logOutput('Title: ' + response.data.Title);
  //Year the movie came out.
  logOutput('Year: ' + response.data.Year);
  //IMDB Rating of the movie.
  logOutput('IMDB Rating: ' + response.data.Ratings[0].Value);
  //Rotten Tomatoes Rating of the movie.
  logOutput('Rotton Tomatoes Rating ' + response.data.Ratings[1].Value);
  //Country where the movie was produced.
  logOutput('Country ' + response.data.Country);
  //Language of the movie.
  logOutput('Language ' + response.data.Language);
  //Plot of the movie.
  logOutput('Plot ' + response.data.Plot);
  //Actors in the movie.
  logOutput('Actors ' + response.data.Actors);
  logOutput("------------");
})
.catch(function (error) {
  //Logs any errors to the log.txt files
  logOutput(error);
});
}

//Do-what-it-says
//-------------------

function doWhatItSays() {
  fs.readFile('random.txt','utf8', (err, data) => {
    if (err) {
      logOutput(err);
    }else {
    
    //Creates an array for the data in the random.text file
    var randomTxtArray = data.split(",");

    //Sets action equal to the first item from the array
    action = randomTxtArray[0];
    
    //Sets the argument to the second item from the array
    argument = randomTxtArray[1];

    //Calls the controller function to handle the data from the random file and calls the appropriate function
    handleAction(action, argument);
    }
  });
}

//Logs data into the terminal and outputs to a text file.
function logOutput(logText) {
  log.info(logText);
  console.log(logText);
}