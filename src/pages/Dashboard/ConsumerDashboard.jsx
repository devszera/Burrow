import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchRequests } from '../../services/api';

const ConsumerDashboard = () => {
  const { state } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      if (!state.user?.id) return;
      setIsLoading(true);
      setError('');

      try {
        const { requests: apiRequests } = await fetchRequests({ userId: state.user.id });
        setRequests(apiRequests || []);
      } catch (err) {
        setError(err.message || 'Unable to load your requests.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [state.user]);

  const stats = useMemo(() => {
    return {
      active: requests.filter((req) => !['delivered', 'rejected'].includes(req.status)).length,
      pending: requests.filter((req) => ['submitted', 'approval_pending', 'payment_pending'].includes(req.status)).length,
      completed: requests.filter((req) => req.status === 'delivered').length,
    };
  }, [requests]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
      case 'approval_pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'approved':
      case 'parcel_arrived':
      case 'in_storage':
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            In Progress
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Delivered
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {state.user?.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your deliveries and schedule new requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/new-request"
              className="flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Request
            </Link>

            <Link
              to="/track"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Track Parcel
            </Link>

            <Link
              to="/schedule"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Clock className="h-5 w-5 mr-2" />
              Schedule Delivery
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
          </div>

          {isLoading ? (
            <div className="px-6 py-8 text-center text-gray-600">Loading your requests...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.length > 0 ? (
                requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {request.orderNumber}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {request.productDescription}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Scheduled: {new Date(request.scheduledDeliveryDate).toLocaleDateString()} at {request.deliveryTimeSlot}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/request/${request.id}`}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No requests yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Create your first delivery request to get started
                  </p>
                  <Link
                    to="/new-request"
                    className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Request
                  </Link>
                </div>
              )}
            </div>
          )}

          {!isLoading && requests.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link
                to="/orders"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View all requests →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
