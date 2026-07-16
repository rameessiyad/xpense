import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { name: 'Food',        icon: 'restaurant-outline',       color: '#39FF14' },
  { name: 'Groceries',   icon: 'cart-outline',             color: '#FAC775' },
  { name: 'Tea/Coffee',  icon: 'cafe-outline',             color: '#F0997B' },
  { name: 'Travel',      icon: 'bus-outline',              color: '#85B7EB' },
  { name: 'Petrol',      icon: 'car-outline',              color: '#F4C0D1' },
  { name: 'Recharges',   icon: 'phone-portrait-outline',   color: '#B4A0F5' },
  { name: 'Bills',       icon: 'flash-outline',            color: '#FAC775' },
  { name: 'EMI',         icon: 'card-outline',             color: '#F0997B' },
  { name: 'Home',        icon: 'home-outline',             color: '#85B7EB' },
  { name: 'Others',      icon: 'ellipsis-horizontal-outline', color: '#8A8A8A' },
];

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [type, setType] = useState<'Expense' | 'Income'>('Expense');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      setLoading(true);
      // API call will go here once backend is ready
      Alert.alert('Success', 'Expense saved!');
      setAmount('');
      setNote('');
      setSelectedCategory('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Entry</Text>
          </View>

          {/* Type toggle */}
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'Expense' && styles.typeBtnActiveExpense]}
              onPress={() => setType('Expense')}
            >
              <Ionicons
                name="arrow-up-outline"
                size={16}
                color={type === 'Expense' ? '#0D0D0D' : '#8A8A8A'}
              />
              <Text style={[styles.typeText, type === 'Expense' && styles.typeTextActiveExpense]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'Income' && styles.typeBtnActiveIncome]}
              onPress={() => setType('Income')}
            >
              <Ionicons
                name="arrow-down-outline"
                size={16}
                color={type === 'Income' ? '#0D0D0D' : '#8A8A8A'}
              />
              <Text style={[styles.typeText, type === 'Income' && styles.typeTextActiveIncome]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount input */}
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

          {/* Category */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  style={[
                    styles.categoryItem,
                    isSelected && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={isSelected ? '#0D0D0D' : cat.color}
                  />
                  <Text style={[
                    styles.categoryItemText,
                    isSelected && { color: '#0D0D0D', fontWeight: '700' },
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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
            <Ionicons name="calendar-outline" size={16} color="#8A8A8A" />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>
              {loading ? 'Saving...' : `Save ${type}`}
            </Text>
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
    backgroundColor: '#0D0D0D',
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
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Type toggle
  typeRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeBtnActiveExpense: {
    backgroundColor: '#FF4C4C',
  },
  typeBtnActiveIncome: {
    backgroundColor: '#39FF14',
  },
  typeText: {
    fontSize: 14,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  typeTextActiveExpense: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  typeTextActiveIncome: {
    color: '#0D0D0D',
    fontWeight: '700',
  },

  // Amount
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
    borderWidth: 0.5,
    borderColor: '#2A2A2A',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#39FF14',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    color: '#39FF14',
    minWidth: 80,
    textAlign: 'center',
  },

  // Category grid
  sectionLabel: {
    fontSize: 13,
    color: '#8A8A8A',
    marginBottom: 12,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#2A2A2A',
  },
  categoryItemText: {
    fontSize: 13,
    color: '#FFFFFF',
  },

  // Note
  noteInput: {
    backgroundColor: '#1A1A1A',
    borderWidth: 0.5,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Date
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 0.5,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
  },
  dateText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  // Save button
  saveBtn: {
    backgroundColor: '#39FF14',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '700',
  },
});