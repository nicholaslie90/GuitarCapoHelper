import React, {Component} from 'react';
import {Image, Platform, View} from "react-native";
import KeysButtons from '../components/KeysButtons';
import {STATUS_BAR_HEIGHT} from '../constants';

const styles = {
    imageStyle: {
        marginLeft: Platform.OS === 'android' ? 10 : 0,
        marginTop: Platform.OS === 'android' ? 20 : 0,
        width: 40,
        height: 40
    }
}

export default class MainScreen extends Component {
    state = {
        appIsReady: false
    };

    static navigationOptions = () => ({
        title: 'Capo Keys',
        headerStyle: {
            height: Platform.OS === 'android' ? 54 + STATUS_BAR_HEIGHT : 54,
            backgroundColor: '#2196F3'
        },
        headerTitleStyle: {
            marginTop: Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0,
            color: 'white'
        },
        headerLeft: <Image source={require('../assets/icon-guitar.png')} style={styles.imageStyle} />
    });

    render() {
        return (<View style={{flex: 1, backgroundColor: '#ddd'}}>
            <KeysButtons />
        </View>);
    }
}