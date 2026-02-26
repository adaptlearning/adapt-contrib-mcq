import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getComponents, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('MCQ - v4.2.0 to v5.0.0', async () => {
  let MCQs;
  whereFromPlugin('MCQ - from v4.2.0', { name: 'adapt-contrib-mcq', version: '<5.0.0' });
  whereContent('MCQ - where MCQ with old feedback format', async (content) => {
    MCQs = getComponents('mcq').filter(MCQ =>
      MCQ._feedback?._correct || MCQ._feedback?._incorrectFinal
    );
    return MCQs.length;
  });
  mutateContent('MCQ - convert old _feedback format to new', async (content) => {
    MCQs.forEach(MCQ => {
      const fb = MCQ._feedback;
      if (fb._correct) {
        fb.correct = fb._correct.body ?? '';
        delete fb._correct;
      }
      if (fb._incorrectFinal || fb._incorrectNotFinal) {
        fb._incorrect = {
          final: fb._incorrectFinal?.body ?? '',
          notFinal: fb._incorrectNotFinal?.body ?? ''
        };
        delete fb._incorrectFinal;
        delete fb._incorrectNotFinal;
      }
      if (fb._partlyCorrectFinal || fb._partlyCorrectNotFinal) {
        fb._partlyCorrect = {
          final: fb._partlyCorrectFinal?.body ?? '',
          notFinal: fb._partlyCorrectNotFinal?.body ?? ''
        };
        delete fb._partlyCorrectFinal;
        delete fb._partlyCorrectNotFinal;
      }
    });
    return true;
  });
  checkContent('MCQ - check _feedback format converted', async (content) => {
    const isValid = MCQs.every(MCQ => {
      const fb = MCQ._feedback;
      return !fb._correct && !fb._incorrectFinal && !fb._incorrectNotFinal &&
        !fb._partlyCorrectFinal && !fb._partlyCorrectNotFinal;
    });
    if (!isValid) throw new Error('MCQ - old _feedback format not fully converted');
    return true;
  });
  updatePlugin('MCQ - update to v5.0.0', { name: 'adapt-contrib-mcq', version: '5.0.0', framework: '>=5.0.0' });

  testSuccessWhere('mcq components with old feedback format', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '4.2.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'mcq',
        _feedback: {
          title: 'Feedback',
          _correct: { title: 'Correct!', body: 'Well done' },
          _incorrectFinal: { title: 'Incorrect', body: 'Try again' }
        }
      },
      {
        _id: 'c-105',
        _component: 'mcq',
        _feedback: {
          title: 'Feedback',
          _correct: { title: 'Right!', body: 'Good job' },
          _incorrectFinal: { title: 'Wrong', body: 'Not quite' },
          _partlyCorrectFinal: { title: 'Almost', body: 'Nearly there' }
        }
      }
    ]
  });

  testSuccessWhere('mcq components with new feedback format are unaffected', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '4.2.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'mcq',
        _feedback: {
          title: 'Feedback',
          correct: 'Well done',
          _incorrect: { final: 'Try again', notFinal: '' }
        }
      }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '5.0.0' }]
  });

  testStopWhere('no mcq components with old format', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '4.2.0' }],
    content: [{ _component: 'other' }]
  });
});
