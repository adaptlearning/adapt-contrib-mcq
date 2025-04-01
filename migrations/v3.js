import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getComponents, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('MCQ - v2.2.1 to v3.0.0', async () => {
  let course, courseMCQGlobals, MCQs;
  const originalAriaRegion = 'This is a multiple choice question. Once you have selected an option, select the submit button below';
  whereFromPlugin('MCQ - from v2.2.1', { name: 'adapt-contrib-mcq', version: '<3.0.0' });
  whereContent('MCQ - where MCQ', async (content) => {
    MCQs = getComponents('mcq');
    return MCQs.length;
  });
  mutateContent('MCQ - add globals if missing', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._components._mcq.ariaRegion')) _.set(course, '_globals._components._mcq.ariaRegion', originalAriaRegion);
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

  testSuccessWhere('mcq components with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '2.2.1' }],
    content: [
      { _id: 'c-100', _component: 'mcq', _items: [{ _graphic: {} }] },
      { _id: 'c-105', _component: 'mcq', _items: [{ _graphic: {} }] },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('mcq components and course with globals', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '2.2.1' }],
    content: [
      { _id: 'c-100', _component: 'mcq', _items: [{ _graphic: {} }] },
      { _id: 'c-105', _component: 'mcq', _items: [{ _graphic: {} }] },
      { _type: 'course', _globals: { _components: { _mcq: { ariaRegion: originalAriaRegion } } } }
    ]
  });

  testSuccessWhere('mcq components and course with custom globals', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '2.2.1' }],
    content: [
      { _id: 'c-100', _component: 'mcq', _items: [{ _graphic: {} }] },
      { _id: 'c-105', _component: 'mcq', _items: [{ _graphic: {} }] },
      { _type: 'course', _globals: { _components: { _mcq: { ariaRegion: 'Custom aria region' } } } }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '2.3.0' }]
  });

  testStopWhere('no mcq components', {
    fromPlugins: [{ name: 'adapt-contrib-mcq', version: '2.2.1' }],
    content: [{ _component: 'other' }]
  });
});
