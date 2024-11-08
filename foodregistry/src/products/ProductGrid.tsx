import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
  apiUrl: string;
  onProductDeleted: (productId: number) => void;
}

// Helper function to get the CSS class for a score
export const getScoreClass = (score: string): string => {
  return `nutri-score score-${score}`;
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, apiUrl, onProductDeleted }) => {

  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map(product => (
          <Col key={product.productId}>
            <Card>
              <Card.Img variant="top" src={`${apiUrl}${product.imageUrl}`} alt={product.name} />
              <Card.Body>
                <Card.Title>{product.productId} {product.name}</Card.Title>
                <Card.Text>
                  {product.description}
                </Card.Text>
                <Card.Text>
                  <span className={getScoreClass(product.nutriScore)}>
                    <a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC9421047/' 
                       target="_blank" 
                       title="Nutri-Score Article" 
                       style={{ textDecoration: 'none', color: 'white' }}>
                      {product.nutriScore || 'N/A'}
                    </a>
                </span>
                </Card.Text>
                <Card.Text>
                  Price: {product.price} NOK
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Button href={`/productupdate/${product.productId}`} variant="primary">Update</Button>
                    <Button onClick={(event) => onProductDeleted(product.productId)} variant="danger">Delete</Button>                    
                </div>                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductGrid;