const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hendelseSchema = new Schema({
    tittel: {
        type: String,
        required: true
    },
    beskrivelse: {
        type: String,
        required: true
    },
    tema: {
        type: String,
        enum: ['vannlekkasje', 'brannfare', 'it-feil'],
        required: true
    },
    prioritet: {
        type: String,
        enum: ['lav', 'middels', 'høy', 'kritisk', 'løst', 'arkivert'],
        required: true
    },
    status: {
        type: String,
        enum: ['registrert', 'under behandling', 'løst', 'arkivert'],
        default: 'registrert',
        required: true
    },
    ferdigstiltDato: {
        type: Date,
        required: false
    },
    ansvarligPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bruker',
        required: true
    },
    tiltak: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tiltak',
            required: false
        }
    ]
}, { 
    timestamps: { createdAt: 'opprettelseDato', updatedAt: false }
})

const Hendelse = mongoose.model('Hendelse', hendelseSchema, 'hendelser');

module.exports = {
    Hendelse,
}