const express = require('express')
require("dotenv").config();
const axios = require('axios');
const code_convertor = express.Router()


const GPT_API_KEY = process.env.API_KEY;

const supportedLanguages = ["java", "python", "javascript","C","C++","Ruby","PHP"];
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
  
 


  code_convertor.post('/debug', async (req, res) => {
    const code = req.body.code;
  
    if (!code) {
      return res.status(400).json({ error: "Please provide code." });
    }
  
    try {
      const prompt = `debug this code and also give some suggestions on how to improve your given code:\n${code}`;
  
      // Make a request to the GPT API for debugging the code
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
  
      if (!response.data.choices || response.data.choices.length === 0) {
        return res.status(500).json({ error: "Unexpected response from GPT API." });
      }
  
      const debuggedCode = response.data.choices[0].text;
      res.json({ debuggedCode });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  });
  




// Route for handling the accuracy button
code_convertor.post('/accuracy', async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: "Please provide code." });
  }

  try {
    const prompt = `check the accuracy of the given code and provide suggestions for improvements:\n${code}`;

    // Make a request to the GPT API for checking the accuracy of the code
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

    if (!response.data.choices || response.data.choices.length === 0) {
      return res.status(500).json({ error: "Unexpected response from GPT API." });
    }

    const accurateCode = response.data.choices[0].text;
    res.json({ accurateCode });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});




module.exports=code_convertor;