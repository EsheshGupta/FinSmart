import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

// Auth screens
import SplashScreen        from '../screens/Auth/Splash';
import WelcomeScreen       from '../screens/Auth/Welcome';
import SignUpScreen        from '../screens/Auth/SignUp';
import LoginScreen         from '../screens/Auth/Login';
import LocationGateScreen  from '../screens/Auth/LocationGate';
import ExchangeSelectionScreen from '../screens/Auth/ExchangeSelection';
import RiskAppetiteScreen  from '../screens/Auth/RiskAppetite';
import RecommendationModeScreen from '../screens/Auth/RecommendationMode';

// Main tab screens
import HomeScreen       from '../screens/Main/Home';
import PortfolioScreen  from '../screens/Main/Portfolio';
import DiscoverScreen   from '../screens/Main/Discover';
import WatchlistScreen  from '../screens/Main/Watchlist';
import ProfileScreen    from '../screens/Main/Profile';

// Stock Detail (modal stack)
import StockDetailScreen from '../screens/StockDetail/StockDetail';

const AuthStack = createNativeStackNavigator();
const MainTab   = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⚡', Portfolio: '💼', Discover: '🔍', Watchlist: '👁', Profile: '👤',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icons[name]}</Text>
    </View>
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
          paddingBottom: Spacing.xs,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: Typography.xs, fontWeight: Typography.medium as any },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <MainTab.Screen name="Home"      component={HomeScreen}      options={{ tabBarLabel: 'Signals' }} />
      <MainTab.Screen name="Portfolio" component={PortfolioScreen} options={{ tabBarLabel: 'Portfolio' }} />
      <MainTab.Screen name="Discover"  component={DiscoverScreen}  options={{ tabBarLabel: 'Discover' }} />
      <MainTab.Screen name="Watchlist" component={WatchlistScreen} options={{ tabBarLabel: 'Watchlist' }} />
      <MainTab.Screen name="Profile"   component={ProfileScreen}   options={{ tabBarLabel: 'Profile' }} />
    </MainTab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash"             component={SplashScreen} />
      <AuthStack.Screen name="Welcome"            component={WelcomeScreen} />
      <AuthStack.Screen name="SignUp"             component={SignUpScreen} />
      <AuthStack.Screen name="Login"              component={LoginScreen} />
      <AuthStack.Screen name="LocationGate"       component={LocationGateScreen} />
      <AuthStack.Screen name="ExchangeSelection"  component={ExchangeSelectionScreen} />
      <AuthStack.Screen name="RiskAppetite"       component={RiskAppetiteScreen} />
      <AuthStack.Screen name="RecommendationMode" component={RecommendationModeScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  // TODO: wire to Redux auth state — for now always show Auth
  const isAuthenticated = false;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="Main"        component={MainTabs} />
          <RootStack.Screen
            name="StockDetail"
            component={StockDetailScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
