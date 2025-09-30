import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri =
  process.env.MONGODB_URI || 'mongodb+srv://dev:pass123@cluster0.dxejc33.mongodb.net/';
const dbName = process.env.MONGODB_DB_NAME || 'burrow';

const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 5000
});

let database;

const defaultWarehouses = [
  {
    id: '1',
    name: 'Burrow Delhi Hub',
    address: 'Sector 18, Noida, Uttar Pradesh 201301',
    coordinates: [28.5355, 77.391],
    capacity: 1000,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Burrow Mumbai Central',
    address: 'Andheri East, Mumbai, Maharashtra 400069',
    coordinates: [19.1136, 72.8697],
    capacity: 1200,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Burrow Bangalore Tech',
    address: 'Whitefield, Bangalore, Karnataka 560066',
    coordinates: [12.9698, 77.75],
    capacity: 800,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Burrow Chennai Port',
    address: 'OMR, Chennai, Tamil Nadu 600119',
    coordinates: [12.8406, 80.1534],
    capacity: 900,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Burrow Kolkata East',
    address: 'Salt Lake, Kolkata, West Bengal 700091',
    coordinates: [22.5726, 88.3639],
    capacity: 700,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Burrow Pune Hub',
    address: 'Hinjewadi, Pune, Maharashtra 411057',
    coordinates: [18.5879, 73.7386],
    capacity: 600,
    operatingHours: '9:00 AM - 7:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

async function connectToDatabase() {
  if (database) {
    return database;
  }

  await client.connect();
  database = client.db(dbName);

  await database.collection('requests').createIndex({ id: 1 }, { unique: true });
  await database.collection('warehouses').createIndex({ id: 1 }, { unique: true });

  const existingWarehouses = await database.collection('warehouses').countDocuments();
  if (existingWarehouses === 0) {
    await database.collection('warehouses').insertMany(defaultWarehouses);
  }

  return database;
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/warehouses', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const warehouses = await db
      .collection('warehouses')
      .find()
      .sort({ name: 1 })
      .toArray();
    res.json(warehouses);
  } catch (error) {
    next(error);
  }
});

app.post('/api/warehouses', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const data = req.body || {};

    if (!data.name || !data.address) {
      return res.status(400).json({ message: 'Warehouse name and address are required.' });
    }

    const now = new Date().toISOString();
    const warehouse = {
      id: data.id || randomUUID(),
      name: data.name,
      address: data.address,
      coordinates: data.coordinates || [0, 0],
      capacity: data.capacity ?? 0,
      operatingHours: data.operatingHours || '9:00 AM - 7:00 PM',
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };

    await db.collection('warehouses').insertOne(warehouse);
    res.status(201).json(warehouse);
  } catch (error) {
    next(error);
  }
});

app.put('/api/warehouses/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const update = { ...req.body };
    delete update.id;
    update.updatedAt = new Date().toISOString();

    const result = await db
      .collection('warehouses')
      .findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' });

    if (!result.value) {
      return res.status(404).json({ message: 'Warehouse not found.' });
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/warehouses/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const result = await db.collection('warehouses').deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Warehouse not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/requests', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const filter = {};
    const { userId, status } = req.query;

    if (userId) {
      filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    const requests = await db
      .collection('requests')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(requests);
  } catch (error) {
    next(error);
  }
});

app.get('/api/requests/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const request = await db.collection('requests').findOne({ id: req.params.id });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
});

app.post('/api/requests', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const data = req.body || {};

    const requiredFields = [
      'userId',
      'orderNumber',
      'platform',
      'productDescription',
      'warehouseId',
      'originalETA',
      'scheduledDeliveryDate',
      'deliveryTimeSlot',
      'destinationAddress'
    ];

    const missingField = requiredFields.find(field => !data[field]);
    if (missingField) {
      return res.status(400).json({ message: `Missing required field: ${missingField}` });
    }

    const now = new Date().toISOString();
    const status = data.status || 'approval_pending';
    const statusHistory = Array.isArray(data.statusHistory) && data.statusHistory.length > 0
      ? data.statusHistory
      : [
          { status: 'submitted', timestamp: now },
          { status, timestamp: now }
        ];

    const paymentDetails = {
      baseHandlingFee: data.paymentDetails?.baseHandlingFee ?? 0,
      storageFee: data.paymentDetails?.storageFee ?? 0,
      deliveryCharge: data.paymentDetails?.deliveryCharge ?? 0,
      gst: data.paymentDetails?.gst ?? 0,
      totalAmount: data.paymentDetails?.totalAmount ?? 0,
      paymentMethod: data.paymentDetails?.paymentMethod || 'online',
      paymentStatus: data.paymentDetails?.paymentStatus || 'pending'
    };

    const request = {
      id: data.id || randomUUID(),
      userId: data.userId,
      orderNumber: data.orderNumber,
      platform: data.platform,
      productDescription: data.productDescription,
      receiptUrl: data.receiptUrl || null,
      warehouseId: data.warehouseId,
      originalETA: data.originalETA,
      scheduledDeliveryDate: data.scheduledDeliveryDate,
      deliveryTimeSlot: data.deliveryTimeSlot,
      destinationAddress: data.destinationAddress,
      status,
      statusHistory,
      paymentDetails,
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now
    };

    await db.collection('requests').insertOne(request);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

app.put('/api/requests/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const update = { ...req.body };
    delete update.id;
    update.updatedAt = new Date().toISOString();

    const result = await db
      .collection('requests')
      .findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' });

    if (!result.value) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/requests/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const result = await db.collection('requests').deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', details: err.message });
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to start server', error);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await client.close();
  process.exit(0);
});
