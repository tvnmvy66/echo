import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import SplitText from './SplitText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '../utils/ThemeContext'
import { lightTheme, darkTheme } from '../utils/theme';
import HelpModal from './HelpModal';

const HeroSection: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const themeColors = isDark ? darkTheme : lightTheme;
    const [helpVisible, setHelpVisible] = useState<boolean>(false);


    return (
        <View style={[styles.container,{ backgroundColor: themeColors.background }]}>
            <View style={styles.splitTextTitleContainer}>
                <SplitText
                    text="Never Miss Your"
                    splitBy="char"
                    duration={420}
                    stagger={60}
                    translateY={10}
                    style={[styles.splitTextTitle, { color: themeColors.text }]}
                />
                <SplitText
                    text="Stop Again!"
                    splitBy="char"
                    duration={420}
                    stagger={60}
                    translateY={10}
                    style={[styles.splitTextTitle, { color: themeColors.text }]}
                />
            </View>
            <View style={[styles.splitTextDespContainer]}>
                <SplitText
                    text="Get a sound alert before you arrive"
                    splitBy="word"
                    duration={420}
                    stagger={60}
                    translateY={10}
                    style={[styles.splitTextDesp, { color: themeColors.text }]}
                />
                <SplitText
                    text="at your destination. Simply set"
                    splitBy="word"
                    duration={420}
                    stagger={60}
                    translateY={10}
                    style={[styles.splitTextDesp, { color: themeColors.text }]}
                />
                <SplitText
                    text="your location and go!"
                    splitBy="word"
                    duration={420}
                    stagger={60}
                    translateY={10}
                    style={[styles.splitTextDesp, { color: themeColors.text }]}
                />
            </View>
            <TouchableOpacity style={styles.helpButtonContainer} onPress={() => setHelpVisible(true)}>
                <Text style={[styles.helpText, { color: themeColors.text }]}>
                    Need Help?
                </Text>
                <Icon name="info" size={20} color={themeColors.text} />
            </TouchableOpacity>
            <HelpModal
                visible={helpVisible}
                onClose={() => setHelpVisible(false)}
                themeColors={themeColors}
                isDark={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    height: 250,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
    splitTextTitle: {
        fontSize: 34,
        lineHeight: 40,
        fontWeight: '600',
        textAlign: 'center',
    },
    splitTextDesp: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        textAlign: 'center',
    },
    splitTextTitleContainer: { alignItems: 'center' },
    splitTextDespContainer: { alignItems: 'center', marginTop: 10 },
    helpButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
    },
    helpText: { fontSize: 12, textDecorationLine: 'underline' },
    helpButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        gap: 2,
    },
})

export default HeroSection