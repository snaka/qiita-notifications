import { getNotifications, getUnreadNotificationsCount } from "./qiita-client";

class BackgroundProcessStore {
  constructor() {
    this.onStateChangedCallbacks = [];
    this.state = {
      unreadNotificationsCount: 0
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
   * @returns {Promise}
   */
  getNotifications() {
    return getNotifications();
  }

  /**
   * @returns {Object}
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
    this.update();
    chrome.runtime.onInstalled.addListener(() => {
      chrome.alarms.create("", { periodInMinutes: this.props.timeInterval });
    });
    chrome.alarms.onAlarm.addListener((alarm) => {
      this.update();
    });
  }

  update() {
    getUnreadNotificationsCount().then((unreadNotificationsCount) => {
      this.store.setState({ unreadNotificationsCount: unreadNotificationsCount.value });
    }).catch((error) => {
      console.error(error);
    });
  }
}
