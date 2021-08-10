import AudioDataEngine from './AudioDataEngine';
import { requirementsObj } from '../components/LoadDepsRequirements';
const { AudioContext } = requirementsObj.AudioContext;


const context = new AudioContext();
const liveEngine = new AudioDataEngine(context);

export default liveEngine;
