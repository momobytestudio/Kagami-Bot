const DEVELOPER_IDS = [
  "957900621426622505",
  "1212057396814544918",
  "1027730721747517500"
];

function isDeveloper(userId) {
  return DEVELOPER_IDS.includes(userId);
}

module.exports = isDeveloper;