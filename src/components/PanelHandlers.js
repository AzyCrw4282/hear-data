import PanelMediaControls from './PanelsMediaControls'
import UpperPanelControls from './PanelsTrack'
import NoteIcon from '@material-ui/icons/NoteAdd';

export default {
    scale: {
        name: 'Add Panel',
        advanced: PanelMediaControls,
        headerControl: UpperPanelControls,
        icon: NoteIcon,
        hasIntensity: true
    }
}