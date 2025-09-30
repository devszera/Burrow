import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Loader2, Trash2 } from 'lucide-react';
import { Request, RequestStatus } from '../../types';
import { api } from '../../services/api';

const OperatorDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [mutatingRequestId, setMutatingRequestId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getRequests();
        if (!ignore) {
          setRequests(data);
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Failed to load requests';
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      ignore = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (!selectedRequest) {
      return;
    }

    const latest = requests.find(req => req.id === selectedRequest.id);
    if (latest && latest.updatedAt !== selectedRequest.updatedAt) {
      setSelectedRequest(latest);
    }
  }, [requests, selectedRequest]);

  const handleRetry = () => setReloadToken(prev => prev + 1);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(req => req.status === 'approval_pending').length,
    approved: requests.filter(req => req.status === 'approved').length,
    delivered: requests.filter(req => req.status === 'delivered').length
  };

  const getStatusBadge = (status: RequestStatus) => {
    const config = {
      submitted: { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      payment_pending: { color: 'bg-amber-100 text-amber-800', label: 'Payment Pending' },
      approval_pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      parcel_expected: { color: 'bg-indigo-100 text-indigo-800', label: 'Parcel Expected' },
      parcel_arrived: { color: 'bg-blue-100 text-blue-800', label: 'Arrived' },
      in_storage: { color: 'bg-purple-100 text-purple-800', label: 'In Storage' },
      preparing_dispatch: { color: 'bg-cyan-100 text-cyan-800', label: 'Preparing Dispatch' },
      out_for_delivery: { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      issue_reported: { color: 'bg-rose-100 text-rose-800', label: 'Issue Reported' }
    };

    const statusConfig = config[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  };

  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
    const request = requests.find(req => req.id === requestId);
    if (!request || request.status === newStatus) {
      return;
    }

    setMutatingRequestId(requestId);
    setActionError(null);

    const lastStatus = request.statusHistory[request.statusHistory.length - 1];
    const statusHistory =
      lastStatus && lastStatus.status === newStatus
        ? request.statusHistory
        : [
            ...request.statusHistory,
            { status: newStatus, timestamp: new Date().toISOString() }
          ];

    try {
      const updatedRequest = await api.updateRequest(requestId, {
        status: newStatus,
        statusHistory
      });

      setRequests(prev => prev.map(req => (req.id === requestId ? updatedRequest : req)));
      setSelectedRequest(prev => (prev && prev.id === requestId ? updatedRequest : prev));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update request';
      setActionError(message);
    } finally {
      setMutatingRequestId(null);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    setMutatingRequestId(requestId);
    setActionError(null);

    try {
      await api.deleteRequest(requestId);
      setRequests(prev => prev.filter(req => req.id !== requestId));
      setSelectedRequest(prev => (prev && prev.id === requestId ? null : prev));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete request';
      setActionError(message);
    } finally {
      setMutatingRequestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Operator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
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
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="approval_pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="parcel_arrived">Parcel Arrived</option>
                  <option value="in_storage">In Storage</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Requests</h2>
          </div>

          {actionError && (
            <div className="px-6 py-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
              {actionError}
            </div>
          )}

          {isLoading ? (
            <div className="px-6 py-10 text-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center">
              <p className="text-red-600 font-medium">Failed to load requests</p>
              <p className="text-gray-500 text-sm mt-1">{error}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => {
                      const isUpdatingRequest = mutatingRequestId === request.id;

                      return (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{request.id}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{request.orderNumber}</div>
                            <div className="text-sm text-gray-500">{request.platform}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {request.productDescription}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(request.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(request.scheduledDeliveryDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{request.deliveryTimeSlot}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedRequest(request)}
                                disabled={isUpdatingRequest}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {request.status === 'approval_pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                                    disabled={isUpdatingRequest}
                                    className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUpdatingRequest ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                    disabled={isUpdatingRequest}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUpdatingRequest ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredRequests.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-600">No requests found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Request Details - {selectedRequest.id}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{selectedRequest.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-medium">{selectedRequest.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-medium">{selectedRequest.productDescription}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled Date:</span>
                      <span className="font-medium">
                        {new Date(selectedRequest.scheduledDeliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Slot:</span>
                      <span className="font-medium">{selectedRequest.deliveryTimeSlot}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Destination:</span>
                      <p className="font-medium mt-1">
                        {selectedRequest.destinationAddress.line1}
                        {selectedRequest.destinationAddress.line2 && `, ${selectedRequest.destinationAddress.line2}`}
                        <br />
                        {selectedRequest.destinationAddress.city}, {selectedRequest.destinationAddress.state} {selectedRequest.destinationAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusUpdate(selectedRequest.id, e.target.value as RequestStatus)}
                    disabled={mutatingRequestId === selectedRequest.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="approval_pending">Approval Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="parcel_expected">Parcel Expected</option>
                    <option value="parcel_arrived">Parcel Arrived</option>
                    <option value="in_storage">In Storage</option>
                    <option value="preparing_dispatch">Preparing Dispatch</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Add Notes</h4>
                  <textarea
                    rows={3}
                    placeholder="Add any notes or comments..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteRequest(selectedRequest.id)}
                  disabled={mutatingRequestId === selectedRequest.id}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutatingRequestId === selectedRequest.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorDashboard;