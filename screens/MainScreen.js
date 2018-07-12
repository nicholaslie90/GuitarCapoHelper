import React, {Component} from 'react';
import {Image, Platform, View} from "react-native";
import {STATUS_BAR_HEIGHT} from '../constants';

const styles = {
    imageStyle: {
        marginLeft: 10,
        width: 40,
        height: 40
    }
}

function cacheImages(images){
    return images.map(image=>{
        if (typeof image === 'string'){
            return Image.pretetch(image);
        }

        return
    })
}

export default class MainScreen extends Component {
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
        return (<View style={{flex: 1, backgroudColor: '#ddd'}}>
            {/*Chord Modal*/}

            {/*Content*/}
        </View>);
    }
}