// Navbar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useTheme } from "../utils/ThemeContext";
import { lightTheme, darkTheme } from "../utils/theme";

const Navbar: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const themeColors = isDark ? darkTheme : lightTheme;

    return (
        <View style={[styles.footer,{ backgroundColor: themeColors.background }]}>
            <Text style={[styles.text, { color: themeColors.text }]}>*For queries, features & feedback</Text>
            <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: themeColors.buttonbg }]}
                onPress={() => { Linking.openURL('mailto:tanmay9987@gmail.com').catch((err) => console.error("Failed to open mail app:", err)); }}
            >
                <MaterialIcons name="mail" size={20} color={themeColors.buttoncolor} />
                <Text style={{ color: themeColors.buttoncolor }}> Contact Developer</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Navbar;

const styles = StyleSheet.create({
    footer: { fontSize: 20, height: 100, alignItems: 'center', justifyContent: 'center' },
    contactButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
    text: { fontSize: 10 },
});
