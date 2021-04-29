import request from '../../utils/request';

export default class {
  constructor(options) {
    this.options = {
      ...options,
    };
  }

  async test() {
    try {
      const { data } = await request.get('/');
      console.log(data);
    } catch {}

    return 'yo';
  }
}
