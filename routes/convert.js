const express = require('express')
require("dotenv").config();
const axios = require('axios');
const code_convertor = express.Router()


const GPT_API_KEY = process.env.API_KEY;

const supportedLanguages = ["java", "python", "javascript"];
// Code conversion route
code_convertor.post('/convert', async (req, res) => {

    const code=req.body.code;
    const targetLanguage=req.body.targetLanguage

  
    if(!code || !targetLanguage){
      return res.status(400).json({ error: "Please provide code" });
    }

    // Validate if the target language is supported
    if (!supportedLanguages.includes(targetLanguage)) {
      //console.log("Unsupported target language:", targetLanguage);
      return res.status(400).json({ error: "Unsupported target language." });
    }
  
    try {
      // Create a prompt based on the selected target language and the provided code
      const prompt = `convert this code to ${targetLanguage}\n${code}`;
  
      // Make a request to the GPT API for code conversion
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: prompt,
        max_tokens: 2048,
        temperature: 1,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GPT_API_KEY}`,
        },
      });
  
      const convertedCode = response.data.choices[0].text;
      //console.log(convertedCode)
      res.json({ "convertedCode": convertedCode});
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
 


// for debug
code_convertor.post('/debug', async (req, res) => {
  
  const code=req.body.code;

  if (!code) {
    //console.log("Unsupported target language:", targetLanguage);
    return res.status(400).json({ error: "plese provide code" });
  }

  try {
    // Create a prompt based on the selected target language and the provided code
    const prompt = `debug this code and also give some suggetion that how you can improve your given code ${code}`;


    // Make a request to the GPT API for code conversion
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GPT_API_KEY}`,
      },
    });

    const debugcode = response.data.choices[0].text;
    //console.log(convertedCode)
    res.json({ "debugedcode": debugcode});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }

});






// Route for handling the accuracy button
code_convertor.post('/accuracy', async (req, res) => {
  
  const code=req.body.code;

  if (!code) {
    //console.log("Unsupported target language:", targetLanguage);
    return res.status(400).json({ error: "plese provide code" });
  }

  try {
    // Create a prompt based on the selected target language and the provided code
    const prompt = `check the accuracy of given code check every thing inside the provided code then give the accuracy of the givien code${code}`;

    // Make a request to the GPT API for code conversion
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GPT_API_KEY}`,
      },
    });

    const accuracy_code = response.data.choices[0].text;
    //console.log(convertedCode)
    res.json({ "accuratecode": accuracy_code});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }


});



module.exports=code_convertor;