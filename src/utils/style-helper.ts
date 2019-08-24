import { prefix } from 'inline-style-prefixer';
import {
  createCSSTransformBuilder,
  properties,
  Units,
} from 'easy-css-transform-builder';

export { Units, transition, buildStyles };

const isTransformProp = (v: string) => properties.indexOf(v) > -1;

const transition = (props: any[], duration: any, easing: any) => {
  props.map(prop => `${prop} ${duration}ms ${easing}`).join(',');
};

const buildStyles = (
  styles: Record<string, any>,
  units: Units,
  vendorPrefix: boolean,
  userAgent: string
) => {
  const builder = createCSSTransformBuilder(units);
  const finalStyles: Record<string, string> = {};
  const transformStyles: Record<string, string> = {};

  Object.keys(styles).forEach(key => {
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

  const transform = builder(transformStyles);
  if (transform !== '') {
    finalStyles.transform = transform;
  }

  if (vendorPrefix) {
    return prefix(finalStyles);
  }

  return finalStyles;
};
