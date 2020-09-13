// import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import faker from 'faker/locale/en';

const getNickName = () => {
  let name = localStorage.getItem('nickName');
  if (!name) {
    name = faker.name.findName();
    localStorage.setItem('nickName', name);
  }
  return name;
};

export { getNickName };
