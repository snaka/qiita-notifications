import jQuery from "jquery";

/**
 * @param {String} path
 * @returns {Promise}
 */
const get = (path) => {
  return new Promise((done, fail) => {
    jQuery.ajax({
      method: "GET",
      dataType: "json",
      url: `${getBaseUrl()}${path}`,
    }).done(done).fail(fail);
  });
};

/**
 * @returns {String}
 */
const getBaseUrl = () => {
  return process.env.QIITA_BASE_URL || "https://qiita.com";
};

/**
 * @returns {Promise}
 */
export const getNotifications = () => {
  return get("/api/internal/notifications");
};

/**
 * @returns {Promise}
 */
export const getUnreadNotificationsCount = () => {
  return get("/api/internal/unread_notifications_count");
};
