import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { textConfig } from '../config/textConfig';
import './GlobalFilter.css';

/**
 * 全局篩選器組件
 * 使用 URL query params 管理篩選狀態，支持書籤和分享
 *
 * @param {Object} props
 * @param {Function} props.onFilterChange - 篩選變化時的回調函數
 */
function GlobalFilter({ onFilterChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // 從 URL 讀取初始篩選值
  const getInitialFilters = () => {
    return {
      timeRange: searchParams.get('timeRange') || 'thisMonth',
      area: searchParams.get('area') || 'all',
      productLine: searchParams.get('productLine') || 'all',
      shift: searchParams.get('shift') || 'all',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());

  // 當 URL 參數變化時更新篩選器
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);

    // 如果是自定義日期範圍，設置日期選擇器的值
    if (newFilters.timeRange === 'custom') {
      setCustomStartDate(newFilters.startDate);
      setCustomEndDate(newFilters.endDate);
      setShowDatePicker(true);
    }

    // 通知父組件篩選器已變化
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [searchParams]);

  // 更新單個篩選條件
  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    // 如果選擇了自定義日期範圍，顯示日期選擇器
    if (key === 'timeRange') {
      if (value === 'custom') {
        setShowDatePicker(true);
      } else {
        setShowDatePicker(false);
        // 清除自定義日期
        newFilters.startDate = '';
        newFilters.endDate = '';
      }
    }

    setFilters(newFilters);
    updateURL(newFilters);
  };

  // 更新 URL query params
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    // 只添加非默認值到 URL
    if (newFilters.timeRange !== 'thisMonth') {
      params.set('timeRange', newFilters.timeRange);
    }
    if (newFilters.area !== 'all') {
      params.set('area', newFilters.area);
    }
    if (newFilters.productLine !== 'all') {
      params.set('productLine', newFilters.productLine);
    }
    if (newFilters.shift !== 'all') {
      params.set('shift', newFilters.shift);
    }
    if (newFilters.startDate) {
      params.set('startDate', newFilters.startDate);
    }
    if (newFilters.endDate) {
      params.set('endDate', newFilters.endDate);
    }

    setSearchParams(params);
  };

  // 應用自定義日期範圍
  const applyCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      alert('請選擇開始和結束日期');
      return;
    }

    if (new Date(customStartDate) > new Date(customEndDate)) {
      alert('開始日期不能晚於結束日期');
      return;
    }

    const newFilters = {
      ...filters,
      timeRange: 'custom',
      startDate: customStartDate,
      endDate: customEndDate,
    };

    setFilters(newFilters);
    updateURL(newFilters);
    setShowDatePicker(false);
  };

  // 重置所有篩選器
  const resetFilters = () => {
    const defaultFilters = {
      timeRange: 'thisMonth',
      area: 'all',
      productLine: 'all',
      shift: 'all',
      startDate: '',
      endDate: '',
    };

    setFilters(defaultFilters);
    setCustomStartDate('');
    setCustomEndDate('');
    setShowDatePicker(false);
    setSearchParams(new URLSearchParams());
  };

  // 獲取當前活躍的篩選器數量
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.timeRange !== 'thisMonth') count++;
    if (filters.area !== 'all') count++;
    if (filters.productLine !== 'all') count++;
    if (filters.shift !== 'all') count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className="global-filter">
      <div className="filter-header">
        <div className="filter-title-section">
          <h3 className="filter-title">
            🔍 {textConfig.globalFilter.title}
          </h3>
          {activeCount > 0 && (
            <span className="filter-badge">{activeCount} 個篩選條件</span>
          )}
        </div>
        <button className="filter-reset-btn" onClick={resetFilters}>
          {textConfig.globalFilter.reset}
        </button>
      </div>

      <div className="filter-controls">
        {/* 時間範圍 */}
        <div className="filter-group">
          <label className="filter-label">
            {textConfig.globalFilter.timeRange}
          </label>
          <select
            className="filter-select"
            value={filters.timeRange}
            onChange={(e) => updateFilter('timeRange', e.target.value)}
          >
            <option value="today">{textConfig.globalFilter.today}</option>
            <option value="thisWeek">{textConfig.globalFilter.thisWeek}</option>
            <option value="thisMonth">{textConfig.globalFilter.thisMonth}</option>
            <option value="last7Days">{textConfig.globalFilter.last7Days}</option>
            <option value="last30Days">{textConfig.globalFilter.last30Days}</option>
            <option value="custom">{textConfig.globalFilter.custom}</option>
          </select>
        </div>

        {/* 生產區域 */}
        <div className="filter-group">
          <label className="filter-label">
            {textConfig.globalFilter.area}
          </label>
          <select
            className="filter-select"
            value={filters.area}
            onChange={(e) => updateFilter('area', e.target.value)}
          >
            <option value="all">{textConfig.globalFilter.all}</option>
            <option value="areaA">{textConfig.globalFilter.areaA}</option>
            <option value="areaB">{textConfig.globalFilter.areaB}</option>
            <option value="areaC">{textConfig.globalFilter.areaC}</option>
          </select>
        </div>

        {/* 產品線 */}
        <div className="filter-group">
          <label className="filter-label">
            {textConfig.globalFilter.productLine}
          </label>
          <select
            className="filter-select"
            value={filters.productLine}
            onChange={(e) => updateFilter('productLine', e.target.value)}
          >
            <option value="all">{textConfig.globalFilter.all}</option>
            <option value="5nm">{textConfig.globalFilter.line5nm}</option>
            <option value="7nm">{textConfig.globalFilter.line7nm}</option>
            <option value="12nm">{textConfig.globalFilter.line12nm}</option>
            <option value="16nm">{textConfig.globalFilter.line16nm}</option>
          </select>
        </div>

        {/* 班別 */}
        <div className="filter-group">
          <label className="filter-label">
            {textConfig.globalFilter.shift}
          </label>
          <select
            className="filter-select"
            value={filters.shift}
            onChange={(e) => updateFilter('shift', e.target.value)}
          >
            <option value="all">{textConfig.globalFilter.all}</option>
            <option value="shiftA">{textConfig.globalFilter.shiftA}</option>
            <option value="shiftB">{textConfig.globalFilter.shiftB}</option>
            <option value="shiftC">{textConfig.globalFilter.shiftC}</option>
          </select>
        </div>
      </div>

      {/* 自定義日期範圍選擇器 */}
      {showDatePicker && (
        <div className="custom-date-range">
          <div className="date-range-inputs">
            <div className="date-input-group">
              <label className="date-label">{textConfig.globalFilter.startDate}</label>
              <input
                type="date"
                className="date-input"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">~</span>
            <div className="date-input-group">
              <label className="date-label">{textConfig.globalFilter.endDate}</label>
              <input
                type="date"
                className="date-input"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
            <button className="date-apply-btn" onClick={applyCustomDateRange}>
              {textConfig.globalFilter.apply}
            </button>
            <button
              className="date-cancel-btn"
              onClick={() => {
                setShowDatePicker(false);
                if (filters.timeRange === 'custom') {
                  updateFilter('timeRange', 'thisMonth');
                }
              }}
            >
              {textConfig.globalFilter.cancel}
            </button>
          </div>
        </div>
      )}

      {/* 當前篩選摘要 */}
      {activeCount > 0 && (
        <div className="filter-summary">
          <span className="summary-label">{textConfig.globalFilter.currentFilters}:</span>
          <div className="summary-tags">
            {filters.timeRange !== 'thisMonth' && (
              <span className="summary-tag">
                {textConfig.globalFilter.timeRange}: {getTimeRangeLabel(filters)}
              </span>
            )}
            {filters.area !== 'all' && (
              <span className="summary-tag">
                {textConfig.globalFilter.area}: {getAreaLabel(filters.area)}
              </span>
            )}
            {filters.productLine !== 'all' && (
              <span className="summary-tag">
                {textConfig.globalFilter.productLine}: {filters.productLine}
              </span>
            )}
            {filters.shift !== 'all' && (
              <span className="summary-tag">
                {textConfig.globalFilter.shift}: {getShiftLabel(filters.shift)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 輔助函數：獲取時間範圍標籤
function getTimeRangeLabel(filters) {
  if (filters.timeRange === 'custom' && filters.startDate && filters.endDate) {
    return `${filters.startDate} ~ ${filters.endDate}`;
  }
  const labels = {
    today: textConfig.globalFilter.today,
    thisWeek: textConfig.globalFilter.thisWeek,
    thisMonth: textConfig.globalFilter.thisMonth,
    last7Days: textConfig.globalFilter.last7Days,
    last30Days: textConfig.globalFilter.last30Days,
  };
  return labels[filters.timeRange] || filters.timeRange;
}

// 輔助函數：獲取區域標籤
function getAreaLabel(area) {
  const labels = {
    areaA: textConfig.globalFilter.areaA,
    areaB: textConfig.globalFilter.areaB,
    areaC: textConfig.globalFilter.areaC,
  };
  return labels[area] || area;
}

// 輔助函數：獲取班別標籤
function getShiftLabel(shift) {
  const labels = {
    shiftA: textConfig.globalFilter.shiftA,
    shiftB: textConfig.globalFilter.shiftB,
    shiftC: textConfig.globalFilter.shiftC,
  };
  return labels[shift] || shift;
}

export default GlobalFilter;
