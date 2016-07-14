/**
 * @param {String} path
 * @returns {Promise}
 */
const get = (path) => {
  return fetch(
    `${getBaseUrl()}${path}`,
    {
      credentials: 'include',
      mode: 'no-cors',
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
 * @returns {String}
 */
const getBaseUrl = () => {
  return process.env.QIITA_BASE_URL || 'https://qiita.com';
};

/**
 * @returns {Promise}
 */
export const getNotifications = () => {
  return get('/api/internal/notifications');
};

/**
 * @returns {Promise}
 */
export const getUnreadNotificationsCount = () => {
  return get('/api/internal/unread_notifications_count');
};
