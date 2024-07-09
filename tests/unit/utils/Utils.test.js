import Utils from '../../../utils/Utils.js';
import ValidationError from '../../../exceptions/ValidationError.js';

describe('Utils.validateUsernamePassword', () => {
  test('should throw if username is empty', () => {
    expect(() => Utils.validateUsernamePassword('', 'password')).toThrow(
      new ValidationError('Username/Password can not be empty'),
    );
  });

  test('should throw if username is shorter than 3 characters', () => {
    expect(() => Utils.validateUsernamePassword('ab', 'password')).toThrow(
      new ValidationError('Username should be at least 3 characters'),
    );
  });

  test('should throw if username includes a period or whitespace', () => {
    expect(() =>
      Utils.validateUsernamePassword('team.sb5', 'password'),
    ).toThrow(new ValidationError('Illegal Username'));
    expect(() =>
      Utils.validateUsernamePassword('team sb5', 'password'),
    ).toThrow(new ValidationError('Illegal Username'));
  });

  test('should throw if username includes a reserved word', () => {
    expect(() =>
      Utils.validateUsernamePassword('test', 'password'),
    ).toThrowError(new ValidationError('Illegal Username'));
  });

  test('reserve word should be case sensitive', () => {
    expect(() =>
      Utils.validateUsernamePassword('TEST', 'password'),
    ).toThrowError(new ValidationError('Illegal Username'));
  });

  test('should not throw for valid username', () => {
    expect(() =>
      Utils.validateUsernamePassword('teamsb5', 'password'),
    ).not.toThrow();
  });

  test('should throw if password is empty', () => {
    expect(() => Utils.validateUsernamePassword('teamsb5', '')).toThrow(
      new ValidationError('Username/Password can not be empty'),
    );
  });

  test('should throw if password is shorter than 4 characters', () => {
    expect(() => Utils.validateUsernamePassword('teamsb5', 'abc')).toThrow(
      new ValidationError('Password should be at least 4 characters'),
    );
  });

  test('should not throw if password is equal to 4 characters', () => {
    expect(() =>
      Utils.validateUsernamePassword('teamsb5', 'test'),
    ).not.toThrow();
  });

  test('should not throw if password is longer than 4 characters', () => {
    expect(() =>
      Utils.validateUsernamePassword('teamsb5', 'test123'),
    ).not.toThrow();
  });

  test('all stop words; should return empty', () => {
    let result = Utils.filterStopWords('across after all');
    expect(result).toBe('');
  });

  test('some stop words; should return non-stop words', () => {
    let result = Utils.filterStopWords('across Annie all');
    expect(result).toBe('Annie');
  });
});
