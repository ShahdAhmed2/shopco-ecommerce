import React from 'react';
import { useNavigate } from 'react-router-dom';
import casualImg from '../../assets/image 11.png';
import formalImg from '../../assets/image 13.png';
import partyImg from '../../assets/image 12.png';
import gymImg from '../../assets/image 14.png';
import './BrowseByDressStyle.css';

const BrowseByDressStyle = () => {
  const navigate = useNavigate();

  const styles = [
    { name: 'Casual', img: casualImg },
    { name: 'Formal', img: formalImg },
    { name: 'Party', img: partyImg },
    { name: 'Gym', img: gymImg },
  ];

  const handleStyleClick = (styleName) => {
    navigate(`/shop?dressStyle=${styleName}`);
  };

  const handleKeyDown = (e, styleName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStyleClick(styleName);
    }
  };

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
            <div 
              className="style-box" 
              style={{ flex: '1', maxWidth: '45%', backgroundImage: `url(${casualImg})` }}
              onClick={() => handleStyleClick('Casual')}
              onKeyDown={(e) => handleKeyDown(e, 'Casual')}
              role="button"
              tabIndex={0}
              aria-label="Browse Casual Style"
            >
              <div className="style-label">Casual</div>
            </div>
            <div 
              className="style-box" 
              style={{ flex: '2', backgroundImage: `url(${formalImg})` }}
              onClick={() => handleStyleClick('Formal')}
              onKeyDown={(e) => handleKeyDown(e, 'Formal')}
              role="button"
              tabIndex={0}
              aria-label="Browse Formal Style"
            >
              <div className="style-label">Formal</div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 w-100">
            <div 
              className="style-box" 
              style={{ flex: '2', backgroundImage: `url(${partyImg})` }}
              onClick={() => handleStyleClick('Party')}
              onKeyDown={(e) => handleKeyDown(e, 'Party')}
              role="button"
              tabIndex={0}
              aria-label="Browse Party Style"
            >
              <div className="style-label">Party</div>
            </div>
            <div 
              className="style-box" 
              style={{ flex: '1', maxWidth: '45%', backgroundImage: `url(${gymImg})` }}
              onClick={() => handleStyleClick('Gym')}
              onKeyDown={(e) => handleKeyDown(e, 'Gym')}
              role="button"
              tabIndex={0}
              aria-label="Browse Gym Style"
            >
              <div className="style-label">Gym</div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="d-lg-none d-flex flex-column gap-3">
          {styles.map((item) => (
            <div 
              key={item.name} 
              className="style-box" 
              style={{ backgroundImage: `url(${item.img})` }}
              onClick={() => handleStyleClick(item.name)}
              onKeyDown={(e) => handleKeyDown(e, item.name)}
              role="button"
              tabIndex={0}
              aria-label={`Browse ${item.name} Style`}
            >
              <div className="style-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByDressStyle;
