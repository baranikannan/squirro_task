import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Bookstore from './Bookstore';
import './App.css';

// This is the main App component of our bookstore app.
function App() {
  // We keep track of bookstores and related data with state hooks.
  const [bookstores, setBookstores] = useState([]);
  const [countries, setCountries] = useState([]);
  const [included, setIncluded] = useState([]); 
  const [loading, setLoading] = useState(true); // Used to show loading messages.
  const [error, setError] = useState(null); // Used to show any errors to the user.

  // This function gets the flag image URL for each country.
  function getCountryFlagUrl(countryCode) {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }

  // When the component mounts, we fetch the bookstore data.
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get('http://localhost:3333/stores')
      .then(response => {
        // Once the data is fetched, we store it in our state hooks.
        const { data, included: includedData} = response.data;
        setBookstores(data); // Data for the bookstores.
        setIncluded(includedData); // Additional data (like books and authors).

        // We extract countries from the 'included' data for later use.
        const extractedCountries = includedData.filter(item => item.type === 'countries')
                                               .map(country => ({
                                                  ...country.attributes,
                                                  id: country.id,
                                                }));

        setCountries(extractedCountries);
        setLoading(false); // We're done loading.
      })
      .catch(error => {
        // If there's an error, we catch it and set our error state.
        console.error('Error fetching bookstores:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // This function pairs books with their stores.
  const getBooksForStore = (storeId) => {
    // Find the store by its ID.
    const store = bookstores.find(store => store.id === storeId);
    if (!store) {
      return [];
    }

    // Find books related to this store.
    const relatedBooksIds = store.relationships?.books?.data?.map(book => book.id) || [];
    const booksWithAuthors = relatedBooksIds.map(bookId => {
      const book = included.find(item => item.type === 'books' && item.id === bookId);
      const author = included.find(item => item.type === 'authors' && item.id === book.relationships.author.data.id);
      
      // We make sure to return both the book name and the author's name.
      return book && author ? {
        id: book.id,
        name: book.attributes.name,
        authorName: author.attributes.fullName
      } : null;
    }).filter(book => book !== null);

    return booksWithAuthors;
  };

  // Here's where we render our app.
  return (
    <>
      <h1>Bookstores</h1>
      <div className="bookstores-container">
        {bookstores.map(store => {
          // Get the country code for each bookstore to fetch the flag.
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
