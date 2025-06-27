<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-month`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :disabled="isDisabledArrows('last-year')"
        @click="handleIconDoubleLeftClick"
        aria-label="Last year"
      ></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <button
          type="button"
          :class="`${prefixClass}-btn ${prefixClass}-btn-text`"
          @click="handlePanelChange"
          aria-label="Select year"
        >
          {{ calendarYear }}
        </button>
      </span>
      <icon-button
        type="double-right"
        :disabled="isDisabledArrows('next-year')"
        @click="handleIconDoubleRightClick"
        aria-label="Next year"
      ></icon-button>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table :class="`${prefixClass}-table ${prefixClass}-table-month`" @click="handleClick" @keydown.enter="handleClick">
        <tr v-for="(row, i) in months" :key="i">
          <td
            v-for="(cell, j) in row"
            :key="j"
            :data-month="cell.month"
            class="cell"
            :class="getCellClasses(cell.month)"
            :aria-label="cell.text"
            tabindex="0"
          >
            <div>{{ cell.text }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { chunk } from '../util/base';
import IconButton from './icon-button';
import { getLocale } from '../locale';
import { setYear } from '../util/date';

export default {
  name: 'TableMonth',
  components: { IconButton },
  inject: {
    getLocale: {
      default: () => getLocale,
    },
    prefixClass: {
      default: 'mx',
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
    getCellClasses: {
      type: Function,
      default: () => [],
    },
  },
  computed: {
    calendarYear() {
      return this.calendar.getFullYear();
    },
    months() {
      const locale = this.getLocale();
      const monthsLocale = locale.months || locale.formatLocale.monthsShort;
      const months = monthsLocale.map((text, month) => {
        return { text, month };
      });
      return chunk(months, 3);
    },
  },
  methods: {
    isDisabledArrows(type) {
      const date = new Date(this.calendar);
      switch (type) {
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-year':
          date.setFullYear(date.getFullYear() + 1, 0, 1);
          break;
        default:
          break;
      }
      if (type == 'last-year' && date.getFullYear() < 2020) {
        // block selection before 2020
        return true;
      }
      return this.disabledCalendarChanger(date, type);
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
    handlePanelChange() {
      this.$emit('changepanel', 'year');
    },
    handleClick(evt) {
      let { target } = evt;
      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }
      const month = target.getAttribute('data-month');
      if (month && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(month, 10));
      }
    },
  },
};
</script>
