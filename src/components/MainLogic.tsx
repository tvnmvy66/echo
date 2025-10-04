import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useTheme } from "../utils/ThemeContext";
import { lightTheme, darkTheme } from "../utils/theme";
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';
import Sound from 'react-native-sound';
import { requestAllPermissions, enableLocation } from "../utils/permissions"

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
        { name: 'Virar', latitude: 19.454751296645092, longitude:72.81200028525781, status: 'none', category: 'railway' },
        { name: 'Nalla Sopara', latitude: 19.41735413475849, longitude: 72.81894885605254, status: 'none', category: 'railway' },
        { name: 'Vasai Road', latitude: 19.382671196186404, longitude: 72.83194310052339, status: 'none', category: 'railway' },
        { name: 'Naigaon', latitude: 19.35138403627699, longitude: 72.84642847892712, status: 'none', category: 'railway' },
        { name: 'Bhayandar', latitude: 19.31159207663589, longitude: 72.85249297081619, status: 'none', category: 'railway' },
        { name: 'Mira Road', latitude: 19.280917437073196, longitude: 72.85583882943364, status: 'none', category: 'railway' },
        { name: 'Dahisar', latitude: 19.249555932233395, longitude: 72.85936694046465, status: 'none', category: 'railway' },
        { name: 'Borivali', latitude: 19.229090729998905, longitude: 72.85746742394922, status: 'none', category: 'railway' },
        { name: 'Kandivli', latitude: 19.20414553427533, longitude: 72.85171977088501, status: 'none', category: 'railway' },
        { name: 'Malad', latitude: 19.18705472093002, longitude: 72.84894583063591, status: 'none', category: 'railway' },
        { name: 'Goregaon', latitude: 19.16462200427039, longitude: 72.8494056986092, status: 'none', category: 'railway' },
        { name: 'Ram Mandir', latitude: 19.149541529286548, longitude: 72.85036455004929, status: 'none', category: 'railway' },
        { name: 'Jogeshwari', latitude: 19.136244575436052, longitude: 72.84874012390536, status: 'none', category: 'railway' },
        { name: 'Andheri', latitude: 19.119900265443338, longitude: 72.84661045890093, status: 'none', category: 'railway' },
        { name: 'Ville Parle', latitude: 19.100507846765087, longitude: 72.84412013789665, status: 'none', category: 'railway' },
        { name: 'Santacruz', latitude: 19.081685860267182, longitude: 72.84164570213994, status: 'none', category: 'railway' },
        { name: 'Khar Road', latitude: 19.069627975466897, longitude: 72.84017442172949, status: 'none', category: 'railway' },
        { name: 'Bandra', latitude: 19.054858278535377, longitude: 72.84062823859583, status: 'none', category: 'railway' },
        { name: 'Mahim', latitude: 19.04071592890212, longitude: 72.84656954993504, status: 'none', category: 'railway' },
        { name: 'Matunga Road', latitude: 19.028695791517634, longitude: 72.8469142687562, status: 'none', category: 'railway' },
        { name: 'Dadar', latitude: 19.01913224612962, longitude: 72.84393161649518, status: 'none', category: 'railway' },
        { name: 'Prabhadevi', latitude: 19.00761570087842, longitude: 72.83591029994527, status: 'none', category: 'railway' },
        { name: 'Lower Parel', latitude: 18.996438728017846, longitude: 72.8308221432363, status: 'none', category: 'railway' },
        { name: 'Mahalaxmi', latitude: 18.981692070236942, longitude: 72.8237020988581, status: 'none', category: 'railway' },
        { name: 'Mumbai Central', latitude: 18.969729816810517, longitude: 72.81923238478383, status: 'none', category: 'railway' },
        { name: 'Grant Road', latitude: 18.96337537422939, longitude: 72.81624854245001, status: 'none', category: 'railway' },
        { name: 'Charni Road', latitude: 18.95182763948836, longitude: 72.81838109416816, status: 'none', category: 'railway' },
        { name: 'Marine Lines', latitude: 18.94626114333547, longitude: 72.82341545762904, status: 'none', category: 'railway' },
        { name: 'Churchgate', latitude: 18.93528284668717, longitude: 72.82708524886232, status: 'none', category: 'railway' },
        { name: 'CSMT', latitude: 18.93989232042675, longitude: 72.83541438448437, status: 'none', category: 'railway' },
        { name: 'Sandhurst Road', latitude: 18.960840284067267, longitude: 72.8394158093713, status: 'none', category: 'railway' },
        { name: 'Byculla', latitude: 18.976710028357783, longitude: 72.83266227534568, status: 'none', category: 'railway' },
        { name: 'Chinchpokli', latitude: 18.98715330262339, longitude: 72.8328725699359, status: 'none', category: 'railway' },
        { name: 'Currey Road', latitude: 18.9942967749057, longitude: 72.8329339308083, status: 'none', category: 'railway' },
        { name: 'Parel', latitude: 19.00912662632727, longitude: 72.83738577886075, status: 'none', category: 'railway' },
        { name: 'Matunga', latitude: 19.02780113658236, longitude: 72.85032823270993, status: 'none', category: 'railway' },
        { name: 'Sion', latitude: 19.04658505323596, longitude: 72.86330020469161, status: 'none', category: 'railway' },
        { name: 'Kurla', latitude: 19.065657049940057, longitude: 72.87899722537266, status: 'none', category: 'railway' },
        { name: 'Vidyavihar', latitude: 19.079143000726404, longitude: 72.89736439786111, status: 'none', category: 'railway' },
        { name: 'Ghatkopar', latitude: 19.08574628723533, longitude: 72.90892136898302, status: 'none', category: 'railway' },
        { name: 'Vikhroli', latitude: 19.11086119654618, longitude: 72.92789551523121, status: 'none', category: 'railway' },
        { name: 'Kanjur Marg', latitude: 19.128219941280552, longitude: 72.928595545548, status: 'none', category: 'railway' },
        { name: 'Nahur', latitude: 19.154534818686983, longitude: 72.94680086049875, status: 'none', category: 'railway' },
        { name: 'Mulund Depot', latitude: 19.16380755458708, longitude: 72.95097294937163, status: 'none', category: 'railway' },
        { name: 'Mulund', latitude: 19.172084775526304, longitude: 72.95620257942147, status: 'none', category: 'railway' },
        { name: 'Thane', latitude: 19.18644731909679, longitude: 72.97539390856458, status: 'none', category: 'railway' },
        { name: 'Versova', latitude: 19.130280615886644, longitude: 72.82134185402565, status: 'none', category: 'metro' },
        { name: 'D N Nagar', latitude: 19.12829623882957, longitude: 72.83011019729985, status: 'none', category: 'metro' },
        { name: 'Azad Nagar', latitude: 19.126877522068156, longitude: 72.8376189833844, status: 'none', category: 'metro' },
        { name: 'Andheri', latitude: 19.120633264477735, longitude: 72.84869120614536, status: 'none', category: 'metro' },
        { name: 'Western Express Highway', latitude: 19.115856911238197, longitude: 72.85642401711475, status: 'none', category: 'metro' },
        { name: 'Airport Road', latitude: 19.110162935991262, longitude: 72.87421597805235, status: 'none', category: 'metro' },
        { name: 'Saki Naka', latitude: 19.103505401314656, longitude: 72.88795496311775, status: 'none', category: 'metro' },
        { name: 'Asalpha', latitude: 19.096362365642616, longitude: 72.89490426258276, status: 'none', category: 'metro' },
        { name: 'Jagruti Nagar', latitude: 19.09250721191421, longitude: 72.90181181202477, status: 'none', category: 'metro' },
        { name: 'Ghatkopar', latitude: 19.086803430271484, longitude: 72.90807928538236, status: 'none', category: 'metro' },
        { name: 'Gundavali', latitude: 19.114957575079487, longitude: 72.85524610901662, status: 'none', category: 'metro' },
        { name: 'Mogra', latitude: 19.128664281761537, longitude: 72.85542659548899, status: 'none', category: 'metro' },
        { name: 'Jogeshwari (East)', latitude: 19.142847840830914, longitude: 72.85501870795795, status: 'none', category: 'metro' },
        { name: 'Goregaon (East)', latitude: 19.152559771669093, longitude: 72.8565270224081, status: 'none', category: 'metro' },
        { name: 'Aarey', latitude: 19.16926306639266, longitude: 72.85872832514742, status: 'none', category: 'metro' },
        { name: 'Kurar', latitude: 19.18727501659153, longitude: 72.85839206683336, status: 'none', category: 'metro' },
        { name: 'Akurli', latitude: 19.198175378132245, longitude: 72.86064840831881, status: 'none', category: 'metro' },
        { name: 'Poisar', latitude: 19.20383384385606, longitude: 72.86337106767054, status: 'none', category: 'metro' },
        { name: 'Magathane', latitude: 19.21715898778463, longitude: 72.86673949051713, status: 'none', category: 'metro' },
        { name: 'Devipada', latitude: 19.22426519503461, longitude: 72.86416011496834, status: 'none', category: 'metro' },
        { name: 'Rashtriya Udyan', latitude: 19.234543021589506, longitude: 72.86309639299748, status: 'none', category: 'metro' },
        { name: 'Ovari Pada', latitude: 19.24326796275108, longitude: 72.8642494986633, status: 'none', category: 'metro' },
        { name: 'Dahisar (East)', latitude: 19.250917395633877, longitude: 72.86655576344246, status: 'none', category: 'metro' },
        { name: 'Anand Nagar', latitude: 19.257334611022387, longitude: 72.86588819127869, status: 'none', category: 'metro' },
        { name: 'Kandarpada', latitude: 19.256561079072807, longitude: 72.85056356916384, status: 'none', category: 'metro' },
        { name: 'Mandapeshwar IC Colony', latitude: 19.249398994082622, longitude: 72.84555653842433, status: 'none', category: 'metro' },
        { name: 'Eksar', latitude: 19.240462794690433, longitude: 72.84347858792916, status: 'none', category: 'metro' },
        { name: 'Borivali (West)', latitude: 19.231311607948943, longitude: 72.8407951463798, status: 'none', category: 'metro' },
        { name: 'Shimpoli', latitude: 19.22283840642035, longitude: 72.8408995966391, status: 'none', category: 'metro' },
        { name: 'Kandivali (West)', latitude: 19.21404145171617, longitude: 72.83731890321116, status: 'none', category: 'metro' },
        { name: 'Dahanukarwadi', latitude: 19.206124478200593, longitude: 72.8346544586083, status: 'none', category: 'metro' },
        { name: 'Valnai-Meeth Chowky', latitude: 19.19687257869008, longitude: 72.83382671874347, status: 'none', category: 'metro' },
        { name: 'Malad West', latitude: 19.185250115296924, longitude: 72.83591301571352, status: 'none', category: 'metro' },
        { name: 'Lower Malad', latitude: 19.172900180686014, longitude: 72.83633930377617, status: 'none', category: 'metro' },
        { name: 'Bangur Nagar', latitude: 19.16236922762344, longitude: 72.83475147348945, status: 'none', category: 'metro' },
        { name: 'Goregaon West', latitude: 19.15312188491975, longitude: 72.83556683681427, status: 'none', category: 'metro' },
        { name: 'Oshiwara', latitude: 19.14605044498607, longitude: 72.8338307208452, status: 'none', category: 'metro' },
        { name: 'Lower Oshiwara', latitude: 19.14060709615117, longitude: 72.83171097524607, status: 'none', category: 'metro' },
        { name: 'Andheri West', latitude: 19.129166735799217, longitude: 72.83143541799718, status: 'none', category: 'metro' },
        { name: 'Milan', latitude: 19.215462, longitude: 72.820778, status: 'none', category: 'metro' },
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
        const options = {
            taskName: 'echo',
            taskTitle: 'Echo',
            taskDesc: 'App is running in background..',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            linkingURI: 'com.echo://Home',
            parameters: {
                delay: 60000,
                station: station
            },
        };
        try {
            await AsyncStorage.setItem('destination', JSON.stringify(stationObj));
            console.log(station)
            setModalVisible(false);
            await BackgroundService.start(veryIntensiveTask, options);
            await BackgroundService.updateNotification({ taskDesc: 'App is running...' });
            setIsRunning(true);
        } catch (err) {
            console.log('Error saving station:', err);
        }
    };

    const playRingtone = () => {
        const ringtone = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Error loading sound:', error);
                return;
            }
            ringtone?.play((success) => {
                if (!success) {
                    console.log('Sound playback failed');
                }
            });
        });
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

    useEffect(() => {
        requestAllPermissions();
        enableLocation();
    }, []);

    let watchId: any = 1000;
    const veryIntensiveTask = async (taskDataArguments: any) => {
        const { station } = taskDataArguments
        await new Promise(async () => {
            console.log('Background service started');
            watchId = Geolocation.watchPosition(
                position => {
                    const dist = getDistanceFromLatLonInM(station.latitude, station.longitude, position.coords.latitude, position.coords.longitude);
                    console.log(dist,station)
                    Vibration.vibrate(500);
                    if (Math.round(dist) < 2500) {
                        Vibration.vibrate(5000);
                        playRingtone();
                        Geolocation.clearWatch(watchId);
                        setIsRunning(false);
                        BackgroundService.stop();
                    }
                },
                error => {
                    console.error(error);
                },
                { enableHighAccuracy: false, distanceFilter: 0 }
            );
        });
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
