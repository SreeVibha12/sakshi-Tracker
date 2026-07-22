const express = require('express');
const router = express.Router();
const Period = require('../models/Period');
const auth = require('../middleware/auth');

/**
 * GET all periods for logged-in user
 */
router.get('/', auth, async (req, res) => {
  try {
    const periods = await Period.find({ userId: req.user.id }).sort({
      startDate: -1
    });

    res.json(periods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * CREATE new period
 */
router.post('/', auth, async (req, res) => {
  try {
    const period = new Period({
      ...req.body,
      userId: req.user.id
    });

    await period.save();

    res.json(period);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * DELETE period
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);

    if (!period) {
      return res.status(404).json({
        msg: 'Period not found'
      });
    }

    if (period.userId.toString() !== req.user.id) {
      return res.status(403).json({
        msg: 'Not authorized'
      });
    }

    await period.deleteOne();

    res.json({
      msg: 'Period deleted'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: 'Server error'
    });
  }
});

/**
 * GET predictions
 */
router.get('/predictions', auth, async (req, res) => {

  try {

    const periods = await Period.find({
      userId: req.user.id
    }).sort({
      startDate: -1
    });

    // Remove duplicate start dates
    const uniquePeriods = periods.filter((period, index, self) =>
      index === self.findIndex(
        p =>
          new Date(p.startDate).toDateString() ===
          new Date(period.startDate).toDateString()
      )
    );

    let avg = 28;

    if (uniquePeriods.length > 1) {

      let total = 0;
      let count = 0;

      for (let i = 1; i < uniquePeriods.length; i++) {

        const diff = Math.round(

          (
            new Date(uniquePeriods[i - 1].startDate) -
            new Date(uniquePeriods[i].startDate)
          ) / (1000 * 60 * 60 * 24)

        );

        if (diff > 0) {

          total += diff;
          count++;

        }

      }

      if (count > 0) {

        avg = Math.round(total / count);

      }

    }

    let nextPeriod = null;

    if (uniquePeriods.length > 0) {

      const latest = new Date(uniquePeriods[0].startDate);

      latest.setDate(latest.getDate() + avg);

      nextPeriod = latest.toISOString().split('T')[0];

    }

    res.json({

      avgCycle: avg,

      nextPeriod

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      msg: 'Server error'

    });

  }

});

module.exports = router;