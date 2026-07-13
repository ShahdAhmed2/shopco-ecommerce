import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import SEO from '../components/common/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'paid':
        return 'bg-primary text-white';
      case 'shipped':
        return 'bg-info text-dark';
      case 'delivered':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header />
      <div className="orders-page py-5 bg-light">
        <SEO 
          title="My Orders | SHOP.CO" 
          description="Review your SHOP.CO purchase histories, shipping status updates, and transaction details."
        />
        <div className="container">
          <h1 className="fw-bold heading-integral mb-4 text-uppercase">My Orders</h1>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading orders...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center py-4 my-4" role="alert">
              <h4 className="alert-heading fw-bold">Oops! Something went wrong</h4>
              <p className="mb-0">{error}</p>
              <button className="btn btn-outline-danger mt-3 px-4 rounded-pill" onClick={fetchOrders}>
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm border border-light p-4">
              <i className="bi bi-bag-x fs-1 text-muted mb-3 d-block"></i>
              <h3 className="fw-bold text-dark">No Orders Placed Yet</h3>
              <p className="text-muted mb-4">It looks like you haven't placed any orders yet. Discover our latest styles today!</p>
              <Link to="/shop" className="btn btn-dark px-5 py-3 rounded-pill fw-semibold text-uppercase">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="orders-list d-flex flex-column gap-4">
              {orders.map((order) => (
                <div className="card order-card border-0 shadow-sm rounded-4 p-4 bg-white" key={order._id}>
                  {/* Order Card Header */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-3">
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '13px' }}>ORDER ID</span>
                      <span className="fw-bold font-monospace text-dark">{order._id}</span>
                    </div>
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '13px' }}>PLACED ON</span>
                      <span className="fw-semibold text-dark">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '13px' }}>TOTAL PRICE</span>
                      <span className="fw-bold text-dark">${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted d-block mb-1" style={{ fontSize: '13px' }}>STATUS</span>
                      <span className={`badge px-3 py-2 rounded-pill text-capitalize fw-bold ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Card Items */}
                  <div className="order-items-grid row g-3 mb-3">
                    <div className="col-md-8">
                      <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>Items Details</h6>
                      {order.orderItems.map((item, idx) => (
                        <div className="d-flex align-items-center gap-3 mb-3" key={`${item.product}-${idx}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded border"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                          <div>
                            <span className="fw-bold d-block text-dark text-truncate" style={{ maxWidth: '300px' }}>{item.name}</span>
                            <small className="text-muted">
                              Size: <span className="text-dark fw-semibold">{item.size}</span> | Color: <span className="text-dark fw-semibold">{item.color}</span> | Qty: <span className="text-dark fw-semibold">{item.quantity}</span>
                            </small>
                          </div>
                          <div className="ms-auto fw-bold text-dark">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-md-4 border-start ps-md-4">
                      <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>Delivery Address</h6>
                      <div className="address-details" style={{ fontSize: '14px' }}>
                        <span className="fw-bold d-block text-dark mb-1">{order.shippingAddress.fullName}</span>
                        <span className="text-muted d-block mb-1"><i className="bi bi-telephone me-2"></i>{order.shippingAddress.phone}</span>
                        <span className="text-muted d-block"><i className="bi bi-geo-alt me-2"></i>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                      </div>

                      <div className="price-details-box mt-3 bg-light p-3 rounded-3" style={{ fontSize: '13px' }}>
                        <div className="d-flex justify-content-between mb-1 text-muted">
                          <span>Subtotal:</span>
                          <span className="fw-semibold text-dark">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1 text-muted">
                          <span>Shipping:</span>
                          <span className="fw-semibold text-dark">${order.shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1 text-muted">
                          <span>Tax (8%):</span>
                          <span className="fw-semibold text-dark">${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2 pt-2 border-top fw-bold text-dark" style={{ fontSize: '14px' }}>
                          <span>Total Paid:</span>
                          <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
