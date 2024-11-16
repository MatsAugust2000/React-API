import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProducerForm from './ProducerForm';
import { Producer } from '../types/producer';
import API_URL from '../apiConfig';
import * as ProducerService from './ProducerService';
import ErrorPopup from '../shared/ErrorPopup';

const ProducerUpdatePage: React.FC = () => {
  const { producerId } = useParams<{ producerId: string }>(); // Get producerId from the URL
  const navigate = useNavigate(); // Create a navigate function
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showUnauthorizedError, setShowUnauthorizedError] = useState(false);

  useEffect(() => {
    const fetchProducer = async () => {
      try {
        const data = await ProducerService.fetchProducerById(producerId);
        setProducer(data);
      } catch (error) {
        setError('Failed to fetch producer');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducer();
  }, [producerId]);

  const handleProducerUpdated = async (producer: Producer) => {

    try {
      const data = await ProducerService.updateProducer(producer.producerId, producer);
      console.log('Producer updated successfully:', data);
      navigate('/producers'); // Navigate back after successful creation
    } catch (error) {
      setShowUnauthorizedError(true);
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!producer) return <p>No producer found</p>;
  
  return (
    <div>
      <h2>Update Producer</h2>
      <ProducerForm onProducerChanged={handleProducerUpdated} producerId={producer.producerId} isUpdate={true} initialData={producer} />
    
      {showUnauthorizedError && (
        <ErrorPopup onClose={() => setShowUnauthorizedError(false)} />
      )}
    </div>
  );
};

export default ProducerUpdatePage;