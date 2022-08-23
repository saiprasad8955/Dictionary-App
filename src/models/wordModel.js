const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Word is Required'],
        unique: true
    },

    lexicalCategory: String,

    origin: String,

    audio: Object,

    definations: { type: Array, required: true },

    examples: Array,

    synonyms: Array,
    isAdded: { type: String, default: false }

}, { timestamps: true });


module.exports = mongoose.model("word", wordSchema);