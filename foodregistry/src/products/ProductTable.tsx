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
  //const toggleImages = () => setShowImages(prevShowImages => !prevShowImages);
  //const toggleDescriptions = () => setShowDescriptions(prevShowDescriptions => !prevShowDescriptions);


  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <Button 
            onClick={() => setShowDescriptions(!showDescriptions)} 
            className="btn btn-outline-primary me-2"
            size="sm"
          >
            {showDescriptions ? 'Hide Descriptions' : 'Show Descriptions'}
          </Button>
          <Button 
            onClick={() => setShowImages(!showImages)} 
            className="btn btn-outline-primary"
            size="sm"
          >
            {showImages ? 'Hide Images' : 'Show Images'}
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
                  <th className="align-middle">ID</th>
                  <th className="align-middle">Name</th>
                  <th className="align-middle">Category</th>
                  <th className="align-middle">Nutrition</th>
                  <th className="align-middle">NutriScore</th>
                  <th className="align-middle">Price</th>
                  {showDescriptions && <th className="align-middle">Description</th>}
                  {showImages && <th className="align-middle">Image</th>}
                  <th className="align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.productId}>
                    <td className="align-middle">{product.productId}</td>
                    <td className="align-middle fw-bold">{product.name}</td>
                    <td className="align-middle">{product.category}</td>
                    <td className="align-middle small">{product.nutrition}</td>
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
                    <td className="align-middle">{product.price} NOK</td>
                    {showDescriptions && (
                      <td className="align-middle small">{product.description}</td>
                    )}
                    {showImages && (
                      <td className="align-middle text-center">
                        <img 
                          src={`${apiUrl}${product.imageUrl}`} 
                          alt={product.name} 
                          className="img-fluid rounded" 
                          style={{ maxWidth: '120px', height: 'auto' }} 
                        />
                      </td>
                    )}
                    <td className="align-middle text-center">
                      <Link 
                        to={`/productupdate/${product.productId}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        Update
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onProductDeleted(product.productId)}
                      >
                        Delete
                      </Button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductTable;