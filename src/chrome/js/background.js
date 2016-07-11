import BackgroundProcess from '../../lib/background-process';

class BadgeView {
  /**
   * @params {Object} props
   */
  constructor(props) {
    this.props = props || {};
  }

  getText() {
    if (this.props.notifications && this.props.notifications.totalCount > 0) {
      return this.props.notifications.totalCount.toString();
    } else {
      return '';
    }
  }

  render() {
    chrome.browserAction.setBadgeBackgroundColor({
      color : [
        0,
        152,
        204,
        255
      ]
    });
    chrome.browserAction.setBadgeText({
      text : this.getText()
    });
  }
}

const process = new BackgroundProcess();
const badgeView = new BadgeView();
process.onStateChanged(({ notifications }) => {
  badgeView.props.notifications = notifications;
  badgeView.render();
});
process.start();
