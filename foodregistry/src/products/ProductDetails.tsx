import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../types/product';
import '../css/ProductDetails.css';
import '../css/NutriScore.css';
import API_URL from '../apiConfig';

interface ProductDetailsProps {
  product: Product;
  apiUrl: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, apiUrl }) => {
  const navigate = useNavigate();

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} NOK`;
  };

  return (
    <div className='product-details'>
      <div className="container">
        <h3 className="my-5">
          {product.name}
        </h3>
        
        <div className="row gx-5">
          <img 
            alt={product.name} 
            src={`${apiUrl}${product.imageUrl}`} 
            className="image-details col-5"
          />
          <div className="col-7">
            <h5>{product.description}</h5>
            <h3>{formatPrice(product.price)}</h3>
            <h6>{product.nutrition}</h6>
            <h4 className="text-nowrap">
              <span className="nutrition-score" data-score={product.nutriScore}>
                <a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC9421047/' 
                       target="_blank" 
                       title="Nutri-Score Article" 
                       style={{ textDecoration: 'none', color: 'white' }}>
                      {product.nutriScore || 'N/A'}
                    
                </a>
              </span>
            </h4>
            <hr/>
            <button 
              className="btn btn-secondary mb-2" 
              onClick={() => navigate('/products')}
            >
              <i className='bi bi-list-ul'></i> Back to Table View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Container component to fetch and manage product data
const ProductDetailsContainer: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/productapi/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return <ProductDetails product={product} apiUrl={API_URL} />;
};

export default ProductDetailsContainer;