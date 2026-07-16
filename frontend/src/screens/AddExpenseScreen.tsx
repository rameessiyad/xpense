import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategories } from "../api/categoryApi";
import { Category } from "../types";

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

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [type, setType] = useState<"Expense" | "Income">("Expense");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSave = async () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    try {
      setLoading(true);
      // transaction API call will go here
      Alert.alert("Success", "Expense saved!");
      setAmount("");
      setNote("");
      setSelectedCategory(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Entry</Text>
          </View>

          {/* Type toggle */}
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "Expense" && styles.typeBtnActiveExpense,
              ]}
              onPress={() => setType("Expense")}
            >
              <Ionicons
                name={"arrow-up-outline" as any}
                size={16}
                color={type === "Expense" ? "#FFFFFF" : "#8A8A8A"}
              />
              <Text
                style={[
                  styles.typeText,
                  type === "Expense" && styles.typeTextActiveExpense,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "Income" && styles.typeBtnActiveIncome,
              ]}
              onPress={() => setType("Income")}
            >
              <Ionicons
                name={"arrow-down-outline" as any}
                size={16}
                color={type === "Income" ? "#0D0D0D" : "#8A8A8A"}
              />
              <Text
                style={[
                  styles.typeText,
                  type === "Income" && styles.typeTextActiveIncome,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View style={styles.amountBox}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#333"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Categories */}
          <Text style={styles.sectionLabel}>Category</Text>
          {categoriesLoading ? (
            <ActivityIndicator color="#39FF14" style={{ marginBottom: 24 }} />
          ) : (
            <View style={styles.categoryGrid}>
              {categories
                .filter((c) => c.type === type)
                .map((cat) => {
                  const isSelected = selectedCategory?._id === cat._id;
                  const color = categoryColors[cat.name] ?? "#8A8A8A";
                  return (
                    <TouchableOpacity
                      key={cat._id}
                      style={[
                        styles.categoryItem,
                        isSelected && {
                          backgroundColor: color,
                          borderColor: color,
                        },
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Ionicons
                        name={cat.icon as any}
                        size={18}
                        color={isSelected ? "#0D0D0D" : color}
                      />
                      <Text
                        style={[
                          styles.categoryItemText,
                          isSelected && { color: "#0D0D0D", fontWeight: "700" },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}

          {/* Note */}
          <Text style={styles.sectionLabel}>Note</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a description (optional)"
            placeholderTextColor="#555"
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Date */}
          <Text style={styles.sectionLabel}>Date</Text>
          <View style={styles.dateBox}>
            <Ionicons
              name={"calendar-outline" as any}
              size={16}
              color="#8A8A8A"
            />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text style={styles.saveBtnText}>Save {type}</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  typeRow: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeBtnActiveExpense: {
    backgroundColor: "#FF4C4C",
  },
  typeBtnActiveIncome: {
    backgroundColor: "#39FF14",
  },
  typeText: {
    fontSize: 14,
    color: "#8A8A8A",
    fontWeight: "500",
  },
  typeTextActiveExpense: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  typeTextActiveIncome: {
    color: "#0D0D0D",
    fontWeight: "700",
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
    color: "#39FF14",
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "700",
    color: "#39FF14",
    minWidth: 80,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 12,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
  },
  categoryItemText: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  noteInput: {
    backgroundColor: "#1A1A1A",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1A1A1A",
    borderWidth: 0.5,
    borderColor: "#2A2A2A",
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
  },
  dateText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  saveBtn: {
    backgroundColor: "#39FF14",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#0D0D0D",
    fontSize: 16,
    fontWeight: "700",
  },
});
