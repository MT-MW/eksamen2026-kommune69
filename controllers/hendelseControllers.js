const { createFlashCookie, findUser } = require('./defaultControllers.js')
const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

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

const hendelseDetails = async (req, res) => {
    const hendelseId = req.params.hendelseId;
    try {
        const bruker = await findUser(req);
        const hendelse = await Hendelse.findById(hendelseId)
        .populate('ansvarligPerson', 'fornavn etternavn')
        .lean();

        const tiltak = await Tiltak.find({ hendelse: hendelseId })
        .sort({datoGjort: -1})
        .populate('gjortAv', 'fornavn etternavn')
        .lean();

        const formattedHendelse = {
            ...hendelse,
            opprettelseDatoFormatted: formatDate(hendelse.opprettelseDato),
            ferdigstiltDatoFormatted: formatDate(hendelse.ferdigstiltDato)
        };

        const formattedTiltak = tiltak.map(tiltak => ({
            ...tiltak,
            datoGjortFormatted: formatDate(tiltak.datoGjort),
        }));
        console.log(formattedHendelse)

        res.render('detailHendelse', {
            title: 'Hendelse detaljer',
            hendelse: formattedHendelse,
            tiltak: formattedTiltak,
            bruker,
        })
    } catch (error) {
        console.log(error)
    }
}

const newTiltakGET = async (req, res) => {
    flash = {
        message: req.cookies.flash,
        type: 'error'
    };
    res.clearCookie('flash');
    const bruker = await findUser(req);
    const hendelseId = req.params.hendelseId;
    try {
        const hendelse = await Hendelse.findById(hendelseId)
        const brukere = await Bruker.find()
        
        res.render('newTiltak', {
            title: 'Nytt tiltak',
            hendelse,
            bruker,
            brukere
        })        
    } catch (error) {
        console.log(error)
    }
}

const newTiltakPOST = async (req, res) => {
    const hendelseId = req.params.hendelseId;
    const { title, description, dateDone, doneBy } = req.body;
    try {

        const gjortAv = await Bruker.findById(doneBy)

        const newTiltak = new Tiltak({ 
            tittel: title,
            beskrivelse: description,
            datoGjort: dateDone,
            gjortAv,
            hendelse: hendelseId
        })

        await newTiltak.save()
        console.log('New tiltak was saved:', newTiltak)
        res.redirect(`/detaljer/${hendelseId}`)
        
    } catch (error) {
        console.log(error)
    }
}

function formatDate(date) {
    if(!date) return "";
    return new Date(date).toLocaleDateString("no-NO");
}

module.exports = {
    newHendelseGET,
    newHendelsePOST,
    hendelseDetails,
    newTiltakGET,
    newTiltakPOST,
    formatDate
}