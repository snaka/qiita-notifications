import moment from 'moment'
import React from 'react'
import ReactDOM from 'react-dom'

class NotificationCard extends React.Component {
  /**
   * @returns [String]
   */
  getClassName() {
    if (this.props.notification.read) {
      return 'card';
    } else {
      return 'card active';
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

  onClick(event) {
    this.props.onNotificationCardClicked(
      new CustomEvent(
        'NotificationCardClicked',
        {
          detail: {
            notification: this.props.notification,
            originalEvent: event
          }
        }
      )
    );
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

class Container extends React.Component {
  render() {
    return(
      <div>
        {
          this.props.notifications.map((notification) => {
            return(
              <NotificationCard
                notification={notification}
                onNotificationCardClicked={this.onNotificationCardClicked.bind(this)}
              />
            );
          })
        }
      </div>
    );
  }

  /**
   * @param {CustomEvent} event
   */
  onNotificationCardClicked(event) {
    chrome.tabs.create({
      selected: false,
      url: event.detail.notification.url
    });
  }
}

const notifications = chrome.extension.getBackgroundPage().process.getState().notifications;

ReactDOM.render(
  <Container notifications={notifications} />,
  document.getElementById('container')
);
