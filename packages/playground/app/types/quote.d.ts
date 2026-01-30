type QuoteTabWrap = 'QuotePayment' | 'QuotePricing' | 'QuoteInvoice'
type QuoteItemModelName = 'itemName' | 'unit' | 'quantity' | 'unitCost' | 'unitPrice' | 'margin' | 'linePrice'
type QuoteEditableItem = ProjectQuoteAcBosDTO & {
  defaultFlag?: SwitchStatus
  visible: boolean // 是否勾选
  editable?: boolean
  disabled?: boolean
  isDefault?: boolean // 是否设为默认，若是要加个icon
  isDemo?: boolean
  isNewDemo?: boolean
}
/**
 * 项目设计类型
 */
type ProjectDesignType = 'systemDesign' | 'batteryOnly'

/**
 * 系统支持的GST计算方式
 * gst_free: 不计算
 * incl_gst: 包含 gst, 需反推， total / (1+gst) * gst
 * excl_gst: 不包含 gst, 直接乘以 gst
 */
type GstType = 'excl_gst' | 'incl_gst' | 'gst_free'

type DeductionItem = Partial<{
  isCreating: boolean
  id: string | number
  quoteId: number
  companyId: number
  uid: string | number
  gstType: GstType
  label: string | null
  itemName: string | null
  price: number | null
  unitPrice: number | null
  linePrice: number | null
  isHideItem?: SwitchStatus
  isHidePrice?: SwitchStatus
}>

/**
 * Margin模式下关联的展示数据字段
 */
type QuoteFinalGroup = {
  fixedPriceFlag: SwitchStatus

  totalCost: number | null
  grossMargin: number | null
  grossProfit: number | null
  finalPrice: number | null

  totalCostExclRate?: number
  grossMarginExclRate?: number
  grossProfitExclRate?: number
  finalPriceExclRate?: number
}

interface DecInfos {
  deductions: DeductionItem[]
  defaultDeductions?: string | DefaultDeductions
  taxPrice?: number | null
  totalPrice?: number | null
}
/**
 * 系统支持的GST计算方式
 * gst_free: 不计算
 * incl_gst: 包含 gst, 需反推， total / (1+gst) * gst
 * excl_gst: 不包含 gst, 直接乘以 gst
 */
type GstType = 'excl_gst' | 'incl_gst' | 'gst_free'

interface DefaultDeductions {
  companyId?: number
  country: string
  deduction?: string
  id?: number
  quoteId?: number
  totalPrice?: null | number
  taxPrice?: number | null
}

type DeductionItem = Partial<{
  isCreating: boolean
  id: string | number
  quoteId: number
  companyId: number
  uid: string | number
  gstType: GstType
  label: string | null
  itemName: string | null
  price: number | null
  unitPrice: number | null
  linePrice?: number | null
}>

/**
 * ProjectQuoteDTO
 */
interface ProjectQuoteDTO {
  /**
   * id 对应 quoteId
   */
  id: number
  projectId: number
  projectDesignId: number
  finalPrice: number | null
  taxRate: number
  // 控制显隐
  isHideAllPrices?: SwitchStatus | null
  isHideKpPrice?: SwitchStatus | null
  isHideBosPrice?: SwitchStatus | null
  isHideAcPrice?: SwitchStatus | null
  isHideDecPrice?: SwitchStatus | null
  /**
   * 金额模式，默认0 非一口价， 1 一口价
   */
  fixedPriceFlag: SwitchStatus
  priceTemplate: 'margin_based' | 'standard'
  acInfos: Required<ProjectQuoteAcBosDTO>[]
  acPrice?: number
  bosInfos: Required<ProjectQuoteAcBosDTO>[]
  bosPrice?: number
  carInfos: Required<ProjectCartDTO>[]
  companyId?: number
  decInfos: DecInfos
  // deposit
  depositDesc?: string
  depositAmount?: number
  depositSwitch: SwitchStatus
  depositRatio: number | null
  depositType: 1 | 2 // 1 'amount' 2 'percentage'
  // discount
  discountSwitch: SwitchStatus
  discountType: 1 | 2 // 1 'amount' 2 'percentage'
  discountAmount: number | null
  discountRatio: number | null
  kpPrice?: number
  paymentInfoSwitch: boolean
  postalAddress: string
  quoteNumber: string
  systemTotalPrice?: number
  companyNumberType?: string
  paybackPeriod: number | null
  savedBillOf20year: number | null
  taxPrice?: number
  newDataFlag?: SwitchStatus
  batteryCapacity: number | null
  annualGeneratePower: number | null
  newStorageAdded?: number | null
  systemSize: number | null
  annualVppIncome: number | null
  vppOpenFlag: SwitchStatus
  annualBillSavings: number | null
  // 兼容老数据用的 customize 字段
  showItemPriceInQuoteSwitch?: SwitchStatus
  [property: string]: any
}

