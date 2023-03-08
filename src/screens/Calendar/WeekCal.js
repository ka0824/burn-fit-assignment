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
  FadeOut,
  FadeIn,
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

const WeekCal = ({
  date,
  selectedDate,
  isPressed,
  offset,
  clickDate,
  changeCalType,
  // goPrev,
  setDate,
  // goNext,
}) => {
  const height = useSharedValue(50);
  const windowWidth = useSharedValue(Dimensions.get("window").width);
  const left = useSharedValue(0);
  const weeks = useSharedValue(parseInt(selectedDate.getDate() / 7));
  const startOffset = useSharedValue(0);
  const endOffset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const delayChange = useCallback(() => {
    setTimeout(changeCalType, 300);
  }, []);

  const goPrev = useCallback(() => {
    const slicedDate = new Date(date);

    const newDate = new Date(slicedDate.setMonth(slicedDate.getMonth() - 1));

    const firstDay = newDate.getDay();
    const nextMonthDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
    const lastDate = new Date(nextMonthDate.setDate(0));
    const lastDay = lastDate.getDay();
    const weeksCnt = parseInt(lastDate.getDate() / 7);

    startOffset.value =
      -parseInt(Dimensions.get("window").width / 7) * firstDay;
    endOffset.value = -(
      Dimensions.get("window").width * (weeksCnt - 1) +
      parseInt(Dimensions.get("window").width / 7) * lastDay
    );

    left.value =
      -Dimensions.get("window").width * weeksCnt +
      parseInt(Dimensions.get("window").width / 7) * (6 - lastDay) -
      100;

    left.value = withSpring(
      -Dimensions.get("window").width * weeksCnt +
        parseInt(Dimensions.get("window").width / 7) * (6 - lastDay)
    );

    setDate((prevState) => {
      return new Date(prevState.setMonth(prevState.getMonth() - 1));
    });
    // console.log(-parseInt(Dimensions.get("window").width / 7) * firstDay);
  }, [date, left, startOffset, endOffset]);

  const goNext = useCallback(() => {
    console.log("next");
    const slicedDate = new Date(date);

    const newDate = new Date(slicedDate.setMonth(slicedDate.getMonth() + 1));

    const firstDay = newDate.getDay();
    const nextMonthDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
    const lastDate = new Date(nextMonthDate.setDate(0));
    const lastDay = lastDate.getDay();
    const weeksCnt = parseInt(lastDate.getDate() / 7);

    startOffset.value =
      -parseInt(Dimensions.get("window").width / 7) * firstDay;
    endOffset.value = -(
      Dimensions.get("window").width * (weeksCnt - 1) +
      parseInt(Dimensions.get("window").width / 7) * lastDay
    );

    left.value = -parseInt(Dimensions.get("window").width / 7) * firstDay + 100;
    left.value = withSpring(
      -parseInt(Dimensions.get("window").width / 7) * firstDay
    );

    setDate((prevState) => {
      return new Date(prevState.setMonth(prevState.getMonth() + 1));
      // return newDate;
    });
  }, [date, left, startOffset, endOffset]);

  useEffect(() => {
    const slicedDate = new Date(date);

    const firstDay = slicedDate.getDay();
    const nextMonthDate = new Date(
      slicedDate.setMonth(slicedDate.getMonth() + 1)
    );
    const lastDate = new Date(nextMonthDate.setDate(0));
    const lastDay = lastDate.getDay();
    const weeksCnt = parseInt(lastDate.getDate() / 7);

    left.value = -windowWidth.value * weeks.value;

    startOffset.value =
      -parseInt(Dimensions.get("window").width / 7) * firstDay;
    endOffset.value = -(
      Dimensions.get("window").width * (weeksCnt - 1) +
      parseInt(Dimensions.get("window").width / 7) * lastDay
    );

    console.log(-parseInt(Dimensions.get("window").width / 7));
    console.log(date);
  }, []);

  const test = () => {
    if (left.value > startOffset.value) {
      console.log("here");
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      // transform: [{ translateX: offset.value.x }],
      //   overflow: "hidden",

      // height: height.value,
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
      isPressed.value = true;
    })
    .onChange((e) => {
      "worklet";

      // if (left.value > startOffset.value) {
      //   // runOnJS(goPrev)();
      //   return;
      // }
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };

      if (height.value + e.changeY > 50) {
        height.value += e.changeY;
      }

      //   if (height.value + e.changeY < 0) {
      //     height.value = 0;
      //     return;
      //   }

      //   if (height.value + e.changeY < 180) {
      //     height.value += e.changeY;
      //   }

      left.value += e.changeX;
    })
    .onFinalize(() => {
      "worklet";
      runOnJS(test)();

      if (height.value > 50) {
        if (height.value < 60) {
          height.value = withSpring(50);
        } else {
          opacity.value = withTiming(0, { duration: 300 });
          height.value = withTiming(180, { duration: 500 });
          left.value = withTiming(0, { duration: 300 });
          runOnJS(delayChange)();
          return;
        }
      }

      if (left.value > startOffset.value + 30) {
        runOnJS(goPrev)();
        // // left.value = -2000;
      } else if (left.value < endOffset.value - 30) {
        runOnJS(goNext)();

        // runOnJS(goNext)();
        // left.value = 0;
      }
      // left.value = 0;
      // runOnJS(changeCalType)();

      isPressed.value = false;

      // if (offset.value.y > 300) {
      //   runOnJS(changeCalType)();
      // }
      // runOnJS(goNext)();

      //   if (offset.value.x > 50) {
      //     runOnJS(goPrev)();
      //     left.value = -100;
      //     left.value = withSpring(0);
      //   } else if (offset.value.x < -50) {
      //     runOnJS(goNext)();
      //     left.value = windowWidth.value - 100;
      //     // left.value = withSpring(0);
      //     left.value = withSpring(0);
      //   }

      //   offset.value = {
      //     x: 0,
      //   };

      //   if (height.value < 90) {
      //     height.value = withTiming(0, { duration: 100 });
      //     // runOnJS(changeCalType)();
      //     runOnJS(delayChange)();
      //   } else {
      //     height.value = withSpring(180);
      //   }
    });

  const renderDate = useCallback(() => {
    const slicedDate = new Date(date);

    const firstDay = slicedDate.getDay();
    const nextMonthDate = new Date(
      slicedDate.setMonth(slicedDate.getMonth() + 1)
    );
    const lastDate = new Date(nextMonthDate.setDate(0));
    const lastDay = lastDate.getDay();
    const currentDateNum = lastDate.getDate();
    const prevMonthDate = new Date(
      slicedDate.setMonth(slicedDate.getMonth() - 1)
    );
    const prevLastDate = new Date(prevMonthDate.setDate(0));
    const prevDateNum = prevLastDate.getDate();
    const dateArr = [];
    const splitArr = [];
    const result = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
              style={{
                ...styles.date,
                backgroundColor: "#e9ecef",
                width: "auto",
              }}
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
              style={{ ...styles.date, backgroundColor: "#e9ecef" }}
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
                style={{ ...styles.date, backgroundColor: "#e9ecef" }}
                onPress={() => clickDate(splitArr[i][j])}
                key={`date${i}${j}`}
              >
                <Text>{days[j]}</Text>
                <Text style={{ ...styles.dateText, ...styles.selected }}>
                  {splitArr[i][j]}
                </Text>
              </TouchableOpacity>
            );
          } else {
            temp.push(
              <TouchableOpacity
                style={{ ...styles.date }}
                onPress={() => clickDate(splitArr[i][j])}
                key={`date${i}${j}`}
              >
                <Text>{days[j]}</Text>
                <Text
                  style={{
                    ...styles.dateText,
                  }}
                >
                  {splitArr[i][j]}
                </Text>
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
    // paddingLeft: 20,
    // paddingRight: 20,
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
    // backgroundColor: "#e9ecef",
    width: "100%",
    // height: "100%",
  },
});
