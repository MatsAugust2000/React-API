import React from 'react';
import { Carousel, Image, Container, Row, Col, Button } from 'react-bootstrap';
import API_URL from '../apiConfig';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

//const API_URL = 'http://localhost:5199'

const HomePage: React.FC = () => {
  return (
      <div className="text-center">
        <div className='text-center mt-5'>
          <h1 className="display-4">Welcome to Food Registry&#8482;</h1>
        </div>
        <div className='carousel-wrapper'>
        <Carousel id="carouselHome" className='full-width-carousel'>
          <Carousel.Item>
            <div className='carousel-image-container'>
            <Image 
              src={`${API_URL}/images/carousel1.jpg`}
              className="d-block w-100" 
              alt="First Slide" 
            />
            
            <Carousel.Caption className='caption-bg'>
              <h5>Baked Chicken Leg</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque nisi sapiente 
                quas minima, deleniti blanditiis minus dolorum expedita nam excepturi 
                quasi ipsa nihil eius autem? Fugit laborum soluta blanditiis sapiente.
              </p>
            </Carousel.Caption>
            </div>
          </Carousel.Item>
          
          <Carousel.Item>
          <div className='carousel-image-container'>
            <Image 
              src={`${API_URL}/images/carousel2.jpg`} 
              className="d-block w-100" 
              alt="Second Slide" 
            />
            <Carousel.Caption className="caption-bg">
              <h5>Barbeque</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque nisi sapiente 
                quas minima, deleniti blanditiis minus dolorum expedita nam excepturi 
                quasi ipsa nihil eius autem? Fugit laborum soluta blanditiis sapiente.
              </p>
            </Carousel.Caption>
            </div>
          </Carousel.Item>

          <Carousel.Item>
          <div className='carousel-image-container'>

            <Image 
              src={`${API_URL}/images/carousel3.jpg`}   
              className="d-block w-100" 
              alt="Third Slide" 
            />
            <Carousel.Caption className="caption-bg">
              <h5>Grilled Veggies</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque nisi sapiente 
                quas minima, deleniti blanditiis minus dolorum expedita nam excepturi 
                quasi ipsa nihil eius autem? Fugit laborum soluta blanditiis sapiente.
              </p>
            </Carousel.Caption>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      <section className="section section-light">
        <h2 className="h2">About the Service</h2>
        <p>
          Welcome to Food Registry, a trusted platform where food producers can register and share detailed information
          about their products. Our mission is to provide a comprehensive registry that ensures transparency and
          accessibility for everyone in the food industry. By using our tool, producers can easily submit accurate details
          such as ingredients, nutritional values, and more, creating a centralized source of truth that consumers and
          businesses alike can rely on.
        </p>
        <p>
          Whether you're a food producer looking to simplify compliance and manage your product information or a business
          needing reliable data to make informed decisions, Food Registry is here to help. Our goal is to support
          transparency, empower healthy choices, and make food information readily accessible to all.
        </p>
      </section>
      
      <section className="section section-dark">
        <Container>
          <Row className="justify-content-center">
            <Col sm={4} className="mb-3 text-center feature-card feature-card1">
            <Link to={`${API_URL}/Identity/Account/Register`} className='iconLink'>
              <div>
                <p className="mb-0"><i className="icon bi bi-person-plus-fill"></i></p>
              </div>
              <div>
                <p className="mb-0"><strong>Create your account</strong></p>
              </div>
            </Link>
            </Col>
            <Col sm={4} className="mb-3 text-center feature-card feature-card2">
              <Link to={`/productcreate`} className='iconLink'>
              <div>
                <p className="mb-0"><i className="icon bi bi-list-ul"></i></p>
              </div>
              <div>
                <p className="mb-0"><strong>Register your product</strong></p>
              </div>
              </Link>
            </Col>
            <Col sm={4} className="mb-3 text-center feature-card feature-card3">
              <div>
                <p className="mb-0"><i className="icon bi bi-globe"></i></p>
              </div>
              <div>
                <p className="mb-0"><strong>Share with the world</strong></p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <hr></hr>
      <section className="section section-light">
        <h2 className="h2">About Us</h2>
        <p>
          At Food Registry, we're passionate about empowering food producers and consumers with easy access to
          transparent, reliable nutritional information. Our platform serves as a centralized registry for food products,
          allowing producers to accurately record ingredients, nutrition values, and other key details. This helps ensure
          that anyone—businesses, consumers, and industry professionals—has access to the essential information needed to
          make informed food choices.
        </p>
        <p>
          We believe in fostering trust and supporting public health by promoting transparency across the food industry. By
          bringing food producers and consumers together through our platform, we aim to create a healthier, more informed
          world, one product at a time.
        </p>
      </section>
      <hr></hr>
      <section className="text-center section section-color">
        <p className="h1">Food nutrition registration made simple!</p>
        <div className="pt-4">
          <Link to="http://localhost:5194/Identity/Account/Register" className="btn btn-outline-light">
            Join Us Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;