import './Bookstore.css';
import React from 'react';

// This component displays the details for a single bookstore.
// It expects props for the bookstore's name, image, rating, establishment date, website URL, books, and country flag URL.
function Bookstore({ name, image, rating, establishmentDate, website, books, countryFlagUrl }) {
  
    // Convert the numerical rating to a string of star characters.
    // For example, a rating of 3 will be converted to '★★★☆☆'.
    const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  
    // Format the establishment date as a string in DD.MM.YYYY format.
    const formattedDate = new Date(establishmentDate).toLocaleDateString('en-GB');
  
    // Sort the array of books by the number of copies sold and take the top two to display.
    const topBooks = books.sort((a, b) => b.copiesSold - a.copiesSold).slice(0, 2);
  
    // The bookstore component consists of three parts: header, body, and footer.
    return (
      <div className="bookstore">
        {/* Header: contains the bookstore image, name, and rating. */}
        <div className="bookstore-header">
          <img src={image} alt={`${name} store`} className="bookstore-image" />
          <h2 className="bookstore-name">{name}</h2>
          <div className="bookstore-rating">{ratingStars}</div>
        </div>

        {/* Body: lists the best-selling books. */}
        <div className="bookstore-body">
          <h3>Best-selling books</h3>
          <ul className="bookstore-books-list">
            {topBooks.length > 0 ? (
              topBooks.map((book) => (
                <li key={book.id}>
                  <span className="book-name">{book.name}</span>
                  <span className="separator"> - </span>
                  <span className="author-name">{book.authorName}</span>
                </li>
              ))
            ) : (
              <p>No data available</p> // Displayed when there are no top-selling books.
            )}
          </ul>
        </div>

        {/* Footer: shows the establishment date, a link to the bookstore's website, and the country flag. */}
        <div className="bookstore-footer">
          <span className="bookstore-established">{formattedDate}</span>
          <a href={website} className="bookstore-website">Visit Website</a>
          {countryFlagUrl && (
            <img src={countryFlagUrl} alt="Country flag" className="bookstore-flag" />
          )}
        </div>
      </div>
    );
}

export default Bookstore;
