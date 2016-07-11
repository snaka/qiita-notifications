import { getNotifications } from './qiita-client';

class BackgroundProcessStore {
  constructor() {
    this.onStateChangedCallbacks = [];
    this.state = {};
  }

  /**
   * @param {Function} callback
   */
  onStateChanged(callback) {
    this.onStateChangedCallbacks.push(callback);
  }

  /**
   * @param {Object} state
   */
  setState(state) {
    Object.keys(state).forEach((key) => {
      this.state[key] = state[key];
    });
    this.onStateChangedCallbacks.forEach((callback) => {
      callback(this.state);
    });
  }
}

const timeInterval = 5 * 1000;

export default class BackgroundProcess {
  constructor() {
    this.store = new BackgroundProcessStore();
  }

  /**
   * @param {Function} callback
   */
  onStateChanged(callback) {
    this.store.onStateChanged(callback);
  }

  start() {
    setInterval(
      () => {
        // getNotifications().then(({ notifications }) => {
        //   this.store.setState({ notifications });
        // }).catch((error) => {
        //   console.error(error);
        // });
        this.store.setState({ notifications: { totalCount: 1 } });
      },
      timeInterval
    );
  }
}
