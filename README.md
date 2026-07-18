# Xpense 💰
### A full-stack mobile expense tracking app

> Track every rupee — built with React Native, Node.js, and MongoDB

---

## 📱 Screenshots

> _Add your app screenshots here_

---
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/40fc43f2-0eaf-470a-8b49-41108de55534" />
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/57bcc943-0c81-42b5-b35d-0d734fb79e85" />
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/50031fdb-1abb-4cc9-8974-7d4585efd0a1" />
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/75ec79ab-01c9-4b5f-b08f-eca49d349940" />
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/6ebf9713-65eb-4709-b65f-2457d4533530" />
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/49e98561-4296-40a7-85e2-ba0887d5a5cc" />
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/adeb2ff9-e9ef-474b-be76-322d53da91f0" />


## ✨ Features

### 🔐 Authentication
- Register and login with email and password
- JWT-based secure sessions with token stored locally
- Auto-login on app relaunch using stored token
- Change password and delete account

### 💸 Expense Tracking
- Add expenses and income entries anytime via floating + button
- 10+ default categories — Food, Groceries, Tea/Coffee, Travel, Petrol, Recharges, Wifi, Electricity, Water Bill, EMI, Home, Others
- Each category belongs to a group (Bills, Recharges, Travel etc.) for grouped reporting
- Add optional note/description per entry
- Backdate entries by selecting custom date and time

### 📊 Dashboard
- Today's total spending at a glance
- Month-to-date running total (1st of month → today)
- Live transaction list for today grouped by time
- Monthly budget progress bar with warning alerts

### 📈 Reports
- Monthly total expense and income summary
- Average spending per day
- Category-wise breakdown with percentage and progress bars
- Weekly trend bar chart (last 7 days)
- Month switcher to view past months

### 💼 Budget Management
- Set overall monthly spending limit
- Set per-category limits (Food, Bills, Travel etc.)
- Smart threshold alerts — notified at 75%, 90%, and 100% of limit
- Color-coded status: On track (green), High usage (yellow), Exceeded (red)
- Edit limits anytime via modal

### 👤 Profile
- View and edit profile (name, currency)
- Supported currencies: INR, USD, EUR, GBP, AED
- Change password with current password verification
- Real-time stats — total transactions, monthly spend, category count
- Delete account with confirmation

### 🔔 Notifications
- Daily reminder at 9 PM to log expenses
- Budget alert notifications at 75%, 90%, 100% threshold
- Notification history screen

### 🎨 UI/UX
- Dark theme — black (#0D0D0D) with bright green (#39FF14) accent
- Animated splash screen with fade + spring animation
- Pull to refresh on home screen
- Empty state illustrations
- Bottom tab navigation with floating add button

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React Native | Cross-platform mobile app framework |
| TypeScript | Type-safe development |
| Expo (SDK 56) | Development toolchain and build |
| React Navigation | Stack and bottom tab navigation |
| Axios | HTTP client with JWT interceptors |
| Context API | Global auth state management |
| AsyncStorage | Persistent local token storage |
| Expo Notifications | Local push notifications |
| Expo Splash Screen | Native splash screen control |
| react-native-safe-area-context | Safe area handling |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM and schema modeling |
| JWT (jsonwebtoken) | Stateless authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

---

## 📁 Project Structure

```
Xpense/
├── backend/
│   └── src/
│       ├── config/         # DB connection, env setup
│       ├── controllers/    # auth, transaction, category, budget, report
│       ├── middleware/     # auth guard, error handler
│       ├── models/         # User, Category, Transaction, Budget
│       ├── routes/         # API route definitions
│       └── utils/          # asyncHandler, AppError, helpers
│
└── frontend/
    └── src/
        ├── api/            # axios instance + API service files
        ├── context/        # AuthContext (global state)
        ├── navigation/     # AppNavigator, AuthNavigator, MainNavigator
        ├── screens/        # All app screens
        │   ├── auth/       # Login, Register
        │   ├── HomeScreen
        │   ├── AddExpenseScreen
        │   ├── ReportsScreen
        │   ├── BudgetScreen
        │   ├── ProfileScreen
        │   └── NotificationScreen
        ├── types/          # TypeScript interfaces
        └── utils/          # storage, notifications helpers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- MongoDB Atlas account (or local MongoDB)
- Expo Go app on your phone

### 1. Clone the repository
```bash
git clone https://github.com/rameessiyad/xpense.git
cd xpense
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Update the base URL in `src/api/axios.ts` with your machine's local IP:
```typescript
baseURL: 'http://YOUR_LOCAL_IP:3000/api/v1'
```

> ⚠️ Use your machine's actual IP address (e.g. `192.168.1.5`), not `localhost` — your phone can't reach localhost on your laptop.

Find your IP:
- **Windows**: run `ipconfig` → look for IPv4 Address
- **Mac/Linux**: run `ifconfig | grep "inet "`

Start the app:
```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| GET | `/api/v1/auth/me` | Get logged in user |
| PUT | `/api/v1/auth/update-profile` | Update name and currency |
| PUT | `/api/v1/auth/change-password` | Change password |
| DELETE | `/api/v1/auth/delete-account` | Delete account |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/transactions` | Get all transactions (filters + pagination) |
| GET | `/api/v1/transactions/today` | Today's transactions and total |
| GET | `/api/v1/transactions/month-to-date` | Month running total + daily breakdown |
| POST | `/api/v1/transactions` | Add new transaction |
| PUT | `/api/v1/transactions/:id` | Update transaction |
| DELETE | `/api/v1/transactions/:id` | Delete transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | Get all user categories |
| POST | `/api/v1/categories` | Create custom category |
| PUT | `/api/v1/categories/:id` | Update category |
| DELETE | `/api/v1/categories/:id` | Delete custom category |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/budgets` | Get budgets with spent amounts |
| POST | `/api/v1/budgets` | Set budget limit |
| PUT | `/api/v1/budgets/:id` | Update budget limit |
| DELETE | `/api/v1/budgets/:id` | Delete budget |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/monthly` | Monthly summary + category breakdown |
| GET | `/api/v1/reports/weekly` | Last 7 days daily breakdown |

---

## 🗄 Database Schema

### User
```json
{ "name": "string", "email": "string", "password": "hashed", "currency": "INR" }
```

### Category
```json
{ "userId": "ref", "name": "string", "icon": "string", "group": "string", "type": "Expense|Income", "isDefault": "boolean" }
```

### Transaction
```json
{ "userId": "ref", "categoryId": "ref", "amount": "number", "type": "Expense|Income", "note": "string", "date": "Date" }
```

### Budget
```json
{ "userId": "ref", "categoryId": "ref|null", "monthlyLimit": "number", "month": "string", "year": "number", "thresholds": "[75,90,100]", "notifiedThresholds": "[]" }
```

---

## 👨‍💻 Author

**Ramees Siyad**
- GitHub: [@rameessiyad](https://github.com/rameessiyad)
- Software Developer · Kochi, Kerala

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
