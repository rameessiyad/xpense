import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import {
  updateProfile,
  changePassword,
  deleteAccount,
  getStats,
} from "../api/profileApi";

const currencies = ["INR", "USD", "EUR", "GBP", "AED"];

export default function ProfileScreen() {
  const { user, logout, login } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.currency ?? "INR",
  );
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    monthTotal: 0,
    totalCategories: 0,
  });

  // Edit profile state
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, []),
  );

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      // fail silently for stats
    }
  };

  const handleSaveProfile = async () => {
    if (!name) {
      Alert.alert("Error", "Name is required");
      return;
    }
    try {
      setSaving(true);
      const updatedUser = await updateProfile({
        name,
        currency: selectedCurrency,
      });
      // update auth context with new user data
      await login(user?.token ?? "", updatedUser);
      Alert.alert("Success", "Profile updated successfully");
      setEditModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    try {
      setSaving(true);
      await changePassword({ currentPassword, newPassword });
      Alert.alert("Success", "Password changed successfully");
      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              logout();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: logout },
    ]);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user?.name ?? "U")}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => {
              setName(user?.name ?? "");
              setSelectedCurrency(user?.currency ?? "INR");
              setEditModalVisible(true);
            }}
          >
            <Ionicons
              name={"pencil-outline" as any}
              size={14}
              color="#0D0D0D"
            />
            <Text style={styles.editProfileBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalTransactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ₹{stats.monthTotal.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>This month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalCategories}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIcon, { backgroundColor: "#39FF1422" }]}
                >
                  <Ionicons
                    name={"notifications-outline" as any}
                    size={18}
                    color="#39FF14"
                  />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingSubLabel}>Budget alerts</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#2A2A2A", true: "#39FF14" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setPasswordModalVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIcon, { backgroundColor: "#85B7EB22" }]}
                >
                  <Ionicons
                    name={"lock-closed-outline" as any}
                    size={18}
                    color="#85B7EB"
                  />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Change password</Text>
                  <Text style={styles.settingSubLabel}>
                    Update your password
                  </Text>
                </View>
              </View>
              <Ionicons
                name={"chevron-forward" as any}
                size={16}
                color="#8A8A8A"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIcon, { backgroundColor: "#FAC77522" }]}
                >
                  <Ionicons
                    name={"pricetag-outline" as any}
                    size={18}
                    color="#FAC775"
                  />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Categories</Text>
                  <Text style={styles.settingSubLabel}>
                    Manage your categories
                  </Text>
                </View>
              </View>
              <Ionicons
                name={"chevron-forward" as any}
                size={16}
                color="#8A8A8A"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIcon, { backgroundColor: "#F0997B22" }]}
                >
                  <Ionicons
                    name={"download-outline" as any}
                    size={18}
                    color="#F0997B"
                  />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Export data</Text>
                  <Text style={styles.settingSubLabel}>Download as CSV</Text>
                </View>
              </View>
              <Ionicons
                name={"chevron-forward" as any}
                size={16}
                color="#8A8A8A"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name={"log-out-outline" as any} size={18} color="#FF4C4C" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons
                  name={"close-outline" as any}
                  size={22}
                  color="#8A8A8A"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Full name</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#555"
              placeholder="Your name"
            />

            <Text style={styles.modalLabel}>Currency</Text>
            <View style={styles.currencyRow}>
              {currencies.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.currencyChip,
                    selectedCurrency === c && styles.currencyChipActive,
                  ]}
                  onPress={() => setSelectedCurrency(c)}
                >
                  <Text
                    style={[
                      styles.currencyText,
                      selectedCurrency === c && styles.currencyTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.modalSaveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text style={styles.modalSaveBtnText}>Save changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change password</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons
                  name={"close-outline" as any}
                  size={22}
                  color="#8A8A8A"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Current password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                placeholderTextColor="#555"
                placeholder="••••••••"
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Text style={styles.showHide}>
                  {showCurrent ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>New password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                placeholderTextColor="#555"
                placeholder="Min. 6 characters"
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Text style={styles.showHide}>{showNew ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Confirm new password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                placeholderTextColor="#555"
                placeholder="••••••••"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.showHide}>
                  {showConfirm ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalSaveBtn, saving && { opacity: 0.6 }]}
              onPress={handleChangePassword}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text style={styles.modalSaveBtnText}>Update password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0D0D0D" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 20, marginBottom: 24 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#39FF14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: "700", color: "#0D0D0D" },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: { fontSize: 13, color: "#8A8A8A", marginBottom: 14 },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#39FF14",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileBtnText: { color: "#0D0D0D", fontSize: 13, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  statCard: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#39FF14",
    marginBottom: 4,
  },
  statLabel: { fontSize: 11, color: "#8A8A8A" },
  statDivider: { width: 0.5, backgroundColor: "#2A2A2A", marginVertical: 4 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A8A8A",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: { fontSize: 14, color: "#FFFFFF", fontWeight: "500" },
  settingSubLabel: { fontSize: 12, color: "#8A8A8A", marginTop: 1 },
  divider: { height: 0.5, backgroundColor: "#2A2A2A", marginHorizontal: 14 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF4C4C22",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#FF4C4C55",
  },
  logoutText: { color: "#FF4C4C", fontSize: 15, fontWeight: "600" },
  deleteBtn: { alignItems: "center", padding: 12, marginBottom: 8 },
  deleteText: { color: "#555", fontSize: 13, textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  modalLabel: { fontSize: 13, color: "#8A8A8A", marginBottom: 8 },
  modalInput: {
    backgroundColor: "#0D0D0D",
    borderWidth: 0.5,
    borderColor: "#333",
    borderRadius: 10,
    padding: 14,
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
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 14,
  },
  showHide: { color: "#39FF14", fontSize: 13 },
  currencyRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  currencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#0D0D0D",
    borderWidth: 0.5,
    borderColor: "#333",
  },
  currencyChipActive: { backgroundColor: "#39FF14", borderColor: "#39FF14" },
  currencyText: { fontSize: 13, color: "#8A8A8A", fontWeight: "500" },
  currencyTextActive: { color: "#0D0D0D", fontWeight: "700" },
  modalSaveBtn: {
    backgroundColor: "#39FF14",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  modalSaveBtnText: { color: "#0D0D0D", fontWeight: "700", fontSize: 15 },
});
