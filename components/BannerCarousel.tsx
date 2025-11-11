import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface BannerItem {
  id: string;
  uri?: string;
  source?: any;
  subtitle?: string;
  titleLines?: string[];
  layout?: "full" | "half";
}

interface BannerCarouselProps {
  data: BannerItem[];
  interval?: number; 
}

export default function BannerCarousel({ data, interval = 4000 }: BannerCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, data.length, interval]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            {item.layout === "half" ? (
              <HalfBanner item={item} />
            ) : (
              <FullBanner item={item} />
            )}
          </View>
        )}
      />
      {/* Pagination */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const FullBanner = ({ item }: { item: BannerItem }) => (
  <ImageBackground
    source={item.source || { uri: item.uri }}
    style={styles.fullBanner}
    imageStyle={styles.image}
    resizeMode="cover"
  >
    <View style={styles.overlay}>
      <View style={styles.textContainerRight}>
        <Text style={styles.subtitleLight}>| {item.subtitle}</Text>
        {item.titleLines?.map((line, i) => (
          <Text key={i} style={styles.titleLight}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  </ImageBackground>
);

const HalfBanner = ({ item }: { item: BannerItem }) => (
  <View style={styles.halfBanner}>
    <View style={styles.textContainerLeft}>
      <Text style={styles.subtitleDark}>| {item.subtitle}</Text>
      {item.titleLines?.map((line, i) => (
        <Text key={i} style={styles.titleDark}>
          {line}
        </Text>
      ))}
    </View>
    <View style={styles.imageWrapper}>
      <View style={styles.circleBehind} />
      <Image source={item.source || { uri: item.uri }} style={styles.halfImage} resizeMode="contain" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  fullBanner: {
    width: width * 0.9,
    height: 200,
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: { borderRadius: 16 },
  overlay: { flex: 1, justifyContent: "center" },
  textContainerRight: { position: "absolute", right: 22, top: "20%" },
  subtitleLight: {
    color: "#fff",
    fontSize: 14,
    textTransform: "uppercase",
    opacity: 0.9,
    marginBottom: 6,
  },
  titleLight: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34,
  },
  halfBanner: {
    width: width * 0.9,
    height: 180,
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#f6f7fb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  textContainerLeft: { flex: 1 },
  subtitleDark: {
    color: "#999",
    fontSize: 13,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  titleDark: { color: "#000", fontSize: 22, fontWeight: "600", lineHeight: 28 },
  imageWrapper: {
    position: "relative",
    width: 160,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  circleBehind: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e9e9ef",
  },
  halfImage: { width: 160, height: "100%" },
  pagination: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#333" },
});

