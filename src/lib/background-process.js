import { getNotifications } from './qiita-client';

class BackgroundProcessStore {
  constructor() {
    this.onStateChangedCallbacks = [];
    this.state = {
      notifications: [],
      totalUnreadCount: 0
    };
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

export default class BackgroundProcess {
  /**
   * @param {Object} props
   */
  constructor(props) {
    this.props = props;
    this.store = new BackgroundProcessStore();
  }

  /**
   * @return {Object}
   */
  getState() {
    return this.store.state;
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
        getNotifications().then(({ notifications, totalUnreadCount }) => {
          this.store.setState({ notifications, totalUnreadCount });
        }).catch((error) => {
          console.error(error);
        });
      },
      this.props.timeInterval
    );
  }
}
