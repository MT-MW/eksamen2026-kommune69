const { createFlashCookie, findUser } = require('./defaultControllers.js')
const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');

const newHendelseGET = async (req, res) => {
    flash = {
        message: req.cookies.flash,
        type: 'error'
    };
    res.clearCookie('flash');
    try {
        const bruker = await findUser(req);
        const tema = Hendelse.schema.path('tema').enumValues;
        const prioritet = Hendelse.schema.path('prioritet').enumValues;
        const brukere = await Bruker.find();

        res.render('newHendelse', { 
            title: 'Registrer ny hendelse', 
            tema,
            prioritet,
            brukere,
            flash,
            bruker
        })
    } catch (error) {
        console.log(error)
    }
}

const newHendelsePOST = async (req, res) => {
    const { title, description, theme, priority, personResponsible } = req.body;
    try {

        const newHendelse = new Hendelse({ 
            tittel: title,
            beskrivelse: description,
            tema: theme,
            prioritet: priority,
            ansvarligPerson: personResponsible
        })

        await newHendelse.save()
        console.log('Ny hendelse lagret', newHendelse)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    newHendelseGET,
    newHendelsePOST
}