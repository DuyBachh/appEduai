import React from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import colors from "../../styles/colors";

export default function HomeScreen({
    navigation,
}) {
    // ========================================
    // FEATURES
    // ========================================

    const features = [
        {
            id: "solver",

            icon: "🧠",

            title:
                "AI Solver",

            description:
                "Giải bài tập từng bước bằng AI",

            onPress: () =>
                navigation.navigate(
                    "Solver"
                ),
        },

        {
            id: "documents",

            icon: "📚",

            title:
                "Tài liệu",

            description:
                "Quản lý và học từ tài liệu",

            onPress: () =>
                navigation.navigate(
                    "Documents"
                ),
        },

        {
            id: "scanner",

            icon: "📷",

            title:
                "OCR Scanner",

            description:
                "Chụp ảnh và nhận diện văn bản",

            onPress: () =>
                navigation.navigate(
                    "Scan"
                ),
        },
    ];

    // ========================================
    // UI
    // ========================================

    return (
        <ScrollView
            style={
                styles.container
            }
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
        >
            {/* HEADER */}

            <View
                style={
                    styles.header
                }
            >
                <View>
                    <Text
                        style={
                            styles.logo
                        }
                    >
                        appEduai
                    </Text>

                    <Text
                        style={
                            styles.welcomeText
                        }
                    >
                        Trợ lý học tập AI của bạn
                    </Text>
                </View>

                <View
                    style={
                        styles.avatar
                    }
                >
                    <Text
                        style={
                            styles.avatarText
                        }
                    >
                        AI
                    </Text>
                </View>
            </View>

            {/* HERO */}

            <View
                style={
                    styles.heroCard
                }
            >
                <View
                    style={
                        styles.heroIconBox
                    }
                >
                    <Text
                        style={
                            styles.heroIcon
                        }
                    >
                        ✨
                    </Text>
                </View>

                <Text
                    style={
                        styles.heroTitle
                    }
                >
                    Học tập thông minh hơn
                </Text>

                <Text
                    style={
                        styles.heroDescription
                    }
                >
                    Giải bài tập, đọc tài liệu,
                    tóm tắt nội dung và học cùng
                    AI trong một ứng dụng.
                </Text>

                <TouchableOpacity
                    style={
                        styles.heroButton
                    }
                    onPress={() =>
                        navigation.navigate(
                            "Solver"
                        )
                    }
                    activeOpacity={
                        0.8
                    }
                >
                    <Text
                        style={
                            styles.heroButtonText
                        }
                    >
                        Bắt đầu với AI Solver
                    </Text>

                    <Text
                        style={
                            styles.heroArrow
                        }
                    >
                        →
                    </Text>
                </TouchableOpacity>
            </View>

            {/* QUICK ACTION */}

            <Text
                style={
                    styles.sectionTitle
                }
            >
                Công cụ học tập
            </Text>

            <Text
                style={
                    styles.sectionDescription
                }
            >
                Chọn công cụ bạn muốn sử dụng
            </Text>

            <View
                style={
                    styles.featureGrid
                }
            >
                {features.map(
                    (
                        item
                    ) => (
                        <TouchableOpacity
                            key={
                                item.id
                            }
                            style={
                                styles.featureCard
                            }
                            onPress={
                                item.onPress
                            }
                            activeOpacity={
                                0.75
                            }
                        >
                            <View
                                style={
                                    styles.featureIconBox
                                }
                            >
                                <Text
                                    style={
                                        styles.featureIcon
                                    }
                                >
                                    {
                                        item.icon
                                    }
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.featureContent
                                }
                            >
                                <Text
                                    style={
                                        styles.featureTitle
                                    }
                                >
                                    {
                                        item.title
                                    }
                                </Text>

                                <Text
                                    style={
                                        styles.featureDescription
                                    }
                                >
                                    {
                                        item.description
                                    }
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.featureArrow
                                }
                            >
                                ›
                            </Text>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* AI INFO */}

            <View
                style={
                    styles.infoCard
                }
            >
                <View
                    style={
                        styles.infoIconBox
                    }
                >
                    <Text
                        style={
                            styles.infoIcon
                        }
                    >
                        🤖
                    </Text>
                </View>

                <View
                    style={
                        styles.infoContent
                    }
                >
                    <Text
                        style={
                            styles.infoTitle
                        }
                    >
                        Học cùng AI
                    </Text>

                    <Text
                        style={
                            styles.infoText
                        }
                    >
                        AI có thể giúp bạn giải thích
                        bài tập, đưa ra gợi ý và trình
                        bày lời giải từng bước.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

// ========================================
// STYLES
// ========================================

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                "#F9FAFB",
        },

        content: {
            paddingHorizontal:
                20,

            paddingTop:
                55,

            paddingBottom:
                100,
        },

        // ========================================
        // HEADER
        // ========================================

        header: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",

            marginBottom:
                24,
        },

        logo: {
            fontSize: 26,

            fontWeight:
                "800",

            color:
                colors.primary,
        },

        welcomeText: {
            marginTop: 4,

            fontSize: 14,

            color:
                colors.gray,
        },

        avatar: {
            width: 46,

            height: 46,

            borderRadius:
                23,

            backgroundColor:
                "#EEF2FF",

            alignItems:
                "center",

            justifyContent:
                "center",

            borderWidth:
                1,

            borderColor:
                "#C7D2FE",
        },

        avatarText: {
            fontSize: 15,

            fontWeight:
                "800",

            color:
                colors.primary,
        },

        // ========================================
        // HERO
        // ========================================

        heroCard: {
            backgroundColor:
                colors.primary,

            borderRadius:
                22,

            padding: 22,

            marginBottom:
                30,
        },

        heroIconBox: {
            width: 50,

            height: 50,

            borderRadius:
                15,

            backgroundColor:
                "rgba(255,255,255,0.16)",

            alignItems:
                "center",

            justifyContent:
                "center",

            marginBottom:
                18,
        },

        heroIcon: {
            fontSize: 26,
        },

        heroTitle: {
            fontSize: 25,

            lineHeight: 32,

            fontWeight:
                "800",

            color:
                "#FFFFFF",

            marginBottom:
                10,
        },

        heroDescription: {
            fontSize: 14,

            lineHeight: 22,

            color:
                "#E0E7FF",

            marginBottom:
                22,
        },

        heroButton: {
            minHeight: 50,

            backgroundColor:
                "#FFFFFF",

            borderRadius:
                12,

            paddingHorizontal:
                16,

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",
        },

        heroButtonText: {
            fontSize: 15,

            fontWeight:
                "700",

            color:
                colors.primary,
        },

        heroArrow: {
            fontSize: 22,

            color:
                colors.primary,
        },

        // ========================================
        // SECTION
        // ========================================

        sectionTitle: {
            fontSize: 20,

            fontWeight:
                "800",

            color:
                colors.text,
        },

        sectionDescription: {
            fontSize: 14,

            color:
                colors.gray,

            marginTop: 4,

            marginBottom:
                16,
        },

        // ========================================
        // FEATURE
        // ========================================

        featureGrid: {
            gap: 12,

            marginBottom:
                28,
        },

        featureCard: {
            backgroundColor:
                "#FFFFFF",

            borderRadius:
                16,

            borderWidth:
                1,

            borderColor:
                "#E5E7EB",

            padding: 15,

            flexDirection:
                "row",

            alignItems:
                "center",
        },

        featureIconBox: {
            width: 52,

            height: 52,

            borderRadius:
                15,

            backgroundColor:
                "#EEF2FF",

            alignItems:
                "center",

            justifyContent:
                "center",

            marginRight:
                14,
        },

        featureIcon: {
            fontSize: 25,
        },

        featureContent: {
            flex: 1,
        },

        featureTitle: {
            fontSize: 16,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom: 4,
        },

        featureDescription: {
            fontSize: 13,

            lineHeight: 19,

            color:
                colors.gray,
        },

        featureArrow: {
            fontSize: 28,

            color:
                "#9CA3AF",

            marginLeft: 8,
        },

        // ========================================
        // INFO
        // ========================================

        infoCard: {
            backgroundColor:
                "#FFFFFF",

            borderWidth:
                1,

            borderColor:
                "#E5E7EB",

            borderRadius:
                16,

            padding: 16,

            flexDirection:
                "row",

            alignItems:
                "flex-start",
        },

        infoIconBox: {
            width: 44,

            height: 44,

            borderRadius:
                14,

            backgroundColor:
                "#EEF2FF",

            alignItems:
                "center",

            justifyContent:
                "center",

            marginRight:
                13,
        },

        infoIcon: {
            fontSize: 22,
        },

        infoContent: {
            flex: 1,
        },

        infoTitle: {
            fontSize: 16,

            fontWeight:
                "700",

            color:
                colors.text,

            marginBottom: 5,
        },

        infoText: {
            fontSize: 13,

            lineHeight: 20,

            color:
                colors.gray,
        },
    });