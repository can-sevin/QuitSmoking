import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import I18n from "../lang/i18n";
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import HMSAds, {HMSBanner, HMSSplash} from '@hmscore/react-native-hms-ads';

interface IEnteranceProps {
    navigation: any;
}

interface IEnteranceState {
    user : any;
    currentDate : any;
    day: any;
    hour: any;
    minute: any;
    priceOfBox : number;
    dailyBox: number;
    cigarettesOfBox: number;
    perDay: number;
    currency: string;
    hourForCigarettes: any;
    hms: boolean;
    bannerAdSize: any;
    bannerAdId: any,
    splashAdId: any,
}

const window = Dimensions.get('window');
/*const _shareToStory = async () => {
    const { uri } = await FileSystem.downloadAsync(
        url,
        `${FileSystem.documentDirectory}meme.jpg`
    ).catch(e => console.log('instagram share failed', JSON.stringify(e), url));

    try {
        const encodedUrl = encodeURIComponent(uri);
        const instagramUrl = `instagram-stories://share?backgroundImage=${encodedUrl}`;
        await Linking.openURL(instagramUrl);
    } catch (error) {
        console.log(error);
    }
};
 */

export default class EnteranceScreen extends Component<IEnteranceProps, IEnteranceState> {
    constructor(props: any) {
        super(props);
        this.state = {user: null,currentDate: new Date().getTime(),
            day: 0, hour: 0, minute: 0, priceOfBox: 20, dailyBox: 1,
            cigarettesOfBox: 20, perDay: 10, currency: 'try', hourForCigarettes: 10,
            hms: false,bannerAdSize: 'smart', bannerAdId: 'x3m5ryjqk2', splashAdId: 'o1t37k89oy'};
    }

