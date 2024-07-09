import axios from 'axios';
import secrets from '../secrets.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import Sentiment from '../models/Sentiment.js';

export default class NaturalLanguageClient {
  static instance = null;
  static getInstance() {
    if (NaturalLanguageClient.instance === null) {
      NaturalLanguageClient.instance = new NaturalLanguageClient();
    }
    return NaturalLanguageClient.instance;
  }
  constructor() {}
  config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://language.googleapis.com/v2/documents:analyzeSentiment',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-goog-api-key': secrets.gcpApiKey,
    },
  };

  async getSentiment(textString) {
    try {
      let data = {
        encodingType: 'UTF8',
        document: {
          type: 'PLAIN_TEXT',
          content: textString,
        },
      };
      let options = this.config;
      options['data'] = data;
      let sentiment = await axios.request(options);
      return new Sentiment(
        sentiment.data.documentSentiment.magnitude,
        sentiment.data.documentSentiment.score,
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerError();
    }
  }
}
