const XLSX = require('xlsx');
const path = require('path');

// 生成月份列表 (2022-01 到 2025-12)
function generateMonths() {
  const months = [];
  for (let year = 2022; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
    }
  }
  return months;
}

const months = generateMonths();

// 检查是否为预测月份
function isForecastMonth(monthStr) {
  return monthStr === '2025-10' || monthStr === '2025-11' || monthStr === '2025-12';
}

// =============================================================================
// 市场与客户指标
// =============================================================================

// 1. 市场占有率（按地区/技术）
function generateMarketShare() {
  const data = [['月份', '地区', '技术类别', '市场占有率(%)', '营收(M USD)', '同比增长(%)', '主要竞争对手', '註解']];

  const regions = ['北美', '欧洲', '亚洲', '其他'];
  const techCategories = ['先进制程(<10nm)', '成熟制程(>10nm)', '特殊应用'];
  const competitors = ['TSMC', 'Samsung', 'Intel', 'SMIC', 'UMC'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    regions.forEach((region, rIndex) => {
      techCategories.forEach((tech, tIndex) => {
        const baseShare = 15 + rIndex * 5 + tIndex * 3 + Math.random() * 5;
        const growthTrend = mIndex * 0.02;
        const marketShare = baseShare + growthTrend;

        const revenue = Math.floor(500 + marketShare * 20 + Math.random() * 200);
        const yoyGrowth = 5 + mIndex * 0.15 + (Math.random() - 0.5) * 10;

        const mainCompetitor = competitors[Math.floor(Math.random() * competitors.length)];

        let note = '';
        if (isForecast) {
          note = '预测：市场占有率持续增长';
        } else if (yoyGrowth > 15) {
          note = '市场扩张快速';
        } else if (yoyGrowth < 0) {
          note = '需加强市场策略';
        }

        data.push([
          month,
          region,
          tech,
          parseFloat(marketShare.toFixed(1)),
          revenue,
          parseFloat(yoyGrowth.toFixed(1)),
          mainCompetitor,
          note
        ]);
      });
    });
  });

  return data;
}

// 2. 主要客户订单状态与预测
function generateCustomerOrders() {
  const data = [['月份', '客户', '订单金额(M USD)', '订单状态', '预计交货月', '订单变化(%)', '风险等级', '註解']];

  const customers = ['客户A', '客户B', '客户C', '客户D', '客户E'];
  const statuses = ['已确认', '生产中', '已交货', '延迟'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    customers.forEach((customer, cIndex) => {
      const baseOrder = 500 + cIndex * 200 + Math.random() * 300;
      const orderAmount = Math.floor(baseOrder + mIndex * 10);

      let status;
      const rand = Math.random();
      if (rand > 0.9) status = '延迟';
      else if (rand > 0.6) status = '已交货';
      else if (rand > 0.3) status = '生产中';
      else status = '已确认';

      const deliveryMonth = month; // 简化处理

      const orderChange = -5 + Math.random() * 20;

      let riskLevel;
      if (orderChange < 0) riskLevel = '中';
      else if (orderChange < 5) riskLevel = '低';
      else riskLevel = '低';

      if (status === '延迟') riskLevel = '高';

      let note = '';
      if (isForecast) {
        note = '预测：订单稳定成长';
      } else if (status === '延迟') {
        note = '需加速生产';
      } else if (orderChange > 15) {
        note = '订单大幅增长';
      }

      data.push([
        month,
        customer,
        orderAmount,
        status,
        deliveryMonth,
        parseFloat(orderChange.toFixed(1)),
        riskLevel,
        note
      ]);
    });
  });

  return data;
}

// 3. 客户满意度指标
function generateCustomerSatisfaction() {
  const data = [['月份', '客户', '整体满意度', '产品质量', '交货准时', '技术支持', '价格竞争力', 'NPS分数', '註解']];

  const customers = ['客户A', '客户B', '客户C', '客户D', '客户E'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    customers.forEach((customer) => {
      const baseSatisfaction = 80 + Math.random() * 15 + mIndex * 0.1;
      const overallSat = Math.min(100, baseSatisfaction);

      const productQuality = Math.min(100, 85 + Math.random() * 12);
      const onTimeDelivery = Math.min(100, 80 + Math.random() * 15);
      const techSupport = Math.min(100, 82 + Math.random() * 13);
      const priceComp = Math.min(100, 75 + Math.random() * 15);
      const nps = Math.floor(50 + Math.random() * 40);

      let note = '';
      if (isForecast) {
        note = '预测：维持高满意度';
      } else if (overallSat > 90) {
        note = '客户满意度优异';
      } else if (overallSat < 80) {
        note = '需改善客户体验';
      }

      data.push([
        month,
        customer,
        parseFloat(overallSat.toFixed(1)),
        parseFloat(productQuality.toFixed(1)),
        parseFloat(onTimeDelivery.toFixed(1)),
        parseFloat(techSupport.toFixed(1)),
        parseFloat(priceComp.toFixed(1)),
        nps,
        note
      ]);
    });
  });

  return data;
}

