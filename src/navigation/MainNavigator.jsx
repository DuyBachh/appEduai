import {
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
    Platform,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import colors from "../styles/colors";

import HomeScreen from "../screens/home/HomeScreen";
import DocumentsScreen from "../screens/documents/DocumentsScreen";
import DocumentDetailScreen from "../screens/documents/DocumentDetailScreen";
import SummaryScreen from "../screens/documents/SummaryScreen";
import SummaryHistoryScreen from "../screens/documents/SummaryHistoryScreen";
import SummaryHistoryDetailScreen from "../screens/documents/SummaryHistoryDetailScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import ChatHistoryScreen from "../screens/chat/ChatHistoryScreen";
import ScanScreen from "../screens/scanner/ScanScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SolverScreen from "../screens/solver/SolverScreen";

const Tab =
    createBottomTabNavigator();

const Stack =
    createNativeStackNavigator();

// ========================================
// TAB ICON
// ========================================

const getTabIcon = (
    routeName,
    focused
) => {
    switch (routeName) {
        case "Home":
            return focused
                ? "home"
                : "home-outline";

        case "Documents":
            return focused
                ? "documents"
                : "documents-outline";

        case "Scan":
            return focused
                ? "scan"
                : "scan-outline";

        case "Profile":
            return focused
                ? "person"
                : "person-outline";

        default:
            return "ellipse-outline";
    }
};

// ========================================
// MAIN TABS
// ========================================

function MainTabs({
    currentUser,
    onLogout,
}) {
    return (
        <Tab.Navigator
            screenOptions={({
                route,
            }) => ({
                // ========================================
                // HEADER
                // ========================================

                headerShown: true,

                headerStyle: {
                    backgroundColor:
                        colors.white,
                },

                headerTitleStyle: {
                    fontSize: 20,

                    fontWeight:
                        "700",

                    color:
                        colors.text,
                },

                headerTintColor:
                    colors.text,

                headerShadowVisible:
                    false,

                headerTitleAlign:
                    "left",

                // ========================================
                // TAB ICON
                // ========================================

                tabBarIcon: ({
                    focused,
                    color,
                    size,
                }) => (
                    <Ionicons
                        name={getTabIcon(
                            route.name,
                            focused
                        )}
                        size={size}
                        color={color}
                    />
                ),

                // ========================================
                // TAB COLORS
                // ========================================

                tabBarActiveTintColor:
                    colors.primary,

                tabBarInactiveTintColor:
                    colors.textSecondary,

                // ========================================
                // TAB LABEL
                // ========================================

                tabBarLabelStyle: {
                    fontSize: 12,

                    fontWeight:
                        "600",

                    marginTop: 2,
                },

                // ========================================
                // TAB BAR STYLE
                // ========================================

                tabBarStyle: {
                    backgroundColor:
                        colors.white,

                    borderTopWidth: 1,

                    borderTopColor:
                        colors.border,

                    height:
                        Platform.OS ===
                        "ios"
                            ? 82
                            : 68,

                    paddingTop: 8,

                    paddingBottom:
                        Platform.OS ===
                        "ios"
                            ? 20
                            : 8,

                    shadowColor:
                        colors.black,

                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },

                    shadowOpacity:
                        0.05,

                    shadowRadius: 6,

                    elevation: 8,
                },

                tabBarItemStyle: {
                    paddingVertical: 2,
                },

                tabBarHideOnKeyboard:
                    true,
            })}
        >
            {/* HOME */}

            <Tab.Screen
                name="Home"
                component={
                    HomeScreen
                }
                options={{
                    title:
                        "Trang chủ",

                    tabBarLabel:
                        "Trang chủ",
                }}
            />

            {/* DOCUMENTS */}

            <Tab.Screen
                name="Documents"
                component={
                    DocumentsScreen
                }
                options={{
                    title:
                        "Tài liệu",

                    tabBarLabel:
                        "Tài liệu",
                }}
            />

            {/* SCAN */}

            <Tab.Screen
                name="Scan"
                component={
                    ScanScreen
                }
                options={{
                    title:
                        "Quét tài liệu",

                    tabBarLabel:
                        "Quét",
                }}
            />

            {/* PROFILE */}

            <Tab.Screen
                name="Profile"
                options={{
                    title:
                        "Cá nhân",

                    tabBarLabel:
                        "Cá nhân",
                }}
            >
                {(props) => (
                    <ProfileScreen
                        {...props}
                        currentUser={
                            currentUser
                        }
                        onLogout={
                            onLogout
                        }
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

// ========================================
// MAIN NAVIGATOR
// ========================================

export default function MainNavigator({
    currentUser,
    onLogout,
}) {
    return (
        <Stack.Navigator>
            {/* MAIN TABS */}

            <Stack.Screen
                name="MainTabs"
                options={{
                    headerShown:
                        false,
                }}
            >
                {(props) => (
                    <MainTabs
                        {...props}
                        currentUser={
                            currentUser
                        }
                        onLogout={
                            onLogout
                        }
                    />
                )}
            </Stack.Screen>

            {/* DOCUMENT DETAIL */}

            <Stack.Screen
                name="DocumentDetail"
                component={
                    DocumentDetailScreen
                }
                options={{
                    title:
                        "Chi tiết tài liệu",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />

            {/* SUMMARY */}

            <Stack.Screen
                name="Summary"
                component={
                    SummaryScreen
                }
                options={{
                    title:
                        "Tóm tắt tài liệu",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />

            {/* SUMMARY HISTORY */}

            <Stack.Screen
                name="SummaryHistory"
                component={
                    SummaryHistoryScreen
                }
                options={{
                    title:
                        "Lịch sử tóm tắt",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />

            {/* SUMMARY HISTORY DETAIL */}

            <Stack.Screen
                name="SummaryHistoryDetail"
                component={
                    SummaryHistoryDetailScreen
                }
                options={{
                    title:
                        "Chi tiết tóm tắt",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />

            {/* CHAT */}

            <Stack.Screen
                name="Chat"
                component={
                    ChatScreen
                }
                options={{
                    title:
                        "AI Chat",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />

            {/* CHAT HISTORY */}

            <Stack.Screen
                name="ChatHistory"
                component={
                    ChatHistoryScreen
                }
                options={{
                    title:
                        "Lịch sử trò chuyện",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />

            {/* SOLVER */}

            <Stack.Screen
                name="Solver"
                component={
                    SolverScreen
                }
                options={{
                    title:
                        "AI Solver",

                    headerBackTitleVisible:
                        false,

                    headerTintColor:
                        colors.text,

                    headerStyle: {
                        backgroundColor:
                            colors.white,
                    },

                    headerShadowVisible:
                        false,
                }}
            />
        </Stack.Navigator>
    );
}