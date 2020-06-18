import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Linking } from 'react-native';
import Header from '../../components/Header';
import LottieView from 'lottie-react-native';
import infoAnimation from '../../assets/infoAnimation.json';
import { systemWeights } from 'react-native-typography';


export default function About() {
    async function navigateTo(url) {
        if (url.includes('http')) {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen)
                Linking.openURL(url);
            else
                ToastAndroid.show('Não foi possível abrir navegador', ToastAndroid.SHORT);
        }
        else {
            const emailURL = 'mailto:'+url;

            const canOpen = await Linking.canOpenURL(emailURL);
            if (canOpen)
                Linking.openURL(emailURL);
            else
                ToastAndroid.show('Não foi possível abrir o email', ToastAndroid.SHORT);
        }    
    }

    return(
        <View style={styles.container}>
            <Header  screenTitle="Sobre"/>
            
            <View style={{height: 10,}} />
            
            <Text style={styles.text}>
                {'\t\t'}O aplicativo <Text style={{...systemWeights.semibold}}>QuizSphere</Text> foi desenvolvido
                com a intenção de adquirir experiência e conhecimento. Foi criado utilizando apenas recursos gratuitos, 
                inclusive, na hospedagem do servidor e do banco de dados, logo, é importante apontar que há certo limite
                na velocidade e memória do aplicativo. 
            </Text>
            <LottieView 
                source={infoAnimation}
                autoPlay
                loop
                useNativeDriver
                style={styles.animation}
            />
            <Text style={styles.text}>
                {'\t\t'}O projeto é totalmente OpenSource, o código pode ser acessado 
                nos links:
            </Text>

            <View style={styles.linkContainer}>
                <TouchableOpacity activeOpacity={.4} onPress={() => navigateTo('https://github.com/Gust4voSales/QuizSphere-Cliente')} >
                    <Text style={styles.link}>https://github.com/Gust4voSales/QuizSphere-Cliente</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.4} onPress={() => navigateTo('https://github.com/Gust4voSales/QuizSphere-Backend')} >
                    <Text style={styles.link}>https://github.com/Gust4voSales/QuizSphere-Backend</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.text, { marginTop: 10, }]}>
                {'\t\t'}Contato, críticas ou sujestões? 
            </Text>
            <TouchableOpacity activeOpacity={.4} onPress={() => navigateTo('manoel0gustavo@gmail.com')} >
                <Text style={styles.link}>manoel0gustavo@gmail.com</Text>
            </TouchableOpacity>
          
        </View>
    );
}

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        backgroundColor: '#3D6F95',
        alignItems: 'center',
    },
    text: {
        width: '90%',
        color: 'white',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'justify',
    },
    linkContainer: {
        alignSelf: 'flex-start',
        width: '100%',
    },
    link: {
        fontSize: 14,
        width: '90%',
        color: 'black',
        textAlign: 'left',
        marginLeft: '5%',
        marginVertical: 5,
        alignSelf: 'flex-start',
        textAlign: 'left',
        // backgroundColor: '#fff',
    },
    animation: {
        width: 100, 
        height: 100,
        // position: 'absolute',
        // bottom: 30,
    }
});