import moment from 'moment'
import React from 'react'
import ReactDOM from 'react-dom'

const backgroundProcess = chrome.extension.getBackgroundPage().process;
const notifications = backgroundProcess.getState().notifications;

class NotificationCard extends React.Component {
  /**
   * @returns [String]
   */
  getClassName() {
    if (this.props.notification.read) {
      return 'card active';
    } else {
      return 'card';
    }
  }

  /**
   * @returns {String}
   */
  getCreatedAt() {
    return moment(this.props.notification.created_at).format('YYYY-MM-DD hh:mm');
  }

  /**
   * @return {String}
   */
  getTeamName() {
    if (this.props.notification.team) {
      return this.props.notification.team.name;
    } else {
      return 'Qiita';
    }
  }

  onClick() {
    chrome.tabs.create({
      url: this.props.notification.url
    });
  }

  render() {
    return(
      <div className={this.getClassName()} onClick={this.onClick.bind(this)}>
        <div className="pull-left">
          <img src={this.props.notification.sender.profile_image_url} height="48" width="48" className="avatar-image" />
        </div>
        <div>
          <div>
            @{this.props.notification.sender.url_name}
          </div>
          <div className="color-black" style={{ fontSize: "14px" }}>
            {this.props.notification.title}
          </div>
          <div className="color-gray">
            {this.getCreatedAt()} on {this.getTeamName()}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  (
    <div>
      {
        notifications.map(notification => <NotificationCard notification={notification}/>)
      }
    </div>
  ),
  document.getElementById('container')
);
