const axios = require('axios')
const wordModel = require('../models/wordModel')

const addWord = async (req, res) => {

    try {

        // Word From Body
        let wordTobeAdded = req.body.word;

        // Search in mongoDb 
        const newData = await wordModel.findOne({ title: wordTobeAdded })

        if (newData === null) {

            // Credentials
            const app_id = "ea258e68"; // insert your APP Id
            const app_key = "0434484bac78a9f0980ff18fd9ebb358"; // insert your APP Key
            const wordId = wordTobeAdded;


            const options = {
                url: `https://od-api.oxforddictionaries.com/api/v2/entries/en/${wordId}`,
                method: "GET",
                headers: {
                    'app_id': app_id,
                    'app_key': app_key
                }
            }

            const wordSearch = await axios(options).catch(err => { throw new Error('No such word exists') })

            // To take whole definations that are present in Oxford API
            const definations = [];
            if (wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].subsenses) {
                wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].subsenses.map(x => definations.push(x.definitions[0]))
            }

            // To take whole synonyms that are present in Oxford API
            const synonyms = [];
            if (wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms) {
                wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].synonyms.map(x => {
                    synonyms.push(x.text)
                })
            }

            // // wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].subsenses[0].synonyms.map(x => synonyms.push(x.text))
            // wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].subsenses.map(x => {
            //     console.log(x)
            // })

            const newData1 = {
                title: wordSearch.data.results[0].word,

                lexicalCategory: wordSearch.data.results[0].lexicalEntries[0].lexicalCategory.id,

                origin: wordSearch.data.results[0].lexicalEntries[0].entries[0].etymologies ? wordSearch.data.results[0].lexicalEntries[0].entries[0].etymologies[0] : '',

                audio: wordSearch.data.results[0].lexicalEntries[0].entries[0].pronunciations[0],

                definations: definations,

                examples: wordSearch.data.results[0].lexicalEntries[0].entries[0].senses[0].examples,

                synonyms: synonyms,
                isAdded: true
            }

            const createData = await wordModel.create(newData1)
            return res.status(201).send({ status: true, data: createData })

        } else {
            return res.status(200).send({ status: true, msg: 'Word is Already Added in Your Dictionary' })
        }

    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
}

module.exports = { addWord }