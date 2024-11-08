import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
//import './App.css';
import HomePage from './home/HomePage';
import ProductListPage from './products/ProductListPage';
import NavMenu from './shared/NavMenu';
import ProductCreatePage from './products/ProductCreatePage';
import ProductUpdatePage from './products/ProductUpdatePage';

const App: React.FC = () => {
  return (
    <Container>
      <NavMenu />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path='/productcreate' element={<ProductCreatePage />}/>
            <Route path='/productupdate/:productId' element={<ProductUpdatePage />}/>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
    </Container>
  );
};

export default App;
