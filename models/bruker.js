const mongoose = require('mongoose');
const argon2 = require('argon2')

const Schema = mongoose.Schema;

const brukerSchema = new Schema({
    fornavn: {
        type: String,
        required: true
    },
    etternavn: {
        type: String,
        required: true
    },
    passord: {
        type: String,
        required: true
    },
    avdeling: {
        type: String,
        required: true,
        enum: ['driftspersonell', 'administrasjon', 'it-avdeling'],
    },
    tildelteHendelser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hendelse',
            required: false
        }
    ]
})

brukerSchema.pre('save', async function () {
    try {
        if (!this.isModified('passord')) return;

        const hash = await argon2.hash(this.passord);
        this.passord = hash;
    } catch (err) {
        console.error(err);
    }
});

async function verifyPassword(user, enteredPassword) {
    try {
        return await argon2.verify(user.passord, enteredPassword);
    } catch (err) {
        console.error(err)
        return false;
    }
}


const Bruker = mongoose.model('Bruker', brukerSchema, 'brukere');

module.exports = {
    Bruker,
    verifyPassword
}