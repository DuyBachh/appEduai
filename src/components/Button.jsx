import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

export default function Button({ title, onPress }) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },

    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});