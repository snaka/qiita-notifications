import jQuery from "jquery"
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";
import "moment/locale/ja";

class NotificationCard extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (!this.getIsActive() && nextProps.index === nextProps.selectedNotificationIndex) {
      if (this.getIsOverflowedToTop()) {
        jQuery('html, body').scrollTop(jQuery(this.notificationElement).offset().top);
      } else if (this.getIsOverflowedToBottom()) {
        jQuery('html, body').scrollTop(jQuery(this.notificationElement).offset().top - jQuery(window).height() + jQuery(this.notificationElement).outerHeight());
      }
    }
  }

  /**
   * @returns [String]
   */
  getClassName() {
    let classNames = ["card"];
    if (!this.props.notification.read) {
      classNames.push("active");
    } else if (this.getIsActive()) {
      classNames.push("selected");
    }
    return classNames.join(" ");
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
      AdventCalendarInvitationNotification: "#CCC",
      AdventCalendarItemNotification: "#CCC",
      AdventCalendarItemReminderNotification: "#CCC",
      CommentMentionNotification: "#D4174E",
      FollowingUserNotification: "#4FA0F7",
      LgtmNotification: "#F0AA00",
      PatchAcceptanceNotification: "#6A5397",
      PatchNotification: "#83C72D",
      ProjectPageCommentReactionNotification: "#F0AA00",
      ProjectPageMentionNotification: "#D4174E",
      ProjectPageReactionNotification: "#F0AA00",
      PublicDomainArticleMentionNotification: "#D4174E",
      PublicReferenceNotification: "#CCC",
      ReplyCommentNotification: "#E1640E",
      StockedItemUpdateNotification: "#63D080",
      StockItemNotification: "#63D080",
      TeamArticleCommentReactionNotification: "#F0AA00",
      TeamArticleMentionNotification: "#D4174E",
      TeamArticleReactionNotification: "#F0AA00",
      TeamReferenceNotification: "#CCC",
      ThankNotification: "#F0AA00",
      ThreadCommentNotification: "#E1640E",
      TweetNotification: "#60B4F1",
    })[this.props.notification.type] || "#CCC";
  }

  /**
   * @returns {String}
   */
  getIconName() {
    return ({
      AdventCalendarInvitationNotification: "calendar",
      AdventCalendarItemNotification: "calendar",
      AdventCalendarItemReminderNotification: "calendar",
      CommentMentionNotification: "at",
      FollowingUserNotification: "user-plus",
      LgtmNotification: "thumbs-o-up",
      PatchAcceptanceNotification: "code-fork",
      PatchNotification: "code-fork",
      ProjectPageCommentReactionNotification: "smile-o",
      ProjectPageMentionNotification: "at",
      ProjectPageReactionNotification: "smile-o",
      PublicDomainArticleMentionNotification: "at",
      PublicReferenceNotification: "reply",
      ReplyCommentNotification: "comment-o",
      StockedItemUpdateNotification: "folder-open-o",
      StockItemNotification: "folder-open-o",
      TeamArticleCommentReactionNotification: "smile-o",
      TeamArticleMentionNotification: "at",
      TeamArticleReactionNotification: "smile-o",
      TeamReferenceNotification: "reply",
      ThankNotification: "thumbs-up",
      ThreadCommentNotification: "comment-o",
      TweetNotification: "twitter",
    })[this.props.notification.type] || "question-circle";
  }

  /**
   * @returns {Boolean}
   */
  getIsActive() {
    return this.props.selectedNotificationIndex === this.props.index;
  }

  /**
   * @returns {Boolean}
   */
  getIsOverflowedToBottom() {
    return jQuery(document).scrollTop() + jQuery(window).height() < jQuery(this.notificationElement).offset().top;
  }

  /**
   * @returns {Boolean}
   */
  getIsOverflowedToTop() {
    return jQuery(document).scrollTop() > jQuery(this.notificationElement).offset().top + jQuery(this.notificationElement).height();
  }

  /**
   * @returns {String}
   */
  getTeamName() {
    if (this.props.notification.team) {
      return this.props.notification.team.name;
    } else {
      return "Qiita";
    }
  }

  /**
   * @returns {String}
   */
  getVerb() {
    return chrome.i18n.getMessage(`verb_for_${this.props.notification.type}`) || chrome.i18n.getMessage("verb_for_unknown_notification_type");
  }

  onClick(event) {
    this.props.onNotificationCardClicked(
      new CustomEvent(
        "NotificationCardClicked",
        {
          detail: {
            notification: this.props.notification,
            originalEvent: event,
          }
        }
      )
    );
  }

  onMouseOver(event) {
    this.props.onNotificationCardMousedOver(
      new CustomEvent(
        "NotificationCardMousedOver",
        {
          detail: {
            index: this.props.index,
            originalEvent: event,
          }
        }
      )
    );
  }

  render() {
    return(
      <div className={this.getClassName()} onClick={this.onClick.bind(this)} onMouseOver={this.onMouseOver.bind(this)} ref={(ref) => this.notificationElement = ref}>
        <div className="pull-left margin-right-10">
          <i className={`card-icon fa fa-fw fa-${this.getIconName()}`} style={{ backgroundColor: this.getIconColor() }} />
        </div>
        <div className="card-body">
          <div className="pull-right color-light-gray font-13 margin-left-4">
            {this.getCreatedAt()}
          </div>
          <div className="margin-bottom-4">
            <img src={this.props.notification.sender.profile_image_url} height="20" width="20" className="avatar-image" />
            {
              (() => {
                if (this.props.notification.sender) {
                  return(
                    <span className="font-bold">
                      {this.props.notification.sender.url_name}
                    </span>
                  );
                }
              })()
            }
            {this.getVerb()}
            <span className="color-light-gray margin-left-4">
              on {this.getTeamName()}
            </span>
          </div>
          <div className="color-gray font-13 text-ellipsis">
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
    this.state = {
      notifications: null,
      selectedNotificationIndex: -1,
    };
    chrome.runtime.getBackgroundPage((background) => {
      background.process.update();
      background.process.getNotifications().then((notifications) => {
        this.setState({ notifications });
      });
    });
  }

  componentDidMount() {
    window.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
      case 13:
        this.onReturnKeyPressed();
        break;
      case 38:
      case 75:
        this.onUpKeyPressed();
        break;
      case 40:
      case 74:
        this.onDownKeyPressed();
        break;
      }
    });
  }

  /**
   * @returns {Integer}
   */
  getNextNotificationIndex() {
    if (this.state.notifications) {
      return Math.min(this.state.selectedNotificationIndex + 1, this.state.notifications.length - 1);
    } else {
      return -1;
    }
  }

  /**
   * @returns {Integer}
   */
  getPreviousNotificationIndex() {
    if (this.state.notifications) {
      if (this.state.selectedNotificationIndex === -1) {
        return this.state.notifications.length - 1;
      } else {
        return Math.max(this.state.selectedNotificationIndex - 1, 0);
      }
    } else {
      return -1;
    }
  }

  render() {
    return(
      <div>
        {
          (() => {
            if (this.state.notifications) {
              return this.state.notifications.map((notification, index) => {
                return(
                  <NotificationCard
                    key={index}
                    index={index}
                    notification={notification}
                    onNotificationCardClicked={this.onNotificationCardClicked.bind(this)}
                    onNotificationCardMousedOver={this.onNotificationCardMousedOver.bind(this)}
                    selectedNotificationIndex={this.state.selectedNotificationIndex}
                  />
                );
              });
            } else {
              return "Loading...";
            }
          })()
        }
      </div>
    );
  }

  onDownKeyPressed() {
    this.setState({ selectedNotificationIndex: this.getNextNotificationIndex() });
  }

  /**
   * @param {CustomEvent} event
   */
  onNotificationCardClicked(event) {
    chrome.tabs.create({
      active: false,
      url: event.detail.notification.url,
    });
  }

  /**
   * @param {CustomEvent} event
   */
  onNotificationCardMousedOver(event) {
    this.setState({ selectedNotificationIndex: event.detail.index });
  }

  onReturnKeyPressed() {
    if (this.state.notifications && this.state.selectedNotificationIndex) {
      chrome.tabs.create({
        active: false,
        url: this.state.notifications[this.state.selectedNotificationIndex].url,
      });
    }
  }

  onUpKeyPressed() {
    this.setState({ selectedNotificationIndex: this.getPreviousNotificationIndex() });
  }
}

moment.locale(chrome.i18n.getMessage("currentLanguageCode"));

ReactDOM.render(
  <Container />,
  document.getElementById("container")
);

window.addEventListener("unload", () => {
  chrome.runtime.getBackgroundPage((background) => {
    background.process.update();
  });
});