/**
 * ProjectCartDTO
 */
interface ProjectCartDTO {
  cartType?: string
  id?: number
  oswProductId?: string
  productId?: number
  productInfo?: string
  productType?: ProductType
  projectDesignId?: number
  projectId?: number
  quantity: number
  unitPrice?: number
  linePrice?: number
  margin?: number
  unitCost?: number
  lineCost?: number
  isHideItem?: SwitchStatus
  isHidePrice?: SwitchStatus
  [property: string]: any
}

/**
* ProjectQuoteAcBosDTO
*/
interface ProjectQuoteAcBosDTO {
  id?: number
  itemId?: number
  quoteId?: number
  companyId?: number
  label?: string // 兼容旧字段，弃用
  sort: number
  itemName: string
  quantity?: number
  unit?: string
  unitCost?: number
  unitPrice: number
  margin?: number
  lineCost?: number
  totalPrice: number // 兼容旧字段，弃用
  linePrice: number
  isHideItem?: SwitchStatus
  isHidePrice?: SwitchStatus
  [property: string]: any
}

/**
 * ProjectPaymentDTO
 */
interface ProjectPaymentDTO {
  id?: number
  projectId?: number
  companyId?: number
  companyPaymentId?: number
  accountName: string | null
  accountNumber: string | null
  bankName: string | null
  bsbNumber: string | null
  bicSwiftCode: string | null
  accountType: 'checking' | 'savings'
  routingNumber: string | null
  currency: string | null
  displayStatus: SwitchStatus // 是否允许编辑 (1 = active, 0 = hidden)
  currency: string | null
  iban: string | null
  payId: string | null
  financingInfoSwitch?: SwitchStatus
  syncFlag?: SwitchStatus
  [property: string]: any
}

/**
 * BoS AC 单一项数据
 */
interface QuoteAddItem {
  uid?: string
  companyId?: number
  id?: number
  itemName?: string
  margin?: number
  sort?: number
  unit?: string
  unitCost?: number
  unitPrice?: number
  [property: string]: any
}

interface CurrencyInfo {
  currency?: string
  currencySymbol?: string
  decimalDigits?: string
  decimalSeparator?: string
  foreignCurrencyFlag?: string
  symbolPosition?: string
  thousandSeparator?: string
  [property: string]: any
}

type InvoiceQuoteData = ProjectQuoteDTO & {
  paymentInfo?: ProjectPaymentDTO[]
  signFlag: SwitchStatus
  signUrl: string
  ccyInfo?: CurrencyInfo
  optionName?: string
  quoteCreateTime?: number
  annualGeneratePower?: number
  batteryCapacity?: number
  paybackPeriod?: number
  systemSize?: number
}

/**
 * 右侧小计 四个接口计算值
 */
type CardInfoKeys
  = | 'newStorageAdded'
    | 'savedBillOf20year'
    | 'paybackPeriod'
    | 'systemSize'
    | 'annualGeneratePower'

/**
 * Deposit 迁AU, 接口要的值 (key暂时不要改，以防刷数据出问题)
 */
interface ConfirmDepositEmits {
  deposit_switch: SwitchStatus
  deposit_desc: string
  deposit_by: 'amount' | 'percentage'
  deposit_amount: number | null
  deposit_percentage: number | null
  remaining_balance: number | null
  total_price: number | null
  sync_deposit?: SwitchStatus
}

type DepositRequestBody = {
  depositSwitch: SwitchStatus
  depositDesc: string
  depositType: number
  depositAmount: number | null
  depositRatio: number | null
  remainingBalance: number | null
  depositUpdateFlag?: SwitchStatus
}
type DepositForm = Partial<DepositRequestBody> & {
  isDepositLoading: boolean
}

