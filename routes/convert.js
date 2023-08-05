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
 
     const issues = analyzeCodeForMissingSemicolons(code);
     const codeQuality = assessCodeQuality(code);
    // Validate if the target language is supported
    if (!supportedLanguages.includes(targetLanguage)) {
      console.log("Unsupported target language:", targetLanguage);
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
      res.json({ "convertedCode": convertedCode,issues,codeQuality });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
 



  // Code analysis function to check for missing semicolons in JavaScript code
function analyzeCodeForMissingSemicolons(code) {
  const lines = code.split('\n');
  const issues = [];

  lines.forEach((line, lineNumber) => {
    if (line.trim() !== '' && !line.trim().endsWith(';')) {
      issues.push({
        type: 'MissingSemicolon',
        line: lineNumber + 1,
        message: 'Missing semicolon at the end of the line.'
      });
    }
  });

  return issues;
}




///quality check of the code
function assessCodeQuality(code) {
  const codeQuality = {
    complexity: calculateCyclomaticComplexity(code),
    length: code.split('\n').length,
    naming: checkNamingConventions(code),
    duplication: checkCodeDuplication(code)
    // Add more quality checks as needed
  };

  return codeQuality;
}

function calculateCyclomaticComplexity(code) {
  const complexity = (code.match(/if|else|for|while|switch/g) || []).length;
  return complexity;
}


function checkNamingConventions(code) {
  const variablesAndFunctions = code.match(/\b([a-z]+[A-Z]\w*)\b|\b([A-Z]+\w*[a-z])\b/g) || [];
  const nonCamelCaseNames = variablesAndFunctions.filter(name => !(/[A-Z]/.test(name[0])));
  return nonCamelCaseNames.length === 0;
}


function checkCodeDuplication(code) {
  const lines = code.split('\n');
  const duplicatedLines = lines.filter((line, index) => lines.indexOf(line) !== index);
  return duplicatedLines.length === 0;
}

module.exports=code_convertor;