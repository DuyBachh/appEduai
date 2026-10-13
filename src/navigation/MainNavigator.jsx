import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import TopSafeArea from "../components/TopSafeArea";
import colors from "../styles/colors";

import HomeScreen from "../features/home/screens/HomeScreen";
import DocumentsScreen from "../features/documents/screens/DocumentsScreen";
import DocumentDetailScreen from "../features/documents/screens/DocumentDetailScreen";
import SummaryScreen from "../features/summary/screens/SummaryScreen";
import SummaryHistoryScreen from "../features/summary/screens/SummaryHistoryScreen";
import SummaryHistoryDetailScreen from "../features/summary/screens/SummaryHistoryDetailScreen";
import ChatScreen from "../features/chat/screens/ChatScreen";
import ChatHistoryScreen from "../features/chat/screens/ChatHistoryScreen";
import ScanScreen from "../features/scanner/screens/ScanScreen";
import SolverScreen from "../features/solver/screens/SolverScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
    Home: {
        active: "home",
        inactive: "home-outline",
    },
    Documents: {
        active: "documents",
        inactive: "documents-outline",
    },
    Scan: {
        active: "scan",
        inactive: "scan-outline",
    },
    Profile: {
        active: "person",
        inactive: "person-outline",
    },
};

function MainTabs({ currentUser, onLogout }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const icons =
                    TAB_ICONS[route.name] ||
                    TAB_ICONS.Home;

                return {
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarActiveTintColor:
                        colors.primary,
                    tabBarInactiveTintColor:
                        colors.textSecondary,
                    tabBarStyle: {
                        backgroundColor:
                            colors.white,
                        borderTopColor:
                            colors.border,
                        height:
                            Platform.OS === "ios"
                                ? 82
                                : 68,
                        paddingTop: 8,
                        paddingBottom:
                            Platform.OS === "ios"
                                ? 22
                                : 8,
                    },
                    tabBarIcon: ({
                        color,
                        size,
                        focused,
                    }) => (
                        <Ionicons
                            name={
                                focused
                                    ? icons.active
                                    : icons.inactive
                            }
                            size={size}
                            color={color}
                        />
                    ),
                };
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Trang chủ" }}
            />

            <Tab.Screen
                name="Documents"
                options={{ title: "Tài liệu" }}
            >
                {(props) => (
                    <TopSafeArea>
                        <DocumentsScreen {...props} />
                    </TopSafeArea>
                )}
            </Tab.Screen>

            <Tab.Screen
                name="Scan"
                options={{ title: "Quét" }}
            >
                {(props) => (
                    <TopSafeArea>
                        <ScanScreen {...props} />
                    </TopSafeArea>
                )}
            </Tab.Screen>

            <Tab.Screen
                name="Profile"
                options={{ title: "Cá nhân" }}
            >
                {(props) => (
                    <TopSafeArea>
                        <ProfileScreen
                            {...props}
                            currentUser={currentUser}
                            onLogout={onLogout}
                        />
                    </TopSafeArea>
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const hiddenHeaderOptions = {
    headerShown: false,
};

export default function MainNavigator({
    currentUser,
    onLogout,
}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: colors.white,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: "700",
                },
            }}
        >
            <Stack.Screen
                name="MainTabs"
                options={hiddenHeaderOptions}
            >
                {(props) => (
                    <MainTabs
                        {...props}
                        currentUser={currentUser}
                        onLogout={onLogout}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen
                name="DocumentDetail"
                options={hiddenHeaderOptions}
            >
                {(props) => (
                    <TopSafeArea>
                        <DocumentDetailScreen {...props} />
                    </TopSafeArea>
                )}
            </Stack.Screen>

            <Stack.Screen
                name="Summary"
                component={SummaryScreen}
                options={hiddenHeaderOptions}
            />

            <Stack.Screen
                name="SummaryHistory"
                component={SummaryHistoryScreen}
                options={hiddenHeaderOptions}
            />

            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={hiddenHeaderOptions}
            />

            <Stack.Screen
                name="ChatHistory"
                component={ChatHistoryScreen}
                options={hiddenHeaderOptions}
            />

            <Stack.Screen
                name="SummaryHistoryDetail"
                component={SummaryHistoryDetailScreen}
                options={{
                    title: "Chi tiết tóm tắt",
                }}
            />

            <Stack.Screen
                name="Solver"
                component={SolverScreen}
                options={{
                    title: "AI Solver",
                }}
            />
        </Stack.Navigator>
    );
}
