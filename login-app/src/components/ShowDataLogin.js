import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { useAuth } from "../AuthContext";

const ShowDataLogin = () => {
    const{email} = useAuth();


  console.log("ShowDataLogin email => ",email);
    return (
      <View>
        <Text> Email: {email}</Text>
      </View>
    ); 
};

export default ShowDataLogin;
