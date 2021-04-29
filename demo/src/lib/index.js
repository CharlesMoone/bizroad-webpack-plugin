import HandleTest from './classes/HandleTest';

export default class {
  constructor(options) {
    this.options = {
      ...options,
    };
  }

  async test() {
    const handleTest = new HandleTest(this.options);
    console.log('test!', await handleTest.test());
  }
}
