/*
* File to integarte components
* Credit: Azky
*/
import React from 'react';
import { connect } from 'unistore/react';

import TablePanel from './DataPanelSelector';

const Def = props => props.data && <TablePanel {...props} />;

const ExportTablePanel = connect('data')(Def);
export default ExportTablePanel;