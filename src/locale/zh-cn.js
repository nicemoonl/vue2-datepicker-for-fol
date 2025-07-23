import DatePicker from 'vue2-datepicker';
import zhCN from 'date-format-parse/lib/locale/zh-cn';

const lang = {
  formatLocale: zhCN,
  yearFormat: 'YYYY年',
  monthFormat: 'MMM',
  monthBeforeYear: false,
  DatePicker: {
    lastYear: '上一年',
    lastMonth: '上一月',
    thisMonth: '当前月',
    thisYear: '当前年',
    nextYear: '下一年',
    nextMonth: '下一月',
    lastDecade: '上十年',
    nextDecade: '下十年',
    selectDate: '选择日期',
    selectYear: '选择年份',
  },
};

DatePicker.locale('zh-cn', lang);

export default lang;
