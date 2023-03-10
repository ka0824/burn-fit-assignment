import React from "react";
import { View } from "react-native";
import { useState, useCallback } from "react";
import { useSharedValue } from "react-native-reanimated";
import ScreenTemplate from "../../component/ScreenTemplate";
import MonthCal from "./MonthCal";
import WeekCal from "./WeekCal";

const Calendar = () => {
  const [date, setDate] = useState(new Date(new Date().setDate(1)));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calType, setCalType] = useState("month");

  const goPrev = useCallback(() => {
    setDate((prevState) => {
      return new Date(prevState.setMonth(prevState.getMonth() - 1));
    });
  }, []);

  const goNext = useCallback(() => {
    setDate((prevState) => {
      return new Date(prevState.setMonth(prevState.getMonth() + 1));
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
            offset={offset}
            goNext={goNext}
            goPrev={goPrev}
            clickDate={clickDate}
            changeCalType={changeCalType}
          ></MonthCal>
        ) : (
          <WeekCal
            date={date}
            selectedDate={selectedDate}
            offset={offset}
            clickDate={clickDate}
            changeCalType={changeCalType}
            goPrev={goPrev}
            goNext={goNext}
          ></WeekCal>
        )}
      </View>
    </ScreenTemplate>
  );
};

export default Calendar;
