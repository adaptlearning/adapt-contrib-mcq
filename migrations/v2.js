import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('MCQ - v2.0.1 to v2.0.2', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v2.0.1', { name: 'adapt-contrib-mcq', version: '>= 2.0.0 <2.0.2' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add _recordInteraction attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._recordInteraction = true;
    });
    return true;
  });
  checkContent('MCQ - check _recordInteraction attribute', async (content) => {
    const isValid = MCQs.every(MCQ =>
      _.has(MCQ, '_recordInteraction')
    );
    if (!isValid) throw new Error('MCQ - _recordInteraction not found');
    return true;
  });
  updatePlugin('MCQ - update to v2.0.2', { name: 'adapt-contrib-mcq', version: '2.0.2', framework: '>=2.0.0' });
});

describe('MCQ - v2.0.2 to v2.0.3', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v2.0.2', { name: 'adapt-contrib-mcq', version: '<2.0.3' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add _canShowModelAnswer attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._canShowModelAnswer = true;
    });
    return true;
  });
  checkContent('MCQ - check _canShowModelAnswer attribute', async (content) => {
    const isValid = MCQs.every(MCQ =>
      _.has(MCQ, '_canShowModelAnswer')
    );
    if (!isValid) throw new Error('MCQ - _canShowModelAnswer not found');
    return true;
  });
  updatePlugin('MCQ - update to v2.0.3', { name: 'adapt-contrib-mcq', version: '2.0.3', framework: '>=2.0.0' });
});

describe('MCQ - v2.0.4 to v2.0.5', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v2.0.4', { name: 'adapt-contrib-mcq', version: '<2.0.5' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add _canShowMarking attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._canShowMarking = true;
    });
    return true;
  });
  checkContent('MCQ - check _canShowMarking attribute', async (content) => {
    const isValid = MCQs.every(MCQ =>
      _.has(MCQ, '_canShowMarking')
    );
    if (!isValid) throw new Error('MCQ - _canShowMarking not found');
    return true;
  });
  updatePlugin('MCQ - update to v2.0.5', { name: 'adapt-contrib-mcq', version: '2.0.5', framework: '>=2.0.11' });
});

describe('MCQ - v2.1.2 to v2.2.0', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v2.1.2', { name: 'adapt-contrib-mcq', version: '<2.2.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = content.filter(({ _component }) => _component === 'mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add feedback title attribute', async (content) => {
    MCQs.forEach(MCQ => {
      MCQ._feedback.title = '';
    });
    return true;
  });
  checkContent('MCQ - check feedback title attribute', async (content) => {
    const isValid = MCQs.every(MCQ =>
      _.has(MCQ._feedback, 'title')
    );
    if (!isValid) throw new Error('MCQ - feedback title not found');
    return true;
  });

  updatePlugin('MCQ - update to v2.2.0', { name: 'adapt-contrib-mcq', version: '2.2.0', framework: '>=2.0.11' });
});
