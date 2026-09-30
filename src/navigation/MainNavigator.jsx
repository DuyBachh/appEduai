import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ currentUser, onLogout }) {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />

            <Tab.Screen
                name="Documents"
                component={DocumentsScreen}
            />

            <Tab.Screen
                name="Scan"
                component={ScanScreen}
            />

            <Tab.Screen name="Profile">
                {(props) => (
                    <ProfileScreen
                        {...props}
                        currentUser={currentUser}
                        onLogout={onLogout}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default function MainNavigator({
    currentUser,
    onLogout,
}) {
    return (
        <Stack.Navigator>
            {/* Main Tabs */}
            <Stack.Screen
                name="MainTabs"
                options={{
                    headerShown: false,
                }}
            >
                {(props) => (
                    <MainTabs
                        {...props}
                        currentUser={currentUser}
                        onLogout={onLogout}
                    />
                )}
            </Stack.Screen>

            {/* Document */}
            <Stack.Screen
                name="DocumentDetail"
                component={DocumentDetailScreen}
                options={{
                    headerShown: false,
                }}
            />

            {/* AI Summary */}
            <Stack.Screen
                name="Summary"
                component={SummaryScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="SummaryHistory"
                component={SummaryHistoryScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="SummaryHistoryDetail"
                component={SummaryHistoryDetailScreen}
                options={{
                    headerShown: false,
                }}
            />

            {/* AI Q&A / Chat */}
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="ChatHistory"
                component={ChatHistoryScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Solver"
                component={SolverScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}