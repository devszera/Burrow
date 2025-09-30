import React, { useState } from 'react';
import { Package, Search, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../lib/api';

const TrackRequest = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedOrderNumber = orderNumber.trim();

    if (!trimmedOrderNumber) {
      setError('Please enter an order number to track.');
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ orderNumber: trimmedOrderNumber });
      const data = await apiClient.get(`/requests?${params.toString()}`);
      const matches = Array.isArray(data) ? data : [];

      if (matches.length > 0) {
        navigate(`/request/${matches[0].id}`);
        return;
      }

      setError("We couldn't find a request with that order number. Please double-check and try again.");
    } catch (requestError) {
      setError(requestError.message || 'Unable to fetch delivery requests at the moment.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Track your delivery request</h1>
                <p className="text-sm text-gray-600">
                  Enter your order number to jump straight to the live status page for your delivery.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                  Order number
                </label>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="orderNumber"
                      type="text"
                      className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="e.g. BRW-2458"
                      value={orderNumber}
                      onChange={(event) => setOrderNumber(event.target.value)}
                      aria-describedby={error ? 'order-number-error' : undefined}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-transparent bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching…' : 'Track request'}
                  </button>
                </div>
              </div>
            </form>

            {error && hasSearched && (
              <div
                className="mt-6 flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                id="order-number-error"
              >
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {hasSearched && !error && (
              <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-600">
                <p className="font-medium text-gray-900">Searching for your delivery request…</p>
                <p className="mt-1 text-gray-500">You will be redirected automatically if we find a match.</p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-blue-50 px-4 py-4 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Need to create a new delivery?</span>
              </div>
              <Link to="/new-request" className="text-sm font-medium text-blue-700 hover:text-blue-600">
                Schedule a delivery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRequest;
