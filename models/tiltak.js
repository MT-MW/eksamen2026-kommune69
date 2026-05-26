const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tiltakSchema = new Schema({
    tittel: {
        type: String,
        required: true
    },
    beskrivelse: {
        type: String,
        required: true
    },
    datoGjort: {
        type: Date,
        required: true
    },
    gjortAv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bruker',
        required: true
    },
    hendelse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hendelse',
        required: false
    }
})

const Tiltak = mongoose.model('Tiltak', tiltakSchema, 'tiltak');

module.exports = {
    Tiltak,
}