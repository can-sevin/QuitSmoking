import React, {Component, useRef} from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    Animated,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Easing,
    ActivityIndicator,
    Modal
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import I18n from "../lang/i18n";
import {Picker} from '@react-native-picker/picker';
import GestureRecognizer from 'react-native-swipe-gestures';
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';

interface IMainProps {
    navigation: any;
}

interface IMainState {
    currency: any;
    disabledCurDec: boolean;
    price: number;
    cigarettePerDay: number;
    cigaretteBox: number;
    cigaretteOfBox: number;
    modalY: any;
    fadeAnim: any;
    indicator: boolean;
}

const window = Dimensions.get('window');

const BottomText = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            useNativeDriver: true,
            toValue: 1,
            duration: 2000
        }).start(() => fadeOut());
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            useNativeDriver: true,
            toValue: 0.2,
            duration: 2000
        }).start(() => fadeIn());
    };


    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            {fadeIn()}
            <Animated.Text style={[styles.text_bottom,{opacity: fadeAnim}]}>{I18n.t('onBoardingFinish')}</Animated.Text>
        </View>
    );
}
export default class MainScreen extends Component<IMainProps, IMainState> {
    constructor(props: any) {
        super(props);
        this.state = {currency: 'try', price: 20, cigarettePerDay: 10, cigaretteBox: 3, disabledCurDec: false, modalY: new Animated.Value(-window.height*0.0001), fadeAnim: new Animated.Value(0), indicator: false, cigaretteOfBox: 20};
    }

    handleAdd = () => {
        Animated.timing(this.state.modalY, {
            duration: 1000,
            toValue: 0,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start();
    };

    handleRemove = () => {
        Animated.timing(this.state.modalY, {
            duration: 1000,
            toValue: -window.height,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start();
    };

    render() {
        return(
            <ScrollView style={{flex: 1}}>
                <LinearGradient colors={['#0D0D0D', '#1A1A1A']} style={{flex: 1, justifyContent: 'flex-start'}}>
                <Image style={{alignSelf: 'center', height: 70, width: 70, marginTop: 16, marginBottom: 16}} source={require('../icons/cigarette_box.png')}/>
                <Text style={styles.text_onboarding}>{I18n.t('onBoardingText')}</Text>
                <LinearGradient colors={['#0D0D0D', '#515151', '#8C8C8C']} useAngle={true} angle={60} style={styles.container_2}>
                    <Text style={styles.text_inner}>{I18n.t('onBoardingBoxCost')}</Text>
                    <View style={{flexDirection: 'row',justifyContent: 'center'}}>
                        <LinearGradient  useAngle={true} angle={45} colors={['#0D0D0D', '#f5f5f5']} style={styles.view}>
                            <View style={styles.container}>
                                <TouchableOpacity style={styles.button} disabled={this.state.disabledCurDec} onPress={() => this.setState({price: this.state.price - 0.5})}>
                                    <Text style={styles.text_button}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.text_button}>{this.state.price.toFixed(1)}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => this.setState({price: this.state.price + 0.5})}>
                                    <Text style={styles.text_button}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                        <Picker
                            selectedValue={this.state.currency}
                            style={{height: 50, width: 150, alignSelf: 'center', color: '#F5F5F5'}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({currency: itemValue})
                            }>
                            <Picker.Item label="EUR" value="eur" />
                            <Picker.Item label="USD" value="usd" />
                            <Picker.Item label="TRY" value="try" />
                        </Picker>
                    </View>
                    <Text style={styles.text_inner}>{I18n.t('onBoardingBoxMuch')}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.button_cigarette} onPress={() => {
                            this.setState({cigaretteBox: this.state.cigaretteBox - 1});
                            this.handleRemove();
                        }}>
                            <Text style={styles.text_cigarette}>-</Text>
                        </TouchableOpacity>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{maxHeight: 130, alignSelf: 'center', maxWidth: 150}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                            {Array.from(Array(this.state.cigaretteBox), (e, i) => {
                                return <Image style={[styles.cigarette]} source={require('../icons/cigarette.png')}/>
                            })}
                            </ScrollView>
                        <TouchableOpacity style={styles.button_cigarette} onPress={() => {
                            this.setState({cigaretteBox: this.state.cigaretteBox + 1});
                            this.handleAdd();
                        }}>
                            <Text style={styles.text_cigarette}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text_inner}>{I18n.t('onBoardingHowMuch')}</Text>
                    <LinearGradient  useAngle={true} angle={45} colors={['#0D0D0D', '#f5f5f5']} style={styles.view}>
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({cigarettePerDay: this.state.cigarettePerDay - 1})}>
                                <Text style={styles.text_button}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.text_button}>{this.state.cigarettePerDay.toFixed(0)}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({cigarettePerDay: this.state.cigarettePerDay + 1})}>
                                <Text style={styles.text_button}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <Text style={styles.text_inner}>{I18n.t('onBoardingBoxMuch')}</Text>
                    <LinearGradient  useAngle={true} angle={45} colors={['#0D0D0D', '#f5f5f5']} style={styles.view}>
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({cigaretteOfBox: this.state.cigaretteOfBox - 1})}>
                                <Text style={styles.text_button}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.text_button}>{this.state.cigaretteOfBox.toFixed(0)}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({cigaretteOfBox: this.state.cigaretteOfBox + 1})}>
                                <Text style={styles.text_button}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </LinearGradient>
                <GestureRecognizer onSwipeRight={(state) => this.setInfo()} onSwipeLeft={(state) => this.setInfo()} style={{flex: 1, justifyContent: 'center'}}>
                    <BottomText/>
                </GestureRecognizer>
                <Modal transparent={true} animationType={'none'} visible={this.state.indicator} style={styles.indicator_view}>
                    <ActivityIndicator hidesWhenStopped={true} animating={true} style={{alignSelf: 'center', flex: 1}} size="large" color="#0000ff" />
                </Modal>
            </LinearGradient>
            </ScrollView>
        )
    }

    async setInfo(){
        this.setState({indicator: true});
        await firestore()
            .collection('Users')
            .doc(auth().currentUser?.uid)
            .set({
                uid: auth().currentUser?.uid,
                box: this.state.cigaretteBox,
                ofBox: this.state.cigaretteOfBox,
                currency: this.state.currency,
                price: this.state.price,
                perDay: this.state.cigarettePerDay,
                date: new Date(),
            })
            .then((res) => {
                console.log('User added!');
                this.setState({indicator: false})
                this.props.navigation.navigate('Enterance');
            });
    }
}

