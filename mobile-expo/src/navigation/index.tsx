import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/theme';

// Auth screens
import SplashScreen        from '../screens/Auth/Splash';
import WelcomeScreen       from '../screens/Auth/Welcome';
import SignUpScreen        from '../screens/Auth/SignUp';
import LoginScreen         from '../screens/Auth/Login';
import LocationGateScreen  from '../screens/Auth/LocationGate';
import ExchangeSelection   from '../screens/Auth/ExchangeSelection';
import RiskAppetiteScreen  from '../screens/Auth/RiskAppetite';
import RecommendationMode  from '../screens/Auth/RecommendationMode';

// Main tab screens
import HomeScreen       from '../screens/Main/Home';
import PortfolioScreen  from '../screens/Main/Portfolio';
import DiscoverScreen   from '../screens/Main/Discover';
import WatchlistScreen  from '../screens/Main/Watchlist';
import ProfileScreen    from '../screens/Main/Profile';

// Modal
import StockDetailScreen from '../screens/StockDetail/StockDetail';

const AuthStack = createNativeStackNavigator();
const MainTab   = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '📡', Portfolio: '💼', Discover: '🔍', Watchlist: '⭐', Profile: '👤',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
      {TAB_ICONS[name] ?? '●'}
    </Text>
  );
}

function MainTabs() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <MainTab.Screen name="Home"      component={HomeScreen}      options={{ tabBarLabel: 'Signals' }} />
      <MainTab.Screen name="Portfolio" component={PortfolioScreen} />
      <MainTab.Screen name="Discover"  component={DiscoverScreen}  />
      <MainTab.Screen name="Watchlist" component={WatchlistScreen} />
      <MainTab.Screen name="Profile"   component={ProfileScreen}   />
    </MainTab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash"             component={SplashScreen}       />
      <AuthStack.Screen name="Welcome"            component={WelcomeScreen}      />
      <AuthStack.Screen name="SignUp"             component={SignUpScreen}        />
      <AuthStack.Screen name="Login"              component={LoginScreen}         />
      <AuthStack.Screen name="LocationGate"       component={LocationGateScreen}  />
      <AuthStack.Screen name="ExchangeSelection"  component={ExchangeSelection}   />
      <AuthStack.Screen name="RiskAppetite"       component={RiskAppetiteScreen}  />
      <AuthStack.Screen name="RecommendationMode" component={RecommendationMode}  />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const isAuthenticated = false; // full auth flow active

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="MainTabs"    component={MainTabs} />
          <RootStack.Screen name="StockDetail" component={StockDetailScreen}
            options={{ presentation: 'modal' }} />
        </>
      ) : (
        <>
          <RootStack.Screen name="Auth" component={AuthNavigator} />
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          <RootStack.Screen name="StockDetail" component={StockDetailScreen}
            options={{ presentation: 'modal' }} />
        </>
      )}
    </RootStack.Navigator>
  );
}
