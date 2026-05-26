const mongoose = require('mongoose');
require('dotenv').config();

const { Bruker } = require('../models/bruker.js');
const { Hendelse } = require('../models/hendelse.js');
const { Tiltak } = require('../models/tiltak.js');

async function seed() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('connected to db');

        console.log("Starting seeding...");

        await Promise.all([
            Bruker.deleteMany({}),
            Hendelse.deleteMany({}),
            Tiltak.deleteMany({}),
        ]);

        //opprett brukere
        const brukere = await Bruker.create([
            { fornavn: "Red", etternavn: "Queen", passord: "crown", avdeling: "administrasjon" },
            { fornavn: "Maria", etternavn: "Westengen", passord: "m", avdeling: "driftspersonell" },
            { fornavn: "Geir", etternavn: "Hilmersen", passord: "g", avdeling: "it-avdeling" },
            { fornavn: "Sensor", etternavn: "to", passord: "s", avdeling: "it-avdeling" },
            { fornavn: "Super", etternavn: "Padde", passord: "passord1", avdeling: "administrasjon" },
        ]);
        console.log("Brukere opprettet");

        //opprett hendelser
        const hendelser = await Hendelse.create ([
        {
            tittel: "Vannlekkasje i teknisk rom",
            beskrivelse: "Det er oppdaget vannlekkasje i kjelleren ved teknisk rom. Risiko for skade på serverutstyr.",
            tema: "vannlekkasje",
            prioritet: "kritisk",
            status: "under behandling",
            ansvarligPerson: new mongoose.Types.ObjectId(brukere[4]._id),
            tiltak: []
        },

        {
            tittel: "Overoppheting i elektrisk tavle",
            beskrivelse: "Det er registrert unormal varmeutvikling i hovedtavle i bygg A.",
            tema: "brannfare",
            prioritet: "kritisk",
            status: "registrert",
            ansvarligPerson: new mongoose.Types.ObjectId(brukere[3]._id),
            tiltak: []
        },

        {
            tittel: "Nedetid på interne systemer",
            beskrivelse: "Flere brukere rapporterer at intranett og filserver er utilgjengelig.",
            tema: "it-feil",
            prioritet: "høy",
            status: "under behandling",
            ansvarligPerson: new mongoose.Types.ObjectId(brukere[2]._id),
            tiltak: []
        },

        {
            tittel: "Sprukket rør i kantine",
            beskrivelse: "Vann spruter fra et rør under vask i kantineområdet.",
            tema: "vannlekkasje",
            prioritet: "middels",
            status: "registrert",
            ansvarligPerson: new mongoose.Types.ObjectId(brukere[1]._id),
            tiltak: []
        },

        {
            tittel: "Feil i adgangskontrollsystem",
            beskrivelse: "Kortlesere fungerer ikke i hovedinngang etter systemoppdatering.",
            tema: "it-feil",
            prioritet: "høy",
            status: "løst",
            ferdigstiltDato: new Date("2026-05-24"),
            ansvarligPerson: new mongoose.Types.ObjectId(brukere[0]._id),
            tiltak: []
        }
        ]);
        console.log('Hendelser created')

        //opprett tiltak
        const tiltak = await Tiltak.create([
            {
                tittel: "Stanse vannlekkasje og sikre området",
                beskrivelse: "Vann ble stengt og området sikret.",
                datoGjort: new Date("2026-05-22"),
                gjortAv: brukere[1]._id,
                hendelse: hendelser[0]._id
            },

            {
                tittel: "Inspisere elektrisk tavle",
                beskrivelse: "Elektriker sjekket overoppheting.",
                datoGjort: new Date("2026-05-23"),
                gjortAv: brukere[2]._id,
                hendelse: hendelser[1]._id
            },

            {
                tittel: "Restart av server og feilsøking",
                beskrivelse: "Server restartet og logganalyse utført.",
                datoGjort: new Date("2026-05-24"),
                gjortAv: brukere[3]._id,
                hendelse: hendelser[2]._id
            },

            {
                tittel: "Midlertidig reparasjon av rør",
                beskrivelse: "Rør midlertidig tettet.",
                datoGjort: new Date("2026-05-24"),
                gjortAv: brukere[0]._id,
                hendelse: hendelser[3]._id
            },

            {
                tittel: "Reinstallasjon av adgangssystem",
                beskrivelse: "System reinstallert og testet.",
                datoGjort: new Date("2026-05-25"),
                gjortAv: brukere[4]._id,
                hendelse: hendelser[4]._id
            }
        ]);

        console.log("Tiltak created");

        // koble tiltak til hendelser
        for (let i = 0; i < hendelser.length; i++) {
            await Hendelse.findByIdAndUpdate(
                hendelser[i]._id,
                { $push: { tiltak: tiltak[i]._id } }
            );
        }

        
        console.log("Seeding complete!");
        process.exit(0)
    } catch (error) {
        console.log('Error during DB seeding',error)
        process.exit(1)
    }
}

seed();