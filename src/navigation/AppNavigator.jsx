import React, {
    useState,
} from "react";

import {
    NavigationContainer,
} from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

export default function AppNavigator() {
    const [
        isLoggedIn,
        setIsLoggedIn,
    ] = useState(false);

    const [
        currentUser,
        setCurrentUser,
    ] = useState(null);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <MainNavigator
                    currentUser={
                        currentUser
                    }
                    onLogout={
                        handleLogout
                    }
                />
            ) : (
                <AuthNavigator
                    onLogin={
                        handleLogin
                    }
                />
            )}
        </NavigationContainer>
    );
}