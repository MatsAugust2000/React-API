import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Producer } from '../types/producer';

interface ProducerFormProps {
    onProducerChanged: (newProducer: Producer) => void;
    producerId?: number;
    isUpdate?: boolean;
    initialData?: Producer;
  }
  
  
  const ProducerForm: React.FC<ProducerFormProps> = ({
      onProducerChanged, 
      producerId,
      isUpdate = false,
      initialData}) => {
    const [name, setName] = useState<string>(initialData?.name || '');
    const [address, setAddress] = useState<string>(initialData?.address || '');

    const navigate = useNavigate();

    const onCancel = () => {
      navigate(-1); // This will navigate back one step in the history
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const producer: Producer = { producerId, name, address };
        onProducerChanged(producer); // Call the passed function with the producer data
    };
    
    return (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProducerName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter producers name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              pattern="[0-9a-zA-ZæøåÆØÅ. \-]{2,20}" // Regular expression pattern
              title="The Name must be numbers or letters and between 2 to 20 characters."
            />       
          </Form.Group>
          <Form.Group controlId="formProducerAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter producers address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              pattern="[0-9a-zA-ZæøåÆØÅ. \-]{2,20}" // Regular expression pattern
              title="The Address must be numbers or letters and between 2 to 20 characters."
            />       
          </Form.Group>
          <br></br>
            <Button variant="secondary" type="submit">{isUpdate ? 'Update Producer' : 'Create Producer'}</Button>
            <Button variant="primary" onClick={onCancel} className="ms-2">Cancel</Button>
        </Form>
    );
};
  
export default ProducerForm;