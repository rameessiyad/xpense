import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ReportsScreen from "../screens/ReportsScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import BudgetScreen from "../screens/BudgetScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type MainTabParamList = {
  Home: undefined;
  Reports: undefined;
  AddExpense: undefined;
  Budget: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0D0D0D",
          borderTopColor: "#1A1A1A",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#39FF14",
        tabBarInactiveTintColor: "#8A8A8A",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reports") {
            iconName = focused ? "pie-chart" : "pie-chart-outline";
          } else if (route.name === "AddExpense") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Budget") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ tabBarLabel: "Add" }}
      />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
