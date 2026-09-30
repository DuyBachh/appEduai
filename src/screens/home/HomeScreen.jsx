import { View, Text } from "react-native";
import Header from "../../components/Header";
import Button from "../../components/Button";
import globalStyles from "../../styles/globalStyles";

export default function HomeScreen({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <Header title="appEduai" />

            <Text style={globalStyles.h1}>
                Trợ lý học tập AI
            </Text>

            <Text style={globalStyles.text}>
                Học tập thông minh hơn với AI
            </Text>

            <Button
                title="Bắt đầu học"
                onPress={() => navigation.navigate("Solver")}
            />
        </View>
    );
}