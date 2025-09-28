import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useTheme } from "../utils/ThemeContext";
import { lightTheme, darkTheme } from "../utils/theme";
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';

type Station = {
    name: string;
    latitude: number;
    longitude: number;
    status: string;
    category: "railway" | "metro";
};

const MainLogic: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const themeColors = isDark ? darkTheme : lightTheme;
    const [isRunning, setIsRunning] = useState<boolean>(BackgroundService.isRunning());
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<"railway" | "metro">("railway");
    const [searchQuery, setSearchQuery] = useState("");

    const stations: Station[] = [
        { name: 'Borivali', latitude: 19.229, longitude: 72.8576, status: 'none', category: 'railway' },
        { name: 'Home', latitude: 19.215784, longitude: 72.817213, status: 'none', category: 'metro' },
        { name: 'Milan', latitude: 19.215462, longitude: 72.820778, status: 'none', category: 'railway' },
    ];

    const filteredStations = stations.filter(
        (station) =>
            station.category === selectedCategory &&
            station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStationSelect = async (station: Station) => {
        const stationObj: Station = {
            ...station,
            status: 'selected',
        };

        try {
            await AsyncStorage.setItem('destination', JSON.stringify(stationObj));
            console.log(stationObj)
            setModalVisible(false);
            await BackgroundService.start(veryIntensiveTask, options);
            await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
            setIsRunning(true);
        } catch (err) {
            console.log('Error saving station:', err);
        }
    };

    function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371000;
        const toRad = (value: any) => (value * Math.PI) / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // distance in meters
    }

    let watchId: any = 1000;
    const veryIntensiveTask = async (taskDataArguments: any) => {
        await new Promise(async () => {
            console.log('Background service started');
            const data:any = await AsyncStorage.getItem('destination');
            const destination:any = await JSON.parse(data)
            watchId = Geolocation.watchPosition(
                position => {
                    const dist = getDistanceFromLatLonInM( destination.latitude, destination.longitude, position.coords.latitude, position.coords.longitude);
                    Vibration.vibrate(500);
                    if (Math.round(dist) < 200) {
                        Vibration.vibrate(5000);
                        Geolocation.clearWatch(watchId);
                        setIsRunning(false);
                        BackgroundService.stop();
                    }
                },
                error => {
                    console.error(error);
                },
                { enableHighAccuracy: false, distanceFilter: 0 ,}
            );
        });
    };

    const options = {
        taskName: 'Echo',
        taskTitle: 'Echo is running',
        taskDesc: 'App is running in background..',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'echo://home',
        parameters: {
            delay: 60000,
        },
    };

    return (
        <View style={[styles.alarmButtonContainer, { backgroundColor: themeColors.background }]}>
            {!isRunning ? (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: themeColors.buttonbg }]}
                    onPress={() => {
                        setModalVisible(true)
                    }}
                >
                    <MaterialIcons name="alarm-add" size={30} color={themeColors.buttoncolor} />
                    <Text style={[styles.buttonText, { color: themeColors.buttoncolor }]}>Start</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: themeColors.buttonbg }]}
                    onPress={async () => {
                        Geolocation.clearWatch(watchId)
                        await BackgroundService.stop();
                        setIsRunning(false);
                    }}
                >
                    <MaterialIcons name="alarm-off" size={30} color={themeColors.buttoncolor} />
                    <Text style={[styles.buttonText, { color: themeColors.buttoncolor }]}>Stop</Text>
                </TouchableOpacity>
            )}
            <Modal visible={modalVisible} transparent animationType="fade">
                <BlurView
                    style={styles.modalBackground}
                    blurType={isDark ? "dark" : "light"}
                    blurAmount={10}
                    reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
                >
                    <View
                        style={[
                            styles.modalBox,
                            { backgroundColor: themeColors.background, borderColor: themeColors.text },
                        ]}
                    >
                        <Text style={[styles.title, { color: themeColors.text }]}>
                            Select Destination Station
                        </Text>

                        {/* Category Toggle */}
                        <View style={styles.categoryToggle}>
                            {["railway", "metro"].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.radioOption,
                                        {
                                            backgroundColor:
                                                selectedCategory === cat
                                                    ? themeColors.buttonbg
                                                    : themeColors.background,
                                        },
                                    ]}
                                    onPress={() => setSelectedCategory(cat as "railway" | "metro")}
                                >
                                    <Text
                                        style={{
                                            color:
                                                selectedCategory === cat
                                                    ? themeColors.buttoncolor
                                                    : themeColors.text,
                                        }}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Search Bar */}
                        <TextInput
                            style={[
                                styles.searchInput,
                                {
                                    borderColor: themeColors.linetext,
                                    color: themeColors.text,
                                },
                            ]}
                            placeholder="Search station..."
                            placeholderTextColor={themeColors.linetext}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        {/* Station List */}
                        <FlatList
                            data={filteredStations}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.stationItem,
                                        { borderBottomColor: themeColors.linetext },
                                    ]}
                                    onPress={() => handleStationSelect(item)}
                                >
                                    <Text style={[styles.stationText, { color: themeColors.text }]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: themeColors.buttonbg }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: themeColors.buttoncolor }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
};

export default MainLogic;

const styles = StyleSheet.create({
    button: {
        padding: 16,
        borderRadius: 30,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    buttonText: { fontSize: 20, fontWeight: '600' },
    alarmButtonContainer: { alignItems: 'center' },
    closeButton: {
        marginTop: 12,
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        maxHeight: '70%',
        elevation: 10,
        borderWidth: 0.1,
    },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    stationItem: {
        padding: 12,
        borderBottomWidth: 1,
    },
    stationText: { fontSize: 16 },
    categoryToggle: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
        backgroundColor: "rgba(72, 70, 70, 0.12)",
        borderRadius: 15,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 5,
        borderRadius: 12,
        width: '40%',
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginVertical: 10,
    },
});
