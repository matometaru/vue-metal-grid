// @flow
import Prefixer from 'inline-style-prefixer';
import { createCSSTransformBuilder, properties } from 'easy-css-transform-builder';

export const Units = {
  length: '',
  angle: '',
};


const isTransformProp = v => properties.indexOf(v) > -1;

export const transition = (props, duration, easing) => (
  props.map(prop => `${prop} ${duration}ms ${easing}`).join(',')
);


export const buildStyles = (
  styles,
  units,
  vendorPrefix,
  userAgent,
) => {
  const builder = createCSSTransformBuilder(units);
  const finalStyles = {};
  const transformStyles = {};

  Object.keys(styles).forEach((key) => {
    const value = styles[key];

    if (isTransformProp(key)) {
      transformStyles[key] = value;

      if (key === 'perspective') {
        finalStyles[key] = value;
      }
    } else {
      finalStyles[key] = value;
    }
  });

  const transform = builder(transformStyles, units);
  if (transform !== '') {
    finalStyles.transform = transform;
  }

  if (vendorPrefix) {
    const prefixer = new Prefixer({ userAgent });
    return prefixer.prefix(finalStyles);
  }

  return finalStyles;
};