import { useState, useEffect, useMemo } from 'react';

export function useResponsive() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartHeight = useMemo(() => {
    const width = dimensions.width;

    // 手機直向 - 增加高度讓圖表更清晰
    if (width <= 480) return 180;
    // 手機橫向/小平板 - 增加高度
    if (width <= 768) return 200;
    // 平板
    if (width <= 1024) return 140;
    // 小筆電
    if (width <= 1280) return 160;
    // 標準桌面
    if (width <= 1600) return 180;
    // 大螢幕
    if (width <= 1920) return 200;
    // 超大螢幕/4K
    return 240;
  }, [dimensions.width]);

  const fontSize = useMemo(() => {
    const width = dimensions.width;

    // 手機版增加字體大小以提升可讀性
    if (width <= 480) return { axis: 11, legend: 11, title: 14, tooltip: 12 };
    if (width <= 768) return { axis: 11, legend: 11, title: 15, tooltip: 12 };
    if (width <= 1024) return { axis: 10, legend: 10, title: 15, tooltip: 13 };
    if (width <= 1920) return { axis: 11, legend: 11, title: 16, tooltip: 13 };
    // 超大螢幕字體略大
    return { axis: 12, legend: 12, title: 17, tooltip: 14 };
  }, [dimensions.width]);

  // 圖表邊距配置
  const chartMargin = useMemo(() => {
    const width = dimensions.width;

    if (width <= 480) return { top: 10, right: 5, left: 0, bottom: 5 };
    if (width <= 768) return { top: 10, right: 10, left: 5, bottom: 5 };
    if (width <= 1024) return { top: 10, right: 10, left: 10, bottom: 5 };
    return { top: 10, right: 15, left: 15, bottom: 5 };
  }, [dimensions.width]);

  // X 軸標籤配置
  const xAxisConfig = useMemo(() => {
    const width = dimensions.width;

    if (width <= 480) return { angle: -45, height: 70, interval: 0 };
    if (width <= 768) return { angle: -35, height: 60, interval: 0 };
    return { angle: 0, height: 40, interval: 'preserveStartEnd' };
  }, [dimensions.width]);

  // Legend 配置
  const legendConfig = useMemo(() => {
    const width = dimensions.width;

    if (width <= 480) return {
      wrapperStyle: { fontSize: '11px', paddingTop: '10px' },
      iconSize: 10,
      layout: 'horizontal'
    };
    if (width <= 768) return {
      wrapperStyle: { fontSize: '11px', paddingTop: '10px' },
      iconSize: 12,
      layout: 'horizontal'
    };
    return {
      wrapperStyle: { fontSize: '12px', paddingTop: '8px' },
      iconSize: 14,
      layout: 'horizontal'
    };
  }, [dimensions.width]);

  const isMobile = useMemo(() => dimensions.width <= 768, [dimensions.width]);
  const isTablet = useMemo(() => dimensions.width > 768 && dimensions.width <= 1024, [dimensions.width]);
  const isDesktop = useMemo(() => dimensions.width > 1024, [dimensions.width]);

  return useMemo(() => ({
    width: dimensions.width,
    height: dimensions.height,
    chartHeight,
    fontSize,
    chartMargin,
    xAxisConfig,
    legendConfig,
    isMobile,
    isTablet,
    isDesktop,
  }), [dimensions.width, dimensions.height, chartHeight, fontSize, chartMargin, xAxisConfig, legendConfig, isMobile, isTablet, isDesktop]);
}
