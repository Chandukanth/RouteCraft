import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import CustomBottomSheet from "../components/ReusableBottomSheet";

const demoCards = Array.from({ length: 15 }, (_, i) => ({
  id: i.toString(),
  title: `Item ${i + 1}`,
  description: `Detailed description for item ${i + 1}. Lorem ipsum dolor sit amet.`,
}));

const BottomSheetScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openSheet = (item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
      <FlatList
        data={demoCards}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.verticalCard}
            onPress={() => openSheet(item)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={2} style={{ color: "#555" }}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />

      <CustomBottomSheet visible={isOpen} onClose={() => setIsOpen(false)}>
       
          <Text style={styles.header}>{selectedItem?.title}</Text>

          <Text style={styles.description}>
            {selectedItem?.description.repeat(5)}
          </Text>

          <Text style={styles.subHeader}>Related Horizontal Cards</Text>
          <View>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              style={{ flexGrow: 0 }}
            >
              {demoCards.slice(0, 8).map((item) => (
                <View key={item.id} style={styles.horizontalCard}>
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>


          <View style={{ height: 20 }} />
     
      </CustomBottomSheet>
    </View>
  );
};

const CARD_WIDTH = Dimensions.get("window").width * 0.6;

const styles = StyleSheet.create({
  verticalCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  horizontalCard: {
    width: CARD_WIDTH,
    height: 100,
    backgroundColor: "#e6e6e6",
    marginHorizontal: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomSheetScreen;
