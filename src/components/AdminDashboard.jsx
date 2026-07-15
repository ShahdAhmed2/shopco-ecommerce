import React, { useState, useMemo } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SEO from './common/SEO';
import './AdminDashboard.css';

const emptyProduct = {
  name: '',
  price: '',
  image: '',
  section: 'new-arrivals',
  discount: '',
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  // Product actions state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProduct, setCurrentProduct] = useState(emptyProduct);
  const [originalProduct, setOriginalProduct] = useState(emptyProduct);

  // Orders filters state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSort, setOrderSort] = useState('newest');

  // Selected order details modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const queryClient = useQueryClient();

  // Queries
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const { data: allOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders-admin'],
    queryFn: () => orderService.getAllOrders(),
    enabled: activeTab === 'orders',
  });

  // Product mutations
  const addProduct = useMutation({
    mutationFn: (newProduct) => productService.createProduct(newProduct),
    onSuccess: () => {
      toast.success('Product created successfully!', { toastId: 'product-create-success' });
      queryClient.invalidateQueries(['products']);
      setShowModal(false);
      setCurrentProduct(emptyProduct);
    },
    onError: (error) => {
      console.error('Add product error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to add product.', { toastId: 'product-create-error' });
    },
  });

  const editProduct = useMutation({
    mutationFn: (updatedProduct) =>
      productService.updateProduct(updatedProduct.id, updatedProduct),
    onSuccess: () => {
      toast.success('Product updated successfully!', { toastId: 'product-update-success' });
      queryClient.invalidateQueries(['products']);
      setShowModal(false);
      setCurrentProduct(emptyProduct);
    },
    onError: (error) => {
      console.error('Edit product error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update product.', { toastId: 'product-update-error' });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully!', { toastId: 'product-delete-success' });
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      console.error('Delete product error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete product.', { toastId: 'product-delete-error' });
    },
  });

  // Order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Order status updated successfully!', { toastId: 'order-update-success' });
      queryClient.invalidateQueries(['orders-admin']);
    },
    onError: (error) => {
      console.error('Update status error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update order status.', { toastId: 'order-update-error' });
    },
  });

  // Handle product edit/change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addProduct.isPending || editProduct.isPending) {
      return;
    }

    if (modalType === 'add') {
      addProduct.mutate(currentProduct);
    } else {
      const isUnchanged =
        currentProduct.name === originalProduct.name &&
        currentProduct.price === originalProduct.price &&
        currentProduct.image === originalProduct.image &&
        currentProduct.section === originalProduct.section &&
        currentProduct.discount === originalProduct.discount;

      if (isUnchanged) {
        toast.dismiss();
        toast.error('No changes were made.');
        return;
      }

      editProduct.mutate(currentProduct);
    }
  };

  const handleDelete = (id) => {
    if (deleteProduct.isPending) {
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id);
    }
  };

  const openProductModal = (type, product = emptyProduct) => {
    setModalType(type);
    if (type === 'edit') {
      setCurrentProduct(product);
      setOriginalProduct(product);
    } else {
      setCurrentProduct(emptyProduct);
      setOriginalProduct(emptyProduct);
    }
    setShowModal(true);
  };

  // Order status badge coloring helper
  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'bg-warning text-dark';
    if (s === 'confirmed' || s === 'paid') return 'bg-info text-dark';
    if (s === 'shipped') return 'bg-primary text-light';
    if (s === 'delivered') return 'bg-success text-light';
    if (s === 'cancelled') return 'bg-danger text-light';
    return 'bg-secondary text-light';
  };

  // Memoized client-side order filtering and sorting
  const filteredOrders = useMemo(() => {
    let result = allOrders;

    // Search by ID, customer name, or email
    if (orderSearch) {
      const term = orderSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(term) ||
          (o.shippingAddress?.name || '').toLowerCase().includes(term) ||
          (o.user?.email || '').toLowerCase().includes(term) ||
          (o.user?.name || '').toLowerCase().includes(term)
      );
    }

    // Status Filter
    if (orderStatusFilter !== 'All') {
      const filterVal = orderStatusFilter.toLowerCase();
      result = result.filter((o) => {
        const statusVal = (o.status || '').toLowerCase();
        if (filterVal === 'confirmed') {
          return statusVal === 'confirmed' || statusVal === 'paid';
        }
        return statusVal === filterVal;
      });
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (orderSort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (orderSort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (orderSort === 'highest-total') {
        return (b.totalPrice || 0) - (a.totalPrice || 0);
      }
      return 0;
    });
  }, [allOrders, orderSearch, orderStatusFilter, orderSort]);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SEO
        title="Admin Dashboard | SHOP.CO"
        description="Manage product listings and catalog items in the SHOP.CO administration dashboard."
      />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#121212' }}>Admin Dashboard</h2>
        <Link to="/" className="btn btn-outline-dark">← Home</Link>
      </div>

      {/* Tabs */}
      <div className="nav nav-tabs mb-4 border-bottom-0">
        <button
          className={`nav-link fw-semibold px-4 py-2.5 rounded-top border-0 ${activeTab === 'products' ? 'active bg-dark text-light' : 'bg-transparent text-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          Products Catalog
        </button>
        <button
          className={`nav-link fw-semibold px-4 py-2.5 rounded-top border-0 ${activeTab === 'orders' ? 'active bg-dark text-light' : 'bg-transparent text-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders Management
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          <Button
            variant="dark"
            className="mb-4 px-4 py-2 fw-semibold"
            onClick={() => openProductModal('add')}
            disabled={addProduct.isPending || editProduct.isPending || deleteProduct.isPending}
          >
            + Add Product
          </Button>

          <div className="table-responsive rounded shadow-sm">
            <table className="table table-bordered align-middle bg-white">
              <thead className="table-light text-center">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Image</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {isProductsLoading ? (
                  <tr><td colSpan="7">Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="7">No products found.</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.discount || '-'}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">
                          {(product.section || '').replace('-', ' ')}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => openProductModal('edit', product)}
                          disabled={addProduct.isPending || editProduct.isPending || deleteProduct.isPending}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          disabled={addProduct.isPending || editProduct.isPending || deleteProduct.isPending}
                        >
                          {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <>
          {/* Controls */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-5">
              <Form.Control
                type="text"
                placeholder="Search by Order ID, name, or email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <Form.Select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Form.Select>
            </div>
            <div className="col-6 col-md-4">
              <Form.Select
                value={orderSort}
                onChange={(e) => setOrderSort(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="highest-total">Sort by: Highest Total</option>
              </Form.Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="table-responsive rounded shadow-sm">
            <table className="table table-bordered align-middle bg-white">
              <thead className="table-light text-center">
                <tr>
                  <th>Order ID</th>
                  <th>Placed On</th>
                  <th>Customer Details</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {isOrdersLoading ? (
                  <tr><td colSpan="6">Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan="6">No orders found.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-mono small text-muted">{order._id}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="text-start">
                        <div className="fw-semibold text-dark">{order.shippingAddress?.name || 'Guest User'}</div>
                        <div className="small text-muted">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="fw-semibold">${Number(order.totalPrice || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)} text-capitalize px-3 py-2 rounded-pill`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => openOrderDetails(order)}
                          >
                            Inspect Details
                          </Button>
                          <Form.Select
                            size="sm"
                            style={{ width: '135px' }}
                            value={order.status || 'pending'}
                            onChange={(e) => updateStatusMutation.mutate({ id: order._id, status: e.target.value })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Product Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          if (!addProduct.isPending && !editProduct.isPending) {
            setShowModal(false);
          }
        }}
        centered
        backdrop={addProduct.isPending || editProduct.isPending ? 'static' : true}
        keyboard={!(addProduct.isPending || editProduct.isPending)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">{modalType === 'add' ? 'Add Product' : 'Edit Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="prodName">Name</Form.Label>
              <Form.Control id="prodName" name="name" value={currentProduct.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="prodPrice">Price</Form.Label>
              <Form.Control id="prodPrice" name="price" type="number" value={currentProduct.price} onChange={handleChange} required min="0" step="0.01" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="prodDiscount">Discount <span className="text-muted">(optional)</span></Form.Label>
              <Form.Control id="prodDiscount" name="discount" value={currentProduct.discount} onChange={handleChange} placeholder="e.g. 20% or 10" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="prodImage">Image URL</Form.Label>
              <Form.Control id="prodImage" name="image" value={currentProduct.image} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="prodSection">Section</Form.Label>
              <Form.Select id="prodSection" name="section" value={currentProduct.section} onChange={handleChange}>
                <option value="new-arrivals">New Arrivals</option>
                <option value="top-selling">Top Selling</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={addProduct.isPending || editProduct.isPending}>
              Cancel
            </Button>
            <Button
              variant="dark"
              type="submit"
              disabled={addProduct.isPending || editProduct.isPending}
            >
              {addProduct.isPending || editProduct.isPending ? 'Saving...' : (modalType === 'add' ? 'Add' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Order Details Inspect Modal */}
      {selectedOrder && (
        <Modal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Order Inspection Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <h6 className="fw-bold text-dark border-bottom pb-2">Shipping Information</h6>
                <div className="mb-1"><span className="text-muted">Name:</span> {selectedOrder.shippingAddress?.fullName || 'N/A'}</div>
                <div className="mb-1"><span className="text-muted">Phone:</span> {selectedOrder.shippingAddress?.phone || 'N/A'}</div>
                <div className="mb-1"><span className="text-muted">Address:</span> {selectedOrder.shippingAddress?.address || 'N/A'}</div>
                <div className="mb-1"><span className="text-muted">City/Country:</span> {`${selectedOrder.shippingAddress?.city || ''}, ${selectedOrder.shippingAddress?.country || ''}`}</div>
                <div><span className="text-muted">Zip Code:</span> {selectedOrder.shippingAddress?.zipCode || 'N/A'}</div>
              </div>
              <div className="col-12 col-md-6">
                <h6 className="fw-bold text-dark border-bottom pb-2">Order Calculations</h6>
                <div className="mb-1 d-flex justify-content-between">
                  <span className="text-muted">Subtotal:</span>
                  <span>${Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="mb-1 d-flex justify-content-between">
                  <span className="text-muted">Shipping cost:</span>
                  <span>${Number(selectedOrder.shippingFee || 0).toFixed(2)}</span>
                </div>
                <div className="mb-1 d-flex justify-content-between">
                  <span className="text-muted">Tax (8%):</span>
                  <span>${Number(selectedOrder.tax || 0).toFixed(2)}</span>
                </div>
                <div className="fw-bold fs-5 d-flex justify-content-between text-dark pt-2 border-top">
                  <span>Total Paid:</span>
                  <span>${Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <h6 className="fw-bold text-dark border-bottom pb-2">Ordered Items Details</h6>
            <div className="table-responsive">
              <table className="table table-bordered align-middle bg-white text-center">
                <thead className="table-light">
                  <tr>
                    <th>Item Summary</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.orderItems || []).map((item, idx) => (
                    <tr key={`order-item-${idx}`}>
                      <td className="text-start">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <span className="fw-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td>{item.color || 'Default'}</td>
                      <td>{item.size || 'M'}</td>
                      <td>{item.quantity || item.qty}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={() => setShowOrderModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;
