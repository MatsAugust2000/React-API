import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { Product } from '../types/product';
import API_URL from '../apiConfig';
import * as ProductService from './ProductService';


// const API_URL = 'http://localhost:5199'

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate(); // Create a navigate function

  const handleProductCreated = async (product: Product) => {
    try {
      const data = await ProductService.createProduct(product);
      console.log('Product created successfully:', data);
      navigate('/products'); // Navigate back after successful creation
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  return (
    <div>
      <h2>Create New Product</h2>
      <ProductForm onProductChanged={handleProductCreated}/>
    </div>
  );
};

export default ProductCreatePage;