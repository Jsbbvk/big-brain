import ClassEnum from "./ClassEnum";
import ModifierEnum from "./ModifierEnum";

const Class = {
  samaritan: {
    [ClassEnum.a]: {
      name: "A",
      modifiers: [
        ModifierEnum.skip_deduction_zero,
        ModifierEnum.blind_trickster,
        ModifierEnum.cancel_trickster_modifier, //60% chance to cancel trickster's modifier
        ModifierEnum.increase_round_duration, //increase round duration to 75s
        ModifierEnum.see_trickster_modifier, //see trickster's current modifier
        //todo ↑
        ModifierEnum.double_samaritan_points, //2 points if samaritan wins
        ModifierEnum.question_difficulty_easy, //set question difficulty to easy
        ModifierEnum.trickster_no_points, //trickster gets 0 points if they win
        ModifierEnum.see_answers, //answer is revealed regardless of skip
      ],
    },
  },
  trickster: {
    [ClassEnum.b]: {
      name: "bjhgf",
      modifiers: [
        ModifierEnum.decrease_round_duration, //decrease round duration to 15s
        ModifierEnum.blind_answers, //players cannot see who voted for what
        ModifierEnum.cancel_single_samaritan_modifier, //80% chance to cancel a random modifier
        ModifierEnum.cancel_all_samaritan_modifiers, //60% chance to cancel all modifiers
        ModifierEnum.double_trickster_point, //2 points if trickster wins
        ModifierEnum.see_samaritan_modifiers, //see all active samaritan modifiers
        //todo ↑
        ModifierEnum.samaritan_choose_wrong_answer, //make random samaritan choose wrong answer
        ModifierEnum.skip_deduction_increase, //skip deduction increase to 2. skip can't go below 0
        ModifierEnum.question_difficulty_hard, //set question difficulty to hard
        ModifierEnum.samaritan_no_points, //samaritans get 0 points if they win
      ],
    },
  },
};

export default Class;
