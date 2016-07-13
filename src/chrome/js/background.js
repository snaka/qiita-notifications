import BackgroundProcess from '../../lib/background-process';

class BadgeView {
  /**
   * @params {Object} props
   */
  constructor(props) {
    this.props = props || {};
  }

  getText() {
    if (this.props.notifications && this.props.totalCount > 0) {
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

const process = new BackgroundProcess();
const badgeView = new BadgeView();
process.onStateChanged(({ notifications, totalCount }) => {
  badgeView.props.notifications = notifications;
  badgeView.props.totalCount = totalCount;
  badgeView.render();
});
process.start();
