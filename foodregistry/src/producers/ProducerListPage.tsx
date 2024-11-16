import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Producer } from '../types/producer';
import API_URL from '../apiConfig';
import ErrorPopup from '../shared/ErrorPopup';
import * as ProducerService from './ProducerService';
import ProducerTable from './ProducerTable';
import ProducerGrid from './ProducerGrid';
import { Product } from '../types/product';
import * as ProductService from '../products/ProductService';

const ProducerListPage: React.FC = () => {
    const [producers, setProducers] = useState<Producer[]>([]); // State for storing producers with Producer type
    const [product, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for storing error messages
    const [showTable, setShowTable] = useState<boolean>(true); // State to toggle between table and grid view
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);
  
    const toggleTableOrGrid = () => setShowTable(prevShowTable => !prevShowTable);
  
    const fetchProducers = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      setError(null);   // Clear any previous errors
  
      try {
        const data = await ProducerService.fetchProducers();
        const dataProd = await ProductService.fetchProducts();
        setProducts(dataProd);
        setProducers(data);
        console.log(data);
      } catch (error) {
        console.error(`There was a problem with the fetch operation: ${error.message}`);
        setError('Failed to fetch producers.');
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };
  
    // Set the view mode to local storage when the producer is fetched
    useEffect(() => {
      const savedViewMode = localStorage.getItem('producerViewMode');
      console.log('[fetch producers] Saved view mode:', savedViewMode); // Debugging line
      if (savedViewMode) {
        if (savedViewMode === 'grid')
          setShowTable(false)
        console.log('show table', showTable);
      }
      fetchProducers();
    }, []);
  
    // Save the view mode to local storage whenever it changes
    useEffect(() => {
      console.log('[save view state] Saving view mode:', showTable ? 'table' : 'grid');
      localStorage.setItem('producerViewMode', showTable ? 'table' : 'grid');
    }, [showTable]);
  
    const filteredProducers = producers.filter(producer =>
      producer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producer.address.toLowerCase().includes(searchQuery.toLowerCase())
    );


  
    const handleProducerDeleted = async (producerId: number) => {
      const confirmDelete = window.confirm(`Are you sure you want to delete the producer ${producerId}?\nEach corresponding Product will be permanently removed too.`);
      if (confirmDelete) {
        try {
          await ProducerService.deleteProducer(producerId);
          setProducers(prevProducers => prevProducers.filter(producer => producer.producerId !== producerId));
          console.log('Producer deleted:', producerId);
        } catch (error) {
          setShowUnauthorizedError(true);
          console.error('Error deleting producer:', error);
          setError('Failed to delete producer.');
        }
      }
    };
  
    return (
      <div>
        <h1>Producers</h1>
        <Button onClick={fetchProducers} className="btn btn-primary mb-3 me-2" disabled={loading}>
          <i className="bi bi-arrow-clockwise"></i> 
          {loading ? ' Loading...' : ' Refresh'}
        </Button>
        <Button onClick={toggleTableOrGrid} className="btn btn-primary mb-3 me-2">
          {showTable ? <i className="bi bi-grid"></i> : <i className="bi bi-list-ul"></i>}
        </Button>
        <Button href='/producercreate' className="btn btn-secondary mb-3 me-2">
        <i className="bi bi-pencil-square"></i> New Producer
        </Button>
        <Form.Group className="mb-3">
          <InputGroup>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder='Search by name or address'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          </InputGroup>
        </Form.Group>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {showTable
          ? <ProducerTable producers={filteredProducers} products={product}  apiUrl={API_URL} onProducerDeleted={handleProducerDeleted} />
          : <ProducerGrid producers={filteredProducers} apiUrl={API_URL} onProducerDeleted={handleProducerDeleted} />}
        
        {showUnauthorizedError && (
          <ErrorPopup onClose={() => setShowUnauthorizedError(false)} />
        )}
  
      </div>
    );
  };
  
  export default ProducerListPage;