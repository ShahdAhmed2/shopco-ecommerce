import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NewArrivals from './components/NewArrivals';
import TopSelling from './components/TopSelling';
import BrowseByDressStyle from './components/BrowseByDressStyle';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <NewArrivals />
      <TopSelling />
      <BrowseByDressStyle />
      <CustomerReviews />
      <Footer />
    </div>
  );
}

export default App;
