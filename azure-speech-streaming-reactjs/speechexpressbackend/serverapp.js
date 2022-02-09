require('dotenv').config()
const express = require('express')
const axios = require('axios');
const app = express()

// get config
const config = require('./config.json')
const port = config[0].web_port
const speechKey = config[0].subscription_key;
const speechRegion = config[0].region;
const endpoint_id = config[0].endpoint_id;
const textAnalyticsKey = config[0].text_analytics_key;
const textAnalyticsEndpoint = config[0].text_analytics_endpoint;    


//"use strict";
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const { json } = require('express');

app.use(express.json());

app.get('/api/sayhello', (req, res) => {
  res.send('Hello World from the backend!')
});

app.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');


    if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
        res.status(400).send('You forgot to add your speech key or region to the .env file.');
    } else {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            console.log(`Speechkey loaded for speech region ${speechRegion}. Getting token`)
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            res.send({ token: tokenResponse.data, region: speechRegion, endpoint_id: endpoint_id });
        } catch (err) {
            res.status(401).send('There was an error authorizing your speech key.');
        }
    }
});

app.post('/api/ta-key-phrases', async (req, res) => { 
    const requestJSON = JSON.stringify(req.body);
    //console.log('JSON string request body ' + requestJSON);

    const requestText = JSON.stringify(req.body.transcript);
    //console.log('Received transcription text : ' + requestText);

    try {
        const keyPhrasesInput = [
            requestText,
        ];
        const textAnalyticsClient = new TextAnalyticsClient(textAnalyticsEndpoint,  new AzureKeyCredential(textAnalyticsKey));

        let keyPhrasesText = "KEY PHRASES: ";
        const keyPhraseResult =  await textAnalyticsClient.extractKeyPhrases(keyPhrasesInput);             
        keyPhraseResult.forEach(document => {            
            keyPhraseResponse = document.keyPhrases;    
            keyPhrasesText += document.keyPhrases;                   
        });   

        let entityText = "ENTITIES: ";
        const entityResults = await textAnalyticsClient.recognizeEntities(keyPhrasesInput);        
        entityResults.forEach(document => {
            //console.log(`Document ID: ${document.id}`);
            document.entities.forEach(entity => {
                if(entity.confidenceScore > 0.5){
                    //console.log(`\tName: ${entity.text} \tCategory: ${entity.category} \tSubcategory: ${entity.subCategory ? entity.subCategory : "N/A"}`);
                    const currentEntity = entity.category + ": " + entity.text;
                    entityText += " " + currentEntity;
                    //console.log(`\tScore: ${entity.confidenceScore}`);                    
                }
            });
        });          

        let piiText = "PII Redacted Text: ";
        const piiResults = await textAnalyticsClient.recognizePiiEntities(keyPhrasesInput, "en");
        for (const result of piiResults) {
            if (result.error === undefined) {
                if(result.redactedText.indexOf('*') > -1){
                    //console.log("Redacted Text: ", result.redactedText);
                    piiText += result.redactedText;
                    //console.log(" -- Recognized PII entities for input", result.id, "--");
                }

                for (const entity of result.entities) {
                    //console.log(entity.text, ":", entity.category, "(Score:", entity.confidenceScore, ")");
                    const currentEntity = entity.category + ": " + entity.text;
                    piiText += currentEntity;
                }
            } else {
                console.error("Encountered an error:", result.error);
            }
        }

        const headers = { 'Content-Type': 'application/json' };  
        res.headers = headers;                  
        //res.send({ keyPhrasesExtracted: keyPhraseResponse, entityExtracted: entityResults, piiExtracted: piiResults });
        res.send({ keyPhrasesExtracted: keyPhrasesText, entityExtracted: entityText, piiExtracted: piiText });
    } catch (err) {
        console.log(err);
        res.status(401).send('There was an error authorizing your text analytics key. Check your text analytics service key or endpoint to the .env file.');
    }        
});

app.post('/api/ta-key-phrases-old', async (req, res) => { 
    //You can find your key and endpoint in the resource's key and endpoint page, under resource management.
    const textAnalyticsKey = config[0].text_analytics_key;
    const textAnalyticsEndpoint = config[0].text_analytics_endpoint;  
    const requestJSON = JSON.stringify(req.body);
    //console.log('JSON string request body ' + requestJSON);
    const requestText = JSON.stringify(req.body.transcript);
    console.log('Received transcription text : ' + requestText);

    try {
        const keyPhrasesInput = [
            requestText,
        ];
        const textAnalyticsClient = new TextAnalyticsClient(textAnalyticsEndpoint,  new AzureKeyCredential(textAnalyticsKey));
        const keyPhraseResult =  await textAnalyticsClient.extractKeyPhrases(keyPhrasesInput);          
        /*keyPhraseResult.forEach(document => {
            console.log(`ID: ${document.id}`);
            keyPhraseResponse = document.keyPhrases;
            console.log(`\tDocument Key Phrases: ${keyPhraseResponse}`);
        });*/      
        const headers = { 'Content-Type': 'application/json' };  
        res.headers = headers;                  
        res.send({ keyPhrasesExtracted: keyPhraseResponse });
    } catch (err) {
        console.log(err);
        res.status(401).send('There was an error authorizing your text analytics key. Check your text analytics service key or endpoint to the .env file.');
    }        
});




app.listen(port, () => {
  console.log(`Express backend app listening on port ${port}`)
})