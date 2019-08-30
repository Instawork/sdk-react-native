import React, {Component} from 'react';
import {StyleSheet, Text, Button, View} from 'react-native';
import {HyperTrack, CriticalErrors} from 'hypertrack-sdk-react-native';

const PUBLISHABLE_KEY = "paste_your_key_here";
export default class App extends Component<{}> {

    state = {
        deviceId: "",
        isTracking: false,
        trackingState: "",
    };

    constructor(props) {
        super(props);
        HyperTrack.initialize(PUBLISHABLE_KEY);
        HyperTrack.enableDebugLogging(true);
    }

    componentWillMount() {
        HyperTrack.addTrackingListeners(this,
            (error) => {
                if (error.code === CriticalErrors.INVALID_PUBLISHABLE_KEY
                    || error.code === CriticalErrors.AUTHORIZATION_FAILED) {
                    console.log("Initialization failed")
                } else {
                    console.log("Tracking failed")
                }
                this.setState({
                    trackingState: "Stopped with error: " + ((error.code + " - " + error.message) || "unknown"),
                    isTracking: false
                })
            },
            () => this.setState({trackingState: "Started", isTracking: true}),
            () => this.setState({trackingState: "Stopped", isTracking: false}));
        HyperTrack.getDeviceID().then((deviceId) => {
            console.log(deviceId);
            this.setState({deviceId: deviceId});
        });
        HyperTrack.setTripMarker({key1: "value", key2: "7"});
        HyperTrack.setDevice("Elvis", {key1: "value", key2: "7"});
    }

    componentWillUnmount() {
        HyperTrack.removeTrackingListeners(this);
    }

    render() {
        const {
            deviceId,
            isTracking,
            trackingState
        } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.text}>{deviceId}</Text>
                <Button
                    style={styles.button}
                    title={isTracking ? "Stop tracking" : "Start tracking"}
                    onPress={() => {
                        HyperTrack.isTracking().then((isTracking) => isTracking ? HyperTrack.stopTracking() : HyperTrack.startTracking())
                    }}
                />
                <Text style={styles.textTitle}>{"Tracking state"}</Text>
                <Text style={styles.text}>{trackingState}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        fontSize: 20,
        margin: 10,
    },
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15
    },
    text: {
        fontSize: 14,
        margin: 10
    },
});