interface QuoteLineItem {
  linePrice?: number
  quantity?: number
  unitPrice?: number
  [key: string]: any
}

type ParsedDeductions = {
  parsedDeductionData: AuDeductionDetails
  parsedDeductionArray: any[]
}

/**
 * 兼容AU项目的 rebates 数据
 */
type AuDeductionDetails = Partial<{
  installationYear: number
  supportStc: Switch
  stcSwitch: SwitchStatuSwitchStatus
  stcGstType: GstType
  stcQuantity: number
  stcUnitPrice: number | null
  stcTotalPrice: number | null

  supportStcBattery: Switch
  stcBatterySwitch: SwitchStatus
  stcBatteryGstType: GstType
  stcBatteryQuantity: number
  stcBatteryUnitPrice: number | null
  stcBatteryTotalPrice: number | null

  supportVic: Switch
  vicSwitch: SwitchStatus
  vicGstType: GstType
  vicTotalPrice: number | null

  supportVicPv: Switch
  vicPvSwitch: SwitchStatus
  vicPvGstType: GstType
  vicPvTotalPrice: number | null

  supportVicBattery: Switch
  vicBatterySwitch: SwitchStatus
  vicBatteryGstType: GstType
  vicBatteryTotalPrice: number | null

  supportBess1: Switch
  bess1Switch: SwitchStatus
  bess1GstType: GstType
  bess1Quantity: number
  bess1UnitPrice: number | null
  bess1TotalPrice: number | null

  supportBess2: Switch
  bess2Switch: SwitchStatus
  bess2GstType: GstType
  bess2Quantity: number
  bess2UnitPrice: number | null
  bess2TotalPrice: number | null
}>

type fixedAuBaseItemType = 'stc' | 'stcBattery' | 'bess1' | 'bess2' | 'vic' | 'vicPv' | 'vicBattery'
interface FixedAuDeductionBaseItem {
  type: fixedAuBaseItemType
  labelKey?: string
  installationYear?: number
  support: SwitchStatus
  switch: SwitchStatus
  isHideItem?: SwitchStatus
  isHidePrice?: SwitchStatus
  gstType: GstType
  quantity?: number | null
  unitPrice?: number | null
  linePrice: number | null
}

type SwitchStatus = 1 | 0

type QuoteTabWrap = 'QuotePayment' | 'QuotePricing' | 'QuoteInvoice'

/**
 * Balance of System / Aditional Charge 单项产品信息
 */
type QuoteAddItem = {
  uid?: string
  id?: number
  companyId?: number
  label?: string
  itemName: string
  sort?: number
  quantity: number
  unit?: string
  unitCost?: number
  unitPrice: number
  margin?: number
  lineCost?: number
  linePrice?: number
}

type QuoteEditableItem = QuoteAddItem & {
  defaultFlag?: SwitchStatus
  visible: boolean // 是否勾选
  editable?: boolean
  disabled?: boolean
  isDefault?: boolean // 是否设为默认，若是要加个icon
}
/**
 * 项目设计类型
 */
type ProjectDesignType = 'systemDesign' | 'batteryOnly'
/**
 * Margin模式下关联的展示数据字段
 */
type QuoteFinalGroup = {
  fixedPriceFlag: SwitchStatus
  totalCost: number | null
  grossMargin: number | null
  grossProfit: number | null
  finalPrice: number | null
  notFixedTotalCost: number | null
  notFixedGrossMargin: number | null
  notFixedGrossProfit: number | null
  notFixedFinalPrice: number | null
}

type CalculatedKeys = 'newStorageAdded'
  | 'savedBillOf20year'
  | 'paybackPeriod'
  | 'systemSize'
  | 'annualGeneratePower'
  | 'batteryCapacity'
  | 'annualGeneratePower'
  | 'annualVppIncome'
  | 'vppOpenFlag'
  | 'annualBillSavings'

type PriceTemplateMode = 'standard' | 'margin_based'

type ItemPrice = {
  linePrice: number
  linePriceWithRate: number
  lineCost: number
  lineCostWithRate: number
  lineProfit: number
}

