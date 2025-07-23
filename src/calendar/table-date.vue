<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-date`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :disabled="isDisabledArrows('last-year')"
        :aria-label="getLocale().DatePicker.lastYear"
        @click="handleIconDoubleLeftClick"
      ></icon-button>
      <icon-button
        type="left"
        :disabled="isDisabledArrows('last-month')"
        :aria-label="getLocale().DatePicker.lastMonth"
        @click="handleIconLeftClick"
      ></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <button
          v-for="item in yearMonth"
          :key="item.panel"
          type="button"
          :class="
            `${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-current-${item.panel}`
          "
          :aria-label="item.ariaLabel"
          @click="handlePanelChange(item.panel)"
        >
          {{ item.label }}
        </button>
      </span>
      <icon-button
        type="right"
        :disabled="isDisabledArrows('next-month')"
        :aria-label="getLocale().DatePicker.nextMonth"
        @click="handleIconRightClick"
      ></icon-button>
      <icon-button
        type="double-right"
        :disabled="isDisabledArrows('next-year')"
        :aria-label="getLocale().DatePicker.nextYear"
        @click="handleIconDoubleRightClick"
      ></icon-button>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table :class="`${prefixClass}-table ${prefixClass}-table-date`">
        <thead>
          <tr>
            <th v-if="showWeekNumber" :class="`${prefixClass}-week-number-header`"></th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody @click="handleCellClick" @keydown.enter="handleCellClick">
          <tr
            v-for="(row, i) in dates"
            :key="i"
            :class="[`${prefixClass}-date-row`, getRowClasses(row)]"
          >
            <td
              v-if="showWeekNumber"
              :data-row-col="`${i},0`"
              :class="`${prefixClass}-week-number`"
            >
              {{ getWeekNumber(row[0]) }}
            </td>
            <td
              v-for="(cell, j) in row"
              :key="j"
              :data-row-col="`${i},${j}`"
              role="button"
              class="cell"
              :class="getCellClasses(cell)"
              :title="getCellTitle(cell)"
              :aria-label="cell.getDate()"
              :aria-current="cell.getDate() === calendar.getDate()"
              tabindex="0"
              @mouseenter="handleMouseEnter(cell)"
              @mouseleave="handleMouseLeave(cell)"
            >
              <div>{{ cell.getDate() }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getWeek, format } from 'date-format-parse';
import IconButton from './icon-button.vue';
import { chunk } from '../util/base';
import { getCalendar, setMonth, setYear } from '../util/date';
import { getLocale } from '../locale';

export default {
  name: 'TableDate',
  components: { IconButton },
  inject: {
    getLocale: {
      default: () => getLocale,
    },
    getWeek: {
      default: () => getWeek,
    },
    prefixClass: {
      default: 'mx',
    },
    onDateMouseEnter: {
      default: undefined,
    },
    onDateMouseLeave: {
      default: undefined,
    },
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: () => false,
    },
    calendar: {
      type: Date,
      default: () => new Date(),
    },
    showWeekNumber: {
      type: Boolean,
      default: false,
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    getRowClasses: {
      type: Function,
      default: () => [],
    },
    getCellClasses: {
      type: Function,
      default: () => [],
    },
  },
  computed: {
    firstDayOfWeek() {
      return this.getLocale().formatLocale.firstDayOfWeek || 0;
    },
    yearMonth() {
      const { yearFormat, monthBeforeYear, monthFormat = 'MMM' } = this.getLocale();
      const yearLabel = {
        panel: 'year',
        label: this.formatDate(this.calendar, yearFormat),
        ariaLabel: this.getLocale().DatePicker.selectYear,
      };
      const monthLabel = {
        panel: 'month',
        label: this.formatDate(this.calendar, monthFormat),
        ariaLabel: this.getLocale().DatePicker.selectMonth,
      };
      return monthBeforeYear ? [monthLabel, yearLabel] : [yearLabel, monthLabel];
    },
    days() {
      const locale = this.getLocale();
      const days = locale.days || locale.formatLocale.weekdaysMin;
      return days.concat(days).slice(this.firstDayOfWeek, this.firstDayOfWeek + 7);
    },
    dates() {
      const year = this.calendar.getFullYear();
      const month = this.calendar.getMonth();
      const arr = getCalendar({
        firstDayOfWeek: this.firstDayOfWeek,
        year,
        month,
      });
      return chunk(arr, 7);
    },
  },
  methods: {
    isDisabledArrows(type) {
      const date = new Date(this.calendar);
      switch (type) {
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, date.getMonth() + 1, 0);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-year':
          date.setFullYear(date.getFullYear() + 1);
          break;
        case 'last-month':
          date.setMonth(date.getMonth(), 0);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-month':
          date.setMonth(date.getMonth() + 1);
          break;
        default:
          break;
      }
      if ((type === 'last-year' || type === 'last-month') && date.getFullYear() < 2020) {
        // block selection before 2020
        return true;
      }
      return this.disabledCalendarChanger(date, type);
    },
    handleIconLeftClick() {
      this.$emit(
        'changecalendar',
        setMonth(this.calendar, v => v - 1),
        'last-month'
      );
    },
    handleIconRightClick() {
      this.$emit(
        'changecalendar',
        setMonth(this.calendar, v => v + 1),
        'next-month'
      );
    },
    handleIconDoubleLeftClick() {
      this.$emit(
        'changecalendar',
        setYear(this.calendar, v => v - 1),
        'last-year'
      );
    },
    handleIconDoubleRightClick() {
      this.$emit(
        'changecalendar',
        setYear(this.calendar, v => v + 1),
        'next-year'
      );
    },
    handlePanelChange(panel) {
      this.$emit('changepanel', panel);
    },
    handleMouseEnter(cell) {
      if (typeof this.onDateMouseEnter === 'function') {
        this.onDateMouseEnter(cell);
      }
    },
    handleMouseLeave(cell) {
      if (typeof this.onDateMouseLeave === 'function') {
        this.onDateMouseLeave(cell);
      }
    },
    handleCellClick(evt) {
      let { target } = evt;
      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }
      const index = target.getAttribute('data-row-col');
      if (index) {
        const [row, col] = index.split(',').map(v => parseInt(v, 10));
        const date = this.dates[row][col];
        this.$emit('select', new Date(date));
      }
    },
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.getLocale().formatLocale });
    },
    getCellTitle(date) {
      const fmt = this.titleFormat;
      return this.formatDate(date, fmt);
    },
    getWeekNumber(date) {
      return this.getWeek(date, this.getLocale().formatLocale);
    },
  },
};
</script>
