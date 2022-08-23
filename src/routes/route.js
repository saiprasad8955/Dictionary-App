const express = require('express')
const router = express.Router();

const { fetchWord } = require('../controllers/fetchWordController')
const { addWord } = require('../controllers/addWordController');
const { fetchAllWords } = require('../controllers/AllCachedWordsController');

// ==== FETCHING WORD From OXFORD API's
router.get('/fetchWords', fetchWord);

// ==== FETCHING WORD From OXFORD API's
router.get('/completeDictionary', fetchAllWords);

// ==== ADDING WORD
router.post('/addWord', addWord);

module.exports = router;