import React, {Component} from 'react';
import {AsyncStorage, Platform, View, Modal} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {closeChordsModal} from "../actions";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants';
import {makeAdMob, productIdRemoveAds} from "../utility";

const InAppBilling = require("react-native-billing");

class ChordsModal extends Component {
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
            contentRowStyle,
            itemContainerStyle, itemHeadStyle, itemStyle, buttonContainerStyle,
        } = styles;

        const {selectedValues: {selectedKeyIndex, selectedCapo}, keys} = this.props;

        return (
            <Modal transparent
                   animationType={'fade'}
                   visible={this.props.modal.chordsModalIsOpen}
                   onRequestClose={() => this.props.closeChordsModal()}>
                <View style={modalStyle}>
                    <View style={containerStyle}>
                        {/*Header*/}
                        <View style={headerStyle}>
                            <Text h4 style={{color: 'white'}}>Chords Transitions</Text>
                        </View>

                        <View style={contentStyle}>
                            <View style={contentRowStyle}>
                                <View style={itemContainerStyle}>
                                    {/*Sub Header*/}
                                    <Text style={[itemStyle, itemHeadStyle]}>
                                        Key {keys[selectedKeyIndex].key}
                                    </Text>
                                </View>

                                <View style={itemContainerStyle}>
                                    {/*Sub Header*/}
                                    <Text style={[itemStyle, itemHeadStyle]}>
                                        ➔
                                    </Text>
                                </View>

                                <View style={itemContainerStyle}>
                                    {/*Sub Header*/}
                                    <Text style={[itemStyle, itemHeadStyle]}>
                                        Capo {selectedCapo} Chords
                                    </Text>
                                </View>
                            </View>

                                {this._renderChordRows()}
                        </View>

                        <View style={buttonContainerStyle}>
                            <Button raised
                                    icon={{name: 'close'}}
                                    title="Close"
                                    backgroundColor="#2196F3"
                                    onPress={() => this.props.closeChordsModal()}/>
                        </View>
                        {this._renderAds()}
                    </View>
                </View>
            </Modal>
        )
    }

    _renderChordRows() {
        const {contentRowStyle, itemContainerStyle, itemStyle} = styles;
        const {selectedValues: {selectedKeyIndex, selectedCapo}, keys} = this.props;

        let count = 0;

        return keys.map((key)=>{
            const keyChordIndex = (count + selectedKeyIndex) > 11 ?
                (count + selectedKeyIndex) - 12 : (count + selectedKeyIndex);

            const capoChordIndex = (keyChordIndex + selectedCapo) > 11 ?
                (keyChordIndex + selectedCapo) - 12: (keyChordIndex + selectedCapo);

            count++;

            return (
                <View key={count} style={contentRowStyle}>
                    <View style={itemContainerStyle}>
                        <Text style={itemStyle}>
                            {keys[keyChordIndex].key}
                        </Text>
                    </View>

                    <View style={itemContainerStyle}>
                        <Text style={itemStyle}>
                            ➔
                        </Text>
                    </View>

                    <View style={itemContainerStyle}>
                        <Text style={itemStyle}>
                            {keys[capoChordIndex].key}
                        </Text>
                    </View>
                </View>
            );
        })
    }

    _renderAds() {
        if (this.state.showAds) {
            return makeAdMob('ca-app-pub-9242567842673294/2234657583', 'ca-app-pub-9242567842673294/5790759215');
        } else {
            return null;
        }
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10
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
};

const mapStateToProps = ({modal, selectedValues, keys}) => ({modal, selectedValues, keys});

export default connect(mapStateToProps, {closeChordsModal})(ChordsModal)