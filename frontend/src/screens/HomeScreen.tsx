import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getTodayTransactions, getMonthToDate } from "../api/transactionApi";
import { Transaction } from "../types";

const categoryColors: Record<string, string> = {
  Food: "#39FF14",
  Groceries: "#FAC775",
  "Tea/Coffee": "#F0997B",
  Travel: "#85B7EB",
  Petrol: "#F4C0D1",
  Recharges: "#B4A0F5",
  Wifi: "#B4A0F5",
  Electricity: "#FAC775",
  "Water Bill": "#85B7EB",
  EMI: "#F0997B",
  Home: "#85B7EB",
  Others: "#8A8A8A",
};

export default function HomeScreen() {
  const { user } = useAuth();

  const [todayTotal, setTodayTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const monthLimit = 10000; // will come from budget API later

  const fetchData = async () => {
    try {
      const [todayRes, monthRes] = await Promise.all([
        getTodayTransactions(),
        getMonthToDate(),
      ]);
      setTodayTotal(todayRes.todayTotal);
      setTransactions(todayRes.data);
      setMonthTotal(monthRes.monthTotal);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // refetch every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const remaining = monthLimit - monthTotal;
  const progressPercent = Math.min((monthTotal / monthLimit) * 100, 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 🌅";
    if (hour < 17) return "Good afternoon ☀️";
    return "Good evening 👋";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#39FF14"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.username}>{user?.name ?? "User"}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons
              name={"notifications-outline" as any}
              size={22}
              color="#39FF14"
            />
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
              <Ionicons
                name={"warning-outline" as any}
                size={14}
                color="#FAC775"
              />
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
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name={"receipt-outline" as any}
                size={40}
                color="#2A2A2A"
              />
              <Text style={styles.emptyText}>No entries today</Text>
              <Text style={styles.emptySubText}>
                Tap + to add your first expense
              </Text>
            </View>
          ) : (
            transactions.map((t) => {
              const color = categoryColors[t.categoryId?.name] ?? "#8A8A8A";
              return (
                <View key={t._id} style={styles.txRow}>
                  <View
                    style={[styles.txIcon, { backgroundColor: color + "22" }]}
                  >
                    <Ionicons
                      name={t.categoryId?.icon as any}
                      size={18}
                      color={color}
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txTitle}>
                      {t.categoryId?.name ?? "Unknown"}
                    </Text>
                    <Text style={styles.txMeta}>
                      {t.note ? t.note : t.categoryId?.group} ·{" "}
                      {new Date(t.date).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: t.type === "Income" ? "#39FF14" : "#FFFFFF" },
                    ]}
                  >
                    {t.type === "Income" ? "+" : "-"}₹
                    {t.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0D0D0D" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
  },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: "#8A8A8A" },
  username: { fontSize: 20, fontWeight: "700", color: "#FFFFFF", marginTop: 2 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  cardRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  card: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  cardLabel: { fontSize: 12, color: "#8A8A8A", marginBottom: 6 },
  cardAmount: { fontSize: 22, fontWeight: "700", color: "#39FF14" },
  cardSub: { fontSize: 11, color: "#555", marginTop: 2 },
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
  budgetTitle: { fontSize: 13, color: "#8A8A8A" },
  budgetAmount: { fontSize: 13, color: "#FFFFFF", fontWeight: "500" },
  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#39FF14", borderRadius: 3 },
  progressDanger: { backgroundColor: "#FAC775" },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  warningText: { fontSize: 12, color: "#FAC775" },
  section: { marginBottom: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  emptyBox: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 15, color: "#555", fontWeight: "500" },
  emptySubText: { fontSize: 13, color: "#333" },
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
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: "500", color: "#FFFFFF" },
  txMeta: { fontSize: 12, color: "#8A8A8A", marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "600" },
});
