export const getDates = (date) => {
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
  return { dateArr: splitArr, firstDay, lastDay };
};
