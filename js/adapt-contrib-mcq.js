import Adapt from 'core/js/adapt';
import McqView from './mcqView';
import McqModel from './mcqModel';

export default Adapt.register('mcq', {
  model: McqModel,
  view: McqView
});
