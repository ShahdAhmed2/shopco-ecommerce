import React, { useRef } from 'react';
import testimonials from '../../data/testimonials';
import './CustomerReviews.css';

const CustomerReviews = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="py-4 bg-white customer-reviews-section">
      <div className="container">
        <div className="position-relative mb-4">
          <h2 className="fw-bold text-center heading-integral mb-0 happy-heading">OUR HAPPY CUSTOMERS</h2>
          <div className="position-absolute end-0 top-50 translate-middle-y d-flex gap-2 d-none d-sm-flex">
            <button
              className="btn"
              onClick={scrollLeft}
              style={{ border: 'none', background: 'none', fontSize: '24px' }}
              aria-label="Previous testimonials"
            >
              ‹
            </button>
            <button
              className="btn"
              onClick={scrollRight}
              style={{ border: 'none', background: 'none', fontSize: '24px' }}
              aria-label="Next testimonials"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="d-flex gap-3 overflow-auto pb-2 hide-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            cursor: 'grab',
          }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 border rounded-4 shadow-sm p-4 d-flex flex-column justify-content-between"
              style={{
                minWidth: '280px',
                maxWidth: '350px',
                scrollSnapAlign: 'start',
                backgroundColor: '#fff'
              }}
            >
              <div>
                <div className="mb-2 text-warning fs-5">
                  {'★'.repeat(item.rating)}
                  <span className="text-muted">{'★'.repeat(5 - item.rating)}</span>
                </div>
                <h5 className="fw-bold fs-6 mb-2">{item.title}</h5>
                <p className="text-muted small mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                  "{item.message}"
                </p>
              </div>
              <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold d-block" style={{ fontSize: '0.9rem' }}>
                    {item.name}
                  </span>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    {item.country}
                  </span>
                </div>
                <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
