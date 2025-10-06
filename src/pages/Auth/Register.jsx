import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const { state, register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData);
      navigate('/dashboard');
    } catch {
      // Error handling is managed within AuthContext
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

    if (errors[event.target.name]) {
      setErrors({
        ...errors,
        [event.target.name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 page-fade">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="burrow-chip">Join Burrow</span>
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="text-burrow-text-secondary">Take control of your deliveries in minutes.</p>
        </div>

        {state.error && (
          <div className="burrow-card border-red-200/70 bg-red-50/60 p-4 text-left">
            <p className="text-red-600 text-sm">{state.error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6 fade-stagger" onSubmit={handleSubmit}>
          <div className="burrow-card p-8 space-y-5 fade-stagger">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-burrow-text-secondary" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full px-3 py-3 border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90 ${
                    errors.name ? 'border-red-300' : 'border-burrow-border'
                  }`}
                  placeholder="Full Name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-burrow-text-secondary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full px-3 py-3 border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90 ${
                    errors.email ? 'border-red-300' : 'border-burrow-border'
                  }`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-burrow-text-secondary" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`pl-10 w-full px-3 py-3 border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90 ${
                    errors.phone ? 'border-red-300' : 'border-burrow-border'
                  }`}
                  placeholder="Phone Number"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-burrow-text-secondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full px-3 py-3 border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90 ${
                    errors.password ? 'border-red-300' : 'border-burrow-border'
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-burrow-text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-burrow-text-secondary" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full px-3 py-3 border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-burrow-border'
                  }`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-burrow-text-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                className="h-4 w-4 rounded border-burrow-border text-burrow-primary focus:ring-burrow-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-burrow-text-primary">
                I agree to the{' '}
                <Link to="/terms" className="text-burrow-primary hover:text-burrow-secondary">
                  terms and conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-burrow-primary hover:text-burrow-secondary">
                  privacy policy
                </Link>
              </label>
            </div>
          </div>
          {errors.terms && <p className="text-red-600 text-xs">{errors.terms}</p>}

          <button
            type="submit"
            disabled={state.isLoading}
            className="burrow-button-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center text-sm text-burrow-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-burrow-primary hover:text-burrow-secondary font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
