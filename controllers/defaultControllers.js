const { Bruker } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

const loginGET = (req, res) => {
    try {
        res.render('index', { title: 'Logg Inn'})
    } catch (error) {
        console.log(error)
    }
}

const problems = async (req, res) => {
    try {
        const results = await Hendelse.find();
        res.render('problems', { title: 'Hendelser', results })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    loginGET,
    problems
}