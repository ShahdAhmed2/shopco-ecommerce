import React from 'react';
import casualImg from '../assets/image 11.png';
import formalImg from '../assets/image 13.png';
import partyImg from '../assets/image 12.png';
import gymImg from '../assets/image 14.png';
import './BrowseByDressStyle.css'; 

const BrowseByDressStyle = () => {
  const styles = [
    { name: 'Casual', img: casualImg },
    { name: 'Formal', img: formalImg },
    { name: 'Party', img: partyImg },
    { name: 'Gym', img: gymImg },
  ];

  return (
    <section className="py-5">
      <div
        className="container px-4 py-5"
        style={{
          backgroundColor: '#F0F0F0',
          borderRadius: '40px',
          maxWidth: '1240px',
        }}
      >
        <h2 className="heading-integral text-center mb-4 happy-heading" style={{ paddingBottom: '50px' }}>
          BROWSE BY DRESS STYLE
        </h2>

        {/* Desktop Layout */}
        <div className="d-none d-lg-flex flex-wrap gap-3">
          <div className="d-flex flex-wrap gap-3 mb-4 w-100">
            <div className="style-box" style={{ flex: '1', maxWidth: '45%', backgroundImage: `url(${casualImg})` }}>
              <div className="style-label">Casual</div>
            </div>
            <div className="style-box" style={{ flex: '2', backgroundImage: `url(${formalImg})` }}>
              <div className="style-label">Formal</div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 w-100">
            <div className="style-box" style={{ flex: '2', backgroundImage: `url(${partyImg})` }}>
              <div className="style-label">Party</div>
            </div>
            <div className="style-box" style={{ flex: '1', maxWidth: '45%', backgroundImage: `url(${gymImg})` }}>
              <div className="style-label">Gym</div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="d-lg-none d-flex flex-column gap-3">
          {styles.map((item) => (
            <div key={item.name} className="style-box" style={{ backgroundImage: `url(${item.img})` }}>
              <div className="style-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByDressStyle;
