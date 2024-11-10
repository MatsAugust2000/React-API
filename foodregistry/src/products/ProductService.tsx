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

// Get itemlist
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/productapi/productlist`);
  return handleResponse(response);
};
// Get item by id
export const fetchProductById = async (productId: string) => {
  const response = await fetch(`${API_URL}/api/productapi/${productId}`);
  return handleResponse(response);
};
// Post create item
export const createProduct = async (product: any) => {
  const response = await fetch(`${API_URL}/api/productapi/create`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(product),
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
// Put update item
export const updateProduct = async (productId: number, product: any) => {
  const response = await fetch(`${API_URL}/api/productapi/update/${productId}`, {
    method: 'PUT',
    headers:{
      'Content-Type': 'application/json'
    },
    credentials: 'include',    
    body: JSON.stringify(product),
  });
  return handleResponse(response);
};
// Delete item
export const deleteProduct = async (productId: number) => {
  const response = await fetch(`${API_URL}/api/productapi/delete/${productId}`, {
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