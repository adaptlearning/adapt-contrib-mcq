import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('MCQ - v2.2.1 to v3.0.0', async () => {
  let course, courseMCQGlobals, MCQs;
  const originalAriaRegion = 'This is a multiple choice question. Once you have selected an option, select the submit button below';
  whereFromPlugin('MCQ - from v2.2.1', { name: 'adapt-contrib-mcq', version: '<3.0.0' });
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
    if (courseMCQGlobals.ariaRegion === originalAriaRegion) courseMCQGlobals.ariaRegion = 'Multiple choice question. Select your option and then submit.';
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

  updatePlugin('MCQ - update to v3.0.0', { name: 'adapt-contrib-mcq', version: '3.0.0', framework: '>=4.0.0' });
});
