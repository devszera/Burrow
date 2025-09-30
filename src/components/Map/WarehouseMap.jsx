import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Navigation } from 'lucide-react';
import { fetchWarehouses } from '../../services/api';

const WarehouseMap = ({ onWarehouseSelect, selectedWarehouseId }) => {
  const [userLocation, setUserLocation] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWarehouses = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { warehouses: apiWarehouses } = await fetchWarehouses();
        setWarehouses(apiWarehouses || []);
      } catch (err) {
        setError(err.message || 'Unable to load warehouses.');
      } finally {
        setIsLoading(false);
      }
    };

    loadWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    if (!userLocation) return warehouses;
    const term = userLocation.toLowerCase();
    return warehouses.filter((warehouse) =>
      [warehouse.name, warehouse.address]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [userLocation, warehouses]);

  const handleLocationSearch = () => {
    setUserLocation((value) => value.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Nearby Warehouses</h3>

        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter your location (city, pincode, area)"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleLocationSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg h-64 mb-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-2" />
          <p>Interactive Map View</p>
          <p className="text-sm">(Map integration with Leaflet/Google Maps)</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-600 text-sm">Loading warehouses...</p>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Nearby Warehouses</h4>

          {filteredWarehouses.length === 0 && (
            <p className="text-sm text-gray-600">No warehouses match your search just yet.</p>
          )}

          {filteredWarehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedWarehouseId === warehouse.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onWarehouseSelect?.(warehouse)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{warehouse.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{warehouse.address}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Capacity: {warehouse.capacity}</span>
                    <span>Hours: {warehouse.operatingHours}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarehouseMap;

WarehouseMap.propTypes = {
  onWarehouseSelect: PropTypes.func,
  selectedWarehouseId: PropTypes.string,
};
