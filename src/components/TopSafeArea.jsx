import React from "react";
import { StyleSheet } from "react-native";
import {
    SafeAreaView,
} from "react-native-safe-area-context";

import colors from "../styles/colors";

export default function TopSafeArea({
    children,
    backgroundColor = colors.background,
}) {
    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor },
            ]}
            edges={["top"]}
        >
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
