export const OPEN: SwitchStatus = 1
export const CLOSE: SwitchStatus = 0

/**
 * 单位可选项，默认无；kw kwh watt watt-hour 需根据参数自动计算数量；
 */
export const unitOptions: { label: string, value: string }[] = [
  // { label: 'No Unit', value: '' },
  { label: 'kW', value: 'kw' },
  { label: 'kWh', value: 'kwh' },
  { label: 'Watt', value: 'watt' },
  { label: 'Watt-Hour', value: 'watt_hour' },
  { label: 'Unit', value: 'unit' },
  { label: 'Job', value: 'job' },
  { label: 'Meter', value: 'meter' },
  { label: 'Hour', value: 'hour' },
  { label: 'Person', value: 'person' },
  { label: 'Panel', value: 'panel' },
  { label: 'Inverter', value: 'inverter' },
  { label: 'Battery', value: 'battery' },
  { label: 'EV Charger', value: 'ev_charge' },
  { label: 'Heat Pump', value: 'heat_pump' },
] as const

export const unitDisplayMap: UnitOptions = {
  kw: 'kW',
  kwh: 'kWh',
  watt: 'Watt',
  watt_hour: 'Watt-Hour',
  unit: 'Unit',
  job: 'Job',
  meter: 'Meter',
  hour: 'Hour',
  person: 'Person',
  panel: 'Panel',
  inverter: 'Inverter',
  battery: 'Battery',
  ev_charge: 'EV Charger',
  heat_pump: 'Heat Pump',
} as const

/**
 * 选择以下单位时数量可修改且为正整数
 */
export const intQtyUnitOptions = ['unit', 'job', 'meter', 'hour', 'person', 'ev_charge', 'heat_pump']

/**
 * 选择以下单位时数量自动计算且不允许修改
 */
export const autoComputyQtyUnitOptions = ['kw', 'kwh', 'watt', 'watt_hour', 'panel', 'inverter', 'battery']

export enum DepositTypeEnum {
  Amount = 1,
  Percentage = 2,
}

/**
 * 后端返的JSON字符串，有些字段缺失会导致错误，这里用对象拷贝
 */
export const auFixedRebates = {
  supportStc: 0,
  stcSwitch: 0,
  stcGstType: 'gst_free',
  stcQuantity: 0,
  stcUnitPrice: null,
  stcTotalPrice: null,

  supportVic: 0,
  vicSwitch: 0,
  vicGstType: 'gst_free',
  vicTotalPrice: null,

  supportVicPv: 0,
  vicPvGstType: 'gst_free',
  vicPvSwitch: 0,
  vicPvTotalPrice: null,

  supportStcBattery: 0,
  stcBatterySwitch: 0,
  stcBatteryGstType: 'gst_free',
  stcBatteryQuantity: 0,
  stcBatteryUnitPrice: null,
  stcBatteryTotalPrice: null,

  supportBess2: 0,
  bess2Switch: 0,
  bess2GstType: 'gst_free',
  bess2Quantity: 0,
  bess2UnitPrice: null,
  bess2TotalPrice: null,
}

export const initialFixedDeductions: AuDeductionDetails = {
  installationYear: 2025,
  supportStc: 0,
  stcSwitch: 0,
  stcGstType: 'gst_free',
  stcQuantity: 0,
  stcUnitPrice: null,
  stcTotalPrice: null,

  supportVic: 0,
  vicSwitch: 0,
  vicGstType: 'gst_free',
  vicPvSwitch: 0,

  supportVicPv: 0,
  vicPvGstType: 'gst_free',
  vicTotalPrice: null,
  vicPvTotalPrice: null,

  supportVicBattery: 0,
  vicBatterySwitch: 0,
  vicBatteryGstType: 'gst_free',
  vicBatteryTotalPrice: null,

  supportStcBattery: 0,
  stcBatterySwitch: 0,
  stcBatteryGstType: 'gst_free',
  stcBatteryQuantity: 0,
  stcBatteryUnitPrice: null,
  stcBatteryTotalPrice: null,

  supportBess1: 0,
  bess1Switch: 0,
  bess1GstType: 'gst_free',
  bess1Quantity: 0,
  bess1UnitPrice: null,
  bess1TotalPrice: null,

  supportBess2: 0,
  bess2Switch: 0,
  bess2GstType: 'gst_free',
  bess2Quantity: 0,
  bess2UnitPrice: null,
  bess2TotalPrice: null,
}

export const auDeductionKeys = [
  {
    type: 'stc',
    keys: ['installationYear', 'supportStc', 'stcSwitch', 'stcGstType', 'stcQuantity', 'stcUnitPrice', 'stcTotalPrice', 'isHideStcItem', 'isHideStcPrice'],
  },
  {
    type: 'stcBattery',
    keys: ['installationYear', 'supportStcBattery', 'stcBatterySwitch', 'stcBatteryGstType', 'stcBatteryQuantity', 'stcBatteryUnitPrice', 'stcBatteryTotalPrice', 'isHideStcBatteryItem', 'isHideStcBatteryPrice'],
  },
  {
    type: 'vic',
    keys: ['supportVic', 'vicSwitch', 'vicGstType', 'vicTotalPrice', 'isHideVicItem', 'isHideVicPrice'],
  },
  {
    type: 'vicPv',
    keys: ['supportVicPv', 'vicPvSwitch', 'vicPvGstType', 'vicPvTotalPrice', 'isHideVicPvItem', 'isHideVicPvPrice'],
  },
  {
    type: 'vicBattery',
    keys: ['supportVicBattery', 'vicBatterySwitch', 'vicBatteryGstType', 'vicBatteryTotalPrice', 'isHideVicBatteryItem', 'isHideHideVicBatteryPrice'],
  },
  {
    type: 'bess1',
    keys: ['supportBess1', 'bess1Switch', 'bess1GstType', 'bess1Quantity', 'bess1UnitPrice', 'bess1TotalPrice', 'isHideBess1Item', 'isHideBess1Price'],
  },
  {
    type: 'bess2',
    keys: ['supportBess2', 'bess2Switch', 'bess2GstType', 'bess2Quantity', 'bess2UnitPrice', 'bess2TotalPrice', 'isHideBess2Item', 'isHideBess2Price'],
  },
]
