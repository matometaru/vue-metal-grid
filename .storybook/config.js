import { configure } from '@storybook/vue'

import Vue from 'vue'

// Load stories
// const req = require.context('../src', true, /\.stories\.js$/);
//
// configure(() => {
//   req.keys().forEach(filename => req(filename));
// }, module);

function loadStories() {
  require('../src/components/GridItem.stories.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);