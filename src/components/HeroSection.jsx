import React from 'react';
import image from "../assets/1.jpg";
import img1 from "../assets/Vector (3).png";
import img2 from "../assets/Vector (2).png";
import img3 from "../assets/Vector (1).png";
import img4 from "../assets/Vector.png";
import img5 from "../assets/Group.png";
import './HeroSection.css';
const HeroSection = () => (
  <section className=" position-relative hero " style={{ backgroundColor: '#F2F0F1' }}>
    <div className="container">
      <div className="row align-items-center justify-content-center" >
        {/* Left Column - Text */}
        <div className="col-lg-6 mb-5 mb-lg-0  text-lg-start">
          <h1 className="fw-bold display-4 heading-integral mb-4" style={{ lineHeight: '1.2' }}>
            FIND CLOTHES<br />
            THAT MATCHES<br />
            YOUR STYLE
          </h1>
          <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <div className="text-center text-lg-start">
            <button className="btn btn-dark mb-4 custom-btn-mobile" style={{ fontSize: '1rem', borderRadius: '70px', padding: '10px 55px' }}>
              Shop Now
            </button>
          </div>



          {/* Stats */}
          <div className="d-flex flex-wrap gap-5 justify-content-center justify-content-lg-start">
            <div >
              <div className="fw-bold fs-2">200+</div>
              <div className="text-muted small">International Brands</div>
            </div>
            <div   className='bprderl'>
              <div className="fw-bold fs-2">2,000+</div>
              <div className="text-muted small">High-Quality Products</div>
            </div>
            <div >
              <div className="fw-bold fs-2">30,000+</div>
              <div className="text-muted small">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Right Column - Full Image */}
        <div className="col-lg-6 text-center position-relative">
          <div className="position-relative">
            <img
              src={image}
              alt="Fashion models"
              className="img-fluid w-100 hero-image"
              style={{
                maxHeight: '700px', 
                objectFit: 'contain', 
              }}
            />
            {/* Decorative Stars */}
            <div className="position-absolute" style={{ bottom: '60%', right: '20px', fontSize: '130px' }}>✦</div>
            <div className="position-absolute" style={{ top: '50%', left: '-20px', fontSize: '80px' }}>✦</div>
          </div>
        </div>
      </div>
    </div>

    {/* Brand Strip */}
    <div
      className="w-100"
      style={{
        backgroundColor: '#000',
        paddingTop: '40px',
        paddingBottom: '60px',
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-around align-items-center gap-3 flex-wrap">
          <img src={img3} alt="Gucci" className="brand-logo" />
          <img src={img4} alt="Prada" className="brand-logo" />
          <img src={img2} alt="Zara" className="brand-logo" />
          <img src={img5} alt="Calvin Klein" className="brand-logo" />
          <img src={img1} alt="Versace" className="brand-logo" />
        </div>
      </div>
    </div>

  </section>
);

export default HeroSection;
