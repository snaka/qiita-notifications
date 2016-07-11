import BackgroundProcess from '../../lib/background-process';

const process = new BackgroundProcess();
process.onStateChanged(({ notifications }) => {
  alert(notifications.totalCount);
});
process.start();
