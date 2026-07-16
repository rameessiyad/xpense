import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: Props) {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        currency,
      });
      await login(res.data.token, res.data.user);
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>₹</Text>
          </View>
          <Text style={styles.appName}>Xpense</Text>
          <Text style={styles.tagline}>Track every rupee</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start tracking your expenses</Text>

          {/* Name */}
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jane Doe"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Min. 6 characters"
              placeholderTextColor="#555"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showHide}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Currency */}
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencyRow}>
            {["INR", "USD", "EUR"].map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.currencyBtn,
                  currency === c && styles.currencyActive,
                ]}
                onPress={() => setCurrency(c)}
              >
                <Text
                  style={[
                    styles.currencyText,
                    currency === c && styles.currencyTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#39FF14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  logoIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D0D0D",
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tagline: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0D0D0D",
    borderWidth: 0.5,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    borderWidth: 0.5,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 14,
  },
  showHide: {
    color: "#39FF14",
    fontSize: 13,
  },
  currencyRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  currencyBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#333",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
  currencyActive: {
    backgroundColor: "#39FF14",
    borderColor: "#39FF14",
  },
  currencyText: {
    color: "#8A8A8A",
    fontWeight: "600",
    fontSize: 13,
  },
  currencyTextActive: {
    color: "#0D0D0D",
  },
  button: {
    backgroundColor: "#39FF14",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#0D0D0D",
    fontWeight: "700",
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#8A8A8A",
    fontSize: 13,
  },
  link: {
    color: "#39FF14",
    fontSize: 13,
    fontWeight: "600",
  },
});
