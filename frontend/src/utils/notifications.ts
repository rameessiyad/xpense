import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const setupNotificationHandler = () => {
  // call this only after app is ready
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

export const registerForPushNotifications = async (): Promise<
  string | null
> => {
  if (!Device.isDevice) return null;

  const isExpoGo = Constants.appOwnership === "expo";
  if (isExpoGo) {
    console.log("Push token skipped in Expo Go");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("budget-alerts", {
      name: "Budget Alerts",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#39FF14",
      sound: "default",
    });
  }

  return null;
};

export const sendBudgetNotification = async (
  title: string,
  body: string,
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        data: { type: "budget-alert" },
      },
      trigger: null,
    });
  } catch (error) {
    console.log("Could not send notification:", error);
  }
};

export const scheduleDailyReminder = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget to log today's expenses 💰",
        body: "Tap to add your expenses for today",
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 21,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.log("Could not schedule reminder:", error);
  }
};
