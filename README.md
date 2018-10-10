# liri-bot

 [Watch a demo of the app](https://drive.google.com/file/d/17YAub8tXr52qZ-NukLudFdfxE4NY-wCq/view?usp=sharing"Liri-bot Demo")

This Node.js app takes user input to search several API for requested info.

APIs used:

Spotify - search for info on songs checked against the Spotify Database

OMDB - seearch for Movie info with OMDB's Database

Bands in Town - Check for Artist events coming up around the world

Technologies Used:

inquirer - Will prompt the user in situations where search criteria is left out

dotenv - used to protect API keys

Moment.js - used to display specific event dates/time correctly

# Liri commands

- you may simply open the app and inquirer will prompt you through the process if you do not want to type everything up front.

### What Each Command Should Do

1. `node liri.js concert-this <artist/band name here>`
   - liri will look up an artist of your choosing and show you:
        - their next three shows
        - the names of the venues
        - the location of these shows
        - the date these shows will take place


2. `node liri.js spotify-this-song '<song name here>'`
     - if you do not say the song you wish to search here you will be prompted to type the song. if it is not the song you were looking for liri will cycle through the top three to help you find the correct song. after your search liri will check if you have a new search for her. once searched liri will display:
        - the Song Title
        - the performing artist
        - the album it is on
        - the link to the spotify preview
        - the release date of the song/album

           * If no song is provided then your program will default to "The Sign" by Ace of Base.


3. `node liri.js movie-this '<movie name here>'`
    - Liri will search OMDB's Database and display:
        - Title of the movie.
        - Year the movie came out.
        - IMDB Rating of the movie.
        - Rotten Tomatoes Rating of the movie.
        - Country where the movie was produced.
        - Language of the movie.
        - Plot of the movie.
        - Actors in the movie.

           * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

4. `node liri.js do-what-it-says`

  * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.


 
