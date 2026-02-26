import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  AddCircleOutline,
  ShieldOutlined,
  CategoryOutlined,
  TagOutlined,
  Inventory2Outlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import '../../styles/formStyles.css';

const ppeCategories = [
  { value: 'Head Protection', label: 'Head', desc: 'Helmets & hard hats', emoji: '🪖', bg: '#dbeafe' },
  { value: 'Foot Protection', label: 'Foot', desc: 'Boots & toe guards', emoji: '🥾', bg: '#fef9c3' },
  { value: 'Body Protection', label: 'Body', desc: 'Vests & jackets', emoji: '🦺', bg: '#dcfce7' },
];

const zones = ['ZONE-001', 'ZONE-002', 'ZONE-003', 'ZONE-004'];

const AddPPEItem = () => {
  const [form, setForm] = useState({
    itemId: '',
    itemName: '',
    categories: [],
    quantity: '',
    zone: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const validate = () => {
    const newErrors = {};
    if (!form.itemId.trim()) newErrors.itemId = 'Item ID is required';
    if (!form.itemName.trim()) newErrors.itemName = 'Item Name is required';
    if (form.categories.length === 0) newErrors.categories = 'Please select at least one category';
    if (!form.quantity) newErrors.quantity = 'Quantity is required';
    else if (isNaN(form.quantity) || Number(form.quantity) < 0)
      newErrors.quantity = 'Enter a valid quantity (0 or more)';
    if (!form.zone) newErrors.zone = 'Please select a zone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('PPE item added:', form);
    setSnackbar({ open: true, message: `"${form.itemName}" added successfully!`, severity: 'success' });
    setForm({ itemId: '', itemName: '', categories: [], quantity: '', zone: '' });
    setErrors({});
  };

  const handleReset = () => {
    setForm({ itemId: '', itemName: '', categories: [], quantity: '', zone: '' });
    setErrors({});
  };

  return (
    <div className="form-page">
      <div className="form-page-header">
        <p className="form-page-subtitle">Register a new Personal Protective Equipment item into the system.</p>
      </div>

      <div className="form-card">
        <div className="form-section-header">
          <ShieldOutlined style={{ color: '#3b82f6', fontSize: 20 }} />
          <p className="form-section-title">PPE Item Information</p>
        </div>
        <hr className="form-section-divider" />

        <form onSubmit={handleSubmit}>

          {/* Row 1: Item ID + Item Name */}
          <div className="form-grid" style={{ marginBottom: 22 }}>
            <div className="form-field">
              <label className="form-label">
                <span className="label-icon"><TagOutlined style={{ fontSize: 16 }} /></span>
                Item ID <span className="required-star">*</span>
              </label>
              <input
                className={`form-input${errors.itemId ? ' error' : ''}`}
                placeholder="e.g. PPE-001"
                value={form.itemId}
                onChange={set('itemId')}
              />
              <p className={`form-helper${errors.itemId ? ' error-text' : ''}`}>
                {errors.itemId || 'Unique identifier for the PPE item'}
              </p>
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-icon"><Inventory2Outlined style={{ fontSize: 16 }} /></span>
                Item Name <span className="required-star">*</span>
              </label>
              <input
                className={`form-input${errors.itemName ? ' error' : ''}`}
                placeholder="e.g. Safety Helmet"
                value={form.itemName}
                onChange={set('itemName')}
              />
              <p className={`form-helper${errors.itemName ? ' error-text' : ''}`}>
                {errors.itemName || 'Descriptive name of the PPE item'}
              </p>
            </div>
          </div>

          {/* Category cards */}
          <div className="form-field" style={{ marginBottom: 22 }}>
            <label className="form-label">
              <span className="label-icon"><CategoryOutlined style={{ fontSize: 16 }} /></span>
              Select Category <span className="required-star">*</span>
            </label>
            <div className="card-select-grid cols-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {ppeCategories.map((cat) => (
                <div
                  key={cat.value}
                  className={`type-card${form.categories.includes(cat.value) ? ' selected' : ''}`}
                  onClick={() => {
                    const already = form.categories.includes(cat.value);
                    const updated = already
                      ? form.categories.filter((c) => c !== cat.value)
                      : [...form.categories, cat.value];
                    setForm({ ...form, categories: updated });
                    setErrors({ ...errors, categories: '' });
                  }}
                >
                  <div className="type-card-icon" style={{ backgroundColor: cat.bg, fontSize: 30 }}>
                    {cat.emoji}
                  </div>
                  <p className="type-card-name">{cat.label}</p>
                  <p className="type-card-desc">{cat.desc}</p>
                </div>
              ))}
            </div>
            {errors.categories && <p className="form-helper error-text">{errors.categories}</p>}
          </div>

          {/* Row 2: Quantity + Zone */}
          <div className="form-grid" style={{ marginBottom: 22 }}>
            <div className="form-field">
              <label className="form-label">
                <span className="label-icon"><ShieldOutlined style={{ fontSize: 16 }} /></span>
                Quantity <span className="required-star">*</span>
              </label>
              <input
                type="number"
                min="0"
                className={`form-input${errors.quantity ? ' error' : ''}`}
                placeholder="e.g. 50"
                value={form.quantity}
                onChange={set('quantity')}
              />
              <p className={`form-helper${errors.quantity ? ' error-text' : ''}`}>
                {errors.quantity || 'Number of units available'}
              </p>
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-icon"><LocationOnOutlined style={{ fontSize: 16 }} /></span>
                Assign to Zone <span className="required-star">*</span>
              </label>
              <select
                className={`form-select${errors.zone ? ' error' : ''}`}
                value={form.zone}
                onChange={(e) => { setForm({ ...form, zone: e.target.value }); setErrors({ ...errors, zone: '' }); }}
              >
                <option value="" disabled>Select a zone...</option>
                {zones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <p className={`form-helper${errors.zone ? ' error-text' : ''}`}>
                {errors.zone || 'Warehouse zone to store this item'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={handleReset}>
              ↩ Reset
            </button>
            <button type="submit" className="btn btn-primary">
              <AddCircleOutline style={{ fontSize: 18 }} />
              Add PPE Item
            </button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: '8px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddPPEItem;
