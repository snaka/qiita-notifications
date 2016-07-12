import jQuery from 'jquery'

const notificationsUrl = 'https://qiita.com/api/internal/notifications';

/**
 * @returns {Promise}
 */
export const getUnreadNotifications = () => {
  return jQuery.get(
    notificationsUrl,
    {
      credentials: 'include'
    }
  ).then((notifications, textStatus, jqXHR) => {
    if (jqXHR.status === 200) {
      return Promise.resolve({
        notifications,
        totalCount: parseInt(jqXHR.getResponseHeader('Total-Count'))
      });
    } else {
      return Promise.reject(textStatus);
    }
  });
};
