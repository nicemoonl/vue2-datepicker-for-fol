import DatePicker from 'vue2-datepicker';
import zhTW from 'date-format-parse/lib/locale/zh-tw';

const lang = {
  formatLocale: zhTW,
  yearFormat: 'YYYY年',
  monthFormat: 'MMM',
  monthBeforeYear: false,
  DatePicker: {
    lastYear: '上一年',
    lastMonth: '上一月',
    thisMonth: '當前月',
    thisYear: '當前年',
    nextYear: '下一年',
    nextMonth: '下一月',
    lastDecade: '上十年',
    nextDecade: '下十年',
    selectDate: '選擇日期',
    selectYear: '選擇年份',
  },
};

DatePicker.locale('zh-tw', lang);

export default lang;
