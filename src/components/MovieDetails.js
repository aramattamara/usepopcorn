import {useEffect, useRef, useState} from "react";
import {useKey} from "../hooks/useKey";
import Loader from "./Loader";
import StarRating from "../StarRating";

const KEY = "5ff117f4"

export default function MovieDetails({selectedId, onCloseMovie, onAddWatched, watchedMovies}){
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('')

  const countRef = useRef(0)

  useEffect(function (){
        if (userRating) countRef.current++;
      },
      [userRating]
  );

  const isWatched = watchedMovies.some((movie) => movie.imdbID === selectedId);
  console.log(isWatched);
  const selectedMovieRating = watchedMovies.find(movie=>movie.imdbID === selectedId)?.userRating;

  // const selectedMovieRating = watchedMovies.find((movie) => movie.imdbID === selectedId)?.userRating;
  // const isWatched = !!selectedMovieRating;
  // console.log(isWatched)

  const {
    Title: title,
    Year:year,
    Poster:poster,
    Runtime:runtime,
    imdbRating,
    Plot:plot,
    Released: released,
    Actors:actors,
    Director:director,
    Genre: genre,
  } = movie;

  function handleAdd(){
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie)

  useEffect(function(){
    async function getMovieDetails (){
      setIsLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails();
  },[selectedId]);

  useEffect(
      function () {
        if (!title) return;
        document.title = `Movie | ${title}`

        return function(){
          document.title = "usePopcorn";
        }
      }, [title])

  return (
      <div className='details'>
        {isLoading ? <Loader /> : (
            <>
              <header>
                <button className="btn-back" onClick={onCloseMovie}>
                  &larr;
                </button>
                <img src={poster} alt={`Poster of ${movie} movie`}/>
                <div className="details-overview">
                  <h2>{title}</h2>
                  <p>
                    {released} &bull; {runtime}
                  </p>
                  <p>{genre}</p>
                  <p><span>⭐️</span>{imdbRating} IMDb rating</p>
                </div>
              </header>
              <section>
                <div className="rating">
                  {!isWatched ? (
                      <>
                        <StarRating
                            defaultRating={selectedMovieRating}
                            maxRating={10}
                            size={24}
                            onSetRatingHandler={setUserRating}
                        />

                        {userRating > 0 && (
                            <button className="btn-add" onClick={handleAdd}>
                              + add
                            </button>
                        )}
                      </>
                  ) : (
                      <p>You rated this movie with {selectedMovieRating} <span>🌟</span></p>
                  )}
                </div>
                <p><em>{plot}</em></p>
                <p>Starring {actors}</p>
                <p>Directed by {director}</p>
              </section>
            </>
        )}
      </div>
  )
}