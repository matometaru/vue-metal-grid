import { mount } from '@vue/test-utils';
import GridItem from '../GridItem';
import * as transitions from '../../animations/transitions';

const mockPorps = {
  index: 1, // 要素のindex
  itemKey: 1, // 要素のkey番号
  component: 'li', // 構成要素
  rect: {
    column: 1,
    height: 1,
    left: 1,
    top: 1,
  },
  containerSize: {
    actualWidth: 100,
    width: 50,
    height: 50,
  },
  duration: 0,
  easing: 'linear',
  appearDelay: 0,
  appear: transitions.fadeUp.appear,
  appeared: transitions.fadeUp.appeared,
  enter: transitions.fadeUp.enter,
  entered: transitions.fadeUp.entered,
  leaved: transitions.fadeUp.leaved,
  units: { length: 'px', angle: 'deg' },
  vendorPrefix: true,
  userAgent: '', // 未使用
  mountedCb: jest.fn(),
  unmountCb: jest.fn(),
  rtl: false,
};

describe('Snapshot Test', () => {
  test('renders correctly', () => {
    const wrapper = mount(GridItem, {
      stubs: ['transition-plus'],
      propsData: mockPorps,
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});

describe('setAppearedStyles', () => {
  test('should be opacity 1', () => {
    const wrapper = mount(GridItem, {
      stubs: ['transition-plus'],
      propsData: mockPorps,
    });
    wrapper.vm.setAppearedStyles();
    expect(wrapper.vm.state.opacity).toBe(1);
  });
});