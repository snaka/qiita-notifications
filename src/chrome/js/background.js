import BackgroundProcess from '../../lib/background-process';

class BadgeView {
  /**
   * @params {Object} props
   */
  constructor(props) {
    this.props = props || {};
  }

  getText() {
    if (this.props.totalCount > 0) {
      return this.props.totalCount.toString();
    } else {
      return '';
    }
  }

  render() {
    chrome.browserAction.setBadgeBackgroundColor({
      color : [
        236,
        67,
        1,
        255
      ]
    });
    chrome.browserAction.setBadgeText({
      text : this.getText()
    });
  }
}

window.process = new BackgroundProcess();
const badgeView = new BadgeView();
window.process.onStateChanged(({ notifications, totalCount }) => {
  badgeView.props.notifications = notifications;
  badgeView.props.totalCount = totalCount;
  badgeView.render();
});
window.process.start();
