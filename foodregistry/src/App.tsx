import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import './App.css';
import HomePage from './home/HomePage';
import ProductListPage from './products/ProductListPage';
import NavMenu from './shared/NavMenu';
import ProductCreatePage from './products/ProductCreatePage';
import ProductUpdatePage from './products/ProductUpdatePage';
import { AuthProvider } from './shared/AuthContext';
import ProtectedRoute from './shared/ProtectedRoute';
import ProductDetailsContainer from './products/ProductDetails';
import Footer from './shared/Footer';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
          <div className='app-container'>
          <NavMenu />

            <div className='content-wrap'>
              <main className='main-content'>
                <Container>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path='/productcreate' element={<ProtectedRoute> <ProductCreatePage /> </ProtectedRoute>}/>
                    <Route path='/productupdate/:productId' element={<ProtectedRoute> <ProductUpdatePage /> </ProtectedRoute>}/>
                    <Route path="/productdetails/:productId" element={<ProductDetailsContainer />} />
                    <Route path='*' element={<Navigate to='/' replace />} />
                  </Routes>
                </Container>
              </main>
            </div>
            <Footer/>
          </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
