const axios = require("axios").default;
const shuffle = require("lodash/_arrayShuffle");
let sessionToken = "";

const setSessionToken = async () => {
  let res = await axios({
    method: "get",
    url: "https://opentdb.com/api_token.php?command=request",
  });

  sessionToken = res.data.token;
};

const getQuestion = async (difficulty = "medium") => {
  let res = await axios({
    method: "get",
    url: `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple&token=${sessionToken}`,
  });

  let {
    data: { results },
  } = res;
  let { correct_answer, incorrect_answers, question } = results[0];

  let answers = shuffle([
    correct_answer,
    incorrect_answers[(Math.random() * incorrect_answers.length) | 0],
  ]);

  return {
    question,
    answers,
    correctIndex: answers.indexOf(correct_answer),
  };
};

module.exports = { setSessionToken, getQuestion };
