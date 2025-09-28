const LiveReport = require('../models/LiveReport');
const Activity = require('../models/Activity');
const Upload = require('../models/Upload'); 

// Get all live reports 
exports.getAllLiveReports = async (req, res) => {
  try {
    const liveReports = await LiveReport.find()
      .populate('activity', 'name description')
      .populate('teacher', 'name email')
      .populate('photos', 'filename path originalName') // ← Populate dengan field yang benar
      .sort({ createdAt: -1 });
    
    res.json({
      message: 'Live reports retrieved successfully',
      data: liveReports
    });
  } catch (err) {
    console.error('Error getting live reports:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Get live report by ID 
exports.getLiveReportById = async (req, res) => {
  try {
    const liveReport = await LiveReport.findById(req.params.id)
      .populate('activity', 'name description')
      .populate('teacher', 'name email')
      .populate('photos', 'filename path originalName'); // ← Populate dengan field yang benar
    
    if (!liveReport) {
      return res.status(404).json({ message: 'Live report not found' });
    }
    
    res.json({
      message: 'Live report retrieved successfully',
      data: liveReport
    });
  } catch (err) {
    console.error('Error getting live report:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Get live report by ID 
exports.getLiveReportById = async (req, res) => {
  try {
    const liveReport = await LiveReport.findById(req.params.id)
      .populate('activity', 'name description')
      .populate('teacher', 'name email')
      .populate('photos', 'filename url');
    
    if (!liveReport) {
      return res.status(404).json({ message: 'Live report not found' });
    }
    
    res.json({
      message: 'Live report retrieved successfully',
      data: liveReport
    });
  } catch (err) {
    console.error('Error getting live report:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Create a new live report 
exports.createLiveReport = async (req, res) => {
  try {
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { activity, description, date } = req.body;

    // Validasi user login
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Convert activity to array if it's a string
    let activityArray = activity;
    if (typeof activity === 'string') {
      activityArray = [activity];
    } else if (Array.isArray(activity)) {
      activityArray = activity;
    } else {
      activityArray = [];
    }

    // Validate required fields
    if (!activityArray || activityArray.length === 0) {
      return res.status(400).json({ message: 'Activity is required' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Validasi activity exists
    try {
      const activityExists = await Activity.findById(activityArray[0]);
      if (!activityExists) {
        return res.status(400).json({ message: 'Activity not found' });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid activity ID' });
    }

    // Handle photos - GUNAKAN MODEL UPLOAD
    let photosArray = [];
    if (req.file) {
      try {
        // Buat document Upload baru (sesuai dengan model Upload Anda)
        const newUpload = new Upload({
          filename: req.file.filename || req.file.originalname,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
          // uploadedBy tidak ada di schema Upload, jadi dihapus
        });
        
        const savedUpload = await newUpload.save();
        photosArray = [savedUpload._id]; // Simpan ObjectId Upload
        
        console.log('Upload created:', savedUpload._id);
      } catch (fileError) {
        console.error('Error creating upload:', fileError);
        // Lanjut tanpa photo jika error
      }
    }

    const liveReport = new LiveReport({
      activity: activityArray,
      date: new Date(date),
      description: description || '',
      photos: photosArray,
      teacher: req.user.userId
    });

    const newLiveReport = await liveReport.save();
    
    // Populate the references for better response
    await newLiveReport.populate([
      { path: 'activity', select: 'name description' },
      { path: 'teacher', select: 'name email' },
      { path: 'photos', select: 'filename path originalName' } // Populate photos dengan data Upload
    ]);

    res.status(201).json({
      message: 'Live report created successfully',
      data: newLiveReport
    });
  } catch (err) {
    console.error('Error creating live report:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format: ' + err.message });
    }
    
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Update a live report
exports.updateLiveReport = async (req, res) => {
  try {
    const { activity, description, date } = req.body;
    
    const liveReport = await LiveReport.findById(req.params.id);
    if (!liveReport) {
      return res.status(404).json({ message: 'Live report not found' });
    }

    // Check authorization - GUNAKAN userId
    if (liveReport.teacher.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    // Update fields
    if (activity) {
      let activityArray = activity;
      if (typeof activity === 'string') {
        activityArray = [activity];
      }
      liveReport.activity = activityArray;
    }
    
    if (description) liveReport.description = description;
    if (date) liveReport.date = new Date(date);

    // Handle photo update
    if (req.file) {
      try {
        const fileUpload = new FileUpload({
          filename: req.file.originalname,
          url: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
          uploadedBy: req.user.userId  // ← GUNAKAN userId
        });
        
        const savedFile = await fileUpload.save();
        liveReport.photos.push(savedFile._id);
      } catch (fileError) {
        console.error('Error creating file upload:', fileError);
      }
    }

    const updatedLiveReport = await liveReport.save();
    
    await updatedLiveReport.populate([
      { path: 'activity', select: 'name description' },
      { path: 'teacher', select: 'name email' },
      { path: 'photos', select: 'filename url' }
    ]);

    res.json({
      message: 'Live report updated successfully',
      data: updatedLiveReport
    });
  } catch (err) {
    console.error('Error updating live report:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a live report
exports.deleteLiveReport = async (req, res) => {
  try {
    const liveReport = await LiveReport.findById(req.params.id);
    if (!liveReport) {
      return res.status(404).json({ message: 'Live report not found' });
    }

    // Check authorization - GUNAKAN userId
    if (liveReport.teacher.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await liveReport.deleteOne();
    res.json({ message: 'Live report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};