// Navbar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useTheme } from "../utils/ThemeContext";
import { lightTheme, darkTheme } from "../utils/theme";


type NavbarProps = {
  title: string;
};

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const themeColors = isDark ? darkTheme : lightTheme;

  return (
    <View style={[
      styles.container,
      { backgroundColor: themeColors.background }
    ]}>
      {/* Left Side - Title */}
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>

      {/* Right Side - Button */}
      <TouchableOpacity onPress={toggleTheme} style={[styles.button, { backgroundColor: themeColors.background }]}>
        {!isDark ? <MaterialIcons name="light-mode" size={20} color={themeColors.text} /> : <MaterialIcons name="dark-mode" size={20} color={themeColors.text} />}
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    padding: 12,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
