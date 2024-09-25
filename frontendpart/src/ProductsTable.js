import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Statistics from './Statistics'; // Import the Statistics component

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/products?page=${page}&limit=${perPage}&search=${searchQuery}`);

        console.log('API Response:', response);

        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setTotalPages(Math.ceil(response.data.total / perPage));
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, perPage, searchQuery]);

  const handleSearch = () => {
    if (searchTerm !== searchQuery) {
      setSearchQuery(searchTerm); // Trigger new search only if the search term has changed
    }
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && page < totalPages) {
      setPage(page + 1);
    } else if (direction === 'previous' && page > 1) {
      setPage(page - 1);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm(''); // Clear the search term in the input box
    setSearchQuery(''); // Reset the search query to get all products
  };

  if (loading) return <div className="text-center my-5">Loading products...</div>;

  if (error) return <div className="alert alert-danger text-center my-5">{error}</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between mb-3">
        <h2>Transaction Dashboard</h2>
        <div className="input-group" style={{ width: '350px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term as the user types
            style={{ minWidth: '200px' }} // Adjust input width
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={handleClearSearch}>Clear</button> {/* Add clear button */}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.sold ? 'Yes' : 'No'}</td>
                  <td>
                    <img src={product.image} alt={product.title} className="img-fluid" style={{ width: '50px', height: '50px' }} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange('previous')}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange('next')}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Move the Statistics component below the table */}
      <Statistics /> 
    </div>
  );
};

export default ProductTable;
