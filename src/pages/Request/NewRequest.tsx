import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Calendar, MapPin, CreditCard } from 'lucide-react';
import WarehouseMap from '../../components/Map/WarehouseMap';
import { Warehouse } from '../../types';
import { ecommercePlatforms, timeSlots } from '../../data/mockData';

interface FormData {
  orderNumber: string;
  platform: string;
  productDescription: string;
  originalETA: string;
  warehouse: Warehouse | null;
  scheduledDeliveryDate: string;
  deliveryTimeSlot: string;
  destinationAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    contactNumber: string;
  };
}

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    orderNumber: '',
    platform: '',
    productDescription: '',
    originalETA: '',
    warehouse: null,
    scheduledDeliveryDate: '',
    deliveryTimeSlot: '',
    destinationAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      contactNumber: ''
    }
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        destinationAddress: {
          ...formData.destinationAddress,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, file: 'Only PDF files are allowed' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size must be less than 5MB' });
        return;
      }
      setSelectedFile(file);
      setErrors({ ...errors, file: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.orderNumber.trim()) newErrors.orderNumber = 'Order number is required';
    if (!formData.platform) newErrors.platform = 'Platform selection is required';
    if (!formData.productDescription.trim()) newErrors.productDescription = 'Product description is required';
    if (!formData.originalETA) newErrors.originalETA = 'Original ETA is required';
    if (!formData.warehouse) newErrors.warehouse = 'Warehouse selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.scheduledDeliveryDate) newErrors.scheduledDeliveryDate = 'Delivery date is required';
    if (!formData.deliveryTimeSlot) newErrors.deliveryTimeSlot = 'Time slot is required';
    if (!formData.destinationAddress.line1.trim()) newErrors['address.line1'] = 'Address line 1 is required';
    if (!formData.destinationAddress.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.destinationAddress.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.destinationAddress.pincode.trim()) newErrors['address.pincode'] = 'Pincode is required';
    if (!formData.destinationAddress.contactNumber.trim()) newErrors['address.contactNumber'] = 'Contact number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = () => {
    // Simulate request submission
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const calculateCharges = () => {
    const baseHandlingFee = 49;
    const storageFee = 20; // Assuming 2 extra days
    const deliveryCharge = 60; // Based on distance
    const subtotal = baseHandlingFee + storageFee + deliveryCharge;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    
    return {
      baseHandlingFee,
      storageFee,
      deliveryCharge,
      subtotal,
      gst,
      total
    };
  };

  const charges = calculateCharges();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step <= currentStep ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Order Details' : step === 2 ? 'Schedule Delivery' : 'Payment'}
                </span>
                {step < 3 && (
                  <div className={`w-16 h-1 ml-4 ${
                    step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Order Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.orderNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., AMZ123456789"
                  />
                  {errors.orderNumber && <p className="text-red-600 text-xs mt-1">{errors.orderNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-commerce Platform *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.platform ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Platform</option>
                    {ecommercePlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  {errors.platform && <p className="text-red-600 text-xs mt-1">{errors.platform}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description *
                  </label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.productDescription ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the product"
                  />
                  {errors.productDescription && <p className="text-red-600 text-xs mt-1">{errors.productDescription}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="originalETA"
                    value={formData.originalETA}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.originalETA ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.originalETA && <p className="text-red-600 text-xs mt-1">{errors.originalETA}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Receipt (PDF only, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ {selectedFile.name} selected
                    </p>
                  )}
                  {errors.file && <p className="text-red-600 text-xs mt-1">{errors.file}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Warehouse</h3>
                <WarehouseMap 
                  onWarehouseSelect={(warehouse) => setFormData({ ...formData, warehouse })}
                  selectedWarehouseId={formData.warehouse?.id}
                />
                {errors.warehouse && <p className="text-red-600 text-xs mt-1">{errors.warehouse}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Delivery */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Schedule Delivery</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDeliveryDate"
                    value={formData.scheduledDeliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.scheduledDeliveryDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduledDeliveryDate && <p className="text-red-600 text-xs mt-1">{errors.scheduledDeliveryDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot *
                  </label>
                  <select
                    name="deliveryTimeSlot"
                    value={formData.deliveryTimeSlot}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deliveryTimeSlot ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.deliveryTimeSlot && <p className="text-red-600 text-xs mt-1">{errors.deliveryTimeSlot}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Destination Address</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="address.line1"
                    value={formData.destinationAddress.line1}
                    onChange={handleInputChange}
                    placeholder="Address Line 1 *"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['address.line1'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['address.line1'] && <p className="text-red-600 text-xs">{errors['address.line1']}</p>}

                  <input
                    type="text"
                    name="address.line2"
                    value={formData.destinationAddress.line2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.city"
                      value={formData.destinationAddress.city}
                      onChange={handleInputChange}
                      placeholder="City *"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors['address.city'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['address.city'] && <p className="text-red-600 text-xs">{errors['address.city']}</p>}

                    <input
                      type="text"
                      name="address.state"
                      value={formData.destinationAddress.state}
                      onChange={handleInputChange}
                      placeholder="State *"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors['address.state'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['address.state'] && <p className="text-red-600 text-xs">{errors['address.state']}</p>}
                  </div>

                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.destinationAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode *"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['address.pincode'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['address.pincode'] && <p className="text-red-600 text-xs">{errors['address.pincode']}</p>}

                  <input
                    type="text"
                    name="address.landmark"
                    value={formData.destinationAddress.landmark}
                    onChange={handleInputChange}
                    placeholder="Landmark"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="tel"
                    name="address.contactNumber"
                    value={formData.destinationAddress.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Contact Number *"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['address.contactNumber'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors['address.contactNumber'] && <p className="text-red-600 text-xs">{errors['address.contactNumber']}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Service Charges</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Handling Fee</span>
                    <span className="font-medium">₹{charges.baseHandlingFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Fee (2 extra days)</span>
                    <span className="font-medium">₹{charges.storageFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium">₹{charges.deliveryCharge}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{charges.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium">₹{charges.gst.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-blue-600">₹{charges.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-blue-600" defaultChecked />
                      <span className="ml-2">Credit/Debit Card</span>
                    </label>
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-blue-600" />
                      <span className="ml-2">UPI</span>
                    </label>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-blue-600" />
                      <span className="ml-2">Net Banking</span>
                    </label>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-blue-600" />
                      <span className="ml-2">Wallet</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Pay ₹{charges.total.toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRequest;