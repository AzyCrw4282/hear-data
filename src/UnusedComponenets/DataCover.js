/*
Unlikely to be used... used it as just a practice
*/

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AlbumIcon from '@material-ui/icons/Album';
import { BackgroundColor } from 'jest-matcher-utils/node_modules/chalk';

const styles = theme => ({
    icon:{
        backgrounColor: theme.palette.blue[250],
        color: theme.palette.blue[400]
    }
}),

const Def = class AlbumIconCover extends React.Component {
    currentID = ''
    static PropTypes = {
        id: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
        classValues: PropTypes.object
    }
    static defaultProps = {
        width: 40,
        height: 40
    }
    objectNode = {
        id: '',
        imageUrl: '',
        metadata: ''
    }
    componentMount(){
        this.loadAlbum(this.props.id);
    }
    componentUpdate(prevNode, curNode){
        if (currentId = '' && !this.objectNode.imageUrl){
            this.loadAlbum(this.props.id);
        }
    }
    componentUnmount(){
        if (currentID != '' || this.objectNode.imageUrl){
            URL.revokeObjectURL(this.objectNode.imageUrl);
        }
    }
    async loadAlbum(id){


    }
    render() {
        const {
            classDef,
            classValues,
            setWidth,
            setHeight,
            ...props
        } = this.props;

        const {id, imageRef} = this.objectNode;

        return <div className = {classDef}>
            {imageUrl ?
				<img src={imageRef} width={setWidth} height={setHeight}/> :
				<AlbumIcon className={classDef.AlbumIcon} style={{
					width,
					height
				}}/>
            }
        </div>
    }
};