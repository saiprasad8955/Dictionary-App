const axios = require('axios');
const wordModel = require('../models/wordModel')


const fetchAllWords = async function (req, res) {

    try {

        const wordId = req.query.word;

        if (Object.keys(req.query).length === 0) {

            // We will first find in db available or not 
            const wordData = await wordModel.find();

            // Check Word exists in DB or not
            if (wordData === null) {
                res.status(404).send({ status: false, data: "Dictionary is Empty !!" })
            }

            // If Exists then retrieve it
            return res.status(200).send({ status: true, wordCounts: wordData.length, data: wordData })
        }

        // We will first find in db available or not 
        const wordData = await wordModel.findOne({ title: wordId })


        // Check Word exists in DB or not
        if (wordData === null) {
            res.status(404).send({ status: false, data: `${wordId} is Not available in your Dictionary !!` })
        }

        // If Exists then retrieve it
        return res.status(200).send({ status: true, data: wordData })

    } catch (error) {
        res.status(500).send({ msg: "server error", error: error.message });
    }
}

module.exports = { fetchAllWords }