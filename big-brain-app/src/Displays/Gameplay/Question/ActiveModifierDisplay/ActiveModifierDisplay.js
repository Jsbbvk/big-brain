import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Box, Typography } from "@material-ui/core";
import CustomModal from "../../../../CustomComponents/CustomModal";
import { useSelector } from "react-redux";
import ModifierText from "../../../Enums/ModifierText";
import { emission } from "../../../../Socket/main";
import RoleEnum from "../../../Enums/RoleEnum";
import ModifierEnum from "../../../Enums/ModifierEnum";

const useStyles = makeStyles((theme) => ({
  scrollable: {
    overflowX: "hidden",
    overflowY: "auto",
    maxHeight: "250px",
    paddingTop: "15px",
    paddingBottom: "15px",
  },
}));

const ActiveModifierDisplay = (props) => {
  const classes = useStyles();

  const player = useSelector((state) => state.player);
  const roomId = useSelector((state) => state.roomId);

  const [cancelled, setCancelled] = useState(false);
  const [modifierEnums, setModifierEnums] = useState([]);

  useEffect(() => {
    emission("get modifier result", {
      room_id: roomId,
      player_uuid: player.uuid,
    }).then((res) => {
      if (res.status !== "success") return;
      let {
        data: { cancelled: cancel, modifiers },
      } = res;
      if (cancel !== undefined) setCancelled(cancel);

      if (modifiers !== undefined) setModifierEnums(modifiers);
    });
  }, []);

  return (
    <CustomModal {...props}>
      <Box textAlign={"center"} mt={7}>
        <Box>
          <Typography variant={"h4"}>Active Modifier</Typography>
          <Box mt={2} px={3} textAlign={"left"}>
            <Typography
              variant={"body1"}
              dangerouslySetInnerHTML={{
                __html: ModifierText[player.stats.modifierEnum],
              }}
            />
            {cancelled && (
              <Box mt={2} style={{ color: "#e11432" }}>
                Your modifier has been cancelled.
              </Box>
            )}
          </Box>
          {modifierEnums.length !== 0 && (
            <Box
              mt={2}
              px={3}
              textAlign={"left"}
              className={classes.scrollable}
            >
              <Box textAlign={"center"} mb={1}>
                <Typography variant={"h6"}>
                  {player.stats.role === RoleEnum.Trickster
                    ? "Samaritan Modifiers"
                    : "Trickster's Modifier"}
                </Typography>
              </Box>
              {modifierEnums.map((m, i) => (
                <Box key={i}>
                  <hr />
                  <Typography
                    variant={"body2"}
                    dangerouslySetInnerHTML={{
                      __html:
                        m === ModifierEnum.NoModifier
                          ? "No Active Modifier"
                          : ModifierText[m],
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </CustomModal>
  );
};

export default ActiveModifierDisplay;
