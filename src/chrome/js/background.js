import BackgroundProcess from '../../lib/background-process';
import BadgeView from '../../lib/badge-view';


const badgeColor = [
  236,
  67,
  1,
  255
];
const timeInterval = 5 * 1000;

window.process = new BackgroundProcess({ timeInterval });
window.process.onStateChanged(({ notifications, totalUnreadCount }) => {
  new BadgeView({
    badgeColor,
    notifications,
    totalUnreadCount
  }).render();
});
window.process.start();
