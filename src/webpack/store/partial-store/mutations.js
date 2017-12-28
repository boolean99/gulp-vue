// Store의 mutation을 정의합니다.

import * as types from './types';

export default {
  [types.INCREMENT] (state, payLoad) {
    state.number = Number.isInteger(payLoad.amount) ? state.number + payLoad.amount :  state.number;
  }
}
