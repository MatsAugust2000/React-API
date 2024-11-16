import API_URL from '../apiConfig'; // Update the path if necessary

const handleResponse = async (response: Response) => {
  if (response.ok) {  // HTTP status code success 200-299
    if (response.status === 204) { // Detele returns 204 No content
      return null;
    }
    return response.json(); // other returns response body as JSON
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
};

// Get producerlist
export const fetchProducers = async () => {
  const response = await fetch(`${API_URL}/api/producerapi/producerlist`);
  return handleResponse(response);
};
// Get producer by id
export const fetchProducerById = async (producerId: string) => {
  const response = await fetch(`${API_URL}/api/producerapi/${producerId}`);
  return handleResponse(response);
};
// Post create producer
export const createProducer = async (producer: any) => {
  const response = await fetch(`${API_URL}/api/producerapi/create`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(producer),
  });

  if (response.status === 401) {
    const error = new Error('Unauthorized') as any;
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return handleResponse(response);
};
// Put update producer
export const updateProducer = async (producerId: number, producer: any) => {
  const response = await fetch(`${API_URL}/api/producer/update/${producerId}`, {
    method: 'PUT',
    headers:{
      'Content-Type': 'application/json'
    },
    credentials: 'include',    
    body: JSON.stringify(producer),
  });
  return handleResponse(response);
};
// Delete producer
export const deleteProducer = async (producerId: number) => {
  const response = await fetch(`${API_URL}/api/producerapi/delete/${producerId}`, {
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });

  if (response.status === 401) {
    const error = new Error('Unauthorized') as any;
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return handleResponse(response);
};