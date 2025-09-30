import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const paymentDetailsSchema = new mongoose.Schema(
  {
    baseHandlingFee: { type: Number, default: 0 },
    storageFee: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'pending' },
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    productDescription: { type: String, required: true, trim: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    originalETA: { type: Date, required: true },
    scheduledDeliveryDate: { type: Date, required: true },
    deliveryTimeSlot: { type: String, required: true },
    destinationAddress: { type: addressSchema, required: true },
    status: { type: String, default: 'submitted' },
    statusHistory: { type: [statusHistorySchema], default: [] },
    paymentDetails: { type: paymentDetailsSchema, default: () => ({}) },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

requestSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.userId = ret.user?._id ? ret.user._id.toString() : ret.user?.toString();
    if (ret.warehouse?._id) {
      ret.warehouseId = ret.warehouse._id.toString();
    }
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Request', requestSchema);
