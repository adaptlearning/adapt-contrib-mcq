import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getComponents, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

// https://github.com/adaptlearning/adapt-contrib-mcq/compare/v7.2.1...v7.3.0
describe('MCQ - v7.2.1 to v7.3.0', async () => {
  let MCQs;
  const originalInstruction = '';
  whereFromPlugin('MCQ - from v7.2.1', { name: 'adapt-contrib-mcq', version: '<7.3.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = getComponents('mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - modify instruction attribute', async (content) => {
    MCQs.forEach(MCQ => {
      if (MCQ.instruction !== originalInstruction) return;
      MCQ.instruction = 'Choose {{#if _isRadio}}one option{{else}}one or more options{{/if}} then select Submit.';
    });
    return true;
  });
  mutateContent('MCQ - add ariaQuestion attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ.ariaQuestion = '';
    });
    return true;
  });
  checkContent('MCQ - check instruction attribute', async (content) => {
    const isInvalid = MCQs.every(MCQ => MCQ.instruction === originalInstruction);
    if (isInvalid) throw new Error('MCQ - instruction attribute not updated');
    return true;
  });
  checkContent('MCQ - check item ariaQuestion attribute', async (content) => {
    const isValid = MCQs.every(MCQ => MCQ.ariaQuestion === '');
    if (!isValid) throw new Error('MCQ - no ariaQuestion attribute found');
    return true;
  });
  updatePlugin('MCQ - update to v7.3.0', { name: 'adapt-contrib-mcq', version: '7.3.0', framework: '>=5.19.1' });

  testSuccessWhere('mcq components with/custom/no instruction', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.2.1' }],
    content: [
      { _id: 'c-100', _component: 'mcq', instruction: originalInstruction },
      { _id: 'c-105', _component: 'mcq', instruction: 'custom instruction' },
      { _id: 'c-110', _component: 'mcq' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.3.0' }]
  });

  testStopWhere('no mcq components', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.2.1' }],
    content: [{ _component: 'other' }]
  });
});

// https://github.com/adaptlearning/adapt-contrib-mcq/commit/4f789793248c5f40529897f5a990cee79758c1b7
describe('MCQ - v7.3.7 to v7.3.8', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v7.3.7', { name: 'adapt-contrib-mcq', version: '<7.3.8' });
  whereContent('MCQ - where MCQ with _feedback', async (content) => {
    MCQs = getComponents('mcq').filter(MCQ => _.has(MCQ, '_feedback') && !_.has(MCQ._feedback, 'altTitle'));
    return MCQs.length;
  });
  mutateContent('MCQ - add altTitle to _feedback', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._feedback.altTitle = '';
    });
    return true;
  });
  checkContent('MCQ - check _feedback altTitle attribute', async (content) => {
    const isValid = MCQs.every(MCQ => _.has(MCQ._feedback, 'altTitle'));
    if (!isValid) throw new Error('MCQ - no _feedback altTitle found');
    return true;
  });
  updatePlugin('MCQ - update to v7.3.8', { name: 'adapt-contrib-mcq', version: '7.3.8', framework: '>=5.19.1' });

  testSuccessWhere('mcq components with _feedback', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.3.7' }],
    content: [
      { _id: 'c-100', _component: 'mcq', _feedback: { correct: 'Correct!' } },
      { _id: 'c-105', _component: 'mcq', _feedback: { correct: '' } }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.3.8' }]
  });

  testStopWhere('no mcq components with _feedback', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.3.7' }],
    content: [
      { _id: 'c-100', _component: 'mcq' }
    ]
  });
});

// https://github.com/adaptlearning/adapt-contrib-mcq/compare/v7.3.11...v7.4.0
describe('MCQ - v7.3.11 to v7.4.0', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v7.3.11', { name: 'adapt-contrib-mcq', version: '<7.4.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = getComponents('mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add altText attribute to _items', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._items.forEach(item => {
        item.altText = '';
      });
    });
    return true;
  });
  checkContent('MCQ - check item altText attribute', async (content) => {
    const isValid = MCQs.every(MCQ => {
      return MCQ._items.every(item => _.has(item, 'altText'));
    });
    if (!isValid) throw new Error('MCQ - no item altText found');
    return true;
  });
  updatePlugin('MCQ - update to v7.4.0', { name: 'adapt-contrib-mcq', version: '7.4.0', framework: '>=5.19.1' });

  testSuccessWhere('correct version mcq components', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.3.11' }],
    content: [
      { _id: 'c-100', _component: 'mcq', _items: [{ title: 'item 1' }] },
      { _id: 'c-105', _component: 'mcq', _items: [{ title: 'item 2' }] }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.4.0' }]
  });

  testStopWhere('no mcq components', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.3.11' }],
    content: [{ _component: 'other' }]
  });
});

