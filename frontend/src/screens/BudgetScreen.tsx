import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categoryBudgets = [
  { name: 'Food',       icon: 'restaurant-outline',     color: '#39FF14', limit: 3000, spent: 2400 },
  { name: 'Bills',      icon: 'flash-outline',          color: '#85B7EB', limit: 2000, spent: 1800 },
  { name: 'Travel',     icon: 'bus-outline',            color: '#F4C0D1', limit: 1500, spent: 1140 },
  { name: 'Groceries',  icon: 'cart-outline',           color: '#FAC775', limit: 2000, spent: 400  },
  { name: 'Recharges',  icon: 'phone-portrait-outline', color: '#B4A0F5', limit: 1000, spent: 600  },
  { name: 'EMI',        icon: 'card-outline',           color: '#F0997B', limit: 1500, spent: 1500 },
];

export default function BudgetScreen() {
  const [monthlyLimit, setMonthlyLimit] = useState(10000);
  const [monthlySpent] = useState(8240);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState('');

  const monthlyRemaining = monthlyLimit - monthlySpent;
  const monthlyProgress = (monthlySpent / monthlyLimit) * 100;

  const getProgressColor = (spent: number, limit: number) => {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return '#FF4C4C';
    if (pct >= 90)  return '#FAC775';
    return '#39FF14';
  };

  const getStatusLabel = (spent: number, limit: number) => {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return { label: 'Exceeded', color: '#FF4C4C' };
    if (pct >= 90)  return { label: 'Almost full', color: '#FAC775' };
    if (pct >= 75)  return { label: 'High usage', color: '#FAC775' };
    return { label: 'On track', color: '#39FF14' };
  };

  const openEdit = (name: string, currentLimit: number) => {
    setEditingCategory(name);
    setNewLimit(String(currentLimit));
    setModalVisible(true);
  };

  const handleSaveLimit = () => {
    if (!newLimit || isNaN(Number(newLimit))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    // API call will go here
    Alert.alert('Success', `Limit updated for ${editingCategory}`);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Budget</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => openEdit('Monthly', monthlyLimit)}
          >
            <Ionicons name="pencil-outline" size={16} color="#39FF14" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Overall monthly budget */}
        <View style={styles.overallCard}>
          <View style={styles.overallTop}>
            <View>
              <Text style={styles.overallLabel}>Monthly budget</Text>
              <Text style={styles.overallMonth}>July 2026</Text>
            </View>
            <View style={styles.overallAmounts}>
              <Text style={styles.overallSpent}>₹{monthlySpent.toLocaleString()}</Text>
              <Text style={styles.overallLimit}> / ₹{monthlyLimit.toLocaleString()}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View style={[
              styles.progressFill,
              {
                width: `${Math.min(monthlyProgress, 100)}%` as any,
                backgroundColor: getProgressColor(monthlySpent, monthlyLimit),
              }
            ]} />
          </View>

          <View style={styles.overallBottom}>
            <View style={styles.remainingRow}>
              <Ionicons
                name={monthlyRemaining <= 2000 ? 'warning-outline' : 'checkmark-circle-outline'}
                size={14}
                color={monthlyRemaining <= 2000 ? '#FAC775' : '#39FF14'}
              />
              <Text style={[
                styles.remainingText,
                { color: monthlyRemaining <= 2000 ? '#FAC775' : '#39FF14' }
              ]}>
                {monthlyRemaining <= 0
                  ? 'Budget exceeded!'
                  : `₹${monthlyRemaining.toLocaleString()} remaining`
                }
              </Text>
            </View>
            <Text style={styles.progressPct}>{Math.round(monthlyProgress)}%</Text>
          </View>

          {/* Notification thresholds */}
          <View style={styles.thresholdRow}>
            <Text style={styles.thresholdLabel}>Notify at:</Text>
            {[75, 90, 100].map((t) => (
              <View
                key={t}
                style={[
                  styles.thresholdChip,
                  monthlyProgress >= t && { backgroundColor: '#39FF14' }
                ]}
              >
                <Text style={[
                  styles.thresholdText,
                  monthlyProgress >= t && { color: '#0D0D0D' }
                ]}>
                  {t}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category budgets */}
        <Text style={styles.sectionTitle}>Category limits</Text>

        {categoryBudgets.map((cat, i) => {
          const pct = (cat.spent / cat.limit) * 100;
          const status = getStatusLabel(cat.spent, cat.limit);
          const progressColor = getProgressColor(cat.spent, cat.limit);

          return (
            <View key={i} style={styles.categoryCard}>
              <View style={styles.categoryTop}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '22' }]}>
                    <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                  </View>
                  <View>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.color + '22' }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.categoryEditBtn}
                  onPress={() => openEdit(cat.name, cat.limit)}
                >
                  <Ionicons name="pencil-outline" size={14} color="#8A8A8A" />
                </TouchableOpacity>
              </View>

              <View style={styles.categoryAmountRow}>
                <Text style={styles.categorySpent}>₹{cat.spent.toLocaleString()}</Text>
                <Text style={styles.categoryLimit}> / ₹{cat.limit.toLocaleString()}</Text>
              </View>

              <View style={styles.categoryProgressBg}>
                <View style={[
                  styles.categoryProgressFill,
                  {
                    width: `${Math.min(pct, 100)}%` as any,
                    backgroundColor: progressColor,
                  }
                ]} />
              </View>

              <Text style={styles.categoryPct}>
                {Math.round(pct)}% used · ₹{(cat.limit - cat.spent).toLocaleString()} left
              </Text>
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit limit modal */}
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
                Edit limit — {editingCategory}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={22} color="#8A8A8A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>New monthly limit (₹)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 5000"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
              autoFocus
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveLimit}>
              <Text style={styles.modalSaveBtnText}>Save limit</Text>
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
    backgroundColor: '#0D0D0D',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#39FF14',
  },
  editBtnText: {
    color: '#39FF14',
    fontSize: 13,
    fontWeight: '500',
  },

  // Overall card
  overallCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderWidth: 0.5,
    borderColor: '#2A2A2A',
  },
  overallTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overallMonth: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  overallAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  overallSpent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#39FF14',
  },
  overallLimit: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  progressBg: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  overallBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  remainingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressPct: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  thresholdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: '#2A2A2A',
  },
  thresholdLabel: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  thresholdChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
  },
  thresholdText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '500',
  },

  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
  },

  // Category cards
  categoryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#2A2A2A',
  },
  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  categoryEditBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  categorySpent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryLimit: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  categoryProgressBg: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPct: {
    fontSize: 11,
    color: '#8A8A8A',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalLabel: {
    fontSize: 13,
    color: '#8A8A8A',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#0D0D0D',
    borderWidth: 0.5,
    borderColor: '#333',
    borderRadius: 10,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  modalSaveBtn: {
    backgroundColor: '#39FF14',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#0D0D0D',
    fontWeight: '700',
    fontSize: 15,
  },
});