const API_BASE_URL = 'http://localhost:5000/api';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

function request(method) {
  return async (url, body = null, isMultipart = false) => {
    const requestOptions = {
      method,
      headers: authHeader(url)
    };
    
    if (body) {
      if (isMultipart) {
        requestOptions.body = body; // Let browser set boundary automatically for FormData
      } else {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
}

function authHeader(url) {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  if (isLoggedIn) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

async function handleResponse(response) {
  const text = await response.text();
  const data = text && JSON.parse(text);
  
  if (!response.ok) {
    if ([401, 403].includes(response.status) && localStorage.getItem('token')) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.reload();
    }

    const error = (data && data.message) || response.statusText;
    throw error;
  }

  return data;
}
