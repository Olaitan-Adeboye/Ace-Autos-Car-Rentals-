const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const { verifyAdmin } = require('./middleware/auth');

// CREATE a new car
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 SEARCH by make and model (query params: ?make=Toyota&model=Camry)
router.get('/search', async (req, res) => {
  try {
    const { make, model } = req.query;
    const query = {};

    if (make) query.make = new RegExp(make, 'i'); // make it case insensitive
    if (model) query.model = new RegExp(model, 'i');

    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a car by ID
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCar) return res.status(404).json({ message: 'Car not found' });
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a car by ID
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
