import API_BASE_URL from '../apiConfig';

const REACT_APP_URL = 'http://localhost:3000';

export const authService = {
    login: () => {
        const returnUrl = encodeURIComponent(REACT_APP_URL);
        window.location.href = `${API_BASE_URL}/Identity/Account/Login?ReturnUrl=${returnUrl}`;
    },

    logout: async (returnUrl?: string) => {
        //const returnUrl = encodeURIComponent(REACT_APP_URL);
        //window.location.href = `${API_BASE_URL}/Identity/Account/Logout?ReturnUrl=${returnUrl}`;
        try{
            const response = await fetch(
                `${API_BASE_URL}/Identity/Account/Logout?ReturnUrl=${returnUrl || ''}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Logout failed');
            }

            const data = await response.json();
            window.location.href = data.redirectUrl;
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback to simple redirect
            window.location.href = `${API_BASE_URL}/Identity/Account/Logout?ReturnUrl=${returnUrl || ''}`;
        }
    },

    register: () => {
        const returnUrl = encodeURIComponent(REACT_APP_URL);
        window.location.href = `${API_BASE_URL}/Identity/Account/Register?ReturnUrl=${returnUrl}`;
    },

    getCurrentUser: async () => {
        try {
            const apiUrl = `${API_BASE_URL}/api/Auth/userinfo`;
            console.log('Fetching user info from:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                console.error('Response NOT OK');
                if (response.status === 401){
                    return { isAuthenticated: false, user: null };
                }
                if (response.status === 404){
                    console.error('API endpoint not found');
                    return { isAuthenticated: false, user: null };
                }
                throw new Error(`HTTP error! statuse: ${response.status}`);
            }
            const data = await response.json();
            console.log('User data received:', data);
            return {
                isAuthenticated: data.isAuthenticated,
                user: {
                    userName: data.userName,
                    manageUrl: data.manageUrl,
                    logoutUrl: data.logoutUrl
                }
            };
        } catch (error) {
            console.error('Error fetching user info:', error);
            return { isAuthenticated: false, user: null };
        }

    }
};