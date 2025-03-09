const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode')
const fs = require('fs')

// PROTECTED ROUTE
const verifyJWT = require('../../middleware/verifyJWT')
router.use(verifyJWT)

// Load transport model
const Transport = require('../../models/Transport');

// @route GET api/transports
// @description Get all transports
// @access Protected
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader.split(' ')[1]
  const decodedJWT = jwtDecode(token)
  const user = decodedJWT.UserInfo
  
  // alte abgeschlossene ausblenden
  let find = {}
  const maxHoursOld = 8
  const cutoff = new Date(Date.now() - maxHoursOld * 60 * 60 * 1000)

  // bei Stationen nur für die jeweilige Station anzeigen
  if(user.roles.includes('4305') || user.roles.includes('5150'))
    find = {
      'user.username': user.username,
      $or: [ {'state': {$lt: 50}}, {'createdAt': {$gt: cutoff}} ]
    }

  Transport.find(find).sort({created: 'desc'})
    .then(transports => res.json(transports))
    .catch(err => res.status(404).json({ notransportsfound: 'No transports found' }));
});

// @route GET api/transports/:id
// @description Get single transport by id
// @access Protected
router.get('/:id', (req, res) => {

  const authHeader = req.headers['authorization']
  const token = authHeader.split(' ')[1]
  const decodedJWT = jwtDecode(token)
  const user = decodedJWT.UserInfo
  
  let find = {}
  if(user.roles.includes('4305'))
    find = {'user.username': user.username, '_id': req.params.id}
  if(user.roles.includes('7459'))
    find = {'_id': req.params.id}

  Transport.findOne(find)
    .then(transport => res.json(transport))
    .catch(err => res.status(404).json({ notransportfound: 'No transport found' }));
});

// @route POST api/transports
// @description add transport
// @access Protected
router.post('/', (req, res) => {
  Transport.create(req.body)
    .then(transport => {
      res.json({ message: 'Ihr Auftrag wurde versendet. Vielen Dank.', transport })

      // datei im web-to-cpl ordner erstellen
      const dir = process.env.CPL_TRANSFER_URL
      const filename = new Date().valueOf()
      let content = JSON.stringify(transport)
      fs.writeFile(`${dir}/${filename}.txt`, content, err => {
        if(err) {
          //TODO: Handle error
          console.log(err)
        }
        // file written successfully
      })
    })
    .catch(err => res.status(400).json({ message: 'Ein Fehler ist aufgetreten.', error: err }));
});

// @route PUT api/transports/:id
// @description Update transport
// @access Protected
router.put('/:id', (req, res) => {
  Transport.findByIdAndUpdate(req.params.id, req.body)
    .then(transport => {
      res.json({ message: 'Update erfolgreich' })

      // datei im web-to-cpl ordner erstellen
      const dir = process.env.CPL_TRANSFER_URL
      const filename = new Date().valueOf()
      let content = JSON.stringify(transport)
      fs.writeFile(`${dir}/${filename}.txt`, content, err => {
        if(err) {
          //TODO: Handle error
          console.log(err)
        }
        // file written successfully
      })
    })
    .catch(err => {
      res.status(400).json({ error: 'Unable to update the Database' })
    }
      
    );
});

// @route DELETE api/transports/:id
// @description Delete transport by id
// @access Protected
router.delete('/:id', (req, res) => {
  Transport.findByIdAndRemove(req.params.id, req.body)
    .then(transport => {
      res.json({ message: 'transport entry deleted successfully' })
    })
    .catch(err => {
      res.status(404).json({ error: 'No such a transport' }
    )}
    )
});

module.exports = router;