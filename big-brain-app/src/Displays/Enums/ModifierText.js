import ModifierEnum from "./ModifierEnum";

const ModifierText = {
  //samaritan modifiers
  [ModifierEnum.skip_deduction_zero]:
    "If necessary, you can skip without a penalty this round.",
  [ModifierEnum.blind_trickster]:
    "During this round, the trickster won't be able to see the correct answer until the results are shown.",
  [ModifierEnum.cancel_trickster_modifier]:
    "<b>50%</b> that the trickster will have their modifier cancelled this round.",
  [ModifierEnum.increase_round_duration]:
    "This round's timer will be increased from 45 seconds to <b>75 seconds</b>.",
  [ModifierEnum.see_trickster_modifier]:
    "You can view the trickster's active modifier this round.",
  [ModifierEnum.double_samaritan_points]:
    "If samaritans win this round, <b>2</b> points will be awarded.",
  [ModifierEnum.question_difficulty_easy]:
    "This round's question will be <b>easy</b>.",
  [ModifierEnum.trickster_no_points]:
    "If the trickster wins this round, <b>no</b> points will be awarded.",
  [ModifierEnum.see_answers]:
    "The correct answer will be shown if this round is skipped.",

  //trickster modifiers
  [ModifierEnum.blind_answers]:
    "The correct answer will <b>not be revealed at all</b> this round.",
  [ModifierEnum.cancel_all_samaritan_modifiers]:
    "<b>60%</b> chance to cancel all samaritan modifiers this round.",
  [ModifierEnum.cancel_single_samaritan_modifier]:
    "<b>80%</b> chance to cancel a random samaritan's modifier this round.",
  [ModifierEnum.double_trickster_point]:
    "If the trickster wins this round, <b>2</b> points will be awarded.",
  [ModifierEnum.see_samaritan_modifiers]:
    "You can <b>view all samaritan modifiers</b> this round.",
  [ModifierEnum.samaritan_choose_wrong_answer]:
    "A random samaritan will choose the <b>wrong answer</b> this round.",
  [ModifierEnum.skip_deduction_increase]:
    "If this round is skipped, the number of skips left will decrease by <b>2</b>.",
  [ModifierEnum.question_difficulty_hard]:
    "This round's question will be <b>hard</b>.",
  [ModifierEnum.samaritan_no_points]:
    "If samaritans win this round, <b>no</b> points will be awarded.",
  [ModifierEnum.decrease_round_duration]:
    "This round's timer will be reduced from 45 seconds to <b>15 seconds</b>.",
};

export default ModifierText;
