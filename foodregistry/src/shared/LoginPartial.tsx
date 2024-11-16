import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { authService } from './AuthService';

const LoginPartial: React.FC = () => {
    const { isAuthenticated, user, loading, error } = useAuth();

    const getDisplayName = (email: string | undefined): string => {
        if (!email) return 'User';
        return email.split('@')[0]; // Extract characters before @
    }

    console.log('LoginPartial state:', { isAuthenticated, user, loading, error }); // Debug log

    const handleLogout = async () => {
      const returnUrl = encodeURIComponent(window.location.origin);
      await authService.logout(returnUrl);
    };

    if (loading) {
        return <Nav.Item>Loading...</Nav.Item>;
    }

    if (error) {
      console.error('Auth error:', error);
      // Show error but still render login options
      return (
          <Nav className="ms-auto">
              <Nav.Link onClick={() => authService.register()}>Register</Nav.Link>
              <Nav.Link onClick={() => authService.login()}>Login</Nav.Link>
          </Nav>
      );
    }

    return (
        <Nav className="ms-auto" style={{}}>
            {isAuthenticated ? (
                <>
                  <NavDropdown
                      title={
                        <>
                        <i className="bi bi-person-circle me-1"></i>
                        {getDisplayName(user?.userName)}
                        </>
                      }
                      id="user-dropdown"
                      className="me-2"
                  >
                      <NavDropdown.Item href="/Identity/Account/Manage">
                      <i className="bi bi-person-lines-fill"></i>  Account
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                      </NavDropdown.Item>
                  </NavDropdown>
                </>
            ) : (
                <>
                <Nav.Link 
                        onClick={() => authService.register()}
                        className="me-2"
                    >
                        Register
                    </Nav.Link>
                    <Nav.Link 
                        onClick={() => authService.login()}
                    >
                        Login
                  </Nav.Link>
                </>
            )}
        </Nav>
    );
};

export default LoginPartial;