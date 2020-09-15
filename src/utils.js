// import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import faker from 'faker/locale/en';

const genId = (n) => {
  const s = 'abcdefghijklmnpqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < n; i++) {
    result += String(s[Math.floor(Math.random() * s.length)]);
  }
  return result;
};

const getUserInfo = () => {
  let uid = localStorage.getItem('userId');
  let name = localStorage.getItem('nickName');
  let avatar = localStorage.getItem('avatarUrl');
  if (!uid) {
    uid = genId(8);
    localStorage.setItem('userId', uid);
  }
  if (!name) {
    name = faker.name.findName();
    localStorage.setItem('nickName', name);
  }
  if (!avatar) {
    avatar = `https://api.adorable.io/avatars/285/${name}.png`;
    localStorage.setItem('avatarUrl', avatar);
  }
  return { userId: uid, nickName: name, avatarUrl: avatar };
};

export { getUserInfo };
