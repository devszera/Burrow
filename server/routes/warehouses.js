import express from 'express';
import Warehouse from '../models/Warehouse.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const warehouses = await Warehouse.find({ isActive: true }).sort({ name: 1 });
    res.json({ warehouses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load warehouses.', details: error.message });
  }
});

export default router;
