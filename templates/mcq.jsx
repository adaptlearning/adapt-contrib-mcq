import Adapt from 'core/js/adapt';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function(model, view) {
  const data = model.toJSON();
  data._globals = Adapt.course.get('_globals');

  return (
    <div className='component__inner mcq__inner'>

      {templates.component(model, view)}

      <div
        className={classes([
          'component__widget',
          'mcq__widget',
          !data._isEnabled && 'is-disabled',
          data._isInteractionComplete && 'is-complete is-submitted show-user-answer',
          data._isCorrect && 'is-correct'
        ])}
        role={data._isRadio ? 'radiogroup' : 'group'}
      >

        {data._items.map(({ text, _index, _isActive, _isVisited, _isSelected }, index) =>

          <div
            className={`mcq__item item-${index}`}
            key={_index}
          >

            <input
              className='mcq__item-input js-item-input'
              id={`${data._id}-${index}-input`}
              name={data._isRadio ? `${data._id}-item` : null}
              type={data._isRadio ? 'radio' : 'checkbox'}
              disabled={data._isEnabled}
              aria-label={Adapt.a11y.normalize(text)}
              data-adapt-index={_index}
            />

            <label
              className={classes([
                'mcq__item-label',
                'js-item-label',
                _isSelected && 'is-selected'
              ])}
              aria-hidden={true}
              htmlFor={`${data._id}-${index}-input`}
              data-adapt-index={_index}
            >

              <div className='mcq__item-state'>
                <div
                  className={classes([
                    'mcq__item-icon',
                    'mcq__item-answer-icon',
                    data._isRadio ? 'is-radio' : 'is-checkbox'
                  ])}
                >

                  <div className='icon'></div>

                </div>

                <div className='mcq__item-icon mcq__item-correct-icon'>
                  <div className='icon'></div>
                </div>

                <div className='mcq__item-icon mcq__item-incorrect-icon'>
                  <div className='icon'></div>
                </div>
              </div>

              <div className='mcq__item-text'>
                <div className='mcq__item-text-inner'>
                  {html(compile(text))}
                </div>
              </div>

            </label>

          </div>
        )}

      </div>

      <div className='btn__container'></div>

    </div>
  );
}
