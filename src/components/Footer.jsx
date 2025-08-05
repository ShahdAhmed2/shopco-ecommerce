import React from 'react';
import paymentImage from '../assets/Frame 53.png';
// import './Footer.css'
const Footer = () => (
  <div className="position-relative" style={{ background: '#F0F0F0' }}>

    {/* Newsletter Floating Section */}
    <div
      className=" container position-absolute start-50 translate-middle-x py-5 footer-section"
      style={{
        top: '-25%',
        width: '100%',
      }}
    >
      <div className="newsletter-box bg-black text-white rounded-4 p-4 p-md-5 shadow d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
      <h4
  className=" container text-md-start mb-3 mb-md-0"
  style={{
    fontFamily: 'Integral CF',
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '40px',
    textTransform: 'uppercase',
    flex: '1',
    whiteSpace: 'normal', //  يخلي الكلام يلف تحت بعض
    wordWrap: 'break-word'
  }}
>
  STAY UPTO DATE ABOUT OUR LATEST OFFERS
</h4>


        <form className="w-100" style={{ maxWidth: '400px' }}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="form-control rounded-pill px-4 py-2 mb-3"
          />
          <button
            type="submit"
            className="btn btn-light fw-bold rounded-pill px-4 py-2 w-100"
          >
            Subscribe to Newsletter
          </button>
        </form>
      </div>
    </div>

    {/* Actual Footer */}
    <footer className="pt-5 mt-5 pb-4 ">
      <div className="container pt-5">

        {/* Links */}
        <div className="container row text-start pt-5 mt-5">
          <div className="col-12 col-md-3 mb-4 text-md-start">
            <h5 className="fw-bold mb-3 fw-bold heading-integral" style={{fontSize:'30px'}}>SHOP.CO</h5>
            
            <p className="small mb-4" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
              We have clothes that suit your style and which you’ll love to wear. From women to men.
            </p>
            <div className="d-flex gap-3 fs-5  justify-content-md-start">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-twitter"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>

          {/* Footer Columns */}
          {[
            { title: "COMPANY", items: ["About", "Features", "Works", "Career"] },
            { title: "HELP", items: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"] },
            { title: "FAQ", items: ["Account", "Manage Deliveries", "Orders", "Payments"] },
            { title: "RESOURCES", items: ["Free eBooks", "Development Tutorial", "How to - Blog", "YouTube Playlist"] },
          ].map((section, idx) => (
            <div className="col-6 col-md-2 mb-4  text-md-start" key={idx}>
              <h6 className="fw-bold mb-3">{section.title}</h6>
              <ul className="list-unstyled small" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                {section.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top" style={{ borderTop: '1px solid #0000001A' }}>
          <div className="small mb-3 mb-md-0 text-center text-md-start" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            Shop.co © 2000–2023, All Rights Reserved
          </div>
          <img src={paymentImage} alt="Payment Methods" height="50px"/>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
