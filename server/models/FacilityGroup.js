const mongoose = require('mongoose');

const FacilityGroupSchema = new mongoose.Schema({
    name: {
        type: String
    },
    facilities: [{
        
    }],
},
{
    timestamps: true
});

module.exports = FacilityGroup = mongoose.model('facilityGroup', FacilityGroupSchema);