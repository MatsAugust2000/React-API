import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { Product } from '../types/product';
import API_URL from '../apiConfig';
import * as ProductService from './ProductService';
import ErrorPopup from '../shared/ErrorPopup';

const ProductUpdatePage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>(); // Get productId from the URL
  const navigate = useNavigate(); // Create a navigate function
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.fetchProductById(productId);
        setProduct(data);
      } catch (error) {
        setError('Failed to fetch product');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleProductUpdated = async (product: Product) => {

    try {
      const data = await ProductService.updateProduct(product.productId, product);
      console.log('Product updated successfully:', data);
      navigate('/products'); // Navigate back after successful creation
    } catch (error) {
      setShowUnauthorizedError(true);
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found</p>;
  
  return (
    <div>
      <h2>Update Product</h2>
      <ProductForm onProductChanged={handleProductUpdated} productId={product.productId} isUpdate={true} initialData={product} />
    
      {showUnauthorizedError && (
        <ErrorPopup onClose={() => setShowUnauthorizedError(false)} />
      )}
    </div>
  );
};

export default ProductUpdatePage;