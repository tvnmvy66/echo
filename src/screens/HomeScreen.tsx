import React from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import MainLogic from "../components/MainLogic";
import { useTheme } from "../utils/ThemeContext";
import { lightTheme, darkTheme } from "../utils/theme.ts";

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeColors = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: themeColors.background }}>
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={themeColors.background}
          />
          <Navbar title="Echo" />
          <HeroSection />
          <MainLogic />
          <Footer />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});