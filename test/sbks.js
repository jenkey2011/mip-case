// 单选
let answerRadio = [
  3,
  1,
  3,
  2,
  1,
  0,
  0,
  1,
  1,
  0,
  [0,2],
  [0,1,2,3],
  [0,1,2,3],
  [0,1,2,3],
  [0,1,2,3]
];
let question = document.querySelectorAll('.block');

questionRadio(answerRadio);

function questionRadio(arr) {
  for (let [i, anwser] of arr.entries()) {
    setTimeout(() => {
      if (Array.isArray(anwser)) {
        for (let [k, an] of anwser.entries()) {
          question[i].querySelectorAll('input')[an].click()
        }
      } else {
        question[i].querySelectorAll('input')[anwser].click()
      }
    }, 333*i);

  }
}