const styles = StyleSheet.create({
    view: {
        width: window.width * 0.25,
        height: window.height * 0.05,
        alignSelf: 'center',
        borderRadius: 16,
        shadowOpacity: 1,
    },
    container: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
       width: 24,
       height: 24,
       borderRadius: 24/2,
       backgroundColor: '#1A1A1A',
       alignItems: 'center',
       justifyContent: 'center',
        alignContent: 'center',
    },
    button_cigarette: {
       width: 48,
       height: 48,
       borderRadius: 64/2,
       backgroundColor: '#1A1A1A',
       alignItems: 'center',
       justifyContent: 'center',
        alignContent: 'center',
    },
    text_button: {
        fontSize: 18,
        color: '#f5f5f5',
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        textAlign: 'center',
    },
    text_cigarette: {
        fontSize: 30,
        color: '#f5f5f5',
        fontFamily: 'Rubik-Regular',
        alignSelf: 'center',
        textAlign: 'center',
    },
    text_onboarding: {
        fontSize: 20,
        color: '#f5f5f5',
        marginHorizontal: 16,
        fontFamily: 'Rubik-Medium',
        alignSelf: 'center',
        textAlign: 'center',
    },
    text_inner: {
        fontSize: 16,
        color: '#f5f5f5',
        marginHorizontal: 16,
        fontFamily: 'Rubik-Medium',
        alignSelf: 'center',
        textAlign: 'center',
    },
    text_bottom: {
        fontSize: 20,
        color: '#f5f5f5',
        margin: 12,
        fontFamily: 'Rubik-SemiBold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    container_2: {
        width: window.width * 0.8,
        height: window.height * 0.7,
        justifyContent: 'space-around',
        borderRadius: 18,
        alignSelf: 'center',
        marginTop: 16,
        shadowOpacity: 0.8,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: '#f5f5f5',
        elevation: 16
    },
    cigarette: {
        alignSelf: 'center',
        alignContent: 'center',
        marginHorizontal: 2,
    },
    indicator_view: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        width: 200,
        height: 200,
    }
});