    async componentDidMount() {
        HMSSplash.setAdId(this.state.splashAdId)
            .then((res) => HMSSplash.show())
            .catch((err) => console.log(err));
        await firestore().collection('Users').doc(auth().currentUser?.uid)
            .get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    this.setState({user:data})
                    this.setState({
                        day:Math.floor((this.state.currentDate - this.state.user.date.toMillis())/86400000).toFixed(0),
                        hour: Math.floor((this.state.currentDate - this.state.user.date.toMillis())/3600000 % 24).toFixed(0),
                        minute: Math.floor((this.state.currentDate - this.state.user.date.toMillis())/60000 % 60).toFixed(0),
                        priceOfBox: Math.floor(this.state.user.price),
                        dailyBox: Math.floor(this.state.user.box),
                        cigarettesOfBox: Math.floor(this.state.user.ofBox),
                        perDay: Math.floor(this.state.user.perDay),
                        currency: this.state.currency,
                        hourForCigarettes: Math.floor((this.state.currentDate - this.state.user.date.toMillis())/3600000).toFixed(0)
                    });
                } else {
                    this.props.navigation.navigate('OnBoarding');
                }
            }).catch(err => console.log(err + 'Firestore Getting Users Info'));
    }

    render() {
        return(
            <LinearGradient colors={['#0D0D0D', '#1A1A1A']} style={{flex: 1, justifyContent: 'flex-start'}}>
                <Text style={{fontSize: 40, color: '#f5f5f5', marginHorizontal: 16, marginVertical: 32}}>{I18n.t('welcome')},</Text>
                <HMSBanner
                    style={{height:100, width: '100%',alignSelf: 'center'}}
                    bannerAdSize={this.state.bannerAdSize}
                    adId={this.state.bannerAdId}
                />
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <View style={{flexDirection:'row'}}>
                        <View>
                        <LinearGradient style={styles.item_view} colors={['#FF0099', '#493240']}>
                            <Text style={styles.item_view_text}>{I18n.t('day')}: {this.state.day}</Text>
                            <Text style={styles.item_view_text}>{I18n.t('hour')}: {this.state.hour}</Text>
                            <Text style={styles.item_view_text}>{I18n.t('minute')}: {this.state.minute}</Text>
                        </LinearGradient>
                        <LinearGradient style={styles.item_view} colors={['#8E2DE2', '#4A00E0']}>
                            <Text style={styles.item_view_text}>{I18n.t('wallet')}: </Text>
                            <Text style={styles.item_view_text}>{Math.floor((this.state.priceOfBox / this.state.cigarettesOfBox) * (this.state.perDay / 24 * this.state.hourForCigarettes))} {this.state.currency}</Text>
                        </LinearGradient>
                        <LinearGradient style={styles.item_view} colors={['#1f4037', '#99f2c8']}>
                            <Text style={styles.item_view_text}>{I18n.t('non_smoking_branch')}:</Text>
                            <Text style={styles.item_view_text}>{Math.floor(this.state.perDay / 24 * this.state.hourForCigarettes)}</Text>
                        </LinearGradient>
                            <LinearGradient style={styles.item_view} colors={['#7F7FD5', '#86A8E7', '#91EAE4']}>
                                <Text style={styles.item_view_text}>{I18n.t('price_target')}</Text>
                                <Text style={styles.item_view_text_desc}>{I18n.t('one_week')}: {this.state.priceOfBox * (this.state.perDay / this.state.cigarettesOfBox) * 7} {this.state.currency}</Text>
                                <Text style={styles.item_view_text_desc}>{I18n.t('one_month')}: {this.state.priceOfBox * (this.state.perDay / this.state.cigarettesOfBox) * 30} {this.state.currency}</Text>
                                <Text style={styles.item_view_text_desc}>{I18n.t('three_month')}: {this.state.priceOfBox * (this.state.perDay / this.state.cigarettesOfBox) * 90} {this.state.currency}</Text>
                                <Text style={styles.item_view_text_desc}>{I18n.t('one_year')}: {this.state.priceOfBox * (this.state.perDay / this.state.cigarettesOfBox) * 365} {this.state.currency}</Text>
                                <Text style={styles.item_view_text_desc}>{I18n.t('five_year')}: {this.state.priceOfBox * (this.state.perDay / this.state.cigarettesOfBox) * 1825} {this.state.currency}</Text>
                                <Text style={styles.item_view_text_desc}>{I18n.t('ten_year')}: {this.state.priceOfBox * (this.state.perDay / this.state.cigarettesOfBox) * 3650} {this.state.currency}</Text>
                            </LinearGradient>
                        </View>
                        <View>
                            <LinearGradient style={styles.item_view_long} colors={['#8A2387', '#E94057', '#F27121']}>
                                <Text style={styles.item_view_text}>{I18n.t('benefits')}:</Text>
                                {this.state.hourForCigarettes * 60 >= 20 && <Text style={styles.item_view_text_desc}>{I18n.t('first_20_min')}</Text>}
                                {this.state.hour.valueOf() >= 8 && <Text style={styles.item_view_text_desc}>{I18n.t('first_8_hours')}</Text>}
                                {this.state.hour.valueOf() >= 24 && <Text style={styles.item_view_text_desc}>{I18n.t('first_24_hours')}</Text>}
                                {this.state.hour.valueOf() >= 48 && <Text style={styles.item_view_text_desc}>{I18n.t('first_48_hours')}</Text>}
                                {this.state.hour.valueOf() >= 72 && <Text style={styles.item_view_text_desc}>{I18n.t('first_72_hours')}</Text>}
                                {this.state.hour.valueOf() >= 2016 && <Text style={styles.item_view_text_desc}>{I18n.t('first_12_week')}</Text>}
                            </LinearGradient>
                            {/*
                             <LinearGradient style={styles.item_view_long_item} colors={['#833ab4', '#fd1d1d', '#F27121']}>
                                <TouchableOpacity style={{flex: 1}} onPress={() => instaShare()}>
                                    <Text style={styles.item_view_text}>{I18n.t('share_insta')}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            */}
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    item_view:{
        width: window.width * 0.4,
        height: window.height * 0.25,
        borderRadius: 16,
        marginStart: 16,
        marginTop: 12,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item_view_text:{
        color: '#f5f5f5',
        fontFamily: 'Rubik-Medium',
        fontSize: 16,
        marginStart: 8,
        marginTop: 8,
        textAlign: 'center',
    },
    item_view_text_desc:{
        color: '#f5f5f5',
        fontFamily: 'Rubik-Regular',
        fontSize: 12,
        marginStart: 8,
        marginTop: 8,
        marginHorizontal: 6,
        textAlign: 'center',
    },
    item_view_text_desc_red:{
        color: 'red',
        fontFamily: 'Rubik-Regular',
        fontSize: 12,
        marginStart: 8,
        marginTop: 8,
        marginHorizontal: 6,
        textAlign: 'center',
    },
    item_view_long:{
        width: window.width * 0.4,
        height: window.height * 0.6,
        borderRadius: 16,
        marginStart: 32,
        marginTop: 24,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    item_view_long_item:{
        width: window.width * 0.4,
        height: window.height * 0.22,
        borderRadius: 16,
        marginStart: 32,
        marginTop: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
