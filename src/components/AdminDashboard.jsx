import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const API_URL = 'https://6888080aadf0e59551b8d6e4.mockapi.io/api/v1/products';

const emptyProduct = {
  name: '',
  price: '',
  image: '',
  section: 'new-arrivals',
  discount: '',
};

function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProduct, setCurrentProduct] = useState(emptyProduct);
  const [originalProduct, setOriginalProduct] = useState(emptyProduct);

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });

  const addProduct = useMutation({
    mutationFn: (newProduct) => axios.post(API_URL, newProduct),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Product added successfully!');
      queryClient.invalidateQueries(['products']);
      setShowModal(false);
      setCurrentProduct(emptyProduct);
    },
    onError: (error) => {
      console.error('Add product error:', error);
      toast.dismiss();
      toast.error('Failed to add product.');
    },
  });

  const editProduct = useMutation({
    mutationFn: (updatedProduct) =>
      axios.put(`${API_URL}/${updatedProduct.id}`, updatedProduct),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries(['products']);
      setShowModal(false);
      setCurrentProduct(emptyProduct);
    },
    onError: (error) => {
      console.error('Edit product error:', error);
      toast.dismiss();
      toast.error('Failed to update product.');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      console.error('Delete product error:', error);
      toast.dismiss();
      toast.error('Failed to delete product.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // منع التكرار أثناء التحميل
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
    // منع التكرار أثناء التحميل
    if (deleteProduct.isPending) {
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id);
    }
  };

  const openModal = (type, product = emptyProduct) => {
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

  return (
    <div className="container py-5" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#121212' }}>Admin Dashboard</h2>
        <Link to="/" className="btn btn-outline-dark">← Home</Link>
      </div>

      <Button 
        variant="dark" 
        className="mb-4 px-4 py-2 fw-semibold" 
        onClick={() => openModal('add')}
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
            {isLoading ? (
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
                      {product.section.replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="me-2" 
                      onClick={() => openModal('edit', product)}
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

      {/* Modal */}
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
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={currentProduct.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={currentProduct.price} onChange={handleChange} required min="0" step="0.01" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount <span className="text-muted">(optional)</span></Form.Label>
              <Form.Control name="discount" value={currentProduct.discount} onChange={handleChange} placeholder="e.g. 20% or 10" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control name="image" value={currentProduct.image} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Select name="section" value={currentProduct.section} onChange={handleChange}>
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
    </div>
  );
}

export default AdminDashboard;