// =============================================================================
// 供应链与原材料
// =============================================================================

// 1. 关键材料库存水平
function generateMaterialInventory() {
  const data = [['月份', '材料名称', '当前库存(单位)', '安全库存', '库存天数', '状态', '供应商数量', '註解']];

  const materials = ['硅晶圆', '光刻胶', '化学品A', '化学品B', '特殊气体', '靶材'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    materials.forEach((material, mIdx) => {
      const baseInventory = 5000 + mIdx * 1000 + Math.random() * 2000;
      const currentInventory = Math.floor(baseInventory + mIndex * 50);
      const safetyStock = Math.floor(baseInventory * 0.7);
      const inventoryDays = Math.floor(20 + Math.random() * 15);

      let status;
      if (currentInventory >= safetyStock * 1.2) status = '充足';
      else if (currentInventory >= safetyStock) status = '正常';
      else status = '偏低';

      const supplierCount = 2 + Math.floor(Math.random() * 3);

      let note = '';
      if (isForecast) {
        note = '预测：维持安全库存';
      } else if (status === '偏低') {
        note = '需补充库存';
      } else if (inventoryDays > 30) {
        note = '库存偏高，可优化';
      }

      data.push([
        month,
        material,
        currentInventory,
        safetyStock,
        inventoryDays,
        status,
        supplierCount,
        note
      ]);
    });
  });

  return data;
}

