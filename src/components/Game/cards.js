const cards = {};

const numberCards = [...Array(10).keys()];
const funcCards = ['skip', 'reverse', 'plustwo'];
const powerCard = ['normal', 'plusfour'];
const colors = ['red', 'yellow', 'green', 'blue'];

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 4; j++) {
    const key = j.toString(16) + i.toString(16);
    cards[key] = {
      type: 'number',
      value: numberCards[i],
      color: colors[j],
    };
  }
}
for (let i = 1; i < 10; i++) {
  for (let j = 0; j < 4; j++) {
    const key = (j + 4).toString(16) + i.toString(16);
    cards[key] = {
      type: 'number',
      value: numberCards[i],
      color: colors[j],
    };
  }
}
for (let i = 10; i < 13; i++) {
  for (let j = 0; j < 4 * 2; j++) {
    const key = j.toString(16) + i.toString(16);
    cards[key] = {
      type: 'func',
      value: funcCards[i - 10],
      color: colors[j % 4],
    };
  }
}
for (let j = 0; j < 4; j++) {
  let i = 13;
  const key = j.toString(16) + i.toString(16);
  cards[key] = {
    type: 'power',
    value: powerCard[0],
  };
}
for (let j = 4; j < 8; j++) {
  let i = 13;
  const key = j.toString(16) + i.toString(16);
  cards[key] = {
    type: 'power',
    value: powerCard[1],
  };
}

for (let k in cards) {
  let x = parseInt(k[1], 16);
  let y = 7 - parseInt(k[0], 16);
  cards[k]['axis'] = { x, y };
}

const cardids = Object.keys(cards);
const getRandomCardids = () => {
  let result = cardids.slice();
  result.sort(function () {
    return Math.random() - 0.5;
  });
  return result;
};
// console.log(cards);
// console.log(Object.keys(cards).length);
export { cards, cardids, getRandomCardids };
