import Adapt from 'core/js/adapt';
import McqView from './McqView';
import McqModel from './McqModel';

export default Adapt.register('mcq', {
  model: McqModel,
  view: McqView
});
