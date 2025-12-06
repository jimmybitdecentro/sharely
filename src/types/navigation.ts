import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  ProfileModal: undefined;
  EditProfileModal: undefined;
  EditProfileFormModal: undefined;
  PreferencesModal: undefined;
  ReferralModal: undefined;
  TransactionsModal: undefined;
  HelpSupportModal: undefined;
  NotificationsModal: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  LoginSocial: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OtpVerification: { email: string; referral?: string };
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Add: undefined;
  Notifications: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  MyLinksScreen:undefined;
  HelpSupport: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: {productId: string};
  Notifications: undefined;
  HelpSupport: undefined;
};

export type ProfileStackParamList = {
  Wallet: undefined;
  Profile: undefined;
  Transactions: undefined;
  Preferences: undefined;
  MyEarnings: undefined;
  MyCampaigns: undefined;
  MyOrders: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  EditProfileForm: undefined;
  NotificationSettings: undefined;
  HelpSupportScreen: undefined;
};

