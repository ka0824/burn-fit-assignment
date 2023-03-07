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

const Calendar = () => {
  const [date, setDate] = useState(new Date(new Date().setDate(1)));
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const offset = useSharedValue({ x: 0, y: 0 });
  const gesture = Gesture.Pan()
    .onBegin((e) => {
      "worklet";
      isPressed.value = true;
    })
    .onChange((e) => {
      "worklet";
      offset.value = {
        x: e.changeX + offset.value.x,
      };
    })
    .onFinalize(() => {
      "worklet";
      isPressed.value = false;

      if (offset.value.x > 50) {
        runOnJS(goPrev)();
      } else if (offset.value.x < -50) {
        runOnJS(goNext)();
      }

      offset.value = {
        x: 0,
      };

      // runOnJS(goPrev)();
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value.x }],
    };
  });

  const renderDate = useCallback(() => {
    const firstDay = date.getDay();
    const nextMonthDate = new Date(date.setMonth(date.getMonth() + 1));
    const lastDate = new Date(nextMonthDate.setDate(0));
    const lastDay = lastDate.getDay();
    const currentDateNum = lastDate.getDate();
    const prevMonthDate = new Date(date.setMonth(date.getMonth() - 1));
    const prevLastDate = new Date(prevMonthDate.setDate(0));
    const prevDateNum = prevLastDate.getDate();
    const dateArr = [];
    const splitArr = [];
    const result = [];
    let temp = [];

    for (let i = 0; i < firstDay; i++) {
      dateArr.unshift(prevDateNum - i);
    }
    for (let i = 1; i <= currentDateNum; i++) {
      dateArr.push(i);
    }
    for (let i = 1; i < 7 - lastDay; i++) {
      dateArr.push(i);
    }

    for (let i = 0; i <= dateArr.length - 1; i++) {
      if (i === dateArr.length - 1) {
        temp.push(dateArr[i]);
        splitArr.push(temp);
        break;
      }

      if (i % 7 === 0 && i !== 0) {
        splitArr.push(temp);
        temp = [];
        temp.push(dateArr[i]);
      } else {
        temp.push(dateArr[i]);
      }
    }

    for (let i = 0; i < splitArr.length; i++) {
      const temp = [];

      for (let j = 0; j < splitArr[i].length; j++) {
        if (i === 0 && j < firstDay) {
          temp.push(
            <TouchableOpacity style={{ ...styles.date }} disabled={true}>
              <Text style={{ ...styles.disable, ...styles.dateText }}>
                {splitArr[i][j]}
              </Text>
            </TouchableOpacity>
          );
        } else if (i === splitArr.length - 1 && j > lastDay) {
          temp.push(
            <TouchableOpacity style={{ ...styles.date }} disabled={true}>
              <Text style={{ ...styles.disable, ...styles.dateText }}>
                {splitArr[i][j]}
              </Text>
            </TouchableOpacity>
          );
        } else {
          if (
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            selectedDate.getDate() === splitArr[i][j]
          ) {
            temp.push(
              <TouchableOpacity
                style={styles.date}
                onPress={() => clickDate(splitArr[i][j])}
              >
                <Text style={{ ...styles.dateText, ...styles.selected }}>
                  {splitArr[i][j]}
                </Text>
              </TouchableOpacity>
            );
          } else {
            temp.push(
              <TouchableOpacity
                style={styles.date}
                onPress={() => clickDate(splitArr[i][j])}
              >
                <Text style={styles.dateText}>{splitArr[i][j]}</Text>
              </TouchableOpacity>
            );
          }
        }
      }
      result.push(temp);
    }

    return result.map((element) => {
      return <View style={styles.space}>{element}</View>;
    });
  }, [date, selectedDate]);

  return (
    <ScreenTemplate>
      <MonthCal
        date={date}
        selectedDate={selectedDate}
        isPressed={isPressed}
        offset={offset}
        goNext={goNext}
        goPrev={goPrev}
        clickDate={clickDate}
      ></MonthCal>
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
