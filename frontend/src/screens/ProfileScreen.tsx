import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const currencies = ["INR", "USD", "EUR", "GBP", "AED"];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.currency ?? "INR",
  );

  // Edit profile state
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: logout },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }
    // API call will go here
    Alert.alert("Success", "Profile updated successfully");
    setEditModalVisible(false);
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
    // API call will go here
    Alert.alert("Success", "Password changed successfully");
    setPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="pencil-outline" size={14} color="#0D0D0D" />
            <Text style={styles.editProfileBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>34</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹8,240</Text>
            <Text style={styles.statLabel}>This month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Currency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
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
                    name="notifications-outline"
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
                    name="lock-closed-outline"
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
              <Ionicons name="chevron-forward" size={16} color="#8A8A8A" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIcon, { backgroundColor: "#FAC77522" }]}
                >
                  <Ionicons
                    name={"tag-outline" as any}
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
              <Ionicons name="chevron-forward" size={16} color="#8A8A8A" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIcon, { backgroundColor: "#F0997B22" }]}
                >
                  <Ionicons name="download-outline" size={18} color="#F0997B" />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Export data</Text>
                  <Text style={styles.settingSubLabel}>Download as CSV</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A8A8A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FF4C4C" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity style={styles.deleteBtn}>
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
                <Ionicons name="close-outline" size={22} color="#8A8A8A" />
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

            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#555"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={handleSaveProfile}
            >
              <Text style={styles.modalSaveBtnText}>Save changes</Text>
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
                <Ionicons name="close-outline" size={22} color="#8A8A8A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Current password</Text>
            <TextInput
              style={styles.modalInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholderTextColor="#555"
              placeholder="••••••••"
            />

            <Text style={styles.modalLabel}>New password</Text>
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor="#555"
              placeholder="Min. 6 characters"
            />

            <Text style={styles.modalLabel}>Confirm new password</Text>
            <TextInput
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#555"
              placeholder="••••••••"
            />

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={handleChangePassword}
            >
              <Text style={styles.modalSaveBtnText}>Update password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#39FF14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 14,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#39FF14",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileBtnText: {
    color: "#0D0D0D",
    fontSize: 13,
    fontWeight: "600",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#39FF14",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#8A8A8A",
  },
  statDivider: {
    width: 0.5,
    backgroundColor: "#2A2A2A",
    marginVertical: 4,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8A8A8A",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Currency
  currencyRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  currencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  currencyChipActive: {
    backgroundColor: "#39FF14",
    borderColor: "#39FF14",
  },
  currencyText: {
    fontSize: 13,
    color: "#8A8A8A",
    fontWeight: "500",
  },
  currencyTextActive: {
    color: "#0D0D0D",
    fontWeight: "700",
  },

  // Settings card
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
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  settingSubLabel: {
    fontSize: 12,
    color: "#8A8A8A",
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 14,
  },

  // Logout
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
  logoutText: {
    color: "#FF4C4C",
    fontSize: 15,
    fontWeight: "600",
  },

  // Delete
  deleteBtn: {
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
  },
  deleteText: {
    color: "#555",
    fontSize: 13,
    textDecorationLine: "underline",
  },

  // Modal
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
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalLabel: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 8,
  },
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
  modalSaveBtn: {
    backgroundColor: "#39FF14",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  modalSaveBtnText: {
    color: "#0D0D0D",
    fontWeight: "700",
    fontSize: 15,
  },
});
