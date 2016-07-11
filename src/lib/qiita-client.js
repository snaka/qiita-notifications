import 'whatwg-fetch';

const notificationsUrl = 'http://qiita.com/api/internal/notifications';

/**
 * @returns {Promise}
 */
export const getNotifications = () => {
  return fetch(
    notificationsUrl,
    {
      credentials: 'include'
    }
  ).then((response) => {
    if (response.status === 200) {
      return response.json().then((notifications) => {
        notifications.totalCount = parseInt(response.headers['Total-Count']);
        return notifications;
      });
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  });
};
