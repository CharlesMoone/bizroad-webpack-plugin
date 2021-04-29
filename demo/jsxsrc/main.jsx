import React from 'react';
import ReactDOM from 'react-dom';

import utils from './utils';

const PageHello = loadable.withLoading(() => import('./Hello'));

ReactDOM.render(<div>${utils.Utils}</div>, document.getElementById('root'));
