import express from 'express';
import Request from '../models/Request.js';
import Warehouse from '../models/Warehouse.js';
import { calculateCharges } from '../utils/calculateCharges.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { userId, status } = req.query;
    const filters = {};

    if (userId) {
      filters.user = userId;
    }

    if (status) {
      filters.status = status;
    }

    const requests = await Request.find(filters)
      .populate('warehouse')
      .populate('user')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests.', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('warehouse').populate('user');
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch request.', details: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      userId,
      orderNumber,
      platform,
      productDescription,
      warehouseId,
      originalETA,
      scheduledDeliveryDate,
      deliveryTimeSlot,
      destinationAddress,
    } = req.body;

    if (!userId || !orderNumber || !platform || !productDescription || !warehouseId || !originalETA || !scheduledDeliveryDate || !deliveryTimeSlot) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const warehouseExists = await Warehouse.exists({ _id: warehouseId });
    if (!warehouseExists) {
      return res.status(400).json({ message: 'Invalid warehouse selected.' });
    }

    const charges = calculateCharges();
    const now = new Date();

    const request = await Request.create({
      user: userId,
      orderNumber,
      platform,
      productDescription,
      warehouse: warehouseId,
      originalETA,
      scheduledDeliveryDate,
      deliveryTimeSlot,
      destinationAddress,
      status: 'approval_pending',
      statusHistory: [
        { status: 'submitted', timestamp: now },
        { status: 'approval_pending', timestamp: now },
      ],
      paymentDetails: charges,
    });

    const populated = await request.populate('warehouse').populate('user');
    res.status(201).json({ request: populated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create request.', details: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    request.status = status;
    request.statusHistory.push({ status, notes, timestamp: new Date() });
    await request.save();

    const populated = await request.populate('warehouse').populate('user');
    res.json({ request: populated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.', details: error.message });
  }
});

export default router;
