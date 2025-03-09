const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
  created: {
    type: Number,
    default: function () {
      return new Date().valueOf()
    },
    required: [true, 'Erstellungsdatum konnte nicht übernommen werden'],
    immutable: true
  },
  user: {
    type: {},
    required: [true, 'Benutzer konnte nicht übernommen werden'],
    immutable: true
  },
  station_phone: {
    type: String,
    maxLength: 100,
    required: [true, 'Telefonnummer konnte nicht übernommen werden']
  },
  patient_firstname: {
    type: String,
    maxLength: 100,
    required: [true, 'Vorname konnte nicht übernommen werden'],
    immutable: true
  },
  patient_lastname: {
    type: String,
    maxLength: 100,
    required: [true, 'Nachname konnte nicht übernommen werden'],
    immutable: true
  },
  case_number: {
    type: String,
    maxLength: 100,
    immutable: true
  },
  with_return: {
    type: String,
    maxLength: 100,
    required: [true, 'Hin-/Rückfahrt konnte nicht übernommen werden'],
    immutable: true
  },
  fastest_arrival: {
    type: Boolean,
    immutable: true
  },
  arrival_time_from: {
    type: Number,
  },
  arrival_time_to: {
    type: Number,
  },
  arrival_clinic: {
    type: String,
    maxLength: 100,
    required: [true, 'Ihr Klinikname konnte nicht übernommen werden'],
    immutable: true
  },
  arrival_adress: {
    type: {},
    maxLength: 100,
    required: [true, 'Ihre Klinikadresse konnte nicht übernommen werden'],
    immutable: true
  },
  arrival_station: {
    type: String,
    maxLength: 100,
    required: [true, 'Ihr Stationsname konnte nicht übernommen werden'],
    immutable: true
  },
  destination_name: {
    type: String,
    maxLength: 100,
    required: [true, 'Zielort Name konnte nicht übernommen werden'],
    immutable: true
  },
  destination_adress: {
    type: {},
    maxLength: 100,
    required: [true, 'Zielort Adresse konnte nicht übernommen werden'],
    immutable: true
  },
  destination_station: {
    type: String,
    maxLength: 100,
    immutable: true
  },
  barrier_free: {
    type: String,
    enum: { 
      values: ['ja', 'nein'],
      message: '"{VALUE}" ist keine gültige Angabe'
    },
    required: [true, 'Feld "Barrierefrei/Fahrstuhl" konnte nicht übernommen werden'],
    immutable: true
  },
  treatment_appointment_time: {
    type: String,
    maxLength: 100,
    immutable: true
  },
  patient_mobility: {
    type: String,
    enum: { 
      values: ['gehfähig', 'sitzend', 'liegend'],
      message: '"{VALUE}" ist keine gültige Angabe'
    },
    required: [true, 'Feld "Mobilität" konnte nicht übernommen werden'],
    immutable: true
  },
  medical_care: {
    type: String,
    enum: { 
      values: ['ja', 'nein'],
      message: '"{VALUE}" ist keine gültige Angabe'
    },
    required: [true, 'Feld "Med. Betreuung" konnte nicht übernommen werden'],
    immutable: true
  },
  patient_oxygen: {
    type: String,
    maxLength: 100,
    required: [true, 'Feld "Sauerstoff" konnte nicht übernommen werden'],
    immutable: true
  },
  patient_infection: {
    type: String,
    maxLength: 100,
    required: [true, 'Feld "Infektion" konnte nicht übernommen werden'],
    immutable: true
  },
  patient_overweight: {
    type: String,
    enum: { 
      values: ['< 100kg', '100kg bis 130kg', '> 130kg'],
      message: '"{VALUE}" ist keine gültige Angabe'
    },
    required: [true, 'Feld "Adipositas" konnte nicht übernommen werden'],
    immutable: true
  },
  patient_companion: {
    type: String,
    enum: { 
      values: ['ohne', 'mit Begleitperson', 'mit Kind'],
      message: '"{VALUE}" ist keine gültige Angabe'
    },
    required: [true, 'Feld "Begleitung" konnte nicht übernommen werden'],
    immutable: true
  },
  note: {
    type: String,
    maxLength: 500,
  },
  state: {
    type: Number,
    default: 10,
    required: true
  }
},
{
    timestamps: true
});

module.exports = Transport = mongoose.model('transport', TransportSchema);