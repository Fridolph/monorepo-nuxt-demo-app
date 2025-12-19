<script setup lang="ts">
const code = ref(`{
    "code": 200,
    "data": {
        "id": 9232,
        "projectId": 6164,
        "projectDesignId": 12129,
        "companyId": 335,
        "companyNumberType": "ABN",
        "taxName": "GST",
        "taxRate": 0.100000,
        "taxPrice": 1142.050000,
        "fixedPriceFlag": 0,
        "kpPrice": 5783.190000,
        "bosPrice": 2952.580000,
        "acPrice": 2684.720000,
        "systemTotalPrice": 12562.540000,
        "totalCost": 506.280000,
        "grossMargin": 91.310000,
        "grossProfit": 5316.500000,
        "finalPrice": 5822.780000,
        "remainingBalance": 3901.260000,
        "depositSwitch": 1,
        "depositType": 2,
        "depositAmount": 887.210000,
        "depositRatio": 33.000000,
        "depositDesc": "test hahah",
        "depositUpdateFlag": 0,
        "paybackPeriod": 3.330000,
        "savedBillOf20year": 31190.560000,
        "paymentInfoSwitch": 1,
        "quoteNumber": "QN202511240",
        "postalAddress": "283 Ison Road, Yarrie Lake NSW 2388, Australia",
        "systemSize": 0.9000,
        "batteryCapacity": 50.8800000000,
        "annualGeneratePower": 1387.242271,
        "calcCompleteFlag": 1,
        "priceTemplate": "margin_based",
        "carInfos": [
            {
                "id": 18891,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "373",
                "productSource": 2,
                "productType": "panel",
                "productName": "PV300-60MMJ",
                "productInfo": "{\"brandLogo\":{\"fileName\":\"logo_d6d6ef221ddccdd09ee2fedb42cc2525.png\",\"originalFilePath\":\"https://assets.solarbrain.com.au/uploads/photo_attachment/photo/261/logo_d6d6ef221ddccdd09ee2fedb42cc2525.png\",\"thumbnailFilePath\":\"https://assets.solarbrain.com.au/uploads/photo_attachment/photo/261/logo_d6d6ef221ddccdd09ee2fedb42cc2525.png\",\"contentType\":1},\"brandName\":\"SolarEdge\",\"brandId\":243,\"productName\":\"PV300-60MMJ\",\"productCode\":\"PV300-60MMJ\",\"oswItemCodeAu\":\"/\",\"oswItemCodeEu\":\"/\",\"productPhotos\":[{\"fileName\":\"SolarEdge_PV300-60MMJ.jpg\",\"originalFilePath\":\"https://file.greensketch.net/images/panels/SolarEdge_PV300-60MMJ.jpg\",\"thumbnailFilePath\":\"https://file.greensketch.net/images/panels/SolarEdge_PV300-60MMJ.jpg\",\"contentType\":1}],\"productWarranty\":\"15\",\"performanceWarranty\":\"25\",\"dataSheets\":[{\"fileName\":\"SolarEdge_PV300-60MMJ.pdf\",\"originalFilePath\":\"https://file.greensketch.net/datasheets/panels/SolarEdge_PV300-60MMJ.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/datasheets/panels/SolarEdge_PV300-60MMJ.pdf\",\"contentType\":1}],\"warrantyDocuments\":[{\"fileName\":\"SolarEdge_PV300-60MMJ.pdf\",\"originalFilePath\":\"https://file.greensketch.net/warranties/panels/SolarEdge_PV300-60MMJ.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/warranties/panels/SolarEdge_PV300-60MMJ.pdf\",\"contentType\":1}],\"extendedPhotos\":{\"front\":\"https://file.greensketch.ai/green-sketch/test/image/47bf9327-9218-4bf9-a146-140d0ed1d2b8.png\"},\"stcMaximumPowerPmax\":300.000000000,\"stcVoltageAtMaximumPowerVmpp\":32.620000000,\"stcShortCircuitCurrentIsc\":9.640000000,\"stcOpenCircuitVoltageVoc\":39.750000000,\"stcCurrentAtMaximumPowerImpp\":9.200000000,\"temperatureCoefficientOfPmax\":-0.004000000,\"temperatureCoefficientOfVoc\":-0.002900000,\"temperatureCoefficientOfIsc\":0.000400000,\"firstYearPowerDegradation\":0E-9,\"subsequentAnnualPowerDegradation\":0.007000000,\"height\":1650.000,\"width\":992.000,\"depth\":40.000,\"weight\":18.000000000,\"frameColor\":\"\",\"stcPanelEfficiency\":0.183000000,\"noctMaximumPowerPmax\":223.300000000,\"noctVoltageAtMaximumPowerVmpp\":30.340000000,\"noctCurrentAtMaximumPowerImpp\":7.360000000,\"noctOpenCircuitVoltageVoc\":37.280000000,\"noctShortCircuitCurrentIsc\":7.780000000,\"connectorType\":\"\"}",
                "quantity": 3,
                "unitCost": 108.230000,
                "unitPrice": 555.030000,
                "margin": 80.500000,
                "lineCost": 324.690000,
                "linePrice": 1665.090000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": 1,
                "isHideItem": null
            },
            {
                "id": 18892,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "23936",
                "productSource": 1,
                "productType": "inverter",
                "productName": "02-3000D-TL",
                "productInfo": "{\"brandLogo\":{\"fileName\":\"Solar+Juice+Pty+Ltd.png\",\"originalFilePath\":\"https://file.greensketch.net/brands/logo/Solar+Juice+Pty+Ltd.png\",\"thumbnailFilePath\":\"https://file.greensketch.net/brands/logo/Solar+Juice+Pty+Ltd.png\",\"contentType\":1},\"brandName\":\"Solar Juice\",\"brandId\":1365,\"productName\":\"02-3000D-TL\",\"productCode\":\"02-3000D-TL\",\"productPhotos\":[{\"fileName\":\"image-not-found.png\",\"originalFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"thumbnailFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"contentType\":1}],\"productWarranty\":\"5\",\"performanceWarranty\":\"\",\"dataSheets\":[{\"fileName\":\"Solar_Juice_02-3000D-TL.pdf\",\"originalFilePath\":\"https://file.greensketch.net/datasheets/inverters/Solar_Juice_02-3000D-TL.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/datasheets/inverters/Solar_Juice_02-3000D-TL.pdf\",\"contentType\":1}],\"certification\":[],\"installationManuals\":[{\"fileName\":\"Solar_Juice_02-3000D-TL.pdf\",\"originalFilePath\":\"https://file.greensketch.net/install_manuals/inverters/Solar_Juice_02-3000D-TL.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/install_manuals/inverters/Solar_Juice_02-3000D-TL.pdf\",\"contentType\":1}],\"warrantyDocuments\":[{\"fileName\":\"Solar_Juice_02-3000D-TL.pdf\",\"originalFilePath\":\"https://file.greensketch.net/warranties/inverters/Solar_Juice_02-3000D-TL.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/warranties/inverters/Solar_Juice_02-3000D-TL.pdf\",\"contentType\":1}],\"maxAcPower\":3000.000000000,\"noOfFeedInPhases\":1,\"noOfMppTrackers\":2,\"maxDcVoltage\":600.000000000,\"minDcVoltageToStartFeedIn\":120.000000000,\"mpptVoltageMin\":90.000000000,\"mpptVoltageMax\":580.000000000,\"nominalAcPower\":3000.000000000,\"maxShortCircuitCurrentPerMppt\":13.200000000,\"type\":\"PV-only Inverter\",\"maxDcPower\":3990.000000000,\"dcInputs\":2,\"maxEfficiency\":0.980000000,\"euroEfficiency\":0.975000000}",
                "quantity": 1,
                "unitCost": 222.000000,
                "unitPrice": 555.000000,
                "margin": 60.000000,
                "lineCost": 222.000000,
                "linePrice": 555.000000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": 1,
                "isHideItem": null
            },
            {
                "id": 19202,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "23280",
                "productSource": 1,
                "productType": "inverter",
                "productName": "02-3600D-TL",
                "productInfo": "{\"brandLogo\":{\"fileName\":\"Solar+Juice+Pty+Ltd.png\",\"originalFilePath\":\"https://file.greensketch.net/brands/logo/Solar+Juice+Pty+Ltd.png\",\"thumbnailFilePath\":\"https://file.greensketch.net/brands/logo/Solar+Juice+Pty+Ltd.png\",\"contentType\":1},\"brandName\":\"Solar Juice\",\"brandId\":1365,\"productName\":\"02-3600D-TL\",\"productCode\":\"02-3600D-TL\",\"productPhotos\":[{\"fileName\":\"image-not-found.png\",\"originalFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"thumbnailFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"contentType\":1}],\"productWarranty\":\"5\",\"performanceWarranty\":\"\",\"dataSheets\":[{\"fileName\":\"Solar_Juice_02-3600D-TL.pdf\",\"originalFilePath\":\"https://file.greensketch.net/datasheets/inverters/Solar_Juice_02-3600D-TL.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/datasheets/inverters/Solar_Juice_02-3600D-TL.pdf\",\"contentType\":1}],\"certification\":[],\"installationManuals\":[{\"fileName\":\"Solar_Juice_02-3600D-TL.pdf\",\"originalFilePath\":\"https://file.greensketch.net/install_manuals/inverters/Solar_Juice_02-3600D-TL.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/install_manuals/inverters/Solar_Juice_02-3600D-TL.pdf\",\"contentType\":1}],\"warrantyDocuments\":[{\"fileName\":\"Solar_Juice_02-3600D-TL.pdf\",\"originalFilePath\":\"https://file.greensketch.net/warranties/inverters/Solar_Juice_02-3600D-TL.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/warranties/inverters/Solar_Juice_02-3600D-TL.pdf\",\"contentType\":1}],\"maxAcPower\":3680.000000000,\"noOfFeedInPhases\":1,\"noOfMppTrackers\":2,\"maxDcVoltage\":600.000000000,\"minDcVoltageToStartFeedIn\":120.000000000,\"mpptVoltageMin\":90.000000000,\"mpptVoltageMax\":580.000000000,\"nominalAcPower\":3680.000000000,\"maxShortCircuitCurrentPerMppt\":13.200000000,\"type\":\"PV-only Inverter\",\"maxDcPower\":4790.000000000,\"dcInputs\":2,\"maxEfficiency\":0.980000000,\"euroEfficiency\":0.975000000}",
                "quantity": 1,
                "unitCost": 261.740000,
                "unitPrice": 974.100000,
                "margin": 73.130000,
                "lineCost": 261.740000,
                "linePrice": 974.100000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": 1,
                "isHideItem": null
            },
            {
                "id": 18893,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "24655",
                "productSource": 1,
                "productType": "battery",
                "productName": "10K PACK LV",
                "productInfo": "{\"brandLogo\":{\"fileName\":\"Soluna.png\",\"originalFilePath\":\"https://file.greensketch.net/brands/logo/Soluna.png\",\"thumbnailFilePath\":\"https://file.greensketch.net/brands/logo/Soluna.png\",\"contentType\":1},\"brandName\":\"Soluna\",\"brandId\":302,\"productName\":\"10K PACK LV\",\"productCode\":\"10K PACK LV\",\"productPhotos\":[{\"fileName\":\"image-not-found.png\",\"originalFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"thumbnailFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"contentType\":1}],\"productWarranty\":\"10\",\"performanceWarranty\":\"\",\"dataSheets\":[{\"fileName\":\"Soluna_10K_PACK_LV.pdf\",\"originalFilePath\":\"https://file.greensketch.net/datasheets/batteries/Soluna_10K_PACK_LV.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/datasheets/batteries/Soluna_10K_PACK_LV.pdf\",\"contentType\":1}],\"certification\":[],\"installationManuals\":[{\"fileName\":\"Soluna_10K_PACK_LV.pdf\",\"originalFilePath\":\"https://file.greensketch.net/install_manuals/batteries/Soluna_10K_PACK_LV.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/install_manuals/batteries/Soluna_10K_PACK_LV.pdf\",\"contentType\":1}],\"warrantyDocuments\":[{\"fileName\":\"Soluna_10K_PACK_LV.pdf\",\"originalFilePath\":\"https://file.greensketch.net/warranties/batteries/Soluna_10K_PACK_LV.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/warranties/batteries/Soluna_10K_PACK_LV.pdf\",\"contentType\":1}],\"nominalEnergy\":10.240000000,\"usableEnergy\":9.200000000,\"depthOfDischarge\":0.900000000,\"roundTripEfficiency\":0.950000000,\"cycleLife\":\"6000\",\"length\":500.000,\"width\":215.000,\"height\":730.000,\"weight\":94.000000000}",
                "quantity": 3,
                "unitCost": 223.110000,
                "unitPrice": 311.000000,
                "margin": 28.260000,
                "lineCost": 669.330000,
                "linePrice": 933.000000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": 1,
                "isHideItem": null
            },
            {
                "id": 19201,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "171093",
                "productSource": 1,
                "productType": "battery",
                "productName": " a-TroniX AX 20,16kWh Solarspeicher-Set",
                "productInfo": "{\"brandLogo\":{},\"brandName\":\"Isola\",\"brandId\":2887,\"productName\":\" a-TroniX AX 20,16kWh Solarspeicher-Set\",\"productCode\":\" a-TroniX AX 20,16kWh Solarspeicher-Set\",\"productPhotos\":[{\"fileName\":\"image-not-found.png\",\"originalFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"thumbnailFilePath\":\"https://file.greensketch.ai/static/images/image-not-found.png\",\"contentType\":1}],\"productWarranty\":\"10\",\"dataSheets\":[],\"certification\":[],\"installationManuals\":[],\"warrantyDocuments\":[],\"extendedPhotos\":{},\"nominalEnergy\":20.160000000,\"usableEnergy\":18.140000000,\"depthOfDischarge\":0.900000000,\"roundTripEfficiency\":0.950000000,\"cycleLife\":\"6000\",\"width\":570.000,\"height\":950.000,\"weight\":229.100000000}",
                "quantity": 1,
                "unitCost": 124.320000,
                "unitPrice": 444.000000,
                "margin": 72.000000,
                "lineCost": 124.320000,
                "linePrice": 444.000000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": 1,
                "isHideItem": null
            },
            {
                "id": 21794,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "27344",
                "productSource": 1,
                "productType": "mounting",
                "productName": "ATL-AD-FL-v2",
                "productInfo": "{\"brandLogo\":{\"fileName\":\"1.png\",\"originalFilePath\":\"https://file.greensketch.ai/master-data/test/supplier/brand/2025/10/17/ba606825-cd03-4849-b717-79ba3fa6a132.webp\",\"thumbnailFilePath\":\"https://file.greensketch.ai/master-data/test/supplier/brand/2025/10/17/thumbnail/ba606825-cd03-4849-b717-79ba3fa6a132.webp\"},\"brandName\":\"Antai\",\"brandId\":326,\"productName\":\"ATL-AD-FL-v2\",\"productCode\":\"ATL-AD-FL-v2\",\"productPhotos\":[{\"fileName\":\"ATL-AD-FL-v2.jpg\",\"originalFilePath\":\"https://file.greensketch.net/images/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.jpg\",\"thumbnailFilePath\":\"https://file.greensketch.net/images/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.jpg\",\"contentType\":1}],\"productWarranty\":\"\",\"performanceWarranty\":\"\",\"dataSheets\":[{\"fileName\":\"ATL-AD-FL-v2.pdf\",\"originalFilePath\":\"https://file.greensketch.net/datasheets/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/datasheets/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.pdf\",\"contentType\":1}],\"certification\":[],\"installationManuals\":[{\"fileName\":\"ATL-AD-FL-v2.pdf\",\"originalFilePath\":\"https://file.greensketch.net/install_manuals/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/install_manuals/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.pdf\",\"contentType\":1}],\"warrantyDocuments\":[{\"fileName\":\"ATL-AD-FL-v2.pdf\",\"originalFilePath\":\"https://file.greensketch.net/warranties/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.pdf\",\"thumbnailFilePath\":\"https://file.greensketch.net/warranties/mountings/abd378b7-e11d-4a7a-89e1-66296df55df4/ATL-AD-FL-v2.pdf\",\"contentType\":1}],\"roofMaterial\":\"\",\"maxBuildingHeight\":0.000,\"railColor\":\"\"}",
                "quantity": 2,
                "unitCost": 55.000000,
                "unitPrice": 323.000000,
                "margin": 82.970000,
                "lineCost": 110.000000,
                "linePrice": 646.000000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": null,
                "isHideItem": null
            },
            {
                "id": 21795,
                "projectId": 6164,
                "projectDesignId": 12129,
                "cartType": "design",
                "productId": "1602",
                "productSource": 1,
                "productType": "mounting",
                "productName": "ATL-DR-417-CAP-EU",
                "productInfo": "{\"brandLogo\":{\"fileName\":\"1.png\",\"originalFilePath\":\"https://file.greensketch.ai/master-data/test/supplier/brand/2025/10/17/ba606825-cd03-4849-b717-79ba3fa6a132.webp\",\"thumbnailFilePath\":\"https://file.greensketch.ai/master-data/test/supplier/brand/2025/10/17/thumbnail/ba606825-cd03-4849-b717-79ba3fa6a132.webp\"},\"brandName\":\"Antai\",\"brandId\":326,\"productName\":\"ATL-DR-417-CAP-EU\",\"productCode\":\"ATL-DR-417-CAP-EU\",\"productPhotos\":[{\"fileName\":\"815bbc6a78346860f4864f20117b720c.png\",\"originalFilePath\":\"https://assets.solarbrain.com.au/uploads/photo_attachment/photo/1545/815bbc6a78346860f4864f20117b720c.png\",\"thumbnailFilePath\":\"https://assets.solarbrain.com.au/uploads/photo_attachment/photo/1545/815bbc6a78346860f4864f20117b720c.png\",\"contentType\":1}],\"dataSheets\":[{\"fileName\":\"EN Datasheet Tile Roof Mounting_15yr.pdf\",\"originalFilePath\":\"https://downloads.osw.energy/nl/downloads/2582/docs/EN Datasheet Tile Roof Mounting_15yr.pdf\",\"contentType\":2}],\"installationManuals\":[{\"fileName\":\"NL Manual Tile Hook Mounting System.pdf\",\"originalFilePath\":\"https://downloads.osw.energy/nl/downloads/2337/docs/NL Manual Tile Hook Mounting System.pdf\",\"contentType\":2}],\"dimensionLength\":32.000,\"dimensionWidth\":15.000,\"dimensionHeight\":50.000}",
                "quantity": 1,
                "unitCost": 308.720000,
                "unitPrice": 566.000000,
                "margin": 45.460000,
                "lineCost": 308.720000,
                "linePrice": 566.000000,
                "sort": null,
                "materialsChangedStatus": 0,
                "visibleValues": null,
                "proposalVisibleValues": null,
                "isHidePrice": null,
                "isHideItem": null
            }
        ],
        "bosInfos": [
            {
                "itemName": "DC Cable Run",
                "unit": "meter",
                "quantity": 1,
                "unitCost": 122,
                "unitPrice": 130,
                "margin": 6.1500,
                "lineCost": 122,
                "linePrice": 130,
                "isHidePrice": null,
                "isHideItem": null
            },
            {
                "itemName": "Online Monitoring Setup (Wi-Fi)",
                "unit": "unit",
                "quantity": 1,
                "unitCost": null,
                "unitPrice": 444,
                "margin": null,
                "lineCost": null,
                "linePrice": 444,
                "isHidePrice": null,
                "isHideItem": null
            },
            {
                "itemName": "AC Cable Run",
                "unit": "meter",
                "quantity": 6,
                "unitCost": 222,
                "unitPrice": 396.43,
                "margin": 44.00,
                "lineCost": 1332,
                "linePrice": 2378.58,
                "isHidePrice": 1,
                "isHideItem": null
            }
        ],
        "acInfos": [
            {
                "itemName": "Delivery Cost",
                "unit": "heat_pump",
                "quantity": 2,
                "unitCost": 150,
                "unitPrice": 267.86,
                "margin": 44.00,
                "lineCost": 300,
                "linePrice": 535.72,
                "isHidePrice": 1,
                "isHideItem": null
            },
            {
                "itemName": "1 Terracotta Roof (Including Tile Grinding)",
                "unit": "job",
                "quantity": 1,
                "unitCost": null,
                "unitPrice": 66,
                "margin": null,
                "lineCost": null,
                "linePrice": 66,
                "isHidePrice": null,
                "isHideItem": null
            },
            {
                "itemName": "2 High Pitch Roof (>_degrees)",
                "unit": "panel",
                "quantity": 3,
                "unitCost": null,
                "unitPrice": 18.33,
                "margin": null,
                "lineCost": null,
                "linePrice": 55,
                "isHidePrice": null,
                "isHideItem": null
            },
            {
                "itemName": "3 Installation Cost",
                "unit": "hour",
                "quantity": 3,
                "unitCost": 100,
                "unitPrice": 676,
                "margin": 85.2100,
                "lineCost": 300,
                "linePrice": 2028,
                "isHidePrice": 1,
                "isHideItem": 0
            }
        ],
        "decInfos": {
            "defaultDeductions": {
                "country": "AU",
                "deduction": "{\"stcSwitch\":1,\"stcGstType\":\"gst_free\",\"stcQuantity\":8,\"stcUnitPrice\":97.125,\"stcTotalPrice\":777,\"supportStc\":1,\"installationYear\":2025,\"stcBatterySwitch\":1,\"stcBatteryGstType\":\"gst_free\",\"stcBatteryQuantity\":425,\"stcBatteryUnitPrice\":0.78,\"stcBatteryTotalPrice\":333,\"supportStcBattery\":1,\"bess1Switch\":0,\"bess1GstType\":\"gst_free\",\"supportBess1\":0,\"bess2Switch\":0,\"bess2GstType\":\"gst_free\",\"bess2Quantity\":334,\"bess2UnitPrice\":1.33,\"bess2TotalPrice\":444,\"supportBess2\":1,\"vicSwitch\":1,\"vicGstType\":\"gst_free\",\"vicTotalPrice\":1400,\"supportVic\":1,\"vicPvSwitch\":1,\"vicPvGstType\":\"gst_free\",\"vicPvTotalPrice\":1400,\"supportVicPv\":1,\"vicBatterySwitch\":0,\"vicBatteryGstType\":\"gst_free\",\"supportVicBattery\":0,\"type\":\"vicPv\",\"trigger\":\"visible\",\"isHideItem\":1,\"isHidePrice\":1,\"isHideStcItem\":0,\"isHideStcPrice\":1,\"isHideVicItem\":0,\"isHideVicPrice\":0,\"isHideStcBatteryItem\":0,\"isHideStcBatteryPrice\":1,\"isHideVicPvItem\":0,\"isHideVicPvPrice\":0,\"triggerValue\":1,\"isHideBess1Price\":0,\"isHideBess2Price\":1,\"isHideVicBatteryPrice\":0,\"isHideBess2Item\":0}",
                "totalPrice": 3910,
                "taxPrice": 0
            },
            "deductions": [
                {
                    "itemName": "11",
                    "gstType": "gst_free",
                    "unitPrice": 11,
                    "linePrice": 11,
                    "taxName": null,
                    "isHidePrice": null,
                    "isHideItem": null
                },
                {
                    "itemName": "33",
                    "gstType": "gst_free",
                    "unitPrice": 33,
                    "linePrice": 33,
                    "taxName": null,
                    "isHidePrice": null,
                    "isHideItem": null
                },
                {
                    "itemName": "22",
                    "gstType": "gst_free",
                    "unitPrice": 22,
                    "linePrice": 22,
                    "taxName": null,
                    "isHidePrice": null,
                    "isHideItem": null
                }
            ],
            "totalPrice": 3976,
            "taxPrice": 0
        },
        "newDataFlag": 1,
        "annualVppIncome": 0.000000,
        "vppOpenFlag": 0,
        "discountSwitch": 1,
        "discountType": 2,
        "discountAmount": 2917.866600,
        "discountRatio": 22.000000,
        "isHideAllPrices": 1,
        "isHideKpPrice": 1,
        "isHideBosPrice": 1,
        "isHideAcPrice": 1,
        "isHideDecPrice": 0
    },
    "msg": "",
    "traceId": "694399663e32d1ad857c6f6828b39322"
}
`)
</script>

<template>
  <section>
    <h1>Demo Page</h1>
    <section class="grid grid-cols-3 gap-4">
      <div>
        <h2>后端 或 用户传入数据</h2>
        <CodeViewer v-model:code="code" />
      </div>
      <div>
        <h2>getters & computed</h2>
        <CodeViewer v-model:code="code" />
      </div>
      <div>
        <h2>最终效果展示</h2>
      </div>
    </section>
  </section>
</template>

<style scoped>

</style>
