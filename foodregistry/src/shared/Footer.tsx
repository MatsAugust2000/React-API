import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col md={4} className="text-center text-md-start">
            <h5>Food Registry</h5>
            <p className="mb-0 text-muted">Track your products with ease</p>
          </Col>
          
          <Col md={4} className="text-center my-3 my-md-0">
            <div className="links">
              <Link to="/" className="mx-2">Home</Link>
              <Link to="/products" className="mx-2">Products</Link>
              <Link to="/about" className="mx-2">About</Link>
            </div>
          </Col>

          <Col md={4} className="text-center text-md-end">
            <p className="mb-0 text-muted">
              © {currentYear} Food Registry. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;