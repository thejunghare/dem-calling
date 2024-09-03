import React, { useEffect } from "react";
import { View, RefreshControl, SafeAreaView, ScrollView, Image } from "react-native";
import { Text } from "react-native-paper";

const Help = () => {
    return (
        <SafeAreaView className='flex-1 p-3'>
            <View>
                <Text className="text-xs font-bold px-5 py-2 text-red-500">Color scheme:</Text>
                <View className='bg-white flex flex-row items-center p-3 m-2 rounded-lg'>
                    <View className='flex flex-row items-center justify-between'>
                        <Text className="text-xs font-bold px-5 py-2">Completed:</Text>
                        <Text className="text-xs font-bold px-5 py-3 rounded-full" style={{ backgroundColor: '#6CB4EE' }}></Text>
                    </View>
                    <View className='flex flex-row items-center justify-between'>
                        <Text className="text-xs font-bold px-5 py-2 rounded-full">Recall:</Text>
                        <Text className="text-xs font-bold px-5 py-3 rounded-full" style={{ backgroundColor: '#FFBF00' }}></Text>
                    </View>

                </View>

                <View className='bg-white flex flex-row items-center p-3 m-2 rounded-lg'>
                    <View className='flex flex-row items-center justify-between'>
                        <Text className="text-xs font-bold px-5 py-2 ">No Answer:</Text>
                        <Text className="text-xs font-bold px-5 py-3 rounded-full" style={{ backgroundColor: '#FF4F00' }}></Text>
                    </View>
                    <View className='flex flex-row items-center justify-between'>
                        <Text className="text-xs font-bold px-5 py-2 ">Declined:</Text>
                        <Text className="text-xs font-bold px-5 py-3 rounded-full" style={{ backgroundColor: '#ED2939' }}></Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );

}

export default Help;