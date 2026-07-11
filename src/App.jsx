import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductSection from './components/product/ProductSection';
import BrowseByDressStyle from './components/BrowseByDressStyle';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <ProductSection title="NEW ARRIVALS" section="new-arrivals" />
      <ProductSection title="TOP SELLING" section="top-selling" />
      <BrowseByDressStyle />
      <CustomerReviews />
      <Footer />
    </div>
  );
}

export default App;
