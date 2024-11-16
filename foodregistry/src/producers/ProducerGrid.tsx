import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Producer } from '../types/producer';
import { Link } from 'react-router-dom';

interface ProducerGridProps {
    producers: Producer[];
    apiUrl: string;
    onProducerDeleted: (producerId: number) => void;
  }

const ProducerGrid: React.FC<ProducerGridProps> = ({ producers, apiUrl, onProducerDeleted }) => {
  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {producers.map(producer => (
          <Col key={producer.producerId}>
            <Card>
              <Card.Body>
                <Card.Title>{producer.name}</Card.Title>
                <Card.Text>
                  {producer.address}
                </Card.Text>
            
                <div className="d-flex justify-content-between">
                    <Button href={`/producerupdate/${producer.producerId}`} variant="primary"><i className="bi bi-pencil-square"></i></Button>
                    <Button onClick={(event) => onProducerDeleted(producer.producerId)} variant="danger"><i className='bi bi-trash'></i></Button>                    
                </div>                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProducerGrid;
  
  