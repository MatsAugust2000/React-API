import React from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginPartial from './LoginPartial';
import '../css/NavMenu.css';

const NavMenu: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg" className='navbar-custom mb3'>
      <Container>
        <Navbar.Brand as={Link} to="/" className='brand'>Food Registry</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/producers">Producers</Nav.Link>

          </Nav>
          <LoginPartial/>
        </Navbar.Collapse>
      </Container>
      
    </Navbar>
  );
};

export default NavMenu;