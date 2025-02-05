import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

// https://github.com/adaptlearning/adapt-contrib-mcq/compare/v4.0.0...v4.0.1
describe('MCQ - v4.0.0 to v4.0.1', async () => {
  let course, courseMCQGlobals, MCQs;
  const originalAriaRegion = 'Multiple choice question. Select your option and then submit.';
  whereFromPlugin('MCQ - from v4.0.0', { name: 'adapt-contrib-mcq', version: '<4.0.1' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add globals if missing', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    if (!_.has(course, '_globals._components._mcq')) _.set(course, '_globals._components._mcq', {});
    courseMCQGlobals = course._globals._components._mcq;
    return true;
  });
  mutateContent('MCQ - modify global ariaRegion default', async (content) => {
    if (courseMCQGlobals.ariaRegion === originalAriaRegion) courseMCQGlobals.ariaRegion = 'Multiple choice question';
    return true;
  });
  checkContent('MCQ - check globals exist', async (content) => {
    const isValid = _.has(course, '_globals._components._mcq');
    if (!isValid) throw new Error('MCQ - globals do not exist');
    return true;
  });
  checkContent('MCQ - check global ariaRegion default', async (content) => {
    const isValid = courseMCQGlobals.ariaRegion !== originalAriaRegion;
    if (!isValid) throw new Error('MCQ - global ariaRegion default not updated');
    return true;
  });

  updatePlugin('MCQ - update to v4.0.1', { name: 'adapt-contrib-mcq', version: '4.0.1', framework: '>=5.0.0' });
});

// https://github.com/adaptlearning/adapt-contrib-mcq/compare/v4.0.1...v4.1.0
describe('MCQ - v4.0.1 to v4.1.0', async () => {
  let course, courseMCQGlobals, MCQs;
  whereFromPlugin('MCQ - from v4.0.1', { name: 'adapt-contrib-mcq', version: '<4.1.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add globals if missing', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    if (!_.has(course, '_globals._components._mcq')) _.set(course, '_globals._components._mcq', {});
    courseMCQGlobals = course._globals._components._mcq;
    return true;
  });
  mutateContent('MCQ - add global ariaCorrectAnswer value', async (content) => {
    courseMCQGlobals.ariaCorrectAnswer = 'The correct answer is {{{correctAnswer}}}';
    return true;
  });
  mutateContent('MCQ - add global ariaCorrectAnswers value', async (content) => {
    courseMCQGlobals.ariaCorrectAnswers = 'The correct answers are {{{correctAnswer}}}';
    return true;
  });
  mutateContent('MCQ - add global ariaUserAnswer value', async (content) => {
    courseMCQGlobals.ariaUserAnswer = 'The answer you chose was {{{userAnswer}}}';
    return true;
  });
  mutateContent('MCQ - add global ariaUserAnswers value', async (content) => {
    courseMCQGlobals.ariaUserAnswers = 'The answers you chose were {{{userAnswer}}}';
    return true;
  });
  checkContent('MCQ - check globals exist', async (content) => {
    const isValid = _.has(course, '_globals._components._mcq');
    if (!isValid) throw new Error('MCQ - globals do not exist');
    return true;
  });
  checkContent('MCQ - check global ariaCorrectAnswer attribute', async (content) => {
    const isValid = courseMCQGlobals.ariaCorrectAnswer === 'The correct answer is {{{correctAnswer}}}';
    if (!isValid) throw new Error('MCQ - global ariaCorrectAnswer attribute incorrect');
    return true;
  });
  checkContent('MCQ - check global ariaCorrectAnswers attribute', async (content) => {
    const isValid = courseMCQGlobals.ariaCorrectAnswers === 'The correct answers are {{{correctAnswer}}}';
    if (!isValid) throw new Error('MCQ - global ariaCorrectAnswers attribute incorrect');
    return true;
  });
  checkContent('MCQ - check global ariaUserAnswer attribute', async (content) => {
    const isValid = courseMCQGlobals.ariaUserAnswer === 'The answer you chose was {{{userAnswer}}}';
    if (!isValid) throw new Error('MCQ - global ariaUserAnswer attribute incorrect');
    return true;
  });
  checkContent('MCQ - check global ariaUserAnswers attribute', async (content) => {
    const isValid = courseMCQGlobals.ariaUserAnswers === 'The answers you chose were {{{userAnswer}}}';
    if (!isValid) throw new Error('MCQ - global ariaUserAnswers attribute incorrect');
    return true;
  });

  updatePlugin('MCQ - update to v4.1.0', { name: 'adapt-contrib-mcq', version: '4.1.0', framework: '>=5.0.0' });
});

// https://github.com/adaptlearning/adapt-contrib-mcq/compare/v4.1.0...v4.2.0
describe('MCQ - v4.1.0 to v4.2.0', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v4.1.0', { name: 'adapt-contrib-mcq', version: '<4.2.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add _hasItemScoring attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._hasItemScoring = false;
    });
    return true;
  });
  mutateContent('MCQ - add item _isPartlyCorrect attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._items.forEach(item => {
        item._isPartlyCorrect = false;
      });
    });
    return true;
  });
  mutateContent('MCQ - add item _score attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._items.forEach(item => {
        item._score = 0;
      });
    });
    return true;
  });
  checkContent('MCQ - check _hasItemScoring attribute', async (content) => {
    const isValid = MCQs.every(MCQ => MCQ._hasItemScoring === false);
    if (!isValid) throw new Error('MCQ - _hasItemScoring attribute not updated');
    return true;
  });
  checkContent('MCQ - check item _isPartlyCorrect attribute', async(content) => {
    const isValid = MCQs.every(MCQ => {
      return MCQ._items.every(item => _.has(item, '_isPartlyCorrect'));
    });
    if (!isValid) throw new Error('MCQ - no item _isPartlyCorrect found');
    return true;
  });
  checkContent('MCQ - check item _score attribute', async(content) => {
    const isValid = MCQs.every(MCQ => {
      return MCQ._items.every(item => _.has(item, '_score'));
    });
    if (!isValid) throw new Error('MCQ - no item _score found');
    return true;
  });
  updatePlugin('MCQ - update to v4.2.0', { name: 'adapt-contrib-mcq', version: '4.2.0', framework: '>=5.0.0' });
});
