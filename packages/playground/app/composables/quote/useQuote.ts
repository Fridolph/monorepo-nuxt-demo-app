import { OPEN, CLOSE } from '@quote/constants/quote'
import { CalcInst } from '@/utils/$calcalator'
import { getQuoteInfo, updateQuoteInfoApi } from '@quote/apis/quote'
import { queryPriceFromGreenDealApi } from '@quote/apis/quote/deduction'
import { getProjectPaymentInfoApi } from '@quote/apis/quote/payment'
import { syncSettingDeposit } from '@quote/apis/quote/company'
import { getCustomize } from '@/apis/modules/proposal'
import type QuotePayment from '~~/layers/quote/components/QuotePayment.vue'
import type QuoteInvoice from '@quote/components/QuoteInvoice.vue'
import type DepositAction from '@quote/components/DepositAction.vue'
/**
 * @description 说明先留着，重构完后再删： 目前增删改 都不调用接口
 * 而是前端自行处理数据结构（并计算价格）后 一整个 JSON 走 quoteInfo 接口给后端
 */
export default function useQuoteFetch() {
  const nuxtApp = useNuxtApp()
  const t = nuxtApp.$i18n.t
  const { $notify } = useNotify()
  const { hasPermission } = usePermission()
  const projectStore = useProjectStore()
  const { setQuoteSyncStatus } = projectStore

  const quoteData = ref<Partial<ProjectQuoteDTO>>({
    id: 0,
    projectId: 0,
    projectDesignId: 0,
    taxRate: 0.05,
    fixedPriceFlag: 0,
    carInfos: [],
    bosInfos: [],
    acInfos: [],
    depositSwitch: CLOSE,
    depositRatio: null,
    depositType: 1,
    finalPrice: null,
    newDataFlag: 1,
    isHideAllPrices: null,
    isHideKpPrice: CLOSE,
    isHideBosPrice: CLOSE,
    isHideAcPrice: CLOSE,
    isHideDecPrice: CLOSE,
  })

  // ---------------------------
  // Quote 对应模块价格显隐相关逻辑
  // ---------------------------
  const isHideAllPrices = ref<SwitchStatus | null>(null)
  function hideAllPrices(isAllControl: boolean = false) {
    isHideAllPrices.value = OPEN
    quoteData.value.isHideAllPrices = OPEN
    setIsHideKpStatus(OPEN)
    setIsHideBosStatus(OPEN)
    setIsHideAcStatus(OPEN)
    if (isAllControl) setIsHideDecStatus(OPEN)
  }
  function onlySetAllHide(status: SwitchStatus | null) {
    isHideAllPrices.value = status
    quoteData.value.isHideAllPrices = status
  }
  function onlyUnhideAllPrice() {
    isHideAllPrices.value = CLOSE
  }
  function unhideAllPrices(isAllControl = false) {
    isHideAllPrices.value = CLOSE
    setIsHideKpStatus(CLOSE)
    setIsHideBosStatus(CLOSE)
    setIsHideAcStatus(CLOSE)
    if (isAllControl) setIsHideDecStatus(CLOSE)
  }

  const isHideKpPrice = ref<SwitchStatus>(CLOSE)
  const setIsHideKpStatus = (status: SwitchStatus) => {
    isHideKpPrice.value = status
    quoteData.value.isHideKpPrice = status
    if (!status) {
      isHideAllPrices.value = CLOSE
      quoteData.value.isHideAllPrices = CLOSE
    }
  }

  const isHideBosPrice = ref<SwitchStatus>(CLOSE)
  const setIsHideBosStatus = (status: SwitchStatus) => {
    isHideBosPrice.value = status
    quoteData.value.isHideBosPrice = status
    if (!status) {
      isHideAllPrices.value = CLOSE
      quoteData.value.isHideAllPrices = CLOSE
    }
  }

  const isHideAcPrice = ref<SwitchStatus>(CLOSE)
  const setIsHideAcStatus = (status: SwitchStatus) => {
    isHideAcPrice.value = status
    quoteData.value.isHideAcPrice = status
    if (!status) {
      isHideAllPrices.value = CLOSE
      quoteData.value.isHideAllPrices = CLOSE
    }
  }

  const isHideDecPrice = ref<SwitchStatus>(CLOSE)
  const setIsHideDecStatus = (status: SwitchStatus) => {
    isHideDecPrice.value = status
    quoteData.value.isHideDecPrice = status
    if (!status) {
      isHideAllPrices.value = CLOSE
      quoteData.value.isHideAllPrices = CLOSE
    }
  }

  const moreOptions = computed(() => {
    let kp = []
    if (isHideKpPrice.value) kp = [{ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' }]
    else kp = [{ label: t('hide_price_in_proposal'), emitName: 'hideItemPrice' }]

    let bos = []
    if (isHideBosPrice.value) bos = [{ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' }]
    else bos = [{ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' }]

    let ac = []
    if (isHideAcPrice.value) ac = [{ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' }]
    else ac = [{ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' }]

    let dec = []
    if (isHideDecPrice.value) dec = [{ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' }]
    else dec = [{ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' }]

    return {
      kp, bos, ac, dec,
    }
  })

  // const hideStatusWC = watch(quoteData, (vals) => {
  //   if (!vals.isHideAllPrices) {
  //     [vals.isHideKpPrice, vals.isHideBosPrice, vals.isHideAcPrice, vals.isHideDecPrice]
  //   }
  // })

  // ---------------------------
  // AU 补贴项显隐控制
  // ---------------------------
  const auDecMoreOptions = computed(() => {
    // 产品临时把隐藏项去掉了，逻辑先别删
    const stc = []
    // if (isHideStcItem.value) {
    //   stc.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    //   stc.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideStcPrice.value) stc.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else stc.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    const stcBattery = []
    // if (isHideStcBatteryItem.value) {
    //   stcBattery.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    //   stcBattery.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideStcBatteryPrice.value) stcBattery.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else stcBattery.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    const vic = []
    // if (isHideVicItem.value) {
    //   vic.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    // vic.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideVicPrice.value) vic.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else vic.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    const vicPv = []
    // if (isHideVicPvItem.value) {
    //   vicPv.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    // vicPv.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideVicPvPrice.value) vicPv.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else vicPv.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    const vicBattery = []
    // if (isHideVicBatteryItem.value) {
    //   vicBattery.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    //   vicBattery.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideVicBatteryPrice.value) vicBattery.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else vicBattery.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    const bess1 = []
    // if (isHideBess1Item.value) {
    //   bess1.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    //   bess1.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideBess1Price.value) bess1.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else bess1.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    const bess2 = []
    // if (isHideBess2Item.value) {
    //   bess2.push({ label: t('unhide_item_in_proposal'), emitName: 'unhide-item' })
    // }
    // else {
    // bess2.push({ label: t('hide_item_in_proposal'), emitName: 'hide-item' })
    if (isHideBess2Price.value) bess2.push({ label: t('unhide_price_in_proposal'), emitName: 'unhide-item-price' })
    else bess2.push({ label: t('hide_price_in_proposal'), emitName: 'hide-item-price' })
    // }

    return { stc, stcBattery, vic, vicPv, vicBattery, bess1, bess2 }
  })

  const isHideStcItem = ref<SwitchStatus>(0)
  const isHideStcPrice = ref<SwitchStatus>(0)
  const isHideStcBatteryItem = ref<SwitchStatus>(0)
  const isHideStcBatteryPrice = ref<SwitchStatus>(0)
  const isHideBess1Item = ref<SwitchStatus>(0)
  const isHideBess1Price = ref<SwitchStatus>(0)
  const isHideBess2Item = ref<SwitchStatus>(0)
  const isHideBess2Price = ref<SwitchStatus>(0)
  const isHideVicItem = ref<SwitchStatus>(0)
  const isHideVicPrice = ref<SwitchStatus>(0)
  const isHideVicPvItem = ref<SwitchStatus>(0)
  const isHideVicPvPrice = ref<SwitchStatus>(0)
  const isHideVicBatteryItem = ref<SwitchStatus>(0)
  const isHideVicBatteryPrice = ref<SwitchStatus>(0)

  const hideControlsData = computed(() => ({
    isHideAllPrices: isHideAllPrices.value,
    isHideKpPrice: isHideKpPrice.value,
    isHideBosPrice: isHideBosPrice.value,
    isHideAcPrice: isHideAcPrice.value,
    isHideDecPrice: isHideDecPrice.value,
  }))

  const setQuotaDataField = <K extends keyof ProjectQuoteDTO>(field: K, value: ProjectQuoteDTO[K]) => {
    if (quoteData.value) {
      quoteData.value = {
        ...quoteData.value,
        [field]: value,
      }
    }
  }

  const currentTabDisplayWrap = ref<QuoteTabWrap>('QuotePricing')
  const quoteTabOptions = [
    {
      label: t('pricing'),
      value: 'QuotePricing',
      icon: 'ri-list-indefinite',
      iconClass: 'text-blue',
    },
    {
      label: t('p_and_f_title'),
      value: 'QuotePayment',
      icon: 'gs-basic:radio-payment',
      tag: h('span', {
        style: {
          display: 'inline-flex',
          color: '#FF3434',
          fontSize: '10px',
          backgroundColor: '#ffebeb',
          borderRadius: '3px',
          padding: '2px 4px',
          marginLeft: '4px',
        },
      }, 'NEW'),
    },
    {
      label: t('invoice_basics'),
      value: 'QuoteInvoice',
      icon: 'gs-basic:radio-invoice',
    },
  ]
  const QuotePaymentRef = ref<InstanceType<typeof QuotePayment>>()
  const QuoteInvoiceRef = ref<InstanceType<typeof QuoteInvoice>>()
  const setQuoteTabOptionValue = (optionValue: QuoteTabWrap) => currentTabDisplayWrap.value = optionValue

  const priceTemplateMode = ref<PriceTemplateMode>('standard')
  const setPriceTemplateMode = (mode: PriceTemplateMode) => {
    priceTemplateMode.value = mode
    quoteData.value.priceTemplate = mode
  }
  const isMarginMode = computed(() => priceTemplateMode.value === 'margin_based')
  const isStandardMode = computed(() => priceTemplateMode.value === 'standard')
  const designQuoteOptions = computed(() => [
    { label: t('standard_pricing'), value: 'standard' },
    { label: t('margin_based_pricing'), value: 'margin_based' },
  ])

  // -------------------- 添加主商品项逻辑
  const isAddingKpItem = ref<boolean>(false)
  const setAddingItemStatus = (status: boolean) => isAddingKpItem.value = status

  const isDeviceModalVisible = ref<boolean>(false)
  const setDeviceModalVisible = (status: boolean) => isDeviceModalVisible.value = status

  const isFetchingApi = ref<boolean>(false)
  const setFetchingStatus = (status: boolean) => isFetchingApi.value = status
  async function fetchQuoteInfo(
    projectDesignId: number,
    beforeCallback?: () => void,
    afterCallback?: () => void,
  ) {
    if (beforeCallback) beforeCallback()

    try {
      const validFormatData = (data: ProjectQuoteDTO) => {
        const resultData = Object.assign({}, data)
        resultData.priceTemplate = hasPermission('Quote.QuoteTemplate:view')
          ? (data.priceTemplate ?? 'standard')
          : 'standard'
        resultData.decInfos = {
          deductions: data?.decInfos?.deductions ?? [],
          defaultDeductions: {
            country: data?.decInfos?.defaultDeductions?.country || '',
            deduction: data?.decInfos?.defaultDeductions?.deduction || '{}',
            taxPrice: data.decInfos?.taxPrice ?? null,
            totalPrice: data.decInfos?.totalPrice ?? null,
          },
          totalPrice: data.decInfos?.totalPrice ?? null,
        }
        resultData.taxRate = data.taxRate ?? 0.1
        resultData.depositAmount = data.depositAmount
        resultData.depositDesc = data.depositDesc ?? t('p_balance_info')
        resultData.depositSwitch = data.depositSwitch ?? 0
        resultData.depositType = data.depositType

        let ratio = data.depositRatio as number
        if (ratio < 1) ratio = $number(ratio).multiply(100).value
        if (ratio > 100) ratio = $number(ratio).divide(100).value
        resultData.depositRatio = ratio
        resultData.depositUpdateFlag = data.depositUpdateFlag ?? 0
        resultData.newDataFlag = data.newDataFlag ?? 1
        resultData.discountSwitch = data.discountSwitch ?? 0
        resultData.discountType = data.discountType ?? 1
        resultData.discountAmount = data.discountAmount ?? null
        resultData.discountRatio = data.discountRatio ?? null

        resultData.isHideAllPrices = data.isHideAllPrices ?? null
        resultData.isHideKpPrice = data.isHideKpPrice ?? 0
        resultData.isHideBosPrice = data.isHideBosPrice ?? 0
        resultData.isHideAcPrice = data.isHideAcPrice ?? 0
        resultData.isHideDecPrice = data.isHideDecPrice ?? 0
        // 兼容从 settings 来的数据，默认刷为隐藏
        resultData.carInfos = data.carInfos
        resultData.bosInfos = data.bosInfos.map(v => ({
          ...v,
          isHidePrice: v.isHidePrice === null
            ? 1
            : v.isHidePrice
              ? 1
              : 0,
        }))
        resultData.acInfos = data.acInfos.map(v => ({
          ...v,
          ...v,
          isHidePrice: v.isHidePrice === null
            ? 1
            : v.isHidePrice
              ? 1
              : 0,
        }))

        return resultData
      }

      const resData = (await getQuoteInfo(projectDesignId)) as ProjectQuoteDTO
      // console.log('🚀 ~ :355 ~ fetchQuoteInfo ~ 接口直接返:', resData)
      if (!resData) throw new Error('quote info is empty')
      const handledResData = validFormatData(resData)
      // console.log('🚀 ~fetchQuoteInfo >>>  经过处理后的 data:', handledResData)

      quoteData.value = handledResData
      return handledResData
    }
    catch (err: unknown) {
      console.error('fetchQuoteInfo', err)
      throw err
    }
    finally {
      if (afterCallback) afterCallback()
      setFetchingStatus(false)
    }
  }

  const isUpdating = ref<boolean>(false)
  const setUpdatingStatus = (status: boolean) => isUpdating.value = status
  /**
   * 更新非价格信息：quote 模版 payment invoice 相关字段等
   * @param quoteData 转成 -> 后端要的 baseInfoBody
   * @returns
   */
  async function updateQuoteBaseInfo(quoteData: ProjectQuoteDTO) {
    try {
      const baseInfoBody = _transformQuoteDataToBaseInfo(quoteData)
      const isUpdatedBaseInfo = await updateQuoteInfoApi(baseInfoBody)
      console.log('🚀 ~ isUpdatedBaseInfo:', isUpdatedBaseInfo)
    }
    catch (err) {
      console.error('updateQuoteInfoApi', err)
      $notify.error(err as string)
    }
    finally {
      setFetchingStatus(false)
      setQuoteSyncStatus(false)
    }
  }

  /**
   * 更新价格信息：
   * @param quoteData 转成 -> 后端要的 priceInfoBody
   * @returns
   */
  async function updateQuotePriceInfo(quoteData: ProjectQuoteDTO, billInfo: BillInfo, finalGroup: FinalOriginData) {
    try {
      setUpdatingStatus(true)
      // 1. 先处理数据成接口要的格式
      const priceInfoBody = await _transformQuoteDataToPriceInfo(quoteData, billInfo, finalGroup)
      console.log('🚀 updateQuotePriceInfo >>> priceInfoBody:', priceInfoBody)
      // 2. 调用 PUT接口
      // 3. 返回值是同步的计算回本周期 需回填到页面
      const resData = await updateQuoteInfoApi(priceInfoBody) as ProjectQuoteDTO
      // 目前实时回填，后端说这个同步计算很快，暂不做优化
      // console.log('🚀 ~ syncReturnData:', resData)
      // 4. 同步设置 updatedSyncData
      setCalculatedInfos(resData)
    }
    catch (err) {
      $notify.error(t('updated_failed'))
      console.error(err)
    }
    finally {
      setUpdatingStatus(false)
      setQuoteSyncStatus(false)
    }
  }

  const greendealPriceInfo = ref<GreenDealPrices>({
    live_stc_price: 38,
    prc_price: 1.5,
    stc_battery_price: 38,
  })
  const setGreenDealPrices = (resData: GreenDealPrices) => greendealPriceInfo.value = resData
  async function queryPriceFromGreenDeal() {
    try {
      const gdPriceInfo = await queryPriceFromGreenDealApi() as GreenDealPrices
      // console.log('🚀 ~ gdPriceInfo:', gdPriceInfo)
      setGreenDealPrices(gdPriceInfo)
      return gdPriceInfo
    }
    catch (err) {
      console.error('fetchAPI >>> queryPriceFromGreenDeal', err)
    }
  }

  async function initialQuoteData(projectId: number, projectDesignId: number) {
    try {
      const response = await Promise.allSettled([
        getProjectPaymentInfo(projectId),
        getCustomize('' + projectId),
        fetchQuoteInfo(projectDesignId),
      ])
      const allOk = response.every(result => result.status === 'fulfilled')
      if (!allOk) throw new Error('Failed to fetch quote info')
      console.log('初始化quote数据', allOk, response[2]?.value)
      // return response?.[1].status === 'fulfilled' && response?.[1].value as ProjectQuoteDTO
      return {
        payment: response?.[0].status === 'fulfilled' && response?.[0].value,
        customize: response?.[1].status === 'fulfilled' && response?.[1].value,
        quote: response?.[2].status === 'fulfilled' && response?.[2].value,
      }
    }
    catch (err) {
      console.error('init Page Data Error', err)
    }
    finally {
      setFetchingStatus(false)
    }
  }

  async function resetFinalPrice() {
    console.log('🚀 ~ resetFinalPrice:')
  }

  function _transformQuoteDataToBaseInfo(quoteData: ProjectQuoteDTO) {
    const {
      id, projectId, projectDesignId, companyId,
      priceTemplate,
      quoteNumber,
      postalAddress,
      paymentInfoSwitch,
      // deposit
      depositSwitch, depositDesc, depositAmount, depositRatio, depositUpdateFlag, remainingBalance, depositType,
    } = quoteData

    const transRatio = isNumber(depositRatio) && depositRatio >= 1
      ? $number(depositRatio, { precision: 4 }).divide(100).value
      : depositRatio
    return {
      id, projectId, projectDesignId, companyId,
      priceTemplate,
      depositSwitch,
      depositDesc,
      depositAmount,
      depositRatio: transRatio,
      remainingBalance,
      depositType,
      quoteNumber,
      postalAddress,
      paymentInfoSwitch,
      depositUpdateFlag,
    }
  }

  function _transformQuoteDataToPriceInfo(quoteData: ProjectQuoteDTO, billInfo: BillInfo, finalGroup: FinalOriginData) {
    const {
      id,
      projectId,
      projectDesignId,
      companyId,
      // discount
      discountSwitch, discountType, discountAmount, discountRatio,
      isHideAllPrices, isHideKpPrice, isHideBosPrice, isHideAcPrice, isHideDecPrice,
    } = quoteData
    const { fixedPriceFlag } = finalGroup as { fixedPriceFlag: number & SwitchStatus } & FinalOriginData
    // console.log('初始 priceInfo ', quoteData, billInfo, finalGroup)
    let convertDecimalMargin: number | null = null
    if (fixedPriceFlag === 1) {
      if (isNumber(finalGroup.grossMargin)) {
        convertDecimalMargin = CalcInst.percentToDecimal(finalGroup.grossMargin)
      }
    }
    else {
      if (isNumber(billInfo.grossMargin)) {
        convertDecimalMargin = CalcInst.percentToDecimal(billInfo.grossMargin)
      }
    }

    const body = {
      id,
      projectId,
      projectDesignId,
      companyId,
      fixedPriceFlag: fixedPriceFlag === 0 ? 0 : 1,
      kpPrice: fixedPriceFlag ? billInfo.fixedKpPrice : billInfo.kpPrice,
      acPrice: billInfo.acPrice,
      bosPrice: billInfo.bosPrice,
      systemTotalPrice: fixedPriceFlag ? billInfo.fixedSystemPrice : billInfo.systemTotal,
      totalCost: fixedPriceFlag ? finalGroup.totalCost : billInfo.totalCost,
      grossMargin: convertDecimalMargin,
      grossProfit: fixedPriceFlag ? finalGroup?.grossProfit : billInfo.grossProfit,
      finalPrice: fixedPriceFlag ? finalGroup.finalPrice : billInfo.finalPrice,
      remainingBalance: depositForm.value.remainingBalance,
      carInfos: _mapListMarginValueToDigits(quoteData.carInfos),
      bosInfos: _mapListMarginValueToDigits(quoteData.bosInfos),
      acInfos: _mapListMarginValueToDigits(quoteData.acInfos),
      decInfos: {
        taxPrice: billInfo.customDeductionRate, // 表示整个 custom + fixed 的补贴 算出来的税
        totalPrice: billInfo.customDeductionPriceInclRate, // 表示整个 custom + fixed 的总价 （传还是按正数传，计算为负）
        deductions: quoteData.deductions ?? [],
        defaultDeductions: quoteData.defaultDeductions ?? {},
        // defaultDeductions: {
        //   "country": "AU",
        //   "deduction": "{\"stcSwitch\":1,\"isHideStcPrice\":1,\"isHideStcItem\":0,\"stcGstType\":\"gst_free\",\"stcQuantity\":44,\"stcUnitPrice\":38.6,\"stcTotalPrice\":1698.4,\"supportStc\":1,\"installationYear\":2026,\"stcBatterySwitch\":1,\"isHideStcBatteryPrice\":1,\"isHideStcBatteryItem\":0,\"stcBatteryGstType\":\"gst_free\",\"stcBatteryQuantity\":152,\"stcBatteryUnitPrice\":39.09,\"stcBatteryTotalPrice\":5941.68,\"supportStcBattery\":1,\"bess1Switch\":0,\"isHideBess1Price\":0,\"isHideBess1Item\":0,\"bess1GstType\":\"gst_free\",\"supportBess1\":1,\"bess2Switch\":1,\"isHideBess2Price\":0,\"isHideBess2Item\":0,\"bess2GstType\":\"gst_free\",\"bess2Quantity\":221,\"bess2UnitPrice\":15.0814,\"bess2TotalPrice\":3333,\"supportBess2\":1,\"vicSwitch\":0,\"isHideVicPrice\":0,\"isHideVicItem\":0,\"vicGstType\":\"gst_free\",\"vicTotalPrice\":1400,\"supportVic\":1,\"vicPvSwitch\":0,\"isHideVicPvPrice\":0,\"isHideVicPvItem\":0,\"vicPvGstType\":\"gst_free\",\"vicPvTotalPrice\":1400,\"supportVicPv\":1,\"vicBatterySwitch\":0,\"isHideVicBatteryPrice\":0,\"isHideVicBatteryItem\":0,\"vicBatteryGstType\":\"gst_free\",\"supportVicBattery\":1,\"type\":\"bess2\",\"trigger\":\"totalPrice\",\"triggerValue\":3333}",
        //   "taxPrice": 0,
        //   "totalPrice": 11695.08
        // }
      },
      // discount
      discountSwitch,
      discountType,
      discountAmount,
      discountRatio: isNumber(discountRatio) ? $number(discountRatio as number, { precision: 4 }).divide(100).value : null,
      // GS-2182 显隐相关字段
      isHideAllPrices,
      isHideKpPrice,
      isHideBosPrice,
      isHideAcPrice,
      isHideDecPrice,
    }

    return body
  }

  function _mapListMarginValueToDigits(list: Record<'margin', number | null>[]) {
    return list.map((item) => {
      return {
        ...item,
        margin: item.margin === null || item.margin === 0
          ? null
          : CalcInst.percentToDecimal(item.margin),
      }
    })
  }

  // --------------------- 回本周期计算 ---------------------
  const calculatedKeyInfo = ref<Partial<Record<CalculatedKeys, number | null>>>({
    newStorageAdded: null,
    savedBillOf20year: null,
    paybackPeriod: null,
    systemSize: null,
    annualGeneratePower: null,
    batteryCapacity: null,
    annualVppIncome: null,
    vppOpenFlag: 0,
    annualBillSavings: null,
  })
  const setCalculatedKey = (key: CalculatedKeys, value: number | null) => calculatedKeyInfo.value[key] = value

  const setCalculatedInfos = (resData: ProjectQuoteDTO) => {
    setCalculatedKey('batteryCapacity', resData.batteryCapacity)
    setCalculatedKey('annualGeneratePower', resData.annualGeneratePower)
    setCalculatedKey('newStorageAdded', resData?.newStorageAdded as number)
    setCalculatedKey('paybackPeriod', resData.paybackPeriod)
    setCalculatedKey('savedBillOf20year', resData.savedBillOf20year)
    setCalculatedKey('systemSize', resData.systemSize)
    setCalculatedKey('annualVppIncome', resData.annualVppIncome)
    setCalculatedKey('vppOpenFlag', resData.vppOpenFlag)
    setCalculatedKey('annualBillSavings', resData.annualBillSavings)
  }

  // --------------------- Deposit ---------------------
  const DepositActionRef = ref<InstanceType<typeof DepositAction>>()
  const depositForm = ref<DepositForm>({
    isDepositLoading: false,
    depositSwitch: 0,
    depositType: 1,
    depositDesc: '',
    depositAmount: null,
    depositRatio: null,
    remainingBalance: null,
    depositUpdateFlag: 0,
  })
  const setDepositForm = (formData: DepositForm) => depositForm.value = formData

  async function confirmDepositDialog(evt: ConfirmDepositEmits) {
    try {
      depositForm.value.isDepositLoading = true
      // console.log('🚀 ~ onConfirmDeposit:', evt)
      const _prepareDepositRequestBody = (evt: ConfirmDepositEmits) => {
        const baseBody: DepositRequestBody = {
          depositSwitch: evt.deposit_switch ? 1 : 0,
          depositDesc: evt.deposit_desc,
          depositAmount: evt.deposit_amount,
          depositType: evt.deposit_by === 'amount' ? 1 : 2,
          depositRatio: evt.deposit_percentage,
          depositUpdateFlag: evt.sync_deposit ?? 0,
          remainingBalance: evt.remaining_balance,
        }

        if (!evt.deposit_switch) return baseBody
        if (evt.deposit_by === 'amount') {
          return {
            ...baseBody,
            depositType: 1,
            depositAmount: evt.deposit_amount,
            depositUpdateFlag: evt.sync_deposit,
          }
        }
        if (evt.deposit_by === 'percentage') {
          return {
            ...baseBody,
            depositType: 2,
            depositRatio: evt.deposit_percentage,
            depositUpdateFlag: evt.sync_deposit,
          }
        }
        return baseBody
      }
      const depositBody = _prepareDepositRequestBody(evt)
      console.log('hooks 内部', evt, depositBody)
      await updateQuoteBaseInfo(({
        ...quoteData.value,
        ...depositBody,
      }) as ProjectQuoteDTO)

      depositForm.value.depositAmount = evt.deposit_amount
      depositForm.value.depositDesc = evt.deposit_desc
      depositForm.value.depositType = evt.deposit_by === 'amount' ? 1 : 2
      depositForm.value.depositSwitch = evt.deposit_switch ? 1 : 0
      let ratio = evt.deposit_percentage as number
      if (ratio < 1) ratio = $number(ratio).multiply(100).value
      else if (ratio > 100) ratio = $number(ratio).multiply(100).value
      depositForm.value.depositRatio = ratio
      depositForm.value.depositUpdateFlag = evt.sync_deposit
      depositForm.value.remainingBalance = evt.remaining_balance

      if (evt.sync_deposit === 1) {
        const gsUser = JSON.parse(localStorage.getItem('gs_user') as string) ?? {}
        const companyId = gsUser?.userInfo?.oswCompanyInfo?.id
        const countryCode = gsUser?.userInfo?.oswCompanyInfo?.countryCode
        syncSettingDeposit({
          id: null,
          companyId,
          countryCode,
          depositSwitch: evt.deposit_switch,
          depositType: evt.deposit_by === 'amount' ? 1 : 2,
          depositAmount: evt.deposit_amount ?? 0,
          depositRatio: ratio ?? 0,
          depositDesc: evt.deposit_desc,
        })
      }
      await DepositActionRef.value?.closeDeposit()
      return true
    }
    catch (err) {
      console.error('Deposit confirmation failed:', err)
      $notify.error(t('updated_failed'))
    }
    finally {
      depositForm.value.isDepositLoading = false
      setQuoteSyncStatus(false)
    }
  }

  // --------------------- Payment ---------------------
  const isPaymentLoading = ref(false)
  const setPaymentLoading = (status: boolean) => isPaymentLoading.value = status

  const paymentInfo = ref<ProjectPaymentDTO>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    bsbNumber: '',
    bicSwiftCode: '',
    currency: '',
    displayStatus: 0,
    iban: '',
    payId: '',
    syncFlag: 0,
    routingNumber: '',
    accountType: 'checking',
  })

  async function getProjectPaymentInfo(projectId: number) {
    setPaymentLoading(true)
    try {
      const paymentResData = await getProjectPaymentInfoApi(projectId)
      paymentInfo.value = paymentResData as ProjectPaymentDTO
      return true
    }
    catch (err: unknown) {
      console.error('fetchQuotePaymentInfo call error', err)
      throw err
    }
    finally {
      setPaymentLoading(false)
    }
  }

  // --------------------- Invoice ---------------------
  const quoteNumber = ref<string>('')
  const setQuoteNumber = (value: string) => quoteNumber.value = value

  async function changeQuoteNumber(evt: string) {
    try {
      setQuoteNumber(evt)
      const isUpdated = await updateQuoteBaseInfo(({
        ...quoteData.value,
        quoteNumber: evt,
      }) as ProjectQuoteDTO)
      console.log('🚀 ~ changeQuoteNumber >>', isUpdated)
      return isUpdated
    }
    catch (err) {
      $notify.error(t('updated_failed'))
      console.error('changeQuoteNumber', err)
      throw err
    }
  }

  const postalAddress = ref<string>('')
  const setPostalAddress = (value: string) => postalAddress.value = value

  async function changePostalAddress(evt: string) {
    try {
      setPostalAddress(evt)
      const isUpdated = await updateQuoteBaseInfo(({
        ...quoteData.value,
        postalAddress: evt,
      }) as ProjectQuoteDTO)
      return isUpdated
    }
    catch (err) {
      $notify.error(t('updated_failed'))
      console.error('changePostalAddress', err)
      throw err
    }
  }

  return {
    // base
    currentTabDisplayWrap, quoteTabOptions, setQuoteTabOptionValue,
    priceTemplateMode, setPriceTemplateMode, isMarginMode, isStandardMode,
    QuotePaymentRef, QuoteInvoiceRef,
    designQuoteOptions,
    depositForm, setDepositForm, DepositActionRef,
    // price
    quoteData, setQuotaDataField,
    isAddingKpItem, setAddingItemStatus,
    isDeviceModalVisible, setDeviceModalVisible,
    // deposit
    confirmDepositDialog,
    isFetchingApi, setFetchingStatus, fetchQuoteInfo,
    // update
    isUpdating, setUpdatingStatus, updateQuoteBaseInfo, updateQuotePriceInfo,
    calculatedKeyInfo, setCalculatedKey, setCalculatedInfos,
    initialQuoteData, resetFinalPrice,
    greendealPriceInfo, setGreenDealPrices, queryPriceFromGreenDeal,
    // payment & invoice
    paymentInfo, getProjectPaymentInfo,
    quoteNumber, setQuoteNumber, changeQuoteNumber,
    postalAddress, setPostalAddress, changePostalAddress,
    moreOptions, auDecMoreOptions,
    hideControlsData,

    // 控制价格显隐
    isHideAllPrices, hideAllPrices, unhideAllPrices, onlyUnhideAllPrice, onlySetAllHide,
    isHideKpPrice, setIsHideKpStatus,
    isHideBosPrice, setIsHideBosStatus,
    isHideAcPrice, setIsHideAcStatus,
    isHideDecPrice, setIsHideDecStatus,

    // AU补贴
    isHideStcItem,
    isHideStcPrice,
    isHideStcBatteryItem,
    isHideStcBatteryPrice,
    isHideBess1Item,
    isHideBess1Price,
    isHideBess2Item,
    isHideBess2Price,
    isHideVicItem,
    isHideVicPrice,
    isHideVicPvItem,
    isHideVicPvPrice,
    isHideVicBatteryItem,
    isHideVicBatteryPrice,
  }
}
