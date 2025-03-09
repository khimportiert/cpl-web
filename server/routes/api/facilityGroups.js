const express = require('express')
const router = express.Router()

// PROTECTED ROUTE
const verifyJWT = require('../../middleware/verifyJWT')
router.use(verifyJWT)

// Load facility group model
const FacilityGroup = require('../../models/FacilityGroup')

// @route GET api/facilities/:username
// @description Get single facility group by username
// @access Protected
router.get('/:username', (req, res) => {

    let find = {"facilities.stations.username": req.params.username}
    
    FacilityGroup.findOne(find)
        .then(facilityGroup => res.json(facilityGroup))
        .catch(err => res.status(404).json({ message: 'Keine Klinik/Station gefunden', error: err }));
});



// @route PUT api/facilities/:username
// @description Update facility group
// @access Protected
router.put('/:username', (req, res) => {
    
    let find = {"facilities.stations.username": req.params.username}

    FacilityGroup.findOneAndUpdate(find, req.body)
    .then(facility => {
        res.json({ message: 'Klinik/Station Update erfolgreich', facility })
    })
    .catch(err => {
        res.status(400).json({ error: err })
    })
})


module.exports = router;