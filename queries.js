// Part 1: Read 
// a)

db.movies.find( {
  cast: { $all: ["Matthew McConaughey", "Kate Hudson"]}
}, 
{_id: 0, title:1, year:1, cast:1}
).sort( {year: -1} ).pretty()

// b)

db.movies.find(
 { "imdb.rating": { $gt: 9}, "tomatoes.viewer.rating": { $gt: 4}}, 
 {_id: 0, title: 1}  
).sort( {"imdb.rating": -1} ).limit(3)

// c)

db.movies.find(
  {"genres": "Comedy", "rated": {$in: [ "G", "PG"] },  "imdb.rating": { $gte: 8 }}, 
  {_id: 0, title: 1, genres: 1, "imdb.rating": 1}  
).limit(5).sort( {"imdb.rating": -1} )

// d) 

db.movies.find( 
    {comments: { 
        $elemMatch: { name: "Cersei Lannister", date: { $gte: new ISODate("2015-01-01T00:00:25Z")}}}
    }
).count()

// Query to find movies with 20 or more Rotten Tomato critic reviews, where the Rotten Tomato critic rating is 8 or higer, sorted by most recent year, 
// and limited to 10 most recent movies (year)   

db.movies.find( 
    {"tomatoes.critic.rating": { $gte: 8}, "tomatoes.critic.numReviews": { $gte: 20}
    }, 
    {_id: 0, title: 1, year: 1, "tomatoes.critic": 1}
).sort({"year": -1}).limit(10)

//Query to find movies directed by Quentin Tarantino with an IMBD rating, showing title, year & IMBD rating, sorted by IMDB rating

db.movies.find(
    {directors: "Quentin Tarantino", "imdb.rating": { $gte: 0} },
    {_id: 0, title: 1, year: 1, "imdb.rating": 1}
).sort({"imdb.rating": -1})

// Query to find movies (solely or partly) written by, directed by and starring Orson Welles, in order of year starting with oldest, 
//showing title, year, writers, directors and cast

db.movies.find(
    {writers: "Orson Welles", directors: "Orson Welles", cast: "Orson Welles" }, 
    {_id: 0, title: 1, year: 1, writers: 1, directors: 1, cast:1}
).sort({year: 1}).pretty()

// Query to find movies with Ireland as a country, made in or before 1990, showing title, year, cast and directors, sorted by year
db.movies.find(
    {countries: "Ireland", year: {$lte: 1990}}, 
    {_id: 0, title: 1, year: 1, cast: 1, directors: 1}
).sort( {year: 1})


// Query to find movies starring Tom Hanks in which the genres contain either Romance or Comedy, showing the title, year & cast, sorted by year (most recent)
// and limited to the latest 10 
db.movies.find(
    {cast: "Tom Hanks", genres: {$in: ["Romance", "Comedy"] }},
    {_id: 0, title: 1, year: 1, cast: 1}
).sort( {year: -1}).limit(10)

// Query to find movies with Horror & Thriller genre starring Jamie Lee Curtis, showing the title, cast, Rotten Tomato Viewer Rating and sorted by Rotten Tomato Viewer Rating
db.movies.find(
    {genres: { $all: ["Horror", "Thriller"]}, cast: "Jamie Lee Curtis"},
    {_id: 0, title: 1, genres: 1, cast: 1, "tomatoes.viewer.rating": 1} 
).sort( {"tomatoes.viewer.rating": -1})


// Part 2 Create (insert)

db.movies.insertMany( [
    {_id: 1, title: "The Irishman", year: 2019, runtime: 209, cast: ["Robert De Niro", "Al Pacino", "Joe Pesci"], 
    plot: "An old man recalls his time painting houses for his friend, Jimmy Hoffa, through the 1950-70s.", 
    directors: ["Martin Scorsese"], imdb: {rating: 7.9, votes: 321043}, genres: ["Biography", "Crime", "Drama"]}, 

    {_id: 2, title: "Marriage Story", year: 2019, runtime: 137, cast: ["Adam Driver", "Scarlett Johansson", "Julia Greer"], 
    plot: "MARRIAGE STORY is Academy Award nominated filmmaker Noah Baumbach's incisive and compassionate look at a marriage breaking up and a family staying together.",
    directors: ["Noah Baumbach"], imdb: {rating: 7.9, votes: 243240}, genres: ["Comedy", "Drama", "Romance"]}, 

    {_id: 3, title: "Joker", year: 2019, runtime: 122, cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"], 
    plot: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
    directors: ["Todd Phillips"], imdb: {rating: 8.5, votes: 925880}, genres: ["Crime", "Drama", "Thriller"]}, 

    {_id: 4, title: "The Lighthouse", year: 2019, runtime: 109, cast: ["Robert Pattinson", "Willem Dafoe", "Valeriia Karaman"], 
    plot: "Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s.", 
    directors: ["Robert Eggers"], imdb: {rating: 7.5, votes: 139652}, genres: ["Drama", "Fantasy", "Horror", "Mystery"]}, 

    {_id: 5, title: "Baby Driver", year: 2017, runtime: 113, cast: ["Ansel Elgort", "Jon Bernthal", "Jon Hamm"], 
    plot: "After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail.", 
    directors: ["Edgar Wright"], imdb: {rating: 7.6, votes: 436093}, genres: ["Action", "Crime", "Drama", "Music", "Thriller"]}
    
])

// Part 3 Update 
// a) 
// Add an actor to the cast of The Irishman 
db.movies.updateOne(
    {_id: 1},
   { $push: {
     cast: "Harvey Keitel"
   } }
)

// b) 
// Update the IMDB doc in The Irishman 
db.movies.updateOne(
    {_id: 1},
    { $set:{
        "imdb.rating": 8.1, 
        }, 
      $inc:{
        "imdb.votes": 1
      }   
    }

)

// c) 
// Add tomatoes subdoc to The Irishman 
db.movies.updateOne(
    {_id: 1},
    { $set:{
        tomatoes:
                 {

                viewer : {
                        rating : 4.35,
                        numReviews : 1057,
                        meter : 86
                        },
                dvd : ISODate("2019-11-01T00:00:00Z"),
                rotten : 20,
                lastUpdated : ISODate("2020-07-24T19:01:32Z"),
                critic : {
                        rating : 8.8,
                        numReviews : 443,
                        meter : 95
                        },
                production : "New Video",
                fresh : 6
    
                }
            }

        }            
)

// Remove genre "Thriller" from Baby Driver 

db.movies.updateOne(
    {_id: 5},
    { $pull: {
        genres: "Thriller"
    }}
)

// Part 4: Delete movie Baby Driver 

db.movies.deleteOne(
    {_id: 5}
)

///////////////////////////////////////
        






