import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // fade + scale in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // after 2s fade out and go to app
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity, transform: [{ scale }] }]}
      >
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>₹</Text>
        </View>
        {/* App name */}
        <Text style={styles.appName}>Xpense</Text>
        <Text style={styles.tagline}>Track every rupee</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.Text style={[styles.footer, { opacity }]}>
        Smart expense tracking
      </Animated.Text>
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (showSplash) {
    return <CustomSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: "#39FF14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  logoText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#0D0D0D",
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#8A8A8A",
  },
  footer: {
    position: "absolute",
    bottom: 48,
    fontSize: 12,
    color: "#333",
  },
});
