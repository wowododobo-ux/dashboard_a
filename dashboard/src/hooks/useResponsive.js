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

    // 手機直向
    if (width <= 480) return 100;
    // 手機橫向/小平板
    if (width <= 768) return 120;
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

    if (width <= 480) return { axis: 9, legend: 9, title: 13 };
    if (width <= 768) return { axis: 10, legend: 10, title: 14 };
    if (width <= 1024) return { axis: 10, legend: 10, title: 15 };
    if (width <= 1920) return { axis: 11, legend: 11, title: 16 };
    // 超大螢幕字體略大
    return { axis: 12, legend: 12, title: 17 };
  }, [dimensions.width]);

  const isMobile = useMemo(() => dimensions.width <= 768, [dimensions.width]);
  const isTablet = useMemo(() => dimensions.width > 768 && dimensions.width <= 1024, [dimensions.width]);
  const isDesktop = useMemo(() => dimensions.width > 1024, [dimensions.width]);

  return useMemo(() => ({
    width: dimensions.width,
    height: dimensions.height,
    chartHeight,
    fontSize,
    isMobile,
    isTablet,
    isDesktop,
  }), [dimensions.width, dimensions.height, chartHeight, fontSize, isMobile, isTablet, isDesktop]);
}
