import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import SEO from '../components/common/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Checkout.css';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Shipping Address Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Redirect if cart is empty on mount
  useEffect(() => {
    if (items.length === 0) {
      toast.info('Your cart is empty. Add products before checking out.', { toastId: 'empty-checkout' });
      navigate('/cart');
    }
  }, []);

  // Compute pricing metrics to display (simulated client-side, recalculated by backend)
  const subtotal = getCartTotal();
  const shippingFee = subtotal > 200 ? 0 : 15;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const totalPrice = subtotal + shippingFee + tax;

  const validate = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Recipient name is required';
    if (!phone.trim()) errors.phone = 'Contact phone number is required';
    if (!address.trim()) errors.address = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const orderItemsPayload = items.map((item) => ({
        product: item.id,
        name: item.name,
        image: item.image,
        price: item.discount ? Number((item.price * (1 - item.discount / 100)).toFixed(2)) : item.price,
        quantity: item.quantity,
        color: item.color || '',
        size: item.size || '',
      }));

      const shippingAddressPayload = {
        fullName,
        phone,
        address,
        city,
        country,
      };

      await orderService.createOrder({
        orderItems: orderItemsPayload,
        shippingAddress: shippingAddressPayload,
      });

      toast.success('Order placed successfully! Thank you for shopping with us.');
      // Clear Cart items from context
      clearCart();
      navigate('/my-orders');
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to place order. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="checkout-page py-5 bg-light">
        <SEO 
          title="Checkout | SHOP.CO" 
          description="Provide your delivery information and finalize your SHOP.CO order details."
        />
        <div className="container">
          <div className="mb-4">
            <Link to="/cart" className="text-dark text-decoration-none fw-medium">
              ← Back to Cart
            </Link>
          </div>

          <h1 className="fw-bold heading-integral mb-4 text-uppercase">Checkout</h1>

          <div className="row g-4">
            {/* Left Column: Shipping Form */}
            <div className="col-lg-7">
              <div className="card p-4 border-0 shadow-sm rounded-4">
                <h3 className="fw-bold mb-4">Shipping Details</h3>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label fw-semibold">Recipient Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      className={`form-control rounded-pill px-3 py-2 ${formErrors.fullName ? 'is-invalid' : ''}`}
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                    />
                    {formErrors.fullName && <div className="invalid-feedback ps-2">{formErrors.fullName}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        className={`form-control rounded-pill px-3 py-2 ${formErrors.phone ? 'is-invalid' : ''}`}
                        placeholder="+1 555-123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                      />
                      {formErrors.phone && <div className="invalid-feedback ps-2">{formErrors.phone}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="country" className="form-label fw-semibold">Country</label>
                      <input
                        type="text"
                        id="country"
                        className={`form-control rounded-pill px-3 py-2 ${formErrors.country ? 'is-invalid' : ''}`}
                        placeholder="United States"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={loading}
                      />
                      {formErrors.country && <div className="invalid-feedback ps-2">{formErrors.country}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label fw-semibold">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      className={`form-control rounded-pill px-3 py-2 ${formErrors.address ? 'is-invalid' : ''}`}
                      placeholder="123 Main St, Apt 4B"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={loading}
                    />
                    {formErrors.address && <div className="invalid-feedback ps-2">{formErrors.address}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="city" className="form-label fw-semibold">City</label>
                    <input
                      type="text"
                      id="city"
                      className={`form-control rounded-pill px-3 py-2 ${formErrors.city ? 'is-invalid' : ''}`}
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={loading}
                    />
                    {formErrors.city && <div className="invalid-feedback ps-2">{formErrors.city}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 rounded-pill py-3 fw-bold mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="col-lg-5">
              <div className="card p-4 border-0 shadow-sm rounded-4">
                <h3 className="fw-bold mb-4">Order Summary</h3>
                
                {/* Cart Items List */}
                <div className="checkout-items mb-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
                  {items.map((item, index) => {
                    const itemPrice = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    return (
                      <div className="d-flex align-items-center gap-3 mb-3 border-bottom pb-3" key={`${item.id}-${item.size}-${item.color}-${index}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded"
                          style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '200px' }}>{item.name}</h6>
                          <small className="text-muted d-block">
                            Size: <span className="text-dark fw-semibold">{item.size}</span> | Color: <span className="text-dark fw-semibold">{item.color}</span>
                          </small>
                          <small className="text-muted d-block">Qty: {item.quantity}</small>
                        </div>
                        <div className="text-end fw-bold">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculations Summary */}
                <div className="summary-breakdown">
                  <div className="d-flex justify-content-between mb-2 text-muted">
                    <span>Subtotal</span>
                    <span className="fw-semibold text-dark">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2 text-muted">
                    <span>Shipping Fee</span>
                    <span className="fw-semibold text-dark">
                      {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3 text-muted">
                    <span>Tax (8%)</span>
                    <span className="fw-semibold text-dark">${tax.toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-0 mt-3">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-5">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
