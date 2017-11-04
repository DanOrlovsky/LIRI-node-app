var twitterKeys = {
    consumer_key: 'LNqUheH55oaG7k47OXkdmKL2f',
    consumer_secret: 'ZWJmWghX0uCvobaLei24u8C6ZwpjFrG6jyIdzyiavHuf5TGKjF',
    access_token_key: '883328505194450945-PXFy501gRQHcv4y4EmxKKHOHhU28Eog',    
    access_token_secret: 'gRvEJF54SRMvaaLYUlbLarW4ovhBD6VjQcnut6HL3skoa',
};

var twitterParams = { screen_name: 'DanGeeOh', count: 20 };


var spotifyKeys = {
    id: '6122f78e6bfb4944bacd2008c27e7bd0',
    secret: 'de7130bf7b5947668d74ece034305466'
};


var omdbApi = {
    baseUrl: 'http://www.omdbapi.com/?apikey=40e9cece&plot=short',
    randomTitles: [
        'Mr Nobody',
        'The Matrix',
        'Airplane',
        'Transformers',
        'The Jerk',
        'Blow',
        'Fear and Loathing in Las Vegas',
    ],
};

module.exports = {
    twitterKeys,
    twitterParams,
    omdbApi,
    spotifyKeys,
}