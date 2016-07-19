import BackgroundProcess from "../../lib/background-process";
import BadgeView from "../../lib/badge-view";

const badgeColor = [
  236,
  67,
  1,
  255
];
const timeInterval = 10 * 60 * 1000;

window.process = new BackgroundProcess({ timeInterval });
window.process.onStateChanged(({ unreadNotificationsCount }) => {
  new BadgeView({
    badgeColor,
    unreadNotificationsCount
  }).render();
});
window.process.start();
