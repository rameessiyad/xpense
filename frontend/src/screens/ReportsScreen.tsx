import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  getMonthlyReport,
  getWeeklyReport,
  CategoryBreakdown,
} from "../api/reportApi";

const COLORS = [
  "#39FF14",
  "#85B7EB",
  "#F0997B",
  "#F4C0D1",
  "#B4A0F5",
  "#FAC775",
  "#8A8A8A",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BarChart = ({ data }: { data: { _id: string; total: number }[] }) => {
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        height: 130,
      }}
    >
      {data.map((item, i) => {
        const height = (item.total / max) * 100;
        const isMax = item.total === max;
        return (
          <View key={i} style={{ flex: 1, alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: "100%",
                height,
                backgroundColor: isMax ? "#39FF14" : "#2A2A2A",
                borderRadius: 4,
              }}
            />
            <Text style={{ color: "#8A8A8A", fontSize: 10 }}>
              {new Date(item._id).toLocaleDateString("en-IN", {
                weekday: "short",
              })}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function ReportsScreen() {
  const now = new Date();
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [activeTab, setActiveTab] = useState<"monthly" | "weekly">("monthly");
  const [report, setReport] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [monthly, weekly] = await Promise.all([
        getMonthlyReport(monthIndex + 1, year),
        getWeeklyReport(),
      ]);
      setReport(monthly);
      setWeeklyData(weekly.dailyBreakdown);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [monthIndex, year]),
  );

  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else setMonthIndex((m) => m - 1);
  };
  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else setMonthIndex((m) => m + 1);
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
        </View>

        {/* Month selector */}
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthBtn}>
            <Ionicons name={"chevron-back" as any} size={18} color="#8A8A8A" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {MONTHS[monthIndex]} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthBtn}>
            <Ionicons
              name={"chevron-forward" as any}
              size={18}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total spent</Text>
            <Text style={styles.summaryAmount}>
              ₹{(report?.totalExpense ?? 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg/day</Text>
            <Text style={styles.summaryAmount}>
              ₹{(report?.avgPerDay ?? 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryAmount}>{report?.totalCount ?? 0}</Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          {(["monthly", "weekly"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === "monthly" ? "By category" : "Weekly trend"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "monthly" ? (
          <View>
            {report?.categoryBreakdown?.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons
                  name={"pie-chart-outline" as any}
                  size={40}
                  color="#2A2A2A"
                />
                <Text style={styles.emptyText}>No data for this month</Text>
              </View>
            ) : (
              report?.categoryBreakdown?.map(
                (item: CategoryBreakdown, i: number) => (
                  <View key={i} style={styles.categoryRow}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: COLORS[i % COLORS.length] + "22" },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={16}
                        color={COLORS[i % COLORS.length]}
                      />
                    </View>
                    <View style={styles.categoryInfo}>
                      <View style={styles.categoryLabelRow}>
                        <Text style={styles.categoryName}>{item.group}</Text>
                        <Text style={styles.categoryAmount}>
                          ₹{item.amount.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.categoryBarBg}>
                        <View
                          style={[
                            styles.categoryBarFill,
                            {
                              width: `${item.percentage}%` as any,
                              backgroundColor: COLORS[i % COLORS.length],
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.categoryPct}>
                        {item.percentage}% · {item.count} transactions
                      </Text>
                    </View>
                  </View>
                ),
              )
            )}
          </View>
        ) : (
          <View style={styles.weeklyBox}>
            <Text style={styles.weeklyTitle}>Last 7 days</Text>
            {weeklyData.length > 0 ? (
              <BarChart data={weeklyData} />
            ) : (
              <Text style={styles.emptyText}>No data this week</Text>
            )}
          </View>
        )}

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
  header: { paddingTop: 20, marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  monthBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  monthText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  summaryLabel: { fontSize: 11, color: "#8A8A8A", marginBottom: 4 },
  summaryAmount: { fontSize: 15, fontWeight: "700", color: "#39FF14" },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: "#39FF14" },
  tabText: { fontSize: 13, color: "#8A8A8A", fontWeight: "500" },
  tabTextActive: { color: "#0D0D0D", fontWeight: "700" },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInfo: { flex: 1 },
  categoryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryName: { fontSize: 13, color: "#FFFFFF", fontWeight: "500" },
  categoryAmount: { fontSize: 13, color: "#FFFFFF", fontWeight: "600" },
  categoryBarBg: {
    height: 5,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 2,
  },
  categoryBarFill: { height: "100%", borderRadius: 3 },
  categoryPct: { fontSize: 11, color: "#8A8A8A" },
  weeklyBox: { backgroundColor: "#1A1A1A", borderRadius: 14, padding: 16 },
  weeklyTitle: { fontSize: 13, color: "#8A8A8A", marginBottom: 16 },
  emptyBox: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, color: "#555" },
});
