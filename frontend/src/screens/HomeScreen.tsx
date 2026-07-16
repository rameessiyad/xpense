import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const transactions = [
  {
    id: "1",
    title: "Tea",
    category: "Tea/Coffee",
    time: "9:30 AM",
    amount: 20,
    icon: "cafe-outline",
  },
  {
    id: "2",
    title: "Lunch",
    category: "Food",
    time: "1:15 PM",
    amount: 150,
    icon: "restaurant-outline",
  },
  {
    id: "3",
    title: "Bus fare",
    category: "Travel",
    time: "2:05 PM",
    amount: 30,
    icon: "bus-outline",
  },
  {
    id: "4",
    title: "Mobile recharge",
    category: "Recharges",
    time: "6:40 PM",
    amount: 250,
    icon: "phone-portrait-outline",
  },
  {
    id: "5",
    title: "Electricity Bill",
    category: "Bills",
    time: "7:00 PM",
    amount: 800,
    icon: "flash-outline",
  },
];

const categoryColors: Record<string, string> = {
  "Tea/Coffee": "#7C4700",
  Food: "#0A4A2E",
  Travel: "#0A2A4A",
  Recharges: "#3A0A4A",
  Bills: "#4A2A0A",
  Groceries: "#0A3A1A",
  EMI: "#4A0A0A",
  Home: "#1A1A4A",
};

export default function HomeScreen() {
  const { user } = useAuth();

  const todayTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthTotal = 8240;
  const monthLimit = 10000;
  const remaining = monthLimit - monthTotal;
  const progressPercent = (monthTotal / monthLimit) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening 👋</Text>
            <Text style={styles.username}>{user?.name ?? "User"}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color="#39FF14" />
          </TouchableOpacity>
        </View>

        {/* Today + Month cards */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Today</Text>
            <Text style={styles.cardAmount}>
              ₹{todayTotal.toLocaleString()}
            </Text>
            <Text style={styles.cardSub}>spent</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>This month</Text>
            <Text style={styles.cardAmount}>
              ₹{monthTotal.toLocaleString()}
            </Text>
            <Text style={styles.cardSub}>spent</Text>
          </View>
        </View>

        {/* Budget progress */}
        <View style={styles.budgetBox}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Monthly budget</Text>
            <Text style={styles.budgetAmount}>
              ₹{monthTotal.toLocaleString()} / ₹{monthLimit.toLocaleString()}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` as any },
                progressPercent >= 90 && styles.progressDanger,
              ]}
            />
          </View>
          {remaining <= 2000 && (
            <View style={styles.warningRow}>
              <Ionicons name="warning-outline" size={14} color="#FAC775" />
              <Text style={styles.warningText}>
                Only ₹{remaining.toLocaleString()} left to reach your limit
              </Text>
            </View>
          )}
        </View>

        {/* Today's transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's entries</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((t) => (
            <View key={t.id} style={styles.txRow}>
              <View
                style={[
                  styles.txIcon,
                  { backgroundColor: categoryColors[t.category] ?? "#1A1A1A" },
                ]}
              >
                <Ionicons name={t.icon as any} size={18} color="#39FF14" />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{t.title}</Text>
                <Text style={styles.txMeta}>
                  {t.category} · {t.time}
                </Text>
              </View>
              <Text style={styles.txAmount}>₹{t.amount}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#0D0D0D" />
      </TouchableOpacity>
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

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },

  // Cards
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  cardLabel: {
    fontSize: 12,
    color: "#8A8A8A",
    marginBottom: 6,
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#39FF14",
  },
  cardSub: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },

  // Budget
  budgetBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  budgetTitle: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  budgetAmount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#39FF14",
    borderRadius: 3,
  },
  progressDanger: {
    backgroundColor: "#FAC775",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  warningText: {
    fontSize: 12,
    color: "#FAC775",
  },

  // Transactions
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  viewAll: {
    fontSize: 13,
    color: "#39FF14",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1E1E1E",
    gap: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  txMeta: {
    fontSize: 12,
    color: "#8A8A8A",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#39FF14",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
