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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  getBudgets,
  createBudget,
  updateBudget,
  BudgetData,
} from "../api/budgetApi";

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetData | null>(null);
  const [newLimit, setNewLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const overallBudget = budgets.find((b) => !b.categoryId);
  const categoryBudgets = budgets.filter((b) => b.categoryId);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      setBudgets(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBudgets();
    }, []),
  );

  const openEdit = (budget: BudgetData | null) => {
    setEditingBudget(budget);
    setNewLimit(budget ? String(budget.monthlyLimit) : "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!newLimit || isNaN(Number(newLimit))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);
      if (editingBudget) {
        await updateBudget(editingBudget._id, {
          monthlyLimit: Number(newLimit),
        });
      } else {
        await createBudget({ monthlyLimit: Number(newLimit) });
      }
      await fetchBudgets();
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return "#FF4C4C";
    if (pct >= 90) return "#FAC775";
    return "#39FF14";
  };

  const getStatusLabel = (pct: number) => {
    if (pct >= 100) return { label: "Exceeded", color: "#FF4C4C" };
    if (pct >= 90) return { label: "Almost full", color: "#FAC775" };
    if (pct >= 75) return { label: "High usage", color: "#FAC775" };
    return { label: "On track", color: "#39FF14" };
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
          <Text style={styles.headerTitle}>Budget</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => openEdit(overallBudget ?? null)}
          >
            <Ionicons
              name={"pencil-outline" as any}
              size={16}
              color="#39FF14"
            />
            <Text style={styles.editBtnText}>
              {overallBudget ? "Edit" : "Set limit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overall budget */}
        {overallBudget ? (
          <View style={styles.overallCard}>
            <View style={styles.overallTop}>
              <View>
                <Text style={styles.overallLabel}>Monthly budget</Text>
                <Text style={styles.overallMonth}>
                  {new Date().toLocaleString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.overallAmounts}>
                <Text style={styles.overallSpent}>
                  ₹{overallBudget.spent.toLocaleString()}
                </Text>
                <Text style={styles.overallLimit}>
                  {" "}
                  / ₹{overallBudget.monthlyLimit.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(overallBudget.percentage, 100)}%` as any,
                    backgroundColor: getProgressColor(overallBudget.percentage),
                  },
                ]}
              />
            </View>
            <View style={styles.overallBottom}>
              <View style={styles.remainingRow}>
                <Ionicons
                  name={
                    (overallBudget.remaining <= 2000
                      ? "warning-outline"
                      : "checkmark-circle-outline") as any
                  }
                  size={14}
                  color={
                    overallBudget.remaining <= 2000 ? "#FAC775" : "#39FF14"
                  }
                />
                <Text
                  style={[
                    styles.remainingText,
                    {
                      color:
                        overallBudget.remaining <= 0
                          ? "#FF4C4C"
                          : overallBudget.remaining <= 2000
                            ? "#FAC775"
                            : "#39FF14",
                    },
                  ]}
                >
                  {overallBudget.remaining <= 0
                    ? "Budget exceeded!"
                    : `₹${overallBudget.remaining.toLocaleString()} remaining`}
                </Text>
              </View>
              <Text style={styles.progressPct}>
                {overallBudget.percentage}%
              </Text>
            </View>
            <View style={styles.thresholdRow}>
              <Text style={styles.thresholdLabel}>Notify at:</Text>
              {overallBudget.thresholds.map((t) => (
                <View
                  key={t}
                  style={[
                    styles.thresholdChip,
                    overallBudget.percentage >= t && {
                      backgroundColor: "#39FF14",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.thresholdText,
                      overallBudget.percentage >= t && { color: "#0D0D0D" },
                    ]}
                  >
                    {t}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.noBudgetBox}
            onPress={() => openEdit(null)}
          >
            <Ionicons
              name={"add-circle-outline" as any}
              size={32}
              color="#39FF14"
            />
            <Text style={styles.noBudgetText}>Set a monthly budget limit</Text>
            <Text style={styles.noBudgetSub}>Tap to get started</Text>
          </TouchableOpacity>
        )}

        {/* Category budgets */}
        {categoryBudgets.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Category limits</Text>
            {categoryBudgets.map((cat, i) => {
              const status = getStatusLabel(cat.percentage);
              return (
                <View key={i} style={styles.categoryCard}>
                  <View style={styles.categoryTop}>
                    <View style={styles.categoryLeft}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: "#39FF14" + "22" },
                        ]}
                      >
                        <Ionicons
                          name={
                            (cat.categoryId?.icon ??
                              "ellipsis-horizontal-outline") as any
                          }
                          size={18}
                          color="#39FF14"
                        />
                      </View>
                      <View>
                        <Text style={styles.categoryName}>
                          {cat.categoryId?.name}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: status.color + "22" },
                          ]}
                        >
                          <Text
                            style={[styles.statusText, { color: status.color }]}
                          >
                            {status.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.categoryEditBtn}
                      onPress={() => openEdit(cat)}
                    >
                      <Ionicons
                        name={"pencil-outline" as any}
                        size={14}
                        color="#8A8A8A"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.categoryAmountRow}>
                    <Text style={styles.categorySpent}>
                      ₹{cat.spent.toLocaleString()}
                    </Text>
                    <Text style={styles.categoryLimit}>
                      {" "}
                      / ₹{cat.monthlyLimit.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.categoryProgressBg}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        {
                          width: `${Math.min(cat.percentage, 100)}%` as any,
                          backgroundColor: getProgressColor(cat.percentage),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPct}>
                    {cat.percentage}% used · ₹{cat.remaining.toLocaleString()}{" "}
                    left
                  </Text>
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBudget ? "Edit limit" : "Set monthly limit"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name={"close-outline" as any}
                  size={22}
                  color="#8A8A8A"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Monthly limit (₹)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 10000"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.modalSaveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text style={styles.modalSaveBtnText}>Save limit</Text>
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
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#39FF14",
  },
  editBtnText: { color: "#39FF14", fontSize: 13, fontWeight: "500" },
  overallCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  overallTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  overallLabel: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  overallMonth: { fontSize: 12, color: "#8A8A8A", marginTop: 2 },
  overallAmounts: { flexDirection: "row", alignItems: "baseline" },
  overallSpent: { fontSize: 18, fontWeight: "700", color: "#39FF14" },
  overallLimit: { fontSize: 13, color: "#8A8A8A" },
  progressBg: {
    height: 8,
    backgroundColor: "#2A2A2A",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  overallBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  remainingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  remainingText: { fontSize: 13, fontWeight: "500" },
  progressPct: { fontSize: 13, color: "#8A8A8A" },
  thresholdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: "#2A2A2A",
  },
  thresholdLabel: { fontSize: 12, color: "#8A8A8A" },
  thresholdChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
  },
  thresholdText: { fontSize: 12, color: "#8A8A8A", fontWeight: "500" },
  noBudgetBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    borderStyle: "dashed",
  },
  noBudgetText: { fontSize: 15, color: "#FFFFFF", fontWeight: "600" },
  noBudgetSub: { fontSize: 13, color: "#8A8A8A" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  categoryCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  categoryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 11, fontWeight: "500" },
  categoryEditBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  categorySpent: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  categoryLimit: { fontSize: 13, color: "#8A8A8A" },
  categoryProgressBg: {
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  categoryProgressFill: { height: "100%", borderRadius: 3 },
  categoryPct: { fontSize: 11, color: "#8A8A8A" },
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
    fontSize: 16,
    marginBottom: 20,
  },
  modalSaveBtn: {
    backgroundColor: "#39FF14",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  modalSaveBtnText: { color: "#0D0D0D", fontWeight: "700", fontSize: 15 },
});
