import React from "react";
import {
    ScrollView,
    StyleSheet,
} from "react-native";

import colors from "../../../styles/colors";

import HomeFeatureList from "../components/HomeFeatureList";
import HomeHeader from "../components/HomeHeader";
import HomeHeroCard from "../components/HomeHeroCard";
import HomeInfoCard from "../components/HomeInfoCard";

import {
    HOME_FEATURES,
} from "../data/homeFeatures";

export default function HomeScreen({
    navigation,
}) {
    const openRoute = (routeName) => {
        navigation.navigate(
            routeName
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
        >
            <HomeHeader />

            <HomeHeroCard
                onStart={() =>
                    openRoute("Solver")
                }
            />

            <HomeFeatureList
                features={
                    HOME_FEATURES
                }
                onOpen={openRoute}
            />

            <HomeInfoCard />
        </ScrollView>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:
            colors.background,
    },
    content:{
        paddingHorizontal:20,
        paddingTop:55,
        paddingBottom:100,
    },
});
