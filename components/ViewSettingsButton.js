import React, {Component} from 'react';
import {Image, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import {openSettingsModal} from '../actions';

class ViewSettingsButton extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#039be5'}
                onPress={() => {
                    this.props.openSettingsModal()
                }}>
                <Image source={require('../assets/icon-settings.png')}
                       style={{
                           width: 30,
                           height: 30,
                           margin: 4,
                           marginRight: 10,
                           marginTop: 10,
                           marginBottom: 12
                       }}/>
            </TouchableHighlight>
        )
    }
}

export default connect(null, {openSettingsModal})(ViewSettingsButton);