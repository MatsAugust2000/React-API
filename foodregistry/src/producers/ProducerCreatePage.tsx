import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProducerForm from './ProducerForm';
import { Producer } from '../types/producer';
import API_URL from '../apiConfig';
import * as ProducerService from './ProducerService';
import ErrorPopup from '../shared/ErrorPopup';

const ProducerCreatePage: React.FC = () => {
    const navigate = useNavigate(); // Create a navigate function
    const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);
  
    const handleProducerCreated = async (producer: Producer) => {
      try {
        const data = await ProducerService.createProducer(producer);
        console.log('Producer created successfully:', data);
        navigate('/producers'); // Navigate back after successful creation
      } catch (error) {
        setShowUnauthorizedError(true);
        console.error('There was a problem with the fetch operation:', error);
      }
    }
    
    return (
      <div>
        <h2>Create New Producer</h2>
        <ProducerForm onProducerChanged={handleProducerCreated}/>
        
        {showUnauthorizedError && (
          <ErrorPopup onClose={() => setShowUnauthorizedError(false)} />
        )}
      </div>
    );
  };
  
  export default ProducerCreatePage;