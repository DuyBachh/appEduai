import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import colors from "../../../styles/colors";

export default function HomeFeatureList({
    features,
    onOpen,
}) {
    return (
        <>
            <Text style={styles.sectionTitle}>
                Công cụ học tập
            </Text>

            <Text style={styles.sectionDescription}>
                Chọn công cụ bạn muốn sử dụng
            </Text>

            <View style={styles.grid}>
                {features.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() =>
                            onOpen(item.route)
                        }
                        activeOpacity={0.75}
                    >
                        <View style={styles.iconBox}>
                            <Text style={styles.icon}>
                                {item.icon}
                            </Text>
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.title}>
                                {item.title}
                            </Text>

                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
}

const styles=StyleSheet.create({
    sectionTitle:{
        fontSize:20,
        fontWeight:"800",
        color:colors.text,
    },
    sectionDescription:{
        fontSize:14,
        color:colors.gray,
        marginTop:4,
        marginBottom:16,
    },
    grid:{
        gap:12,
        marginBottom:28,
    },
    card:{
        backgroundColor:colors.white,
        borderRadius:16,
        borderWidth:1,
        borderColor:colors.border,
        padding:15,
        flexDirection:"row",
        alignItems:"center",
    },
    iconBox:{
        width:52,
        height:52,
        borderRadius:15,
        backgroundColor:"#EEF2FF",
        alignItems:"center",
        justifyContent:"center",
        marginRight:14,
    },
    icon:{fontSize:25},
    content:{flex:1},
    title:{
        fontSize:16,
        fontWeight:"700",
        color:colors.text,
        marginBottom:4,
    },
    description:{
        fontSize:13,
        lineHeight:19,
        color:colors.gray,
    },
    arrow:{
        fontSize:28,
        color:"#9CA3AF",
        marginLeft:8,
    },
});
