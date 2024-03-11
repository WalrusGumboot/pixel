import {makeProject} from '@motion-canvas/core';

import './global.css';

import main from './scenes/main?scene';
import rick from "./rick.mp3";

export default makeProject({
  scenes: [main],
  audio: rick
});
