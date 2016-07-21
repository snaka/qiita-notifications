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
    return moment(this.props.notification.created_at).fromNow();
  }

  /**
   * @returns {String}
   */
  getIconColor() {
    return ({
      AdventCalendarInvitationNotification: '#CCC',
      AdventCalendarItemNotification: '#CCC',
      AdventCalendarItemReminderNotification: '#CCC',
      CommentMentionNotification: '#D4174E',
      FollowingUserNotification: '#4FA0F7',
      LgtmNotification: '#F0AA00',
      PatchAcceptanceNotification: '#6A5397',
      PatchNotification: '#83C72D',
      ProjectPageCommentReactionNotification: '#F0AA00',
      ProjectPageMentionNotification: '#D4174E',
      ProjectPageReactionNotification: '#F0AA00',
      PublicDomainArticleMentionNotification: '#D4174E',
      PublicReferenceNotification: '#CCC',
      ReplyCommentNotification: '#E1640E',
      StockedItemUpdateNotification: '#63D080',
      StockItemNotification: '#63D080',
      TeamArticleCommentReactionNotification: '#F0AA00',
      TeamArticleMentionNotification: '#D4174E',
      TeamArticleReactionNotification: '#F0AA00',
      TeamReferenceNotification: '#CCC',
      ThankNotification: '#F0AA00',
      ThreadCommentNotification: '#E1640E',
      TweetNotification: '#60B4F1',
    })[this.props.notification.type] || '#CCC';
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
      ProjectPageCommentReactionNotification: 'smile-o',
      ProjectPageMentionNotification: 'at',
      ProjectPageReactionNotification: 'smile-o',
      PublicDomainArticleMentionNotification: 'at',
      PublicReferenceNotification: 'reply',
      ReplyCommentNotification: 'comment-o',
      StockedItemUpdateNotification: 'folder-open-o',
      StockItemNotification: 'folder-open-o',
      TeamArticleCommentReactionNotification: 'smile-o',
      TeamArticleMentionNotification: 'at',
      TeamArticleReactionNotification: 'smile-o',
      TeamReferenceNotification: 'reply',
      ThankNotification: 'thumbs-up',
      ThreadCommentNotification: 'comment-o',
      TweetNotification: 'twitter',
    })[this.props.notification.type] || 'question-circle';
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

  /**
   * @returns {String}
   */
  getVerb() {
    return ({
      AdventCalendarInvitationNotification: 'invited',
      AdventCalendarItemNotification: 'registered to calendar',
      AdventCalendarItemReminderNotification: 'reminded',
      CommentMentionNotification: 'mentioned',
      FollowingUserNotification: 'followed',
      LgtmNotification: 'liked',
      PatchAcceptanceNotification: 'accepted patch',
      PatchNotification: 'patched',
      ProjectPageCommentReactionNotification: 'reacted',
      ProjectPageMentionNotification: 'mentioned',
      ProjectPageReactionNotification: 'reacted',
      PublicDomainArticleMentionNotification: 'mentioned',
      PublicReferenceNotification: 'referenced',
      ReplyCommentNotification: 'commented',
      StockedItemUpdateNotification: 'updated',
      StockItemNotification: 'stocked',
      TeamArticleCommentReactionNotification: 'reacted',
      TeamArticleMentionNotification: 'mentioned',
      TeamArticleReactionNotification: 'reacted',
      TeamReferenceNotification: 'referenced',
      ThankNotification: 'thanked',
      ThreadCommentNotification: 'commented',
      TweetNotification: 'tweeted',
    })[this.props.notification.type] || 'did something';
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
          <i className={`card-icon fa fa-fw fa-${this.getIconName()}`} style={{ backgroundColor: this.getIconColor() }} />
        </div>
        <div className="card-body">
          <div className="pull-right color-gray margin-left-4">
            {this.getCreatedAt()}
          </div>
          <div className="margin-bottom-4">
            <img src={this.props.notification.sender.profile_image_url} height="20" width="20" className="avatar-image" />
            <span className="font-bold margin-right-4">
              {this.props.notification.sender.url_name}
            </span>
            {this.getVerb()}
            <span className="color-gray margin-left-4">
              on {this.getTeamName()}
            </span>
          </div>
          <div className="text-ellipsis" style={{ fontSize: "14px" }}>
            {this.props.notification.title}
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
    chrome.runtime.getBackgroundPage((background) => {
      background.process.update();
      background.process.getNotifications().then((notifications) => {
        this.setState({ notifications });
      });
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
      active: false,
      url: event.detail.notification.url
    });
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('container')
);
