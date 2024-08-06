const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config();

app.use(express.json());

const connectDB = require("./connectMongo");
app.use(express.static(path.join(__dirname, 'home')));

connectDB();

const DeviceModel = require("./models/book.model");
const redis = require('./redis')
// API GET để lấy tất cả dữ liệu
app.get('/data', async (req, res) => {
  try {
    const devices = await DeviceModel.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API POST để thêm dữ liệu
app.post('/data', async (req, res) => {
  try {
    const { name } = req.body;
    if (typeof name === 'string') {
      const newDevice = new DeviceModel({ name });
      await newDevice.save();
      res.status(201).json({ message: 'Data added successfully.' });
    } else {
      res.status(400).json({ message: 'Name must be a string.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API DELETE để xóa dữ liệu
app.delete('/data', async (req, res) => {
  try {
    const { name } = req.body; // Xóa theo tên thiết bị, có thể thay đổi nếu cần
    const result = await DeviceModel.deleteOne({ name });
    if (result.deletedCount > 0) {
      res.json({ message: 'Data deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Data not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
