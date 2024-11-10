import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import ProductTable from './ProductTable';
import ProductGrid from './ProductGrid';
import { Product } from '../types/product';
import API_URL from '../apiConfig';
import * as ProductService from './ProductService';
import ErrorPopup from '../shared/ErrorPopup';

// const API_URL = 'http://localhost:5199'

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // State for storing products with Product type
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for storing error messages
  const [showTable, setShowTable] = useState<boolean>(true); // State to toggle between table and grid view
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);

  const toggleTableOrGrid = () => setShowTable(prevShowTable => !prevShowTable);

  const fetchProducts = async () => {
    setLoading(true); // Set loading to true when starting the fetch
    setError(null);   // Clear any previous errors

    try {
      const data = await ProductService.fetchProducts();
      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  // Set the view mode to local storage when the product is fetched
  useEffect(() => {
    const savedViewMode = localStorage.getItem('productViewMode');
    console.log('[fetch products] Saved view mode:', savedViewMode); // Debugging line
    if (savedViewMode) {
      if (savedViewMode === 'grid')
        setShowTable(false)
      console.log('show table', showTable);
    }
    fetchProducts();
  }, []);

  // Save the view mode to local storage whenever it changes
  useEffect(() => {
    console.log('[save view state] Saving view mode:', showTable ? 'table' : 'grid');
    localStorage.setItem('productViewMode', showTable ? 'table' : 'grid');
  }, [showTable]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductDeleted = async (productId: number) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the product ${productId}?`);
    if (confirmDelete) {
      try {
        await ProductService.deleteProduct(productId);
        setProducts(prevProducts => prevProducts.filter(product => product.productId !== productId));
        console.log('Product deleted:', productId);
      } catch (error) {
        setShowUnauthorizedError(true);
        console.error('Error deleting product:', error);
        setError('Failed to delete product.');
      }
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <Button onClick={fetchProducts} className="btn btn-primary mb-3 me-2" disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Products'}
      </Button>
      <Button onClick={toggleTableOrGrid} className="btn btn-primary mb-3 me-2">
        {showTable ? `Display Grid` : 'Display Table'}
      </Button>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or description"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {showTable
        ? <ProductTable products={filteredProducts} apiUrl={API_URL} onProductDeleted={handleProductDeleted} />
        : <ProductGrid products={filteredProducts} apiUrl={API_URL} onProductDeleted={handleProductDeleted} />}
      <Button href='/productcreate' className="btn btn-secondary mt-3">
          Add New Product
      </Button>
      {showUnauthorizedError && (
        <ErrorPopup onClose={() => setShowUnauthorizedError(false)} />
      )}

    </div>
  );
};

export default ProductListPage;