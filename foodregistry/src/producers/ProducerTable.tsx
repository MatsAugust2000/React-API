import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Producer } from '../types/producer';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';

interface ProducerTableProps {
    producers: Producer[];
    products: Product[];
    apiUrl: string;
    onProducerDeleted: (producerId: number) => void;
  }

export const getScoreClass = (score: string): string => {
  return `nutri-score score-${score}`;
};
  
const ProducerTable: React.FC<ProducerTableProps> = ({ producers, products, apiUrl, onProducerDeleted }) => {
    const [showId, setShowId] = useState<boolean>(false);
    const [showProducts, setShowProducts] = useState<boolean>(false);
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
                onClick={() => setShowProducts(!showProducts)} 
                className="btn btn-primary me-2"
                size="sm"
              >
                <i className="bi bi-info"></i>
                {showProducts ? ' Hide Products' : ' Show Products'}
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
                    <th className="align-middle">Address</th>
                    <th className="align-middle">Actions</th>
                    {showProducts && <th className="align-middle text-center">Products</th>}
                    </tr>
                </thead>
                <tbody>
                    {producers.map(producer => (
                    <tr key={producer.producerId}>
                        {showId && (
                        <td className="align-middle">{producer.producerId}</td>
                        )}
                        <td className="align-middle fw-bold">
                      <Link 
                        to={`/producerdetails/${producer.producerId}`}
                        className='text-decoration-none'
                      >
                        {producer.name}
                      </Link>
                    </td>
                    <td className='align-middle'>{producer.address}</td>
                    <td className="align-middle text-center">
                      <Link 
                        to={`/producerupdate/${producer.producerId}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        <i className="bi bi-pencil-square"></i> Update
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onProducerDeleted(producer.producerId)}
                      >
                        <i className='bi bi-trash'></i> Delete
                      </Button>
                      </td>
                    {showProducts && (
                    <table className="table table-striped table-hover custom-table" >
                        <thead>
                            <tr className="table-header">
                                <th>Image</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>NutriScore</th>
                            </tr>
                        </thead>
                        <tbody>
                      {products
                        .filter(product => product.producerId === producer.producerId)
                        .map(product => (
                     <tr>
                     <td className='align-middle text center'>
                     <img 
                          src={`${apiUrl}${product.imageUrl}`} 
                          alt={product.name} 
                          className="img-fluid rounded" 
                          style={{ maxWidth: '120px', height: 'auto' }} 
                        />
                      </td>
                      <td className='align-middle'>
                      <Link 
                        key={product.productId}
                        to={`/productdetails/${product.productId}`}
                        className='text-decoration-none'
                      >
                        {product.name}<br></br>
                      </Link>
                      </td>
                        <td className="align-middle">
                            {product.category}
                        </td>
                        <td className="align-middle">
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


                        </tr>

                        ))}

                        </tbody>
                        </table>
                        )}
                
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

export default ProducerTable;
