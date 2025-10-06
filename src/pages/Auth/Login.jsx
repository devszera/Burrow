import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { state, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(formData.email, formData.password);
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 page-fade">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="burrow-chip">Welcome back</span>
          <h2 className="text-3xl font-bold">Sign in to your Burrow account</h2>
          <p className="text-burrow-text-secondary">We&apos;re glad to keep your deliveries on track.</p>
        </div>

        {state.error && (
          <div className="burrow-card border-red-200/70 bg-red-50/60 p-4 text-left">
            <p className="text-red-600 text-sm">{state.error}</p>
          </div>
        )}

        <div className="burrow-card p-5 bg-burrow-muted/60">
          <p className="text-burrow-primary text-sm font-semibold mb-2">Demo credentials for an operator view:</p>

          <p className="text-burrow-text-secondary text-xs">Operator 1: operator.one@burrow.com / OperatorDemo1</p>
          <p className="text-burrow-text-secondary text-xs">Operator 2: operator.two@burrow.com / OperatorDemo2</p>
        </div>

        <form className="mt-8 space-y-6 fade-stagger" onSubmit={handleSubmit}>
          <div className="burrow-card p-8 space-y-6">
            <div className="space-y-4 fade-stagger">
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
                    className="pl-10 w-full px-3 py-3 border border-burrow-border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90"
                    placeholder="Email address"
                  />
                </div>
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
                    className="pl-10 pr-10 w-full px-3 py-3 border border-burrow-border rounded-2xl focus:ring-2 focus:ring-burrow-primary focus:border-transparent bg-white/90"
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
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-burrow-text-secondary">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-burrow-border text-burrow-primary focus:ring-burrow-primary"
                />
                Remember me
              </label>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-burrow-primary hover:text-burrow-secondary">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="burrow-button-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center text-sm text-burrow-text-secondary">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-burrow-primary hover:text-burrow-secondary font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
