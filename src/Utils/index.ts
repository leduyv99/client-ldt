import { PlayerAnimation } from "../Entity/Player";

export const getPlayerAssetsAlias = (playerAnimation: PlayerAnimation, index = 0) => {
  if (playerAnimation === 'idle') {
    return `CHAR_${index}_IDLE`
  }
  if (playerAnimation === 'move') {
    return `CHAR_${index}_RUN`
  }
  return ""
}