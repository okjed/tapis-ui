import { call, put, takeLeading } from 'redux-saga/effects';
import { authSuccess } from '../fixtures/auth.fixture';
// import login from 'utils/tapis';
import { ACTIONS } from '../actions/auth';

export function* authLogin(action) {
  try {
    yield put({ type: ACTIONS.LOGIN.START });
    //const userJson = yield call(login, action.payload);
    const userJson = authSuccess;
    yield put({ type: ACTIONS.LOGIN.SUCCESS, payload: userJson });
  } catch (error) {
    yield put({
      type: ACTIONS.LOGIN.ERROR,
      payload: error,
    });
  }
}

export function* watchLogin() {
  yield takeLeading(ACTIONS.LOGIN.LOGIN, authLogin);
}
