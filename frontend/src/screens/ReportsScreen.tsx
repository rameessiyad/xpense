import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const categoryData = [
  {
    name: "Food",
    amount: 2400,
    percentage: 29,
    color: "#39FF14",
    icon: "restaurant-outline",
  },
  {
    name: "Bills",
    amount: 1800,
    percentage: 22,
    color: "#85B7EB",
    icon: "flash-outline",
  },
  {
    name: "EMI",
    amount: 1500,
    percentage: 18,
    color: "#F0997B",
    icon: "card-outline",
  },
  {
    name: "Travel",
    amount: 1140,
    percentage: 14,
    color: "#F4C0D1",
    icon: "bus-outline",
  },
  {
    name: "Recharges",
    amount: 600,
    percentage: 7,
    color: "#B4A0F5",
    icon: "phone-portrait-outline",
  },
  {
    name: "Groceries",
    amount: 400,
    percentage: 5,
    color: "#FAC775",
    icon: "cart-outline",
  },
  {
    name: "Others",
    amount: 400,
    percentage: 5,
    color: "#8A8A8A",
    icon: "ellipsis-horizontal-outline",
  },
];

const weeklyData = [
  { day: "Mon", amount: 320 },
  { day: "Tue", amount: 850 },
  { day: "Wed", amount: 200 },
  { day: "Thu", amount: 1200 },
  { day: "Fri", amount: 640 },
  { day: "Sat", amount: 980 },
  { day: "Sun", amount: 450 },
];

const months = [
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

const DonutChart = ({ data }: { data: typeof categoryData }) => {
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#1A1A1A",
        }}
      />
      {data.map((item, i) => {
        const dash = (item.percentage / 100) * circumference;
        const gap = circumference - dash;
        const rotation = (offset / 100) * 360 - 90;
        offset += item.percentage;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: "transparent",
              borderTopColor: item.color,
              transform: [{ rotate: `${rotation}deg` }],
              opacity: 0.9,
            }}
          />
        );
      })}
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ color: "#39FF14", fontSize: 16, fontWeight: "700" }}>
          ₹8,240
        </Text>
        <Text style={{ color: "#8A8A8A", fontSize: 10 }}>total</Text>
      </View>
    </View>
  );
};

const BarChart = ({ data }: { data: typeof weeklyData }) => {
  const maxAmount = Math.max(...data.map((d) => d.amount));
  const barHeight = 100;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        height: barHeight + 30,
      }}
    >
      {data.map((item, i) => {
        const height = (item.amount / maxAmount) * barHeight;
        const isMax = item.amount === maxAmount;
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
            <Text style={{ color: "#8A8A8A", fontSize: 10 }}>{item.day}</Text>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
        </View>

        {/* Month selector */}
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthBtn}>
            <Ionicons name="chevron-back" size={18} color="#8A8A8A" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {months[monthIndex]} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthBtn}>
            <Ionicons name="chevron-forward" size={18} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total spent</Text>
            <Text style={styles.summaryAmount}>₹8,240</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg/day</Text>
            <Text style={styles.summaryAmount}>₹275</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryAmount}>34</Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "monthly" && styles.tabActive]}
            onPress={() => setActiveTab("monthly")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "monthly" && styles.tabTextActive,
              ]}
            >
              By category
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "weekly" && styles.tabActive]}
            onPress={() => setActiveTab("weekly")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "weekly" && styles.tabTextActive,
              ]}
            >
              Weekly trend
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "monthly" ? (
          <View style={styles.section}>
            {/* Donut chart */}
            <View style={styles.chartBox}>
              <DonutChart data={categoryData} />
            </View>

            {/* Category breakdown */}
            {categoryData.map((item, i) => (
              <View key={i} style={styles.categoryRow}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: item.color + "22" },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={item.color}
                  />
                </View>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryLabelRow}>
                    <Text style={styles.categoryName}>{item.name}</Text>
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
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPct}>{item.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.weeklyBox}>
              <Text style={styles.weeklyTitle}>This week's spending</Text>
              <BarChart data={weeklyData} />
            </View>

            {/* Daily breakdown */}
            {weeklyData.map((item, i) => (
              <View key={i} style={styles.dailyRow}>
                <Text style={styles.dailyDay}>{item.day}</Text>
                <View style={styles.dailyBarBg}>
                  <View
                    style={[
                      styles.dailyBarFill,
                      { width: `${(item.amount / 1200) * 100}%` as any },
                    ]}
                  />
                </View>
                <Text style={styles.dailyAmount}>₹{item.amount}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Month selector
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
  monthText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#8A8A8A",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#39FF14",
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#39FF14",
  },
  tabText: {
    fontSize: 13,
    color: "#8A8A8A",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#0D0D0D",
    fontWeight: "700",
  },

  // Section
  section: {
    marginBottom: 16,
  },
  chartBox: {
    alignItems: "center",
    marginBottom: 24,
  },

  // Category rows
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
  categoryInfo: {
    flex: 1,
  },
  categoryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  categoryBarBg: {
    height: 5,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 2,
  },
  categoryBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  categoryPct: {
    fontSize: 11,
    color: "#8A8A8A",
  },

  // Weekly
  weeklyBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  weeklyTitle: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 16,
  },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  dailyDay: {
    fontSize: 13,
    color: "#8A8A8A",
    width: 32,
  },
  dailyBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
  },
  dailyBarFill: {
    height: "100%",
    backgroundColor: "#39FF14",
    borderRadius: 3,
  },
  dailyAmount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
    width: 60,
    textAlign: "right",
  },
});
