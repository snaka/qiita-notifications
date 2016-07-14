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
   * @returns {String}
   */
  getIconName() {
    return ({
      AdventCalendarInvitationNotification: 'calendar',
      AdventCalendarItemNotification: 'calendar',
      AdventCalendarItemReminderNotification: 'calendar',
      CommentMentionNotification: 'at',
      FollowingUserNotification: 'user-plus',
      LgtmNotification: 'thumbs-o-up',
      PatchAcceptanceNotification: 'code-fork',
      PatchNotification: 'code-fork',
      ProjectPageMentionNotification: 'at',
      PublicDomainArticleMentionNotification: 'at',
      PublicReferenceNotification: 'reply',
      ReplyCommentNotification: 'comment-o',
      StockedItemUpdateNotification: 'folder-open-o',
      StockItemNotification: 'folder-open-o',
      TeamArticleMentionNotification: 'at',
      TeamReferenceNotification: 'reply',
      ThankNotification: 'thumbs-up',
      ThreadCommentNotification: 'comment-o',
      TweetNotification: 'twitter',
    })[this.props.notification.type] || 'question-circle-o';
  }

  /**
   * @returns {String}
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
        <div className="pull-left margin-right-10">
          <img src={this.props.notification.sender.profile_image_url} height="48" width="48" className="avatar-image" />
        </div>
        <div className="pull-right margin-left-4">
          <i className={`fa fa-fw fa-${this.getIconName()}`} />
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
  constructor(...args) {
    super(...args);
    this.state = { notifications: null };
    chrome.extension.getBackgroundPage().process.getNotifications().then((notifications) => {
      this.setState({ notifications });
    });
  }

  render() {
    return(
      <div>
        {
          (() => {
            if (this.state.notifications) {
              return this.state.notifications.map((notification) => {
                return(
                  <NotificationCard
                    notification={notification}
                    onNotificationCardClicked={this.onNotificationCardClicked.bind(this)}
                  />
                );
              })
            } else {
              return 'Loading...';
            }
          })()
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

ReactDOM.render(
  <Container />,
  document.getElementById('container')
);
