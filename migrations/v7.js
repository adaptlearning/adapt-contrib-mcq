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
  updatePlugin('MCQ - update to v7.6.0', { name: 'adapt-contrib-mcq', version: '7.5.0', framework: '>=5.19.1' });

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
