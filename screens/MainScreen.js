import React, {Component} from 'react';
import {AsyncStorage, Image, Platform, View} from "react-native";
import { Divider } from 'react-native-elements';
import KeysButtons from '../components/KeysButtons';
import CapoButtons from '../components/CapoButtons';
import ViewChordsButton from '../components/ViewChordsButton';
import {SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../constants';
import CapoKey from '../components/CapoKey';
import ChordsModal from "../modals/ChordsModal";
import {makeAdMob, productIdRemoveAds} from "../utility";

const InAppBilling = require("react-native-billing");

class MainScreen extends Component {
    state = {
        appIsReady: false,
        showAds: true
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
        headerLeft: <Image source={require('../assets/icon-guitar.png')} style={styles.imageStyle}/>
    });

    async componentWillMount() {
        let stateObject = {};
        let isPurchased = await AsyncStorage.getItem('removeAds');
        if (isPurchased === 'true') {
            stateObject['showAds'] = false;
        } else {
            stateObject['showAds'] = true;

            //Check if user has purchased Remove Ads
            if (Platform.OS === 'android') {
                await InAppBilling.close();
                try {
                    await InAppBilling.open();
                    let isPurchased = await InAppBilling.isPurchased(productIdRemoveAds);
                    if (isPurchased) {
                        await AsyncStorage.setItem('removeAds', 'true');
                        stateObject['showAds'] = false;
                    } else {
                        stateObject['showAds'] = true;
                    }
                } finally {
                    await InAppBilling.close();
                }
            }
        }

        this.setState(stateObject);
    }

    render() {
        const { containerStyle, dividerStyle, buttonContainerStyle } = styles;

        return (<View style={{flex: 1, backgroundColor: '#ddd'}}>
            <ChordsModal />

            <View style={containerStyle}>
                <KeysButtons/>
                <Divider style={dividerStyle}/>
                <CapoButtons/>
                <Divider style={dividerStyle}/>
                <CapoKey />
            </View>

            <ViewChordsButton style={buttonContainerStyle}/>

            {this._renderAds()}
        </View>);
    }

    _renderAds() {
        if (this.state.showAds) {
            return makeAdMob('ca-app-pub-9242567842673294/1496290985', 'ca-app-pub-9242567842673294/2251394489');
        } else {
            return null;
        }
    }
}

const styles = {
    imageStyle: {
        marginLeft: Platform.OS === 'android' ? 10 : 0,
        marginTop: Platform.OS === 'android' ? 20 : 0,
        width: 40,
        height: 40
    },
    containerStyle: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    dividerStyle: {
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: '#2196F3'
    },
    buttonContainerStyle: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10
    }
}

export default MainScreen