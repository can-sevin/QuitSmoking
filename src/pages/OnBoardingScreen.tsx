import React, {Component, useRef} from "react";
import {Image, StyleSheet, Text, View, Animated} from "react-native";
import I18n from '../lang/i18n';
import LinearGradient from 'react-native-linear-gradient';
import GestureRecognizer from 'react-native-swipe-gestures';
import auth from '@react-native-firebase/auth';

interface IOnBoardingProps {
    navigation: any;
}

interface IOnBoardingState {
}

const BottomText = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            useNativeDriver: false,
            toValue: 1,
            duration: 2000
        }).start(() => fadeOut());
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            useNativeDriver: false,
            toValue: 0,
            duration: 2000
        }).start(() => fadeIn());
    };


    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            {fadeIn()}
            <Image style={styles.icon} source={require('../icons/no-smoking.png')}/>
            <Text style={styles.text}>{I18n.t('appName')}</Text>
            <Animated.Text style={[styles.bottomText,{opacity: fadeAnim}]}>{I18n.t('startToSlide')}</Animated.Text>
        </View>
    );
}

export default class OnBoardingScreen extends Component<IOnBoardingProps, IOnBoardingState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <GestureRecognizer onSwipeUp={(state) => this.login()} style={{flex: 1, justifyContent: 'center'}}>
            <LinearGradient colors={['#0D0D0D', '#1A1A1A']} style={{flex: 1, justifyContent: 'center'}}>
                <BottomText/>
            </LinearGradient>
            </GestureRecognizer>
        )
    }

    login(){
        auth()
            .signInAnonymously()
            .then(() => {
                console.log('User signed in anonymously');
            })
            .catch(error => {
                if (error.code === 'auth/operation-not-allowed') {
                    console.log('Enable anonymous in your firebase console.');
                }
                console.error(error);
            });
        this.props.navigation.navigate('Main')
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 36,
        marginTop: 20,
        fontFamily: 'Rubik-SemiBold',
        alignContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        color: '#f5f5f5',
    },
    icon: {
        height: 128,
        width: 128,
        alignContent: 'center',
        alignSelf: 'center',
    },
    bottomText: {
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
        alignContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        color: '#f5f5f5',
        position: 'absolute',
        bottom: 16,
    }
});
