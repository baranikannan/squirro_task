import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Bookstore from './Bookstore';
import './App.css';
import waitImage from './wait.jpeg';

// Helper function to get the flag image URL for a given country code.
function getCountryFlagUrl(countryCode) {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
}

// The main component of our application.
function App() {
  // State for storing bookstores, countries, and related info.
  const [bookstores, setBookstores] = useState([]);
  const [countries, setCountries] = useState([]);
  const [included, setIncluded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State to track retry attempts
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; // Maximum number of retries

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Rate limiting state
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const requestQueue = [];
  const maxRequests = 100; // Example: API allows 100 requests per hour
  let requestCount = 0;
  const rateLimitResetTime = 3600000; // 1 hour in milliseconds
  
  

  // Effect hook to load bookstores from the backend on component mount.
  useEffect(() => {
    let isMounted = true; // Flag to prevent updates if the component unmounts

    // Function to fetch data from the backend.
    const fetchData = () => {
      if (rateLimitReached) {
        // If rate limit is reached, push requests to a queue
        requestQueue.push(() => fetchData());
        return;
      }

      if (requestCount >= maxRequests) {
        setRateLimitReached(true);
        setTimeout(() => {
          requestCount = 0; // Reset request count after 1 hour
          setRateLimitReached(false);
          // Process queued requests
          while (requestQueue.length > 0) {
            const nextRequest = requestQueue.shift();
            nextRequest();
          }
        }, rateLimitResetTime);
        return;
      }

      // Increment request count
      requestCount++;

      axios.get(`http://localhost:3333/stores?page=${currentPage}&size=10`)
        .then(response => {
          if (!isMounted) return; // Prevent update if the component is unmounted

          const { data, included: includedData, meta } = response.data;
          
          // Handle the case when no bookstores are returned
          if (data.length === 0) {
            setError('No bookstores are currently available. Please check back later.');
            setLoading(false);
            return;
          }

          // Update state with the data received from the backend.
          setBookstores(data);
          setIncluded(includedData);
          setTotalPages(meta.totalPages); // Assuming the API provides total pages info
          setLoading(false);

          
          // Extract countries data from the included resources.
          const extractedCountries = includedData
            .filter(item => item.type === 'countries')
            .map(country => ({
              ...country.attributes,
              id: country.id,
            }));

          // Update countries state.
          setCountries(extractedCountries);
          setLoading(false);
        })
        .catch(err => {
          if (!isMounted) return; // Prevent update if the component is unmounted

          // Retry logic for handling errors
          if (retryCount < maxRetries) {
            setRetryCount(retryCount + 1);
            setTimeout(fetchData, 2000);
          } else {
            setError('An unexpected error occurred. Please try again later.');
            setLoading(false);
          }
        });
    };

    fetchData();

    // Cleanup function to set isMounted to false when the component unmounts.
    return () => {
      isMounted = false;
    };
  }, [currentPage, rateLimitReached, retryCount]); // Include retryCount in the dependency array.


  // Function to change page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  // Function to find books for a given bookstore.
  const getBooksForStore = (storeId) => {
    // Look for the store by its ID.
    const store = bookstores.find(store => store.id === storeId);
    if (!store) return [];

    // Get the IDs of related books.
    const relatedBooksIds = store.relationships?.books?.data?.map(book => book.id) || [];
    
    // Map book IDs to book and author data, filtering out any null values.
    const booksWithAuthors = relatedBooksIds.map(bookId => {
      const book = included.find(item => item.type === 'books' && item.id === bookId);
      const author = included.find(item => item.type === 'authors' && item.id === book.relationships.author.data.id);

      // Check for missing data and skip if necessary.
      if (!book || !author || !book.attributes.name) {
        return null;
      }      
      
      // Return the book with its author's full name.
      return {
        id: book.id,
        name: book.attributes.name,
        authorName: author.attributes.fullName
      };
    }).filter(book => book !== null); // Filter out any null values.

    return booksWithAuthors;
  };

  // Render error page if an error occurred.
  if (error) {
    return (
      <div className="error-page" style={{ backgroundImage: `url(${waitImage})` }}>
        <h2>Please Wait!</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Render loading indicator while data is being fetched.
  if (loading) {
    return <div className="loading">Loading bookstores...</div>;
  }

  // Render the main content once data is loaded.
  return (
    <>
      <h1>Bookstores</h1>
      <div className="bookstores-container">
        {bookstores.map(store => {
          // For each store, find the country flag image if available.
          const countryCode = countries.find(country => country.id === store.relationships?.countries?.data?.id)?.code;
          return (
            <Bookstore
              key={store.id}
              name={store.attributes.name}
              image={store.attributes.storeImage}
              rating={store.attributes.rating}
              establishmentDate={new Date(store.attributes.establishmentDate).toLocaleDateString()}
              website={store.attributes.website}
              books={getBooksForStore(store.id)}
              countryFlagUrl={countryCode ? getCountryFlagUrl(countryCode) : ''}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