// 2. 供应商绩效指标
function generateSupplierPerformance() {
  const data = [['月份', '供应商', '准时交货率(%)', '质量合格率(%)', '响应时间(小时)', '价格竞争力', '综合评分', '註解']];

  const suppliers = ['供应商A', '供应商B', '供应商C', '供应商D', '供应商E'];
  const priceRatings = ['优', '良', '中'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    suppliers.forEach((supplier) => {
      const onTimeRate = 85 + Math.random() * 12 + mIndex * 0.05;
      const qualityRate = 95 + Math.random() * 4;
      const responseTime = 24 + Math.random() * 24;
      const priceComp = priceRatings[Math.floor(Math.random() * priceRatings.length)];
      const overallScore = ((onTimeRate + qualityRate) / 2 + (48 - responseTime)) / 2;

      let note = '';
      if (isForecast) {
        note = '预测：持续监控供应商表现';
      } else if (onTimeRate < 90) {
        note = '需改善交货准时性';
      } else if (qualityRate < 96) {
        note = '需提升质量标准';
      }

      data.push([
        month,
        supplier,
        parseFloat(onTimeRate.toFixed(1)),
        parseFloat(qualityRate.toFixed(1)),
        parseFloat(responseTime.toFixed(1)),
        priceComp,
        parseFloat(overallScore.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// =============================================================================
// 研发与技术
// =============================================================================

// 1. 新制程技术开发进度
function generateRDProgress() {
  const data = [['月份', '项目名称', '完成度(%)', '里程碑', '预算执行率(%)', '风险等级', '预计完成日', '註解']];

  const projects = ['3nm制程开发', '2nm前期研究', 'GAA技术', '先进封装技术', 'EUV优化'];
  const milestones = ['概念验证', '初期开发', '试产', '量产准备', '量产'];
  const risks = ['低', '中', '高'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    projects.forEach((project, pIdx) => {
      const baseCompletion = mIndex * 2 + pIdx * 5;
      const completion = Math.min(100, baseCompletion + Math.random() * 5);

      let milestone;
      if (completion < 20) milestone = '概念验证';
      else if (completion < 50) milestone = '初期开发';
      else if (completion < 75) milestone = '试产';
      else if (completion < 95) milestone = '量产准备';
      else milestone = '量产';

      const budgetExecution = 90 + Math.random() * 15;
      const risk = risks[Math.floor(Math.random() * risks.length)];
      const expectedDate = '2025-12';

      let note = '';
      if (isForecast) {
        note = '预测：按计划推进';
      } else if (completion > mIndex * 2.5) {
        note = '进度超前';
      } else if (completion < mIndex * 1.5) {
        note = '需加快进度';
      }

      data.push([
        month,
        project,
        parseFloat(completion.toFixed(1)),
        milestone,
        parseFloat(budgetExecution.toFixed(1)),
        risk,
        expectedDate,
        note
      ]);
    });
  });

  return data;
}

// 2. 专利申请与授权数量
function generatePatents() {
  const data = [['年份', '季度', '申请数量', '授权数量', '累计申请', '累计授权', '主要技术领域', '註解']];

  const techAreas = ['制程技术', '设备改进', '材料科学', '封装技术', '测试方法'];
  let cumulativeApplied = 500;
  let cumulativeGranted = 300;

  for (let year = 2022; year <= 2025; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const isForecast = year === 2025 && quarter === 4;

      const applied = Math.floor(20 + Math.random() * 15 + (year - 2022) * 2);
      const granted = Math.floor(10 + Math.random() * 10 + (year - 2022) * 1.5);

      cumulativeApplied += applied;
      cumulativeGranted += granted;

      const mainArea = techAreas[Math.floor(Math.random() * techAreas.length)];

      let note = '';
      if (isForecast) {
        note = '预测：持续增加研发投入';
      } else if (applied > 30) {
        note = '研发活跃期';
      }

      data.push([
        year,
        `Q${quarter}`,
        applied,
        granted,
        cumulativeApplied,
        cumulativeGranted,
        mainArea,
        note
      ]);
    }
  }

  return data;
}

// =============================================================================
// 人力资源
// =============================================================================

// 1. 员工保留率与流动
function generateEmployeeRetention() {
  const data = [['月份', '部门', '总人数', '新进人数', '离职人数', '保留率(%)', '关键人才保留率(%)', '註解']];

  const departments = ['研发', '制造', '质量', '工程', '行政'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    departments.forEach((dept, dIdx) => {
      const baseHeadcount = 200 + dIdx * 100 + mIndex * 2;
      const totalHeadcount = Math.floor(baseHeadcount);
      const newHires = Math.floor(5 + Math.random() * 10);
      const turnover = Math.floor(2 + Math.random() * 6);

      const retentionRate = ((totalHeadcount - turnover) / totalHeadcount) * 100;
      const keyTalentRetention = Math.min(100, retentionRate + 5 + Math.random() * 3);

      let note = '';
      if (isForecast) {
        note = '预测：稳定人力结构';
      } else if (retentionRate < 90) {
        note = '需关注离职率';
      } else if (dept === '研发' && keyTalentRetention < 95) {
        note = '加强关键人才留任';
      }

      data.push([
        month,
        dept,
        totalHeadcount,
        newHires,
        turnover,
        parseFloat(retentionRate.toFixed(1)),
        parseFloat(keyTalentRetention.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// 2. 员工绩效指标
function generateEmployeePerformance() {
  const data = [['月份', '部门', '平均绩效分数', '优秀比例(%)', '培训完成率(%)', '生产力指标', '满意度', '註解']];

  const departments = ['研发', '制造', '质量', '工程', '行政'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    departments.forEach((dept) => {
      const avgPerformance = 75 + Math.random() * 20 + mIndex * 0.1;
      const excellentRatio = 15 + Math.random() * 15;
      const trainingCompletion = 80 + Math.random() * 18;
      const productivity = 85 + Math.random() * 12;
      const satisfaction = 75 + Math.random() * 20;

      let note = '';
      if (isForecast) {
        note = '预测：维持高绩效';
      } else if (avgPerformance > 85) {
        note = '团队表现优异';
      } else if (trainingCompletion < 85) {
        note = '需加强培训推动';
      }

      data.push([
        month,
        dept,
        parseFloat(avgPerformance.toFixed(1)),
        parseFloat(excellentRatio.toFixed(1)),
        parseFloat(trainingCompletion.toFixed(1)),
        parseFloat(productivity.toFixed(1)),
        parseFloat(satisfaction.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// =============================================================================
// 风险管理
// =============================================================================

// 1. 营运风险指标
function generateOperationalRisk() {
  const data = [['月份', '风险类别', '风险等级', '发生概率', '影响程度', '缓解措施', '责任部门', '註解']];

  const riskCategories = ['供应链中断', '设备故障', '质量问题', '网络攻击', '地缘政治'];
  const riskLevels = ['低', '中', '高', '极高'];
  const probabilities = ['很低', '低', '中', '高'];
  const impacts = ['轻微', '中等', '严重', '极严重'];
  const departments = ['供应链', '制造', '质量', 'IT', '风控'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    riskCategories.forEach((category, cIdx) => {
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      const probability = probabilities[Math.floor(Math.random() * probabilities.length)];
      const impact = impacts[Math.floor(Math.random() * impacts.length)];

      let mitigation = '';
      if (category === '供应链中断') mitigation = '多元化供应商，增加库存';
      else if (category === '设备故障') mitigation = '预防性维护，备用设备';
      else if (category === '质量问题') mitigation = '加强SPC监控，根因分析';
      else if (category === '网络攻击') mitigation = '强化资安防护，定期演练';
      else mitigation = '密切监控情势，制定应变计划';

      const responsibleDept = departments[cIdx];

      let note = '';
      if (isForecast) {
        note = '预测：持续监控';
      } else if (riskLevel === '高' || riskLevel === '极高') {
        note = '需立即关注';
      }

      data.push([
        month,
        category,
        riskLevel,
        probability,
        impact,
        mitigation,
        responsibleDept,
        note
      ]);
    });
  });

  return data;
}

// 2. EHS绩效指标
function generateEHSPerformance() {
  const data = [['月份', '指标类别', '指标值', '目标值', '达成率(%)', '事故数', '严重度', '註解']];

  const ehsCategories = ['工安事故率', '环保排放', '能源效率', '废弃物回收率', '健康检查完成率'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    ehsCategories.forEach((category) => {
      let metricValue, targetValue, accidents, severity;

      if (category === '工安事故率') {
        metricValue = 0.5 + Math.random() * 1.5;
        targetValue = 1.0;
        accidents = Math.floor(Math.random() * 3);
        severity = accidents > 0 ? '轻微' : '无';
      } else if (category === '环保排放') {
        metricValue = 85 + Math.random() * 10;
        targetValue = 90;
        accidents = 0;
        severity = '无';
      } else if (category === '能源效率') {
        metricValue = 88 + Math.random() * 8;
        targetValue = 92;
        accidents = 0;
        severity = '无';
      } else if (category === '废弃物回收率') {
        metricValue = 75 + Math.random() * 15;
        targetValue = 85;
        accidents = 0;
        severity = '无';
      } else {
        metricValue = 92 + Math.random() * 7;
        targetValue = 95;
        accidents = 0;
        severity = '无';
      }

      const achievement = (metricValue / targetValue) * 100;

      let note = '';
      if (isForecast) {
        note = '预测：持续改善EHS表现';
      } else if (achievement >= 100) {
        note = '达标';
      } else if (achievement < 90) {
        note = '需改善';
      }

      data.push([
        month,
        category,
        parseFloat(metricValue.toFixed(2)),
        parseFloat(targetValue.toFixed(2)),
        parseFloat(achievement.toFixed(1)),
        accidents,
        severity,
        note
      ]);
    });
  });

  return data;
}

// =============================================================================
// 主程序
// =============================================================================

console.log('开始生成所有指标数据...\n');

// 市场与客户指标
console.log('=== 市场与客户指标 ===');
const marketWorkbook = XLSX.utils.book_new();

console.log('1. 生成市场占有率数据...');
const marketShareData = generateMarketShare();
const ws_ms = XLSX.utils.aoa_to_sheet(marketShareData);
XLSX.utils.book_append_sheet(marketWorkbook, ws_ms, '市場佔有率');

console.log('2. 生成客户订单数据...');
const customerOrdersData = generateCustomerOrders();
const ws_co = XLSX.utils.aoa_to_sheet(customerOrdersData);
XLSX.utils.book_append_sheet(marketWorkbook, ws_co, '客戶訂單狀態');

console.log('3. 生成客户满意度数据...');
const customerSatData = generateCustomerSatisfaction();
const ws_cs = XLSX.utils.aoa_to_sheet(customerSatData);
XLSX.utils.book_append_sheet(marketWorkbook, ws_cs, '客戶滿意度');

const marketFilePath = path.join(__dirname, 'dashboard/public/市場與客戶指標.xlsx');
XLSX.writeFile(marketWorkbook, marketFilePath);
console.log(`✅ 市场与客户指标数据已生成: ${marketFilePath}\n`);

// 供应链与原材料
console.log('=== 供应链与原材料 ===');
const supplyWorkbook = XLSX.utils.book_new();

console.log('1. 生成材料库存数据...');
const materialInvData = generateMaterialInventory();
const ws_mi = XLSX.utils.aoa_to_sheet(materialInvData);
XLSX.utils.book_append_sheet(supplyWorkbook, ws_mi, '材料庫存水平');

console.log('2. 生成供应商绩效数据...');
const supplierPerfData = generateSupplierPerformance();
const ws_sp = XLSX.utils.aoa_to_sheet(supplierPerfData);
XLSX.utils.book_append_sheet(supplyWorkbook, ws_sp, '供應商績效');

const supplyFilePath = path.join(__dirname, 'dashboard/public/供應鏈與原材料.xlsx');
XLSX.writeFile(supplyWorkbook, supplyFilePath);
console.log(`✅ 供应链与原材料数据已生成: ${supplyFilePath}\n`);

// 研发与技术
console.log('=== 研发与技术 ===');
const rdWorkbook = XLSX.utils.book_new();

console.log('1. 生成研发进度数据...');
const rdProgressData = generateRDProgress();
const ws_rd = XLSX.utils.aoa_to_sheet(rdProgressData);
XLSX.utils.book_append_sheet(rdWorkbook, ws_rd, '新製程開發進度');

console.log('2. 生成专利数据...');
const patentsData = generatePatents();
const ws_pt = XLSX.utils.aoa_to_sheet(patentsData);
XLSX.utils.book_append_sheet(rdWorkbook, ws_pt, '專利申請與授權');

const rdFilePath = path.join(__dirname, 'dashboard/public/研發與技術.xlsx');
XLSX.writeFile(rdWorkbook, rdFilePath);
console.log(`✅ 研发与技术数据已生成: ${rdFilePath}\n`);

// 人力资源
console.log('=== 人力资源 ===');
const hrWorkbook = XLSX.utils.book_new();

console.log('1. 生成员工保留率数据...');
const retentionData = generateEmployeeRetention();
const ws_er = XLSX.utils.aoa_to_sheet(retentionData);
XLSX.utils.book_append_sheet(hrWorkbook, ws_er, '員工保留率');

console.log('2. 生成员工绩效数据...');
const performanceData = generateEmployeePerformance();
const ws_ep = XLSX.utils.aoa_to_sheet(performanceData);
XLSX.utils.book_append_sheet(hrWorkbook, ws_ep, '員工績效指標');

const hrFilePath = path.join(__dirname, 'dashboard/public/人力資源.xlsx');
XLSX.writeFile(hrWorkbook, hrFilePath);
console.log(`✅ 人力资源数据已生成: ${hrFilePath}\n`);

// 风险管理
console.log('=== 风险管理 ===');
const riskWorkbook = XLSX.utils.book_new();

console.log('1. 生成营运风险数据...');
const operationalRiskData = generateOperationalRisk();
const ws_or = XLSX.utils.aoa_to_sheet(operationalRiskData);
XLSX.utils.book_append_sheet(riskWorkbook, ws_or, '營運風險指標');

console.log('2. 生成EHS绩效数据...');
const ehsData = generateEHSPerformance();
const ws_ehs = XLSX.utils.aoa_to_sheet(ehsData);
XLSX.utils.book_append_sheet(riskWorkbook, ws_ehs, 'EHS績效');

const riskFilePath = path.join(__dirname, 'dashboard/public/風險管理.xlsx');
XLSX.writeFile(riskWorkbook, riskFilePath);
console.log(`✅ 风险管理数据已生成: ${riskFilePath}\n`);

console.log('🎉 所有指标数据生成完成！');
console.log('\n生成的文件列表:');
console.log('1. 市场与客户指标.xlsx');
console.log('2. 供应链与原材料.xlsx');
console.log('3. 研发与技术.xlsx');
console.log('4. 人力资源.xlsx');
console.log('5. 风险管理.xlsx');
console.log('\n数据范围: 2022/01-2025/12 (2025/10-12为预测数据)');
