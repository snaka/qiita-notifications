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
window.process.onStateChanged(({ notifications, totalCount }) => {
  new BadgeView({
    badgeColor,
    notifications,
    totalCount
  }).render();
});
window.process.start();
