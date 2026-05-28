const { createFlashCookie, findUser } = require('./defaultControllers.js')
const { Bruker, verifyPassword } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

const newHendelseGET = async (req, res) => {
    try {
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');
        const bruker = await findUser(req);

        //get possible enum values from schema model
        const tema = Hendelse.schema.path('tema').enumValues;
        const allpriorities = Hendelse.schema.path('prioritet').enumValues;
        //exclude priorities løst and arkivert
        const prioritet = allpriorities.filter(v => !['løst', 'arkivert'].includes(v));

        //get all users
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
    //get field values from form/body
    const { title, description, theme, priority, personResponsible } = req.body;
    try {
        //create new hendelse with the values
        const newHendelse = new Hendelse({ 
            tittel: title,
            beskrivelse: description,
            tema: theme,
            prioritet: priority,
            ansvarligPerson: personResponsible
        })

        //save new hendelse
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
        //gets logged in user
        const bruker = await findUser(req);

        //gets the hendelse and turns in to plain javascriptobjects so i can format the dates
        const hendelse = await Hendelse.findById(hendelseId)
        .populate('ansvarligPerson', 'fornavn etternavn')
        .lean();

        //gets the tiltak and turns in to plain javascriptobjects so i can format the dates
        const tiltak = await Tiltak.find({ hendelse: hendelseId })
        .sort({datoGjort: -1})
        .populate('gjortAv', 'fornavn etternavn')
        .lean();

        //formats the dates
        const formattedHendelse = {
            ...hendelse,
            opprettelseDatoFormatted: formatDate(hendelse.opprettelseDato),
            ferdigstiltDatoFormatted: formatDate(hendelse.ferdigstiltDato)
        };

        const formattedTiltak = tiltak.map(tiltak => ({
            ...tiltak,
            datoGjortFormatted: formatDate(tiltak.datoGjort),
        }));

        //checks if user is admin or responsible for the hendelse
        const isOwner = bruker._id.toString() === hendelse.ansvarligPerson._id.toString();
        const isAdmin = bruker.avdeling === 'administrasjon';

        const isAllowed = isOwner || isAdmin;

        res.render('detailHendelse', {
            title: 'Hendelse detaljer',
            hendelse: formattedHendelse,
            tiltak: formattedTiltak,
            bruker,
            isAllowed,
            isOwner,
            isAdmin
        })
    } catch (error) {
        console.log(error)
    }
}

const newTiltakGET = async (req, res) => {
    const hendelseId = req.params.hendelseId;
    try {
        flash = {
            message: req.cookies.flash,
            type: 'error'
        };
        res.clearCookie('flash');
        const bruker = await findUser(req);

        //get the hendelse the tiltak is going to belong to
        const hendelse = await Hendelse.findById(hendelseId)
        //get all users
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

        //get the user tha the tiltak is done by from database
        const gjortAv = await Bruker.findById(doneBy)

        //create new tiltak with right values
        const newTiltak = new Tiltak({ 
            tittel: title,
            beskrivelse: description,
            datoGjort: dateDone,
            gjortAv,
            hendelse: hendelseId
        })

        //save new tiltak
        await newTiltak.save()
        console.log('New tiltak was saved:', newTiltak)

        res.redirect(`/detaljer/${hendelseId}`)
    } catch (error) {
        console.log(error)
    }
}

const updateHendelsePOST = async (req, res) => {
    const hendelseId = req.params.hendelseId;
    //get the value from the form/body
    const newState = req.body.status;
    try {

        //if new state value is løst then set the state and priority to løst and set the done date
        //but if state value is arkivert then the done date doesnt get set
        if(newState == 'løst') {
            const hendelseToUpdate = await Hendelse.findByIdAndUpdate(
                hendelseId,
                { status: newState, prioritet: newState, ferdigstiltDato: new Date() },
                { returnDocument: 'after', runValidators: true }
            )
        } else if(newState == 'arkivert') {
            const hendelseToUpdate = await Hendelse.findByIdAndUpdate(
                hendelseId,
                { status: newState, prioritet: newState },
                { returnDocument: 'after', runValidators: true }
            )            
        } else if(newState == 'under behandling') {
            const hendelseToUpdate = await Hendelse.findByIdAndUpdate(
                hendelseId,
                { status: newState },
                { returnDocument: 'after', runValidators: true }
            )              
        }

        res.redirect(`/detaljer/${hendelseId}`)
    } catch (error) {
        console.log(error)
    }
}

//format date to dd.mm.yyyy
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
    updateHendelsePOST,
    formatDate
}