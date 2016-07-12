import { getUnreadNotifications } from './qiita-client';

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

const timeInterval = 1 * 1000;

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
        getUnreadNotifications().then(({ notifications, totalCount }) => {
          this.store.setState({ notifications, totalCount });
        }).catch((error) => {
          console.error(error);
        });
      },
      timeInterval
    );
  }
}
