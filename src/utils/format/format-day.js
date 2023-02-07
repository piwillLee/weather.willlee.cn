import dayjs from "dayjs";

const fmtDate = (date) => {
  return dayjs(date).format("MM/DD");
};

export default fmtDate;
