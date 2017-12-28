// Store의 getter를 정의합니다.

import * as types from './types';

export default {
  [types.HALF_OF_NUMBER]: state => {
    return state.number - (state.number / 2);
  }
}
