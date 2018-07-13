/**
 * Created by nicholaslie on 19/03/18.
 */

import React, {Component} from 'react';
import {AdMobBanner} from "react-native-admob";
import {
    Platform,
} from "react-native";

const productIdRemoveAds = 'nicholaslie.mhwguidewiki.iap.removeads';
const iapiOS = ['nicholaslie.monsterhunterworld.iap.removeads'];

let _ = require('lodash');

function makeAdMob(iOSAdUnitID, androidAdUnitID) {
    return Platform.select({
        ios: () => <AdMobBanner
            adSize="fullBanner"
            adUnitID={iOSAdUnitID}
            testDevices={[AdMobBanner.simulatorId]}
            style={{justifyContent: 'center'}}
        />,
        android: () => <AdMobBanner
            adSize="fullBanner"
            adUnitID={androidAdUnitID}
            testDevices={[AdMobBanner.simulatorId]}
            style={{justifyContent: 'center'}}
        />,
    })();
}

function printAllProperties(object) {
    let propValue;
    for (let propName in object) {
        propValue = object[propName]

        console.log(propName, propValue);
    }
}

export {
    makeAdMob,
    printAllProperties,
    productIdRemoveAds,
    iapiOS,
}