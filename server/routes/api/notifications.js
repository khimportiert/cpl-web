const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode')

// PROTECTED ROUTE
const verifyJWT = require('../../middleware/verifyJWT')
router.use(verifyJWT)

// Load notification model
const Notification = require('../../models/Notification');

// @route GET api/notifications
// @description Get all notifications
// @access Protected
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader.split(' ')[1]
  const decodedJWT = jwtDecode(token)
  const user = decodedJWT.UserInfo
  const maxHoursOld = 24
  const cutoff = new Date(Date.now() - maxHoursOld * 60 * 60 * 1000)
  const find = {
    'user_to': user.username,
    $or: [ {'is_new': true}, {'createdAt': {$gt: cutoff}} ]
  }

  Notification.find(find).sort({createdAt: 'desc'})
    .then(notification => res.json(notification))
    .catch(err => res.status(404).json({ message: 'No transports found', error: err }));
});

// @route GET api/notifications/:id
// @description Get single notification by id
// @access Protected
router.get('/:id', (req, res) => {
    Notification.findById(req.params.id)
    .then(notification => res.json(notification))
    .catch(err => res.status(404).json({ message: 'No notification found' }));
});

// @route POST api/notifications
// @description add notification
// @access Protected
router.post('/', (req, res) => {
    Notification.create(req.body)
    .then(notification => res.json({ message: '', notification }))
    .catch(err => res.status(400).json({ message: 'Ein Fehler ist aufgetreten.', error: err }));
});

// @route PUT api/notifications/:id
// @description Update notification
// @access Protected
router.put('/', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader.split(' ')[1]
  const decodedJWT = jwtDecode(token)
  const user = decodedJWT.UserInfo
  const find = {'user_to': user.username}

  Notification.updateMany(find, req.body)
    .then(notification => res.json({ message: 'Update erfolgreich' }))
    .catch(err => {
      res.status(400).json({ message: '', error: err })
    }
      
    );
});

// @route DELETE api/notifications/:id
// @description Delete notifications by id
// @access Protected
router.delete('/:id', (req, res) => {
    Notification.findByIdAndRemove(req.params.id, req.body)
    .then(notification => {
      res.json({ message: 'transport entry deleted successfully' })
    })
    .catch(err => {
      res.status(404).json({ message: '', error: err }
    )}
    )
});

module.exports = router;