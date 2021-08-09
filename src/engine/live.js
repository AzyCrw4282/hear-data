import AudioDataEngine from './AudioDataEngine';
import { requirements } from '../components/LoadDepsRequirements';
const { AudioContext } = requirements.AudioContext;


const context = new AudioContext();
const liveEngine = new AudioDataEngine(context);

export default liveEngine;
