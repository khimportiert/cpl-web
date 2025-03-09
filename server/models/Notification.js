const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user_from: {
        type: {},
        required: [true, 'user_from konnte nicht übernommen werden'],
        immutable: true
    },
    user_to: {
        type: {},
        required: [true, 'user_to konnte nicht übernommen werden'],
        immutable: true
    },
    transport_id: {
        type: String,
        maxLength: 100,
        required: [true, 'Transport ID konnte nicht übernommen werden'],
        immutable: true
    },
    transport_patient_firstname: {
        type: String,
        maxLength: 100,
        required: [true, 'Patientenvorname konnte nicht übernommen werden'],
        immutable: true
    },
    transport_patient_lastname: {
        type: String,
        maxLength: 100,
        required: [true, 'Patientennachname konnte nicht übernommen werden'],
        immutable: true
    },
    is_new: {
        type: Boolean,
        default: true,
        required: true,
    },
    transport_state: {
        type: Number,
        min: 0,
        max: 100,
        required: function() {
            return !(this.message)
        }
    },
    message: {
        type: String,
        maxLength: 500,
        required: function() {
            return !(this.transport_state)
        }
    },
},
{
    timestamps: true
});

module.exports = Notification = mongoose.model('notification', NotificationSchema);