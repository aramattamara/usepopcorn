import {useState} from "react";
import {useMovies} from "./hooks/useMovies";
import {useLocalStorageState} from "./hooks/useLocalStorageState";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Main from "./components/Main";
import Box from "./components/Box";
import MoviesList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMovieList";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([])

  function handleSelectMovie(id){
    setSelectedId((selectedId) => (id === selectedId ? null : id))
  }

  function handleCloseMovie(){
    setSelectedId(null)
  }

  function handleAddWatched(movie){
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies}/>
      </NavBar>

      <Main>
        <Box>
          {/*{isLoading ? <Loader /> :  <MoviesList movies={movies}/>}*/}
          {isLoading && <Loader />}
          {!isLoading && !error && <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
              <MovieDetails
                  selectedId={selectedId}
                  onCloseMovie={handleCloseMovie}
                  onAddWatched={handleAddWatched}
                  watchedMovies={watched}
              />
              ) : (
                  <>
                    <WatchedSummary watched={watched}/>
                    <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/>
                  </>
          )}
        </Box>

      </Main>
    </>
  );
}
