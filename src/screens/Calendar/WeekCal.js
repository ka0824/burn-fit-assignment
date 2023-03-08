import React, { useCallback, useLayoutEffect } from "react";
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
import { getDates, getweekOffset } from "../../utils/calendarFuncs";

const WeekCal = ({
  date,
  selectedDate,
  offset,
  clickDate,
  changeCalType,
  goNext,
  goPrev,
}) => {
  const height = useSharedValue(50);
  const windowWidth = useSharedValue(Dimensions.get("window").width);
  const left = useSharedValue(0);
  const startOffset = useSharedValue(0);
  const endOffset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const delayChange = useCallback(() => {
    setTimeout(changeCalType, 300);
  }, []);

  const goPrevAdvanced = useCallback(() => {
    const slicedDate = new Date(date);

    const newDate = new Date(slicedDate.setMonth(slicedDate.getMonth() - 1));

    const { start, end } = getweekOffset(newDate);

    startOffset.value = start;
    endOffset.value = end;

    left.value = end - 100;
    left.value = withSpring(end);

    goPrev();
  }, [date, left, startOffset, endOffset, goPrev]);

  const goNextAdvanced = useCallback(() => {
    const slicedDate = new Date(date);
    const newDate = new Date(slicedDate.setMonth(slicedDate.getMonth() + 1));
    const { start, end } = getweekOffset(newDate);

    startOffset.value = start;
    endOffset.value = end;

    left.value = start + 100;
    left.value = withSpring(start);

    goNext();
  }, [date, left, startOffset, endOffset, goNext]);

  useLayoutEffect(() => {
    const slicedDate = new Date(date);
    const { dateArr, firstDay, lastDay } = getDates(slicedDate);
    const { start, end } = getweekOffset(slicedDate);
    const targetDate = selectedDate.getDate();
    let targetWeek;

    for (let i = 0; i < dateArr.length; i++) {
      if (targetDate <= 6) {
        if (dateArr[i].includes(targetDate)) {
          targetWeek = i;
          break;
        }
      } else {
        if (dateArr[i].includes(targetDate)) {
          targetWeek = i;
        }
      }
    }

    if (targetWeek === 0) {
      left.value =
        -windowWidth.value * targetWeek -
        parseInt(windowWidth.value / 7) * firstDay;
      return;
    }

    if (targetWeek === dateArr.length - 1) {
      left.value =
        -windowWidth.value * targetWeek +
        parseInt(windowWidth.value / 7) * (6 - lastDay);
      return;
    }
    startOffset.value = start;
    endOffset.value = end;
    left.value = -windowWidth.value * targetWeek;
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: "auto",
      left: left.value,
      height: height.value,
      position: "relative",
    };
  });

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      "worklet";
    })
    .onChange((e) => {
      "worklet";
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };

      if (height.value + e.changeY > 50) {
        height.value += e.changeY;
      }

      left.value += e.changeX;
    })
    .onFinalize(() => {
      "worklet";

      if (height.value > 50) {
        if (height.value < 80) {
          height.value = withSpring(50);
        } else {
          opacity.value = withTiming(0, { duration: 300 });
          height.value = withTiming(200, { duration: 500 });
          left.value = withTiming(0, { duration: 300 });
          runOnJS(delayChange)();
          return;
        }
      }

      if (left.value > startOffset.value) {
        runOnJS(goPrevAdvanced)();
      } else if (left.value < endOffset.value) {
        runOnJS(goNextAdvanced)();
      }
    });

  const renderDate = useCallback(() => {
    const { dateArr, firstDay, lastDay } = getDates(date);
    const result = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysColor = [
      "red",
      "black",
      "black",
      "black",
      "black",
      "black",
      "#50bcdf",
    ];

    for (let i = 0; i < dateArr.length; i++) {
      const temp = [];

      for (let j = 0; j < dateArr[i].length; j++) {
        if (i === 0 && j < firstDay) {
          temp.push(
            <TouchableOpacity
              style={{
                ...styles.date,
                backgroundColor: "#e9ecef",
                width: "auto",
              }}
              disabled={true}
              key={`date${i}${j}`}
            >
              <Text style={{ ...styles.disable, ...styles.dateText }}>
                {dateArr[i][j]}
              </Text>
            </TouchableOpacity>
          );
        } else if (i === dateArr.length - 1 && j > lastDay) {
          temp.push(
            <TouchableOpacity
              style={{ ...styles.date, backgroundColor: "#e9ecef" }}
              disabled={true}
              key={`date${i}${j}`}
            >
              <Text style={{ ...styles.disable, ...styles.dateText }}>
                {dateArr[i][j]}
              </Text>
            </TouchableOpacity>
          );
        } else {
          if (
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            selectedDate.getDate() === dateArr[i][j]
          ) {
            temp.push(
              <TouchableOpacity
                style={{ ...styles.date, backgroundColor: "#e9ecef" }}
                onPress={() => clickDate(dateArr[i][j])}
                key={`date${i}${j}`}
              >
                <Text style={{ color: daysColor[j] }}>{days[j]}</Text>
                <Text style={{ ...styles.dateText, ...styles.selected }}>
                  {dateArr[i][j]}
                </Text>
              </TouchableOpacity>
            );
          } else {
            temp.push(
              <TouchableOpacity
                style={{ ...styles.date }}
                onPress={() => clickDate(dateArr[i][j])}
                key={`date${i}${j}`}
              >
                <Text style={{ color: daysColor[j] }}>{days[j]}</Text>
                <Text
                  style={{
                    ...styles.dateText,
                  }}
                >
                  {dateArr[i][j]}
                </Text>
              </TouchableOpacity>
            );
          }
        }
      }
      result.push(temp);
    }

    return result.map((element, idx) => {
      return (
        <View style={styles.space} key={`outside-${idx}`}>
          {element}
        </View>
      );
    });
  }, [date, selectedDate]);

  return (
    <View>
      <View style={{ ...styles.space, height: 60, justifyContent: "center" }}>
        <Text style={{ fontSize: 16 }}>
          {date.toLocaleString("default", { month: "long" })}{" "}
          {date.getFullYear()}
        </Text>
      </View>
      <View style={{ backgroundColor: "#e9ecef" }}>
        <GestureHandlerRootView>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[animatedStyles]}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {renderDate()}
              </View>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

export default WeekCal;

const styles = StyleSheet.create({
  space: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
    width: "100%",
  },
});
