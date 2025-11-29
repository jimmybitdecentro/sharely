import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
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
};

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: {productId: string};
  Notifications: undefined;
  HelpSupport: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  MyEarnings: undefined;
  MyCampaigns: undefined;
  MyOrders: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  HelpSupport: undefined;
};

