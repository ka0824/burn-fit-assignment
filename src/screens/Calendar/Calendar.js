import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import ScreenTemplate from "../../component/ScreenTemplate";
import MonthCal from "./MonthCal";
import WeekCal from "./WeekCal";

const Calendar = () => {
  const [date, setDate] = useState(new Date(new Date().setDate(1)));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calType, setCalType] = useState("month");
  const isPressed = useSharedValue(false);

  const goPrev = useCallback(() => {
    setDate((prevState) => {
      return new Date(date.setMonth(date.getMonth() - 1));
    });
  }, []);

  const goNext = useCallback(() => {
    setDate((prevState) => {
      return new Date(date.setMonth(date.getMonth() + 1));
    });
  }, []);

  const clickDate = useCallback((clicked) => {
    setSelectedDate((prevState) => {
      return new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${clicked}`
      );
    });
  });

  const changeCalType = useCallback(() => {
    setCalType((prevState) => {
      if (prevState === "month") {
        return "week";
      } else {
        return "month";
      }
    });
  }, []);

  const offset = useSharedValue({ x: 0, y: 0 });

  return (
    <ScreenTemplate>
      <View>
        {calType === "month" ? (
          <MonthCal
            date={date}
            selectedDate={selectedDate}
            isPressed={isPressed}
            offset={offset}
            goNext={goNext}
            goPrev={goPrev}
            clickDate={clickDate}
            changeCalType={changeCalType}
          ></MonthCal>
        ) : (
          <WeekCal></WeekCal>
        )}
      </View>
    </ScreenTemplate>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  space: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  weekDay: {
    textAlign: "center",
    flex: 1,
  },
  icon: {
    color: "#50bcdf",
    size: 30,
  },
  date: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  disable: {
    color: "#808080",
  },
  selected: {
    borderWidth: 1,
    borderColor: "#50bcdf",
    borderRadius: 50,
  },
  dateText: {
    height: 30,
    width: "50%",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
