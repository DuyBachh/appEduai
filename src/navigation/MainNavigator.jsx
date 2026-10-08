import { Platform } from "react-native";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/home/HomeScreen";
import DocumentsScreen from "../screens/documents/DocumentsScreen";
import DocumentDetailScreen from "../screens/documents/DocumentDetailScreen";
import SummaryScreen from "../screens/documents/SummaryScreen";
import SummaryHistoryScreen from "../screens/documents/SummaryHistoryScreen";
import SummaryHistoryDetailScreen from "../screens/documents/SummaryHistoryDetailScreen";

import ScanScreen from "../screens/scanner/ScanScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

import ChatScreen from "../screens/chat/ChatScreen";
import ChatHistoryScreen from "../screens/chat/ChatHistoryScreen";

import SolverScreen from "../screens/solver/SolverScreen";

import colors from "../styles/colors";

const Tab =
    createBottomTabNavigator();

const Stack =
    createNativeStackNavigator();

// ========================================
// SAFE AREA WRAPPER
// ========================================

const withTopSafeArea = (
    ScreenComponent
) => {
    return function SafeAreaScreen(
        props
    ) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor:
                        colors.background,
                }}
                edges={["top"]}
            >
                <ScreenComponent
                    {...props}
                />
            </SafeAreaView>
        );
    };
};

// Các màn tự có custom header
const SafeDocumentDetailScreen =
    withTopSafeArea(
        DocumentDetailScreen
    );

const SafeSummaryScreen =
    withTopSafeArea(
        SummaryScreen
    );

const SafeSummaryHistoryScreen =
    withTopSafeArea(
        SummaryHistoryScreen
    );

const SafeChatScreen =
    withTopSafeArea(
        ChatScreen
    );

const SafeChatHistoryScreen =
    withTopSafeArea(
        ChatHistoryScreen
    );

// ========================================
// BOTTOM TAB
// ========================================

function MainTabs({
    currentUser,
    onLogout,
}) {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor:
                    colors.background,
            }}
            edges={["top"]}
        >
            <Tab.Navigator
                screenOptions={({
                    route,
                }) => ({
                    // Tắt native header
                    // vì các tab đã có nội dung
                    // tiêu đề riêng
                    headerShown: false,

                    tabBarHideOnKeyboard:
                        true,

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
                            Platform.OS ===
                            "ios"
                                ? 82
                                : 68,

                        paddingTop: 8,

                        paddingBottom:
                            Platform.OS ===
                            "ios"
                                ? 22
                                : 8,
                    },

                    tabBarIcon: ({
                        color,
                        size,
                        focused,
                    }) => {
                        let iconName;

                        switch (
                            route.name
                        ) {
                            case "Home":
                                iconName =
                                    focused
                                        ? "home"
                                        : "home-outline";
                                break;

                            case "Documents":
                                iconName =
                                    focused
                                        ? "documents"
                                        : "documents-outline";
                                break;

                            case "Scan":
                                iconName =
                                    focused
                                        ? "scan"
                                        : "scan-outline";
                                break;

                            case "Profile":
                                iconName =
                                    focused
                                        ? "person"
                                        : "person-outline";
                                break;

                            default:
                                iconName =
                                    "ellipse-outline";
                        }

                        return (
                            <Ionicons
                                name={
                                    iconName
                                }
                                size={
                                    size
                                }
                                color={
                                    color
                                }
                            />
                        );
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={
                        HomeScreen
                    }
                    options={{
                        title:
                            "Trang chủ",
                    }}
                />

                <Tab.Screen
                    name="Documents"
                    component={
                        DocumentsScreen
                    }
                    options={{
                        title:
                            "Tài liệu",
                    }}
                />

                <Tab.Screen
                    name="Scan"
                    component={
                        ScanScreen
                    }
                    options={{
                        title:
                            "Quét",
                    }}
                />

                <Tab.Screen
                    name="Profile"
                    options={{
                        title:
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
        </SafeAreaView>
    );
}

// ========================================
// MAIN STACK
// ========================================

export default function MainNavigator({
    currentUser,
    onLogout,
}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible:
                    false,

                headerStyle: {
                    backgroundColor:
                        colors.white,
                },

                headerTintColor:
                    colors.text,

                headerTitleStyle: {
                    fontWeight:
                        "700",
                },
            }}
        >
            {/* MAIN TAB */}
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

            {/* ========================= */}
            {/* CUSTOM HEADER SCREENS */}
            {/* ========================= */}

            <Stack.Screen
                name="DocumentDetail"
                component={
                    SafeDocumentDetailScreen
                }
                options={{
                    headerShown:
                        false,
                }}
            />

            <Stack.Screen
                name="Summary"
                component={
                    SafeSummaryScreen
                }
                options={{
                    headerShown:
                        false,
                }}
            />

            <Stack.Screen
                name="SummaryHistory"
                component={
                    SafeSummaryHistoryScreen
                }
                options={{
                    headerShown:
                        false,
                }}
            />

            <Stack.Screen
                name="Chat"
                component={
                    SafeChatScreen
                }
                options={{
                    headerShown:
                        false,
                }}
            />

            <Stack.Screen
                name="ChatHistory"
                component={
                    SafeChatHistoryScreen
                }
                options={{
                    headerShown:
                        false,
                }}
            />

            {/* ========================= */}
            {/* NATIVE HEADER SCREENS */}
            {/* ========================= */}

            <Stack.Screen
                name="SummaryHistoryDetail"
                component={
                    SummaryHistoryDetailScreen
                }
                options={{
                    title:
                        "Chi tiết tóm tắt",
                }}
            />

            <Stack.Screen
                name="Solver"
                component={
                    SolverScreen
                }
                options={{
                    title:
                        "AI Solver",
                }}
            />
        </Stack.Navigator>
    );
}