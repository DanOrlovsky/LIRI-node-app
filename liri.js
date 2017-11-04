// LIRI-node-app
// Dan Orlovsky
// 10/31/17

// Include custom libs for app
var service = require('./lib/app-service');
var gui = require('./lib/gui');
var keys = require('./lib/keys');

// Include dependencies
var Spotify = require('node-spotify-api');
var request = require('request');
var clear = require('clear');
var inquirer = require('inquirer');
var fs = require('fs');
var Twitter = require('twitter');
var twitter = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);
var searchTitle = "";

// Clears the display
clear();

// Get's the date
var dateTime = new Date();

// Loop through an array from a starting index and returns a string
function buildSearchString(startIdx, arr) {
    searchTitle = "";
    for(var i = startIdx; i < arr.length; i++) {
        searchTitle += arr[i] + " ";
    }
}

// Displays usage instructions
function displayHelp() {
    gui.writeText(`\n
        --------------------------------------------------
        |                Welcome to LIRI!                |
        --------------------------------------------------
        USAGE INSTRUCTIONS:\n\n
        $node liri '<option>'

        Possible <option>'s are :
        \tmy-tweets
        \tspotify-this-song '<song name here>'
        \tmovie-this '<movie title here>'\n\n\n
    `);
    service.LogAction('Display Help', 'Nothing to show');
}

// Displays a users' latest tweets.
function displayTweets() {
    var tweetString = "\n\nHere are your latest tweets!\n\n";
    // Call twitter
    twitter.get('statuses/user_timeline', keys.twitterParams).then((tweets) => { 
        // Loop through the tweets, building a tweet string.
        for (var i = 0; i < tweets.length; i++) {
            tweetString += '\n\t\t' + tweets[i].created_at;
            tweetString += '\n\t\t' + tweets[i].text + '\n\n';
        }
        // Write the string to the screen
        gui.writeText(tweetString);
        // Write to our log file.
        service.LogAction('Retrieve Tweets', tweetString);
    }).catch((err) => {
        gui.writeText("We have encountered an error grabbing your tweets");
        service.LogAction('Retrieve Tweets', err);
        return;
    });
}

// Searches the spotify API returning results of a track
function displaySpotifyResults(songTitle) {
    var songString = "\n\nHere is information on that song!\n\n";
    // Call the spotify api and on the promise
    spotify.search({ type: 'track', query: songTitle }).then((response) => {
        // Grab the first track from the response
        var song = response.tracks.items[0];
        // Build a string
        songString += `\n
            Artist: ${ song.artists[0].name }
            Track: ${ song.name }
            Album: ${ song.album.name }
            Popularity: ${ song.popularity }
            Track Number: ${ song.track_number }
        \n`;
        // Print the string
        gui.writeText(songString);
        // Log the action to the log file.
        service.LogAction('Retrieve Songs', songString);
    }).catch((error) => {
        if (error) {
            gui.writeText("\n\nThere was an error retreiving the song from Spotify.\n\n");
            service.LogAction('Retrieve Songs', error);
        }
    })
}

// Calls the omdb api and returns results of a movie
function displayMovieResults(movieTitle) {
    var movieString = "\n\nHere is information on that movie!\n\n";
    
    // Uses request to call the api
    request(keys.omdbApi.baseUrl + `&t=${ movieTitle}`, (error, response, body) => {
        // Parse the JSON
        body = JSON.parse(body);
        var rtRating = "";
        if(!error && response.statusCode == 200) {
            // Loop through all ratings and find the Rotten Tomatoes rating.
            for(var i = 0; i < body.Ratings.length; i++) {
                if(body.Ratings[i].Source === "Rotten Tomatoes") {
                    rtRating = body.Ratings[i].Value;
                }
            }
            // Builds the movie display string
            movieString += `
                Title: ${ body.Title }
                Rated: ${ body.Rated }
                Year: ${ body.Year }
                IMDB Rating: ${ body.imdbRating }
                Rotten Tomatoes: ${ rtRating }
                Filmed In: ${ body.Country }
                Plot: ${ body.Plot }
                Language: ${ body.Language }
            `;
            // Displays the string
            gui.writeText(movieString);
            // Logs the action
            service.LogAction("Retrieve Movie", movieString);
            // Breaks out of the function
            return;
        }
        gui.writeText("\n\nThere was an error retreiving the song from OMBD.\n\n");
        service.LogAction('Error Retreiving Movie', error);
    });
}

// Switch statement to see what the user wanted to do
function checkOptions(cmd) {
    if (searchTitle === "") buildSearchString(3, process.argv);
    switch (cmd) {
        case 'my-tweets':
            displayTweets();
            break;
        case 'movie-this':
            displayMovieResults(searchTitle);
            break;
        case 'spotify-this-song':            
            displaySpotifyResults(searchTitle);
        // If we make it here, display help
        default:
            displayHelp();
            break;
    }
}

// If the user didn't put in a command, display help and bail
if (process.argv.length < 3) {
    displayHelp();
    process.exit();
}

// Grabs our command.
var command = process.argv[2];

if (command == '--help') {
    displayHelp();
    process.exit();
} else if (command == 'do-what-it-says') {
    fs.readFile('./random.txt', 'utf8', (error, data) => {
        if(error) {
            gui.writeText('Error happened opening the auto-file', error);
            service.LogAction('Open Random.txt', error);
            return;
        }
        var temp = data.split(',');
        command = temp[0];
        searchTitle = temp[1];
        checkOptions(command);
    });
} else {
    checkOptions(command);
}


