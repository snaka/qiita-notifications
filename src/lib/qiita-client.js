// const notificationsUrl = 'https://qiita.com/api/internal/notifications';
const notificationsUrl = 'http://qiita.test:3000/api/internal/notifications';

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
        return {
          notifications,
          totalUnreadCount: parseInt(response.headers.get('Total-Unread-Count'))
        };
      });
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  });
};
