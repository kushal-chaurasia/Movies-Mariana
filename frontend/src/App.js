import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { Button, Form, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch data from API to populate dropdown
    axios.get('http://localhost:8000/api/genre/')
      .then(response => {
        setOptions(response.data.genre.map((genre, index) => ({
          id: index,
          value: genre,
          label: genre
        })));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    axios.post('http://localhost:8000/api/get-movie/', {})
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleOptionSelect = (eventKey) => {
    const index = selectedOptions.indexOf(eventKey);
    if (index === -1) {
      setSelectedOptions([...selectedOptions, eventKey]); // Add option if not already selected
    } else {
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(index, 1); // Remove option if already selected
      setSelectedOptions(updatedOptions);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Fetch movies based on selected options and search term
    axios.post("http://localhost:8000/api/get-movie/", { genre: selectedOptions, query: searchTerm })
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  };

  return (
    <Container>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-4">
            <Dropdown onSelect={handleOptionSelect}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedOptions.length ? selectedOptions.join(', ') : 'Select Options'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {options.map((option, index) => (
                  <Dropdown.Item key={index} eventKey={option.value}>{option.label}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-md-4">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-4">
            <Button variant="secondary" onClick={handleSearch}>Search</Button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <h4>Selected Options:</h4>
            <ul>
              {selectedOptions.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Poster</th>
            <th>Genre(s)</th>
            <th>Rating</th>
            <th>Year Release</th>
            <th>Metacritic Rating</th>
            <th>Runtime</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <td>{movie.title}</td>
              <td>
                <img src={movie.poster} alt={movie.title} style={{ maxWidth: '100px' }} />
              </td>
              <td>{movie.genre ? movie.genre.join(', ') : 'N/A'}</td>
              <td>{movie.imdb_rating}/10</td>
              <td>{movie.year}</td>
              <td>{movie.Ratings.find(rating => rating.source === 'Metacritic') ? movie.Ratings.find(rating => rating.source === 'Metacritic').value : 'N/A'}</td>
              <td>{movie.runtime}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
