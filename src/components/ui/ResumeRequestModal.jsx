import React, { useState } from 'react';
import './ResumeRequestModal.css';

export default function ResumeRequestModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    reason: '',
    companyName: '',
    otherReason: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReasonChange = (e) => {
    setFormData(prev => ({
      ...prev,
      reason: e.target.value,
      companyName: '',
      otherReason: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!formData.email || !formData.name || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.reason === 'Employer' && !formData.companyName) {
      setError('Please enter your company name');
      return;
    }

    if (formData.reason === 'Others' && !formData.otherReason) {
      setError('Please specify your reason');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/resume-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setMessage('Request submitted! Please check your inbox in 2 minutes.');
      setFormData({
        email: '',
        name: '',
        reason: '',
        companyName: '',
        otherReason: '',
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="resume-modal-overlay" onClick={onClose}>
      <div className="resume-modal-content" onClick={e => e.stopPropagation()}>
        <div className="resume-modal-header">
          <h2>Request Resume</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="resume-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email here."
              required
            />
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Full Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name here."
              required
            />
          </div>

          {/* Reason Radio Buttons */}
          <div className="form-group">
            <label>Reason for Resume Request*</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="Employer"
                  checked={formData.reason === 'Employer'}
                  onChange={handleReasonChange}
                />
                Employer
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="Professor"
                  checked={formData.reason === 'Professor'}
                  onChange={handleReasonChange}
                />
                Professor
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value="Others"
                  checked={formData.reason === 'Others'}
                  onChange={handleReasonChange}
                />
                Others
              </label>
            </div>
          </div>

          {/* Conditional: Company Name for Employer */}
          {formData.reason === 'Employer' && (
            <div className="form-group">
              <label htmlFor="companyName">Company Name*</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Your Company Name"
                required={formData.reason === 'Employer'}
              />
            </div>
          )}

          {/* Conditional: Other Reason text input */}
          {formData.reason === 'Others' && (
            <div className="form-group">
              <label htmlFor="otherReason">Please Specify*</label>
              <input
                type="text"
                id="otherReason"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleInputChange}
                placeholder="Your designation and reason for resume request."
                required={formData.reason === 'Others'}
              />
            </div>
          )}

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Success Message */}
          {message && <div className="success-message">{message}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
