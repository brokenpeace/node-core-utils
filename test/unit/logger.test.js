'use strict';

const assert = require('assert');
const chalk = require('chalk');

const loggerFactory = require('../../lib/logger');
const LogStream = require('../fixtures/log_stream');

// Complete ISO date format -> YYYY-MM-DDThh:mm:ss.sTZD
const dateRegex = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);

describe('Logger', () => {
  describe('Colors', () => {
    let stream;
    let logger;

    beforeEach(() => {
      stream = new LogStream();
      logger = loggerFactory(stream);
    });

    it('should have blue color when the level is INFO', () => {
      logger.info('test');
      assert.strictEqual(stream.toString(), `${chalk.blue('[INFO]')} test\n`);
    });

    it('should have red color when the level is FATAL', () => {
      logger.fatal('test');
      assert.strictEqual(stream.toString(), `${chalk.red('[FATAL]')} test\n`);
    });

    it('should have yellow color when the level is WARN', () => {
      logger.warn('test');
      assert.strictEqual(stream.toString(), `${chalk.yellow('[WARN]')} test\n`);
    });

    it('should have green color when the level is DEBUG', () => {
      logger.debug('test');
      assert.strictEqual(stream.toString(), `${chalk.green('[DEBUG]')} test\n`);
    });
  });

  describe('Formatter', () => {
    let stream;
    let logger;

    beforeEach(() => {
      stream = new LogStream();
      logger = loggerFactory(stream);
    });

    it('should print the date and time when showTime is true ', () => {
      logger.info({ showTime: true }, 'test');
      const date = stream.toString().split(' ')[1].replace(/\[|\]/g, '');
      assert.strictEqual(dateRegex.test(date), true);
    });

    describe('ERROR', () => {
      it('should print STACK and DATA when the level is ERROR', () => {
        logger.error({
          type: 'test_error',
          stack: 'stack',
          data: { reason: 'Testing logger.error' }
        }, 'Error with logger.error');
        assert.strictEqual(stream.toString(), `${chalk.red('[ERROR]')} test_error Error with logger.error\n[STACK] stack\n[DATA] {\n` +
          `  "reason": "Testing logger.error"\n` +
        `}\n\n`);
      });

      it('should print nothing when there is no object to be serialized', () => {
        logger.error('test');
        assert.strictEqual(stream.toString(), `${chalk.red('[ERROR]')} test\n[STACK] \n[DATA] \n\n`);
      });
    });

    describe('INFO', () => {
      let stream;
      let logger;
  
      beforeEach(() => {
        stream = new LogStream();
        logger = loggerFactory(stream);
      });
  
      it('should print raw information when it is defined', () => {
        logger.info({ raw: 'Some interesting information' }, 'test');
        assert.strictEqual(stream.toString(), `${chalk.blue('[INFO]')} test\nSome interesting information\n`);
      });

      it('should not print message when msg is defined', () => {
        logger.info({ raw: 'Some interesting information' });
        assert.strictEqual(stream.toString(), `${chalk.blue('[INFO]')} \nSome interesting information\n`);
      });
    });
  });
});
