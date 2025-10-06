import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import apiClient from '../../lib/api';

const ConsumerDashboard = () => {
  const { state } = useAuth();

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      if (!state.user?.id) {
        setRequests([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ userId: state.user.id });
        const response = await apiClient.get(`/requests?${params.toString()}`);

        if (isMounted) {
          setRequests(response ?? []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError?.message || 'Unable to load your requests.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [state.user?.id]);

  const userRequests = useMemo(
    () => requests.filter(req => req.userId === state.user?.id),
    [requests, state.user?.id]
  );

  const stats = useMemo(
    () => ({
      active: userRequests.filter(req => !['delivered', 'rejected'].includes(req.status)).length,
      pending: userRequests.filter(req => ['submitted', 'approval_pending', 'payment_pending'].includes(req.status)).length,
      completed: userRequests.filter(req => req.status === 'delivered').length
    }),
    [userRequests]
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
      case 'approval_pending':
      case 'payment_pending':
      case 'reschedule_requested':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-burrow-accent/20 text-burrow-secondary">
            Pending
          </span>
        );
      case 'approved':
      case 'scheduled':
      case 'parcel_expected':
      case 'parcel_arrived':
      case 'in_storage':
      case 'preparing_dispatch':
      case 'out_for_delivery':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-burrow-primary/15 text-burrow-primary">In Progress</span>;
      case 'delivered':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            Delivered
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case 'issue_reported':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Issue Reported
          </span>
        );
      case 'cancelled':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen py-12 page-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 page-fade">
          <span className="burrow-chip">Dashboard</span>
          <h1 className="text-3xl font-bold mt-4">Welcome back, {state.user?.name}!</h1>
          <p className="text-burrow-text-secondary mt-2">Manage your deliveries and schedule new requests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 fade-stagger">
          <div className="burrow-card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-burrow-primary/10 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-burrow-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-burrow-text-secondary">Active Requests</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="burrow-card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-burrow-accent/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-burrow-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-burrow-text-secondary">Pending Approval</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="burrow-card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-burrow-text-secondary">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="burrow-card p-8 mb-10 page-fade">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/new-request"
              className="burrow-button-primary justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Request
            </Link>

            <Link
              to="/track"
              className="burrow-button-ghost"
            >
              <Package className="h-5 w-5 mr-2" />
              Track Parcel
            </Link>
          </div>
        </div>

        <div className="burrow-card page-fade overflow-hidden">
          <div className="px-6 py-5 border-b border-burrow-border bg-burrow-muted/40">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
          </div>

          <div className="divide-y divide-burrow-border/70">
            {error && (
              <div className="px-6 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">{error}</div>
            )}

            {isLoading && (
              <div className="px-6 py-4 text-sm text-burrow-text-secondary">Loading your recent requests...</div>
            )}

            {!isLoading && !error && userRequests.length > 0 ? (
              userRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-burrow-text-primary">{request.orderNumber}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-burrow-text-secondary mt-1">{request.productDescription}</p>
                      <p className="text-xs text-burrow-text-secondary mt-1">
                        Scheduled: {request.scheduledDeliveryDate ? new Date(request.scheduledDeliveryDate).toLocaleDateString() : 'TBC'}
                        {request.deliveryTimeSlot ? ` at ${request.deliveryTimeSlot}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link to={`/request/${request.id}`} className="text-burrow-primary hover:text-burrow-secondary text-sm font-medium">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : null}

            {!isLoading && !error && userRequests.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Package className="h-12 w-12 text-burrow-primary mx-auto mb-4" />
                <p className="text-burrow-text-primary">No requests yet</p>
                <p className="text-burrow-text-secondary text-sm mt-1">Create your first delivery request to get started</p>
                <Link
                  to="/new-request"
                  className="burrow-button-primary mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Link>
              </div>
            )}
          </div>

          {!isLoading && !error && userRequests.length > 5 && (
            <div className="px-6 py-4 border-t border-burrow-border bg-burrow-muted/40">
              <Link to="/orders" className="text-burrow-primary hover:text-burrow-secondary text-sm font-medium">
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
