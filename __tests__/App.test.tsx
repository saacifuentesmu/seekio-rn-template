import React from 'react';
import {it} from '@jest/globals';
import renderer from 'react-test-renderer';

import App from '../App';

it('renders without crashing', () => {
  renderer.create(<App />);
});
