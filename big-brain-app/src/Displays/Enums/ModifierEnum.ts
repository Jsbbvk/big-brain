//todo maybe a repeat most recent modifier?

enum ModifierEnum {
  NoModifier,

  //samaritan modifiers
  skip_deduction_zero, //skip deduction is set to 0
  blind_trickster, //trickster cannot see correct answer
  cancel_trickster_modifier, //50% chance to cancel trickster's modifier
  increase_round_duration, //increase round duration to 75s
  see_trickster_modifier, //see trickster's current modifier
  double_samaritan_points, //2 points if samaritan wins
  question_difficulty_easy, //set question difficulty to easy
  trickster_no_points, //trickster gets 0 points if they win
  see_answers, //answer is revealed regardless of skip

  //trickster modifiers
  decrease_round_duration, //decrease round duration to 15s
  blind_answers, //players cannot see who voted for what
  cancel_single_samaritan_modifier, //80% chance to cancel a random modifier
  cancel_all_samaritan_modifiers, //60% chance to cancel all modifiers
  double_trickster_point, //2 points if trickster wins
  see_samaritan_modifiers, //see all active samaritan modifiers
  samaritan_choose_wrong_answer, //make random samaritan choose wrong answer
  skip_deduction_increase, //skip deduction increase to 2. skip can't go below 0
  question_difficulty_hard, //set question difficulty to hard
  samaritan_no_points, //samaritans get 0 points if they win
}

export default ModifierEnum;
