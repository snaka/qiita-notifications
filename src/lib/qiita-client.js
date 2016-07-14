/**
 * @param {String} url
 * @returns {Promise}
 */
export const get = (url) => {
  return fetch(
    url,
    {
      credentials: 'include'
    }
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  });
};

/**
 * @returns {Promise}
 */
export const getNotifications = () => {
  return get('http://qiita.test:3000/api/internal/notifications');
};

/**
 * @returns {Promise}
 */
export const getUnreadNotificationsCount = () => {
  return get('http://qiita.test:3000/api/internal/unread_notifications_count');
};
