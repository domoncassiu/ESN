import ValidationError from '../exceptions/ValidationError.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import HandledError from '../exceptions/HandledError.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import ErrorResponse from '../models/ErrorResponse.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

class Utils {
  static loadData(filePath) {
    const reservedListRaw = fs.readFileSync(
      path.join(path.dirname(__filename), filePath),
      'utf-8',
    );
    console.log(path.join(path.dirname(__filename), filePath));
    const lines = reservedListRaw.trim().split('\n');
    let filteredWordsTemp = [];

    lines.forEach((line) => {
      const words = line.trim().split(' ');
      words.forEach((word) => {
        if (!word.match(/^[A-Y]$/i)) {
          filteredWordsTemp.push(word);
        }
      });
    });
    return filteredWordsTemp;
  }

  static filteredWords = Utils.loadData('../texts/Reserved_name_list.txt');
  static filteredStopWords = Utils.loadData('../texts/Stop_word_list.txt');

  static checkAny(str, items) {
    return items.some((item) => {
      if (str.includes(item) && item !== '') return true;
      return false;
    });
  }

  static validateUsernamePassword(username, password) {
    // Username and password validation

    //Check if username or password is empty
    if (!username || !password) {
      throw new ValidationError('Username/Password can not be empty');
    }

    //Check if Username is east 3 characters
    if (username.length < 3) {
      throw new ValidationError('Username should be at least 3 characters');
    }
    //Check if password is at least 4 characters
    if (password.length < 4) {
      throw new ValidationError('Password should be at least 4 characters');
    }

    //Check if username is a bannedName
    if (username.includes('.') || /\s/.test(username)) {
      throw new ValidationError('Illegal Username');
    }
    if (
      Utils.checkAny(username.toLowerCase(), Utils.filteredWords) &&
      username !== 'esnadmin'
    ) {
      throw new ValidationError('Illegal Username');
    }
  }

  static handleError(error, res) {
    if (error instanceof HandledError) {
      res.status(error.code).send(new ErrorResponse(error));
    } else {
      console.trace(error);
      res.status(500).send(new ErrorResponse(new InternalServerError()));
    }
  }

  static extractParameters(req) {
    let page = 1;
    let pageSize = 50;
    let ascending = true;
    let sender = req.decodedToken.username;
    try {
      page = parseInt(req.query.page || 1);
      pageSize = parseInt(req.query.pageSize || 500);
      ascending = req.query.ascending === 'true';
    } catch (err) {
      throw new InvalidEntryError();
    }

    return { page, pageSize, ascending, sender };
  }

  static filterStopWords(searchText) {
    const filteredWordList = Utils.filteredStopWords[0].split(',');
    const filteredWords = searchText
      .split(/\s+/)
      .filter((word) => !filteredWordList.includes(word))
      .join(' ');
    return filteredWords;
  }
}

export default Utils;
