<template>
  <div>{{ hello }}</div>
</template>
<script>
import axios from 'axios';

import module from '@/module';
import ddd, { yello } from './yello';

export default {
  data() {
    return {
      hello: '1',
    };
  },
};
</script>
<style scoped>
div {
  margin: 0;
}
</style>
