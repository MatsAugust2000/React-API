import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { Product } from '../types/product';
import API_URL from '../apiConfig';
import * as ProductService from './ProductService';
import ErrorPopup from '../shared/ErrorPopup';

// const API_URL = 'http://localhost:5199'

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate(); // Create a navigate function
  const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);

  const handleProductCreated = async (product: Product) => {
    try {
      const data = await ProductService.createProduct(product);
      console.log('Product created successfully:', data);
      navigate('/products'); // Navigate back after successful creation
    } catch (error) {
      setShowUnauthorizedError(true);
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  return (
    <div>
      <h2>Create New Product</h2>
      <ProductForm onProductChanged={handleProductCreated}/>
      
      {showUnauthorizedError && (
        <ErrorPopup onClose={() => setShowUnauthorizedError(false)} />
      )}
    </div>
  );
};

export default ProductCreatePage;