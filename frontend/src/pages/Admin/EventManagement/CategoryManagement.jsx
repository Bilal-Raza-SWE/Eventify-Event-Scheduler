import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import './CategoryManagement.css';

const CategoryManagement = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#007bff'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = 'Category name is required';
    }
    if (!data.description.trim()) {
      errors.description = 'Description is required';
    }
    return errors;
  };

  // Handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(newCategory);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories([...categories, createdCategory]);
        setNewCategory({ name: '', description: '', icon: '', color: '#007bff' });
        setErrors({});
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Handle category update
  const handleUpdateCategory = async (categoryId) => {
    const validationErrors = validateForm(editingCategory);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCategory)
      });

      if (response.ok) {
        setCategories(categories.map(cat => 
          cat.id === categoryId ? editingCategory : cat
        ));
        setEditingCategory(null);
        setErrors({});
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setCategories(categories.filter(cat => cat.id !== categoryId));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="category-management-modal">
        <div className="modal-header">
          <h2>Category Management</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleCreateCategory} className="category-form">
          <h3>Create New Category</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  name: e.target.value
                })}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Icon (CSS Class)</label>
              <input
                type="text"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  icon: e.target.value
                })}
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  color: e.target.value
                })}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  description: e.target.value
                })}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
          </div>

          <button type="submit" className="btn-create">
            <FaPlus /> Create Category
          </button>
        </form>

        <div className="categories-list">
          <h3>Existing Categories</h3>
          <div className="categories-grid">
            {categories.map(category => (
              <div key={category.id} className="category-card">
                {editingCategory?.id === category.id ? (
                  // Edit Mode
                  <div className="category-edit-form">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        name: e.target.value
                      })}
                    />
                    <textarea
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        description: e.target.value
                      })}
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleUpdateCategory(category.id)}
                        className="btn-save"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => setEditingCategory(null)}
                        className="btn-cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div 
                      className="category-icon"
                      style={{ backgroundColor: category.color }}
                    >
                      <i className={category.icon}></i>
                    </div>
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                    <div className="category-actions">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="btn-edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn-delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;