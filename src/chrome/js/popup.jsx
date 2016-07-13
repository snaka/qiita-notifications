import React from 'react'
import ReactDOM from 'react-dom'

const backgroundProcess = chrome.extension.getBackgroundPage().process;
const notifications = backgroundProcess.getState().notifications;

ReactDOM.render(
  (
    <div>
      {
        notifications.map((notification) => {
          return(
            <div className="card">
              <div className="pull-left">
                <img src={notification.sender.profile_image_url} height="48" width="48" className="avatar-image" />
              </div>
              <div>
                <div>
                  {notification.created_at}
                </div>
                <div>
                  @{notification.sender.url_name}
                </div>
                <div>
                  {notification.title}
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  ),
  document.getElementById('container')
);
