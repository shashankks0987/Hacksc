import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value, storage_Key) => {
    try {
        const jsonValue = JSON.stringify(value)
        console.log("Data stored", value)
        await AsyncStorage.setItem(storage_Key, jsonValue)
    } catch (e) {
        // saving error
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 0,
        padding: 0,
    },
    text: {
        margin: 10,
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        elevation: 5,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
    },
});

const InputComponent = ({key1}) => {
    const [weight, setText] = useState('');

    const handleTextChange = inputText => {
        setText(inputText);
        let s = {"weight": inputText}
        storeData(s, key1)
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={handleTextChange}
                value={weight}
            />
            </View>
    );
};

export default InputComponent;