/**
 * 账单展示信息：固定价模式 ----- 价格计算方式不同，要做区分
 */
type BillInfoKeys = | 'systemTotalInclRate'
  | 'systemTotalExclRate'
  | 'kpPrice'
  | 'bosPrice'
  | 'acPrice'
  | 'systemTaxRate'
  | 'discountAmount'
  | 'discountAmouontExclRate'
  | 'discountRatio'
  | 'customDeductionPriceInclRate'
  | 'customDeductionRate'
  | 'totalCost'
  | 'totalCostExclRate'
  | 'grossMargin'
  | 'grossMarginExclRate'
  | 'grossProfit'
  | 'grossProfitExclRate'
  | 'finalPrice'
  | 'finalPriceExclRate'
  | 'fixedSystemPrice'
  | 'fixedSystemTaxRate'
  | 'fixedSystemPriceExclRate'
  | 'fixedKpPrice'
  | 'fixedTotalCost'
  | 'fixedTotalCostExclRate'
  | 'fixedGrossMargin'
  | 'fixedGrossMarginExclRate'
  | 'fixedGrossProfit'
  | 'fixedGrossProfitExclRate'
  | 'fixedFinalPrice'
  | 'fixedFinalPriceExclRate'

type BillInfo = Partial<Record<BillInfoKeys, number | null>>

interface CalculatorParams {
  keyProductList: ProjectCartDTO[]
  bosList: ProjectQuoteAcBosDTO[]
  acList: ProjectQuoteAcBosDTO[]
  customDeductionList: DeductionItem[]
  taxRate: number
}

interface UserInputParams {
  fixedPriceFlag: SwitchStatus // 1 固定价 0 非固定价
  totalCost: number
  grossMargin: number
  grossProfit: number
  finalPrice: number
  userEditDescriptor?: {
    area: 'priceItem' | 'finalGroup' | 'other'
    triggerKey: 'qty' | 'unitCost' | 'unitPrice' | 'margin' | 'lineCost' | 'lineTotal' | 'grossMargin' | 'totalCost' | 'grossProfit' | 'finalPrice'
    triggerValue: number
  }
}

/**
 * Margin 模式 改变 FinalPrice 4个联动输入项
 */
type FinalTriggerKey = 'totalCost' | 'grossMargin' | 'grossProfit' | 'finalPrice'

/**
 * Margin 模式 改变 FinalPrice 4个联动输入项
 */
type FinalOriginData = Record<FinalTriggerKey, number>

type UnitOptionKeys
  = | 'kw'
    | 'kwh'
    | 'watt'
    | 'watt_hour'
    | 'unit'
    | 'job'
    | 'meter'
    | 'hour'
    | 'person'
    | 'panel'
    | 'inverter'
    | 'battery'
    | 'ev_charge'
    | 'heat_pump'

type UnitOptionValues
  = | 'kW'
    | 'kWh'
    | 'Watt'
    | 'Watt-Hour'
    | 'Unit'
    | 'Job'
    | 'Meter'
    | 'Hour'
    | 'Person'
    | 'Panel'
    | 'Inverter'
    | 'Battery'
    | 'EV Charger'
    | 'Heat Pump'

// 定义 UnitOptions 类型
type UnitOptions = {
  [Key in UnitOptionKeys]: UnitOptionValues
}

type ProductType
  = | 'panel'
    | 'inverter'
    | 'battery'
    | 'ev_charge'
    | 'heat_pump'
    | 'mounting'
    | 'electrical'
    | 'others'

type GreenDealPriceKeys = 'live_stc_price' | 'prc_price' | 'stc_battery_price'

type GreenDealPrices = Record<GreenDealPriceKeys, number>

type DiscountType = 1 | 2 // 1 'percentage'  2 'amount'

interface DiscountInfos {
  discountSwitch: SwitchStatus
  discountType: DiscountType
  discountAmount: number | null
  discountRatio: number | null
  ratioToAmount?: number | null
}

type QuoteHideType = 'hide-item' | 'unhide-item' | 'hide-item-price' | 'unhide-item-price'

type QuoteHideEmits<T = any> = {
  idx?: number
  type: string
  isHideItem?: SwitchStatus
  isHidePrice?: SwitchStatus
  item: T
  data?: T[]
}