// https://github.com/adaptlearning/adapt-contrib-mcq/compare/v7.4.3...v7.5.0
describe('MCQ - v7.4.3 to v7.5.0', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v7.4.3', { name: 'adapt-contrib-mcq', version: '<7.5.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = getComponents('mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add _canShowCorrectness attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._canShowCorrectness = MCQ._showMarking !== undefined ? MCQ._showMarking : false;
    });
    return true;
  });
  checkContent('MCQ - check _canShowCorrectness attribute', async (content) => {
    const isValid = MCQs.every(({ _canShowCorrectness }) => _canShowCorrectness !== undefined);
    if (!isValid) throw new Error('MCQ - no _canShowCorrectness attribute found');
    return true;
  });
  updatePlugin('MCQ - update to v7.5.0', { name: 'adapt-contrib-mcq', version: '7.5.0', framework: '>=5.19.1' });

  testSuccessWhere('correct version mcq components', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.4.3' }],
    content: [
      { _id: 'c-100', _component: 'mcq' },
      { _id: 'c-105', _component: 'mcq' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.5.0' }]
  });

  testStopWhere('no mcq components', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.4.3' }],
    content: [{ _component: 'other' }]
  });
});

// https://github.com/adaptlearning/adapt-contrib-mcq/issues/251
describe('MCQ - v7.5.0 to @@RELEASE_VERSION', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v7.5.0', { name: 'adapt-contrib-mcq', version: '<@@RELEASE_VERSION' });
  whereContent('MCQ - where MCQ with legacy feedback', async (content) => {
    MCQs = getComponents('mcq').filter(MCQ =>
      _.has(MCQ, '_feedback.correct') ||
      _.has(MCQ, '_feedback._incorrect') ||
      _.has(MCQ, '_feedback._partlyCorrect')
    );
    return MCQs.length;
  });
  mutateContent('MCQ - convert _feedback.correct to _feedback._correct object', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._feedback._correct = { body: MCQ._feedback.correct };
      _.unset(MCQ._feedback, 'correct');
    });
    return true;
  });
  mutateContent('MCQ - convert _feedback._incorrect to _feedback._incorrectFinal/_incorrectNotFinal objects', async (content) => {
    MCQs.forEach(MCQ => {
      if (!_.has(MCQ, '_feedback._incorrect')) return;
      MCQ._feedback._incorrectFinal = { body: MCQ._feedback._incorrect.final ?? '' };
      MCQ._feedback._incorrectNotFinal = { body: MCQ._feedback._incorrect.notFinal ?? '' };
      _.unset(MCQ._feedback, '_incorrect');
    });
    return true;
  });
  mutateContent('MCQ - convert _feedback._partlyCorrect to _feedback._partlyCorrectFinal/_partlyCorrectNotFinal objects', async (content) => {
    MCQs.forEach(MCQ => {
      if (!_.has(MCQ, '_feedback._partlyCorrect')) return;
      MCQ._feedback._partlyCorrectFinal = { body: MCQ._feedback._partlyCorrect.final ?? '' };
      MCQ._feedback._partlyCorrectNotFinal = { body: MCQ._feedback._partlyCorrect.notFinal ?? '' };
      _.unset(MCQ._feedback, '_partlyCorrect');
    });
    return true;
  });
  checkContent('MCQ - check legacy _feedback keys removed', async (content) => {
    const isValid = MCQs.every(MCQ =>
      !_.has(MCQ, '_feedback.correct') &&
      !_.has(MCQ, '_feedback._incorrect') &&
      !_.has(MCQ, '_feedback._partlyCorrect')
    );
    if (!isValid) throw new Error('MCQ - legacy _feedback keys still present');
    return true;
  });
  checkContent('MCQ - check _feedback._correct.body present', async (content) => {
    const isValid = MCQs.every(MCQ => _.has(MCQ, '_feedback._correct.body'));
    if (!isValid) throw new Error('MCQ - _feedback._correct.body not found');
    return true;
  });
  updatePlugin('MCQ - update to @@RELEASE_VERSION', { name: 'adapt-contrib-mcq', version: '@@RELEASE_VERSION', framework: '>=5.19.1' });

  testSuccessWhere('mcq components with legacy flat string feedback', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.5.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'mcq',
        _feedback: {
          correct: 'Well done.',
          _incorrect: { final: 'Sorry, that is wrong.', notFinal: 'Try again.' },
          _partlyCorrect: { final: 'Nearly!', notFinal: 'Almost there.' }
        }
      },
      {
        _id: 'c-105',
        _component: 'mcq',
        _feedback: {
          correct: 'Correct!',
          _incorrect: { final: 'Incorrect.' }
        }
      }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '@@RELEASE_VERSION' }]
  });

  testStopWhere('no mcq components with legacy feedback', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '7.5.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'mcq',
        _feedback: { _correct: { body: 'Well done.' } }
      }
    ]
  });
});
