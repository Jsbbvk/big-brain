import ClassEnum from "./ClassEnum";
import ModifierEnum from "./ModifierEnum";

const Class = {
  samaritan: {
    [ClassEnum.Sociopath]: {
      name: "Sociopath",
      modifiers: [
        ModifierEnum.blind_trickster,
        ModifierEnum.blind_trickster,
        ModifierEnum.cancel_trickster_modifier,
        ModifierEnum.cancel_trickster_modifier,
        ModifierEnum.see_trickster_modifier,
        ModifierEnum.trickster_no_points,
      ],
    },
    [ClassEnum.Genius]: {
      name: "Genius",
      modifiers: [
        ModifierEnum.increase_round_duration,
        ModifierEnum.increase_round_duration,
        ModifierEnum.skip_deduction_zero,
        ModifierEnum.skip_deduction_zero,
        ModifierEnum.see_trickster_modifier,
        ModifierEnum.see_answers,
      ],
    },
    [ClassEnum.Speedrunner]: {
      name: "Speedrunner",
      modifiers: [
        ModifierEnum.question_difficulty_easy,
        ModifierEnum.question_difficulty_easy,
        ModifierEnum.skip_deduction_zero,
        ModifierEnum.skip_deduction_zero,
        ModifierEnum.increase_round_duration,
        ModifierEnum.double_samaritan_points,
      ],
    },
    [ClassEnum.Benefactor]: {
      name: "Benefactor",
      modifiers: [
        ModifierEnum.double_samaritan_points,
        ModifierEnum.double_samaritan_points,
        ModifierEnum.see_answers,
        ModifierEnum.see_answers,
        ModifierEnum.question_difficulty_easy,
        ModifierEnum.skip_deduction_zero,
      ],
    },
    [ClassEnum.Hunter]: {
      name: "Hunter",
      modifiers: [
        ModifierEnum.see_trickster_modifier,
        ModifierEnum.see_trickster_modifier,
        ModifierEnum.trickster_no_points,
        ModifierEnum.trickster_no_points,
        ModifierEnum.blind_trickster,
        ModifierEnum.cancel_trickster_modifier,
      ],
    },
    [ClassEnum.Gifted]: {
      name: "Gifted",
      modifiers: [
        ModifierEnum.question_difficulty_easy,
        ModifierEnum.trickster_no_points,
        ModifierEnum.cancel_trickster_modifier,
        ModifierEnum.blind_trickster,
        ModifierEnum.skip_deduction_zero,
        ModifierEnum.increase_round_duration,
        ModifierEnum.see_answers,
      ],
    },
  },
  trickster: {
    [ClassEnum.Berserker]: {
      name: "Berserker",
      modifiers: [
        ModifierEnum.cancel_all_samaritan_modifiers,
        ModifierEnum.cancel_all_samaritan_modifiers,
        ModifierEnum.cancel_single_samaritan_modifier,
        ModifierEnum.cancel_single_samaritan_modifier,
        ModifierEnum.question_difficulty_hard,
        ModifierEnum.samaritan_choose_wrong_answer,
        ModifierEnum.blind_answers,
      ],
    },
    [ClassEnum.Megamind]: {
      name: "Megamind",
      modifiers: [
        ModifierEnum.see_samaritan_modifiers,
        ModifierEnum.see_samaritan_modifiers,
        ModifierEnum.question_difficulty_hard,
        ModifierEnum.question_difficulty_hard,
        ModifierEnum.decrease_round_duration,
        ModifierEnum.skip_deduction_increase,
        ModifierEnum.cancel_single_samaritan_modifier,
      ],
    },
    [ClassEnum.Hustler]: {
      name: "Hustler",
      modifiers: [
        ModifierEnum.samaritan_choose_wrong_answer,
        ModifierEnum.samaritan_choose_wrong_answer,
        ModifierEnum.samaritan_no_points,
        ModifierEnum.samaritan_no_points,
        ModifierEnum.skip_deduction_increase,
        ModifierEnum.double_trickster_point,
        ModifierEnum.cancel_single_samaritan_modifier,
      ],
    },
    [ClassEnum.Flash]: {
      name: "Flash",
      modifiers: [
        ModifierEnum.decrease_round_duration,
        ModifierEnum.decrease_round_duration,
        ModifierEnum.decrease_round_duration,
        ModifierEnum.question_difficulty_hard,
        ModifierEnum.question_difficulty_hard,
        ModifierEnum.skip_deduction_increase,
        ModifierEnum.samaritan_choose_wrong_answer,
      ],
    },
    [ClassEnum.Scout]: {
      name: "Scout",
      modifiers: [
        ModifierEnum.blind_answers,
        ModifierEnum.blind_answers,
        ModifierEnum.skip_deduction_increase,
        ModifierEnum.skip_deduction_increase,
        ModifierEnum.cancel_single_samaritan_modifier,
        ModifierEnum.see_samaritan_modifiers,
        ModifierEnum.question_difficulty_hard,
      ],
    },
    [ClassEnum.Vampire]: {
      name: "Vampire",
      modifiers: [
        ModifierEnum.double_trickster_point,
        ModifierEnum.double_trickster_point,
        ModifierEnum.double_trickster_point,
        ModifierEnum.samaritan_no_points,
        ModifierEnum.samaritan_no_points,
        ModifierEnum.blind_answers,
        ModifierEnum.see_samaritan_modifiers,
      ],
    },
    [ClassEnum.Talented]: {
      name: "Talented",
      modifiers: [
        ModifierEnum.decrease_round_duration,
        ModifierEnum.blind_answers,
        ModifierEnum.cancel_single_samaritan_modifier,
        ModifierEnum.cancel_all_samaritan_modifiers,
        ModifierEnum.double_trickster_point,
        ModifierEnum.see_samaritan_modifiers,
        ModifierEnum.samaritan_choose_wrong_answer,
        ModifierEnum.skip_deduction_increase,
        ModifierEnum.question_difficulty_hard,
        ModifierEnum.samaritan_no_points,
      ],
    },
  },
};

export default Class;
