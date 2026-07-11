import React from 'react';

/**
 * Reusable Product Details Quick-View Modal Component
 * @param {Object} props
 * @param {Object} props.product - The product object to display details for
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback triggered when closing the modal
 * @param {string} props.selectedSize - Active selected size selection state
 * @param {Function} props.setSelectedSize - Setter callback for selected size
 * @param {string} props.selectedColor - Active selected color selection state
 * @param {Function} props.setSelectedColor - Setter callback for selected color
 * @param {Function} props.onAddToCart - Callback triggered on confirmation click
 */
const ProductModal = ({
  product,
  isOpen,
  onClose,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid mb-3"
              style={{ borderRadius: '10px' }}
            />
            <p><strong>Price:</strong> ${product.price}</p>
            {product.discount && (
              <p>
                <strong>Discount:</strong>{' '}
                <span className="text-danger">{product.discount}%</span>
              </p>
            )}
            <p><strong>Rating:</strong> {product.rating}/5</p>
            
            {/* Size Selection */}
            <div className="mb-3">
              <label className="form-label"><strong>Size:</strong></label>
              <div className="btn-group" role="group">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <React.Fragment key={size}>
                    <input
                      type="radio"
                      className="btn-check"
                      name="size"
                      id={`size-${size}`}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                    />
                    <label
                      className={`btn btn-outline-dark ${selectedSize === size ? 'active' : ''}`}
                      htmlFor={`size-${size}`}
                    >
                      {size}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-3">
              <label className="form-label"><strong>Color:</strong></label>
              <div className="btn-group" role="group">
                {['Black', 'White', 'Red', 'Blue'].map((color) => (
                  <React.Fragment key={color}>
                    <input
                      type="radio"
                      className="btn-check"
                      name="color"
                      id={`color-${color}`}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                    />
                    <label
                      className={`btn btn-outline-dark ${selectedColor === color ? 'active' : ''}`}
                      htmlFor={`color-${color}`}
                    >
                      {color}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button
              className="btn btn-dark w-100"
              onClick={onAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
