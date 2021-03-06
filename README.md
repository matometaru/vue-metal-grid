## vue-metal-grid

## Demo
[Vue Metal Grid](https://matometaru.github.io/vue-metal-grid/#/)

## Install

`npm i vue-metal-grid`

`yarn add vue-metal-grid`

## Basic Usage

```
<template>
  <MetalGrid>
    <template v-for="item in items">
      <a :href="item.link" target="_blank" :key="item.id">
        <p class="date">{{item.date|format}}</p>
        <p class="tit">{{item.title.rendered}}</p>
      </a>
    </template>
  </MetalGrid>
</template>

<script>
import MetalGrid from 'vue-metal-grid'

export default {
  components: {
    MetalGrid: MetalGrid
  },
...
```

## Thanks

* [tsuyoshiwada/react\-stack\-grid: Pinterest like layout components for React\.js](https://github.com/tsuyoshiwada/react-stack-grid)

## License
Released under the MIT Licence

## Author
[matometaru](https://github.com/matometaru)

## Development
Initialization of the project.

```
$ cd /your/project/dir
$ git clone https://github.com/matometaru/vue-metal-grid.git
```

Install some dependencies.
```
$ npm install
```

Start the development and can you see demo page (access to the http://localhost:3000/).
```
$ npm start
```

Run ESLint.
```
$ npm test:lint
```
