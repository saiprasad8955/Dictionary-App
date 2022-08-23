const axios = require('axios');
const wordModel = require('../models/wordModel')


const fetchWord = async function (req, res) {

    try {

        const wordId = req.query.word;

        // We will first find in db available or not 
        const word = await wordModel.findOne({ title: wordId })

        // Check if word exists in DB then show thelocally cached Data 
        if (word) {
            return res.status(200).send({ status: true, data: word })
        }

        // If not then search through the oxford dictionary Api's and fetch results
        const app_id = "ea258e68"; // insert your APP Id
        const app_key = "0434484bac78a9f0980ff18fd9ebb358"; // insert your APP Key


        const options = {
            url: `https://od-api.oxforddictionaries.com/api/v2/entries/en/${wordId}`,
            method: "GET",
            headers: {
                'app_id': app_id,
                'app_key': app_key
            }
        }

        const wordSearch = await axios(options).catch(err => { throw new Error('No such word exists') })

        const definations = [];
        if (wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].subsenses) {
            wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].subsenses.map(x => definations.push(x.definitions[0]))
        }

        const synonyms = [];
        if (wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms) {
            wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms.map(x => {
                synonyms.push(x.text)
            })
        }

        const newData1 = {
            title: wordSearch.data.results[0].word,

            lexicalCategory: wordSearch.data.results[0].lexicalEntries[0].lexicalCategory.id,

            origin: wordSearch.data.results[0].lexicalEntries[0].entries[0].etymologies ? wordSearch.data.results[0].lexicalEntries[0].entries[0].etymologies[0] : '',

            audio: wordSearch.data.results[0].lexicalEntries[0].entries[0].pronunciations[0],

            definations: definations,

            examples: wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].examples,

            synonyms: synonyms,
        }

        const createData = await wordModel.create(newData1)
        return res.status(200).send({ status: true, data: createData })

    } catch (error) {
        res.status(500).send({ msg: "server error", error: error.message });
    }
}

module.exports = { fetchWord }