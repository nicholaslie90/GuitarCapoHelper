import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    Image,
    NativeModules,
    Platform,
    ToastAndroid,
    TouchableHighlight,
    View,
    Modal
} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {closeSettingsModal} from "../actions";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants';
import {iapiOS, makeAdMob, productIdRemoveAds} from "../utility";

const {InAppUtils} = NativeModules;
const InAppBilling = require("react-native-billing");

class SettingsModal extends Component {
    state = {
        showAds: true,
    };

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
        const {
            modalStyle,
            containerStyle,
            headerStyle,
            contentStyle,
            buttonContainerStyle,
            settingsItem,
            settingsImage,
            settingsContent,
            settingsText,
            aboutStyle
        } = styles;

        const restorePurchase = Platform.OS === 'ios' ? <TouchableHighlight underlayColor={'silver'}
                                                                            onPress={() => {
                                                                                this._restorePurchase();
                                                                            }}>
            <View style={settingsItem}>
                <Image source={require('../assets/icon-restore-purchase.png')}
                       style={settingsImage}/>
                <View style={settingsContent}>
                    <Text h5>Restore Purchase</Text>
                    <Text style={settingsText}>Click here to restore purchases.</Text>
                </View>
            </View>
        </TouchableHighlight> : null;

        return (
            <Modal transparent
                   animationType={'fade'}
                   visible={this.props.modal.settingsModalIsOpen}
                   onRequestClose={() => this.props.closeSettingsModal()}>
                <View style={modalStyle}>
                    <View style={containerStyle}>
                        {/*Header*/}
                        <View style={headerStyle}>
                            <Text h4 style={{color: 'white'}}>Settings</Text>
                        </View>

                        <View style={aboutStyle}>
                            <Text style={{textAlign: 'center'}} h4>About this app</Text>
                            <Text style={{lineHeight: 30, textAlign: 'center'}}>This simple app aims to help you to play guitar in the correct chords, if your friend
                                is playing with a capo, so you can play along.
                                {"\n\n"}

                                This app is built using React Native + Redux with the help of an excellent YouTube tutorial by Barry Michael Doyle. Go check out his videos!</Text>
                        </View>

                        {/*Remove Ads*/}
                        <TouchableHighlight underlayColor={'silver'}
                                            onPress={() => {
                                                this._removeAds();
                                            }}>
                            <View style={settingsItem}>
                                <Image source={require('../assets/icon-remove-ads.png')}
                                       style={settingsImage}/>
                                <View style={settingsContent}>
                                    <Text h5>Remove Ads</Text>
                                    <Text style={settingsText}>Remove ads and enjoy the extra screen
                                        estate!</Text>
                                </View>
                            </View>
                        </TouchableHighlight>

                        {/*Restore Purchase*/}
                        {restorePurchase}

                        <View style={buttonContainerStyle}>
                            <Button raised
                                    icon={{name: 'close'}}
                                    title="Close"
                                    backgroundColor="#2196F3"
                                    onPress={() => this.props.closeSettingsModal()}/>
                        </View>
                        {this._renderAds()}
                    </View>
                </View>
            </Modal>
        )
    }

    async _removeAds() {
        if (Platform.OS === 'android') {
            await InAppBilling.close();

            InAppBilling.open()
                .then(() => InAppBilling.purchase(productIdRemoveAds))
                .then(details => {
                    if (details.purchaseState === 'PurchasedSuccessfully') {
                        ToastAndroid.show('Thanks for purchasing!', ToastAndroid.LONG);
                        this.setState({showAds: false})
                    } else {
                        this.setState({showAds: true})
                    }
                    // console.warn("You purchased: ", details);
                    return InAppBilling.close();
                })
                .catch(err => {
                    // console.warn(err);
                });
        }

        if (Platform.OS === 'ios') {
            InAppUtils.loadProducts(iapiOS, (error, products) => {
                if (products.length > 0) {
                    //In-app purchases found
                    InAppUtils.canMakePayments((canMakePayments) => {
                        if (!canMakePayments) {
                            Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on the device.');
                        } else {
                            InAppUtils.purchaseProduct(products[0].identifier, (error, response) => {
                                // NOTE for v3.0: User can cancel the payment which will be available as error object here.
                                if (response && response.productIdentifier) {
                                    Alert.alert('Thanks for purchasing!', 'Thanks for purchasing! Your Transaction ID is ' + response.transactionIdentifier);
                                    this._storeRemoveAds();
                                }
                            });
                        }
                    })
                }
            });
        }
    }

    _renderAds() {
        if (this.state.showAds) {
            return makeAdMob('ca-app-pub-9242567842673294/1861771423', 'ca-app-pub-9242567842673294/1287056359');
        } else {
            return null;
        }
    }

    _restorePurchase() {
        InAppUtils.restorePurchases((error, response) => {
            if (error) {
                Alert.alert('iTunes Error', 'Could not connect to iTunes Store.');
            } else {
                if (response.length === 0) {
                    Alert.alert('No Purchases Found', "We didn't find any purchases to restore.");
                    return;
                }

                response.forEach((purchase) => {
                    if (purchase.productIdentifier === iapiOS) {
                        // Handle purchased product.
                        Alert.alert('Previous Purchase Found!', 'Removed ads from the app :)');
                        this._storeRemoveAds();
                    }
                });
            }
        });
    }

    _storeRemoveAds() {
        this.setState({showAds: false})
        AsyncStorage.setItem('removeAds', 'true');
    }
}

const marginPercent = 0.05;

const styles = {
    modalStyle: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    containerStyle: {
        flex: 1,
        marginTop: SCREEN_HEIGHT * marginPercent,
        marginBottom: SCREEN_HEIGHT * marginPercent,
        marginLeft: SCREEN_WIDTH * marginPercent,
        marginRight: SCREEN_WIDTH * marginPercent,
        backgroundColor: 'white'
    },
    headerStyle: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    contentStyle: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    contentRowStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemHeadStyle: {
        fontWeight: '900',
        fontSize: 14
    },
    itemStyle: {
        alignItems: 'center',
        fontSize: 16,
        textAlign: 'center'
    },
    buttonContainerStyle: {
        paddingBottom: 10
    },
    settingsItem: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    settingsImage: {
        width: 25,
        height: 25,
        marginLeft: 10,
        marginRight: 20,
        resizeMode: 'contain'
    },
    settingsContent: {
        flexDirection: 'column',
        marginRight: 20
    },
    settingsText: {
        paddingRight: 40,
        fontSize: 12
    },
    aboutStyle: {
        flexDirection: 'column',
        margin: 10
    }
};

const mapStateToProps = ({modal}) => ({modal});

export default connect(mapStateToProps, {closeSettingsModal})(SettingsModal)