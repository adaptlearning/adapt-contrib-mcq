import components from 'core/js/components';
import McqView from './McqView';
import McqModel from './McqModel';

export default components.register('mcq', {
  model: McqModel,
  view: McqView
});
