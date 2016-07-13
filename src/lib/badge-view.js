export default class BadgeView {
  /**
   * @params {Object} props
   */
  constructor(props) {
    this.props = props;
  }

  getText() {
    if (this.props.totalUnreadCount > 0) {
      return this.props.totalUnreadCount.toString();
    } else {
      return '';
    }
  }

  render() {
    chrome.browserAction.setBadgeBackgroundColor({ color : this.props.badgeColor });
    chrome.browserAction.setBadgeText({ text : this.getText() });
  }
}
