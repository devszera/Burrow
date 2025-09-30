export const calculateCharges = () => {
  const baseHandlingFee = 49;
  const storageFee = 20;
  const deliveryCharge = 60;
  const subtotal = baseHandlingFee + storageFee + deliveryCharge;
  const gst = Number((subtotal * 0.18).toFixed(2));
  const totalAmount = Number((subtotal + gst).toFixed(2));

  return {
    baseHandlingFee,
    storageFee,
    deliveryCharge,
    gst,
    totalAmount,
    paymentStatus: 'pending',
  };
};
