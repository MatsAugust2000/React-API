import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Product } from '../types/product';
import { Link } from 'react-router-dom';
//import getScoreClass from './ProductForm';
import '../css/NutriScore.css';
import '../css/ProductTable.css';

interface ProductTableProps {
  products: Product[];
  apiUrl: string;
  onProductDeleted: (productId: number) => void;
}


// Helper function to get the CSS class for a score
export const getScoreClass = (score: string): string => {
  return `nutri-score score-${score}`;
};

const ProductTable: React.FC<ProductTableProps> = ({ products, apiUrl, onProductDeleted }) => {
  const [showImages, setShowImages] = useState<boolean>(true);
  const [showDescriptions, setShowDescriptions] = useState<boolean>(true);
  const [showNutrition, setShowNutrition] = useState<boolean>(true);
  const [showId, setShowId] = useState<boolean>(false);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false); 

  const handleShareClick = (productId: number) => {
    setShowSharePopup(true);
  }
  

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
        <Button 
            onClick={() => setShowId(!showId)} 
            className="btn btn-primary me-2"
            size="sm"
          >
            <i className="bi bi-list-ol"></i>
            {showId ? ' Hide' : ' Show'}
          </Button>
          <Button 
            onClick={() => setShowDescriptions(!showDescriptions)} 
            className="btn btn-primary me-2"
            size="sm"
          >
            <i className="bi bi-card-text"></i>
            {showDescriptions ? ' Hide' : ' Show'}
          </Button>
          <Button 
            onClick={() => setShowImages(!showImages)} 
            className="btn btn-primary me-2"
            size="sm"
          >
            <i className="bi bi-images"></i> 
            {showImages ? ' Hide' : ' Show'}
          </Button>
          <Button 
            onClick={() => setShowNutrition(!showNutrition)} 
            className="btn btn-primary"
            size="sm"
          >
            <i className="bi bi-clipboard-data"></i> 
            {showNutrition ? ' Hide' : ' Show'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="table-responsive">
            <Table 
              striped 
              bordered 
              hover 
              className="shadow-sm" 
              style={{ backgroundColor: 'white' }}
            >
              <thead className="bg-light">
                <tr>
                  {showId && <th className="align-middle">ID</th>}
                  <th className="align-middle">Name</th>
                  {showImages && <th className="align-middle">Image</th>}
                  {showDescriptions && <th className="align-middle">Description</th>}
                  <th className="align-middle">Price</th>
                  <th className="align-middle">Category</th>
                  {showNutrition && <th className="align-middle">Nutrition</th>}
                  <th className="align-middle">NutriScore</th>
                  <th className="align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.productId}>
                    {showId && (
                      <td className="align-middle">{product.productId}</td>
                    )}
                    <td className="align-middle fw-bold">
                      <Link 
                        to={`/productdetails/${product.productId}`}
                        className='text-decoration-none'
                      >
                        {product.name}
                      </Link>
                    </td>

                    {showImages && (
                      <td className="align-middle text-center">
                        <Link 
                          to={`/productdetails/${product.productId}`}
                          className='text-decoration-none'
                        >
                        <img 
                          src={`${apiUrl}${product.imageUrl}`} 
                          alt={product.name} 
                          className="img-fluid rounded" 
                          style={{ maxWidth: '120px', height: 'auto' }} 
                        />
                        </Link>
                      </td>
                    )}
                    {showDescriptions && (
                      <td className="align-middle small description">{product.description}</td>
                    )}
                    <td className="align-middle">{product.price} NOK</td>
                    <td className="align-middle">{product.category}</td>
                    {showNutrition && (
                      <td className="align-middle small">{product.nutrition}</td>
                    )}
                    <td className="align-middle text-center">
                      <span className={getScoreClass(product.nutriScore || 'N/A')}>
                        <a 
                          href='https://pmc.ncbi.nlm.nih.gov/articles/PMC9421047/' 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Nutri-Score Article" 
                          style={{ textDecoration: 'none', color: 'white' }}
                        >
                          {product.nutriScore || 'N/A'}
                        </a>
                      </span>
                    </td>
                    
                    <td className="align-middle text-center">
                      <Link 
                        to={`/productupdate/${product.productId}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        <i className="bi bi-pencil-square"></i> Update
                      </Link>
                      <Button 
                        onClick={() => handleShareClick(product.productId)}
                        className="btn btn-primary btn-sm me-2"
                      >
                        <i className="bi bi-share"></i> Share
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onProductDeleted(product.productId)}
                      >
                        <i className='bi bi-trash'></i> Delete
                      </Button>
                      </td>
                  </tr>
                ))}
              </tbody>              
            </Table>
          </div>
        </Col>
      </Row>
      {showSharePopup && (
                <div className="share-popup">
                <h5>Share this product</h5>
                <Button 
                  variant="link" 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                ><i className="bi bi-facebook"></i> 
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                ><i className="bi bi-twitter" ></i> 
                </Button>
                <br></br>
                <br></br>
                <Button className='btn btn-secondary btn-sm' onClick={() => setShowSharePopup(false)}>Close</Button>
              </div>
            )}

    </Container>
  );
};

export default ProductTable;