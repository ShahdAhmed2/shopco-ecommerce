import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const deliveryFee = 15;
  const discountPercentage = 20;

  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setAppliedDiscount(20);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(item, item.size, item.color, newQuantity);
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item, item.size, item.color);
    toast.success('Item removed from cart');
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="fw-bold mb-4">YOUR CART</h2>
          <p className="text-muted">Your cart is empty</p>
          <Link to="/" className="btn btn-dark rounded-pill">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Breadcrumbs */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-dark">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Cart</li>
          </ol>
        </nav>
      </div>

      <div className="container py-4">
        <h1 className="fw-bold text-center mb-5">YOUR CART</h1>

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="cart-items">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item mb-4 p-4 border rounded">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h6 className="fw-semibold mb-1">{item.name}</h6>
                      <p className="text-muted mb-1">Size: {item.size}</p>
                      <p className="text-muted mb-0">Color: {item.color}</p>
                    </div>
                    <div className="col-md-2">
                      <span className="fw-bold">${item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price}</span>
                    </div>
                    <div className="col-md-2">
                      <div className="quantity-controls d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary p-4 border rounded">
              <h5 className="fw-bold mb-4">Order Summary</h5>
              
              <div className="summary-item d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-item d-flex justify-content-between mb-2 text-danger">
                <span>Discount (-{discountPercentage}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-item d-flex justify-content-between mb-3">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="summary-item d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5">${total.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-dark"
                    onClick={handleApplyPromo}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="btn btn-dark w-100 py-3 fw-bold">
                Go to Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CartPage;
