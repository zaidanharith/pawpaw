const LiveReport = require('../models/LiveReport');



// Create new live report

exports.createLiveReport = async (req, res) => {

  try {

    const report = new LiveReport(req.body);

    await report.save();



    res.status(201).json({

      success: true,

      message: 'Live report created successfully',

      data: report

    });

  } catch (err) {

    res.status(400).json({

      success: false,

      message: 'Failed to create live report',

      error: err.message

    });

  }

};



// Get all live reports

exports.getLiveReports = async (req, res) => {

  try {

    const reports = await LiveReport.find()

      .populate('activity', 'title description') // ambil data activity

      .populate('teacher', 'name email')        // ambil data teacher (User)

      .populate('photos');                      // ambil data FileUpload



    res.status(200).json({

      success: true,

      data: reports

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: 'Failed to fetch live reports',

      error: err.message

    });

  }

};



// Get live report by ID

exports.getLiveReportById = async (req, res) => {

  try {

    const report = await LiveReport.findById(req.params.id)

      .populate('activity', 'title description')

      .populate('teacher', 'name email')

      .populate('photos');



    if (!report) {

      return res.status(404).json({

        success: false,

        message: 'Live report not found'

      });

    }



    res.status(200).json({

      success: true,

      data: report

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: 'Failed to fetch live report',

      error: err.message

    });

  }

};



// Update live report

exports.updateLiveReport = async (req, res) => {

  try {

    const report = await LiveReport.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true, runValidators: true }

    ).populate('activity', 'title description')

     .populate('teacher', 'name email')

     .populate('photos');



    if (!report) {

      return res.status(404).json({

        success: false,

        message: 'Live report not found'

      });

    }



    res.status(200).json({

      success: true,

      message: 'Live report updated successfully',

      data: report

    });

  } catch (err) {

    res.status(400).json({

      success: false,

      message: 'Failed to update live report',

      error: err.message

    });

  }

};



// Delete live report

exports.deleteLiveReport = async (req, res) => {

  try {

    const report = await LiveReport.findByIdAndDelete(req.params.id);



    if (!report) {

      return res.status(404).json({

        success: false,

        message: 'Live report not found'

      });

    }



    res.status(200).json({

      success: true,

      message: 'Live report deleted successfully'

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: 'Failed to delete live report',

      error: err.message

    });

  }

};