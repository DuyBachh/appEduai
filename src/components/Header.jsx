import { View, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

export default function Header({ title }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
    },
});