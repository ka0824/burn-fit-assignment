import React, { useCallback, useEffect } from "react";
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const MonthCal = ({
  date,
  selectedDate,
  isPressed,
  offset,
  goNext,
  goPrev,
  clickDate,
  changeCalType,
}) => {
  const height = useSharedValue(180);
  const left = useSharedValue(0);
  const right = useSharedValue(0);
  const windowWidth = useSharedValue(Dimensions.get("window").width);
  const opacity = useSharedValue(1);
  const delayChange = useCallback(() => {
    setTimeout(changeCalType, 300);
  }, []);

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      "worklet";
      isPressed.value = true;
    })
    .onChange((e) => {
      "worklet";
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };

      if (height.value + e.changeY < 0) {
        height.value = 0;
        return;
      }

      if (height.value + e.changeY < 180) {
        height.value += e.changeY;
      }
    })
    .onFinalize(() => {
      "worklet";
      isPressed.value = false;

      if (offset.value.x > 50) {
        runOnJS(goPrev)();
        left.value = -100;
        left.value = withSpring(0);
      } else if (offset.value.x < -50) {
        runOnJS(goNext)();
        left.value = windowWidth.value - 100;
        left.value = withSpring(0);
      }

      offset.value = {
        x: 0,
      };

      if (height.value < 90) {
        opacity.value = withTiming(0, { duration: 300 });
        height.value = withTiming(50, { duration: 500 });
        runOnJS(delayChange)();
      } else {
        height.value = withSpring(180);
      }
    });

  useEffect(() => {
    offset.value = { x: 0, y: 0 };
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value.x }],
      opacity: opacity.value,
      overflow: "hidden",
      height: height.value,
      left: left.value,
      right: right.value,
      backgroundColor: "#e9ecef",
      position: "relative",
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
            <TouchableOpacity
              style={{ ...styles.date }}
              disabled={true}
              key={`date${i}${j}`}
            >
              <Text style={{ ...styles.disable, ...styles.dateText }}>
                {splitArr[i][j]}
              </Text>
            </TouchableOpacity>
          );
        } else if (i === splitArr.length - 1 && j > lastDay) {
          temp.push(
            <TouchableOpacity
              style={{ ...styles.date }}
              disabled={true}
              key={`date${i}${j}`}
            >
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
                key={`date${i}${j}`}
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
                key={`date${i}${j}`}
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
    <View>
      <View style={{ ...styles.space, height: 60 }}>
        <TouchableOpacity onPress={goPrev}>
          <MaterialCommunityIcons
            name={"chevron-left"}
            size={styles.icon.size}
            color={styles.icon.color}
          ></MaterialCommunityIcons>
        </TouchableOpacity>
        <Text style={{ fontSize: 16 }}>
          {date.toLocaleString("default", { month: "long" })}{" "}
          {date.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goNext}>
          <MaterialCommunityIcons
            name={"chevron-right"}
            size={styles.icon.size}
            color={styles.icon.color}
          ></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: "#e9ecef" }}>
        <GestureHandlerRootView>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[animatedStyles]}>
              <View style={styles.space}>
                <Text style={{ ...styles.weekDay, color: "red" }}>Sun</Text>
                <Text style={styles.weekDay}>Mon</Text>
                <Text style={styles.weekDay}>Tue</Text>
                <Text style={styles.weekDay}>Wed</Text>
                <Text style={styles.weekDay}>Thu</Text>
                <Text style={styles.weekDay}>Fri</Text>
                <Text style={{ ...styles.weekDay, color: "#50bcdf" }}>Sat</Text>
              </View>
              <View>{renderDate()}</View>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

export default MonthCal;

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
