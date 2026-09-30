import { StyleSheet } from "react-native";
import colors from "./colors";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },

    // H1
    h1: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "700",
        color: colors.text,
    },

    // H2
    h2: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
        color: colors.text,
    },

    // H3
    h3: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "600",
        color: colors.text,
    },

    // Body
    text: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400",
        color: colors.text,
    },

    // Body Small
    textSmall: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
        color: colors.gray,
    },

    // Caption
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "400",
        color: colors.gray,
    },

    // Error
    error: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
        color: colors.error,
    },
});

export default globalStyles;