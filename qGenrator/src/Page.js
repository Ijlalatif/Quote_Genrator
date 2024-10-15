import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ToastAndroid, Platform, Share } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';

export default function Page() {
    const [quote, setQuote] = useState('Press the button');
    const [author, setAuthor] = useState('');
    const [copied, setCopied] = useState(false); // State to show copied message

    const randomQuote = () => {
        fetch('https://favqs.com/api/qotd')
            .then(res => res.json())
            .then(data => {
                setQuote(data.quote.body);
                setAuthor(data.quote.author);
            });
    };

    useEffect(() => {
        randomQuote();
    }, []);

    const speakQuote = () => {
        Speech.speak(`${quote} by ${author}`, {
            language: 'en-US',
            pitch: 1.0,
            rate: 0.75
        });
    };

    const copyQuote = async () => {
        await Clipboard.setStringAsync(`${quote} - ${author}`);
        setCopied(true); // Show copied message
        if (Platform.OS === 'android') {
            ToastAndroid.show('Quote copied to clipboard!', ToastAndroid.SHORT); // Android toast
        } else {
            alert('Quote copied to clipboard!'); // iOS alert
        }

        setTimeout(() => {
            setCopied(false); // Reset copied message after 2 seconds
        }, 2000);
    };

    const shareQuote = async () => {
        try {
            await Share.share({
                message: `Check out this quote: "${quote}" by ${author}`
            });
        } catch (error) {
            console.error("Error sharing the quote:", error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5372f0' }}>
            <StatusBar barStyle='light-content' />
            <View style={{ width: '90%', backgroundColor: '#FFF', borderRadius: 20, padding: 20 }}>
                <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 20 }}>
                    Quote of the day
                </Text>
                <FontAwesome name='quote-left' style={{ fontSize: 20 }} />
                <Text style={{ color: '#000', fontSize: 16, lineHeight: 26, letterSpacing: 1.1, fontWeight: '400', textAlign: 'center', marginBottom: 10 }}>
                    {quote}
                </Text>
                <FontAwesome name='quote-right' style={{ fontSize: 20, textAlign: 'right' }} />
                <Text
                    style={{ color: '#000', fontSize: 16, lineHeight: 26, letterSpacing: 1.1, fontWeight: '400', textAlign: 'right', fontStyle: 'italic', marginBottom: 10 }}
                >{author}</Text>
                <TouchableOpacity onPress={randomQuote} style={{ backgroundColor: '#5372f0', padding: 20, borderRadius: 30, marginVertical: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>New Quote</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity onPress={speakQuote}
                        style={{ borderWidth: 2, borderColor: '#5372f0', borderRadius: 50, padding: 15 }}>
                        <FontAwesome name='volume-up' size={22} color='#5372f0' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={copyQuote}
                        style={{ borderWidth: 2, borderColor: '#5372f0', borderRadius: 50, padding: 15 }}>
                        <FontAwesome name='copy' size={22} color='#5372f0' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={shareQuote}
                        style={{ borderWidth: 2, borderColor: '#5372f0', borderRadius: 50, padding: 15 }}>
                        <FontAwesome name='share' size={22} color='#5372f0' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
