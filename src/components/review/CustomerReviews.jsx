import React, { useRef } from 'react';
import './CustomerReviews.css';
const reviews = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: 'I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations.',
  },
  {
    name: 'Alex K.',
    rating: 5,
    text: 'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.',
  },
  {
    name: 'James L.',
    rating: 4,
    text: 'I\'ve shopped with dozens of stores for unique fashion pieces, but nothing beats the curated selection at Shop.co. The selection of clothes is not only diverse but also on point with the latest trends.',
  },
  {
    name: 'Lena S.',
    rating: 5,
    text: 'Great selection, fast shipping, and wonderful support. Highly recommended for fashion lovers!',
  },
  {
    name: 'Tom N.',
    rating: 4,
    text: 'Nice website, good deals, and the clothes arrived on time. I\'ll definitely be ordering again.',
  },
];

const CustomerReviews = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
   <section className="py-5 bg-white customer-reviews-section">
  <div className="container">
    <div className="d-flex justify-content-between align-items-center mb-4 flex-nowrap w-100">
  <h2 className="fw-bold heading-integral mb-0 happy-heading">OUR HAPPY CUSTOMERS</h2>
  <div className="d-flex gap-2">
    <button
      className="btn"
      onClick={scrollLeft}
      style={{ border: 'none', background: 'none', fontSize: '24px' }}
    >
      ‹
    </button>
    <button
      className="btn"
      onClick={scrollRight}
      style={{ border: 'none', background: 'none', fontSize: '24px' }}
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
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 border rounded-4 shadow-sm p-4"
          style={{
            minWidth: '250px',
            maxWidth: '350px',
            scrollSnapAlign: 'start',
          }}
        >
          <div className="mb-2 text-warning fs-5">
            {'★'.repeat(review.rating)}
            <span className="text-muted">{'★'.repeat(5 - review.rating)}</span>
          </div>
          <div className="fw-bold mb-2">{review.name}</div>
          <div className="text-muted small" style={{ fontSize: '0.85rem' }}>
            {review.text}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default CustomerReviews;
