import React, { Component } from 'react';
import { Container } from 'reactstrap';
//import axios from 'axios';
import { getKeyPhrases, getTokenOrRefresh } from './token_util.js';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import './App.css';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default class App extends Component {
  constructor(props) {
      super(props);

      this.state = {color: 'white', value: '' };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
        color: 'white',   
        displayText: 'INITIALIZED: ready to test speech...',
          displayNLPOutput: 'NLP Output: ...'
      };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your conversation will be saved with name : ' + this.state.value + ' Submit a different name to change it.');
    event.preventDefault();
  }

  async componentDidMount() {
      // check for valid speech key/region
      const tokenRes = await getTokenOrRefresh();
      if (tokenRes.authToken === null) {
          this.setState({
              displayText: 'FATAL_ERROR amc: ' + tokenRes.error
          });
      }
  }

  async sttFromMic() {
      const tokenObj = await getTokenOrRefresh();
      //const customSpeechEndpoint = process.env.CUSTOM_SPEECH_ENDPOINT_ID;
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      //Setting below specifies custom speech model ID that is created using Speech Studio
      speechConfig.endpointId = 'd26026b7-aaa0-40bf-84e7-35054451a3f4';

      //Setting below allows specifying custom GUID that can be used to correlnpate audio captured by Speech Logging
      speechConfig.setServiceProperty("clientConnectionId", this.state.value, speechsdk.ServicePropertyChannel.UriQueryParameter);

      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      this.setState({
          displayText: 'Speak into your microphone to start conversation...' + this.state.value
      });      

      let resultText = "";
      let nlpText = " ";
      recognizer.sessionStarted = (s, e) => {
          resultText = "Session ID: " + e.sessionId;

          this.setState({
              displayText: resultText
          });
      };

      recognizer.recognized = async (s, e) => {
        if(e.result.reason === ResultReason.RecognizedSpeech){
          
            //Display continuous transcript
            resultText += `\n${e.result.text}`;    
            this.setState({
                displayText: resultText
            });      
            
            //Perform continuous NLP
            const nlpObj = await getKeyPhrases(e.result.text);              
                
            //Display extracted Key Phrases      
            const keyPhraseText = JSON.stringify(nlpObj.keyPhrasesExtracted); 
            if(keyPhraseText.length > 15){
                //nlpText += "\n" + keyPhraseText;
                //this.setState({ displayNLPOutput: nlpText }); 
            }        

            //Display extracted entities
            const entityText = JSON.stringify(nlpObj.entityExtracted); 
            if(entityText.length > 12){
                nlpText += "\n" + entityText;
                this.setState({ displayNLPOutput: nlpText.replace('<br/>', '\n') });
            }         

            //Display PII Detected               
            const piiText = JSON.stringify(nlpObj.piiExtracted);
            if(piiText.length > 21){
                nlpText += "\n" + piiText; 
                this.setState({ displayNLPOutput: nlpText.replace('<br/>', '\n') }); 
            }                    
        }
        else if (e.result.reason === ResultReason.NoMatch) {
            //resultText += `\nNo Match`
            resultText += `\n`
        }          

    };

      recognizer.startContinuousRecognitionAsync();
  }

  async fileChange(event) {
      const audioFile = event.target.files[0];
      console.log(audioFile);
      const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

      this.setState({
          displayText: fileInfo
      });

      const tokenObj = await getTokenOrRefresh();
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(result => {
          let displayText;
          if (result.reason === ResultReason.RecognizedSpeech) {
              displayText = `RECOGNIZED: Text=${result.text}`
          } else {
              displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
          }

          this.setState({
              displayText: fileInfo + displayText
          });
      });
  }

  render() {
      return (
          <Container className="app-container">              
              
              <div style={{ color: 'green', fontSize: 35, display: 'flex', justifyContent:'center', alignItems:'center' }}>Realtime Call Intelligence - powered by Azure AI</div>
              <div style={{ color: 'red', fontSize: 20, display: 'flex', justifyContent:'center', alignItems:'center' }}>NOTE: This covnersation will be recorded for demo purpose.</div>
              <div style={{ color: 'green', fontSize: 20, display: 'flex', justifyContent:'center', alignItems:'center' }}>-----------------------------------------------------------</div>
              
              <form onSubmit={this.handleSubmit}>
                    <label>
                    STEP 1 - Enter a Name for this Conversation (without spaces) :
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
              </form>
              

              <div className="col-6">
                      <i className="fas fa-microphone fa-lg mr-2" onClick={() => this.sttFromMic()}></i>
                      STEP 2 - Click on Microphone and start talking for real-time insights..
              </div>
              
              <div style={{ color: 'blue', fontSize: 20, display: 'flex', justifyContent:'center', alignItems:'center' }}>-----  Speech-to-text Output ----------------------------------------------------  AI-powered Call Insights ------</div>
              
              <div className="row" style={{ height: 900}}> 
                  <div className="col-6 output-display rounded" style={{ color: 'white', fontSize: 18, "borderWidth":"1px", 'borderColor':"black", 'borderStyle':'solid'}}>
                        <code>{this.state.displayText}</code>
                  </div>
                  <div className="col-6 nlpoutput-display rounded " style={{ color: 'green', fontSize: 18, "borderWidth":"1px", 'borderColor':"black", 'borderStyle':'solid'}}>                      
                      <code>{this.state.displayNLPOutput}</code>
                  </div>
              </div>              

          </Container>
      );
  }
}