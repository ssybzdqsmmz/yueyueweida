/*
 * @Author: WouRaoyu
 * @Date: 2021-04-24 20:31:09
 * @LastEditors: nsy
 * @LastEditTime: 2021-07-23 17:52:49
 * @Description: file content
 */
import * as Cesium from 'Cesium';

const MenusInfo = {
  场景对比: {
    viewPnt: {
      Orientation: {
        heading: 5.848107619933472,
        pitch: -0.5514402480161209,
        roll: 6.281746510019346,
      },
      Position: {
        longitude: 101.88355063024079,
        latitude: 29.988837146640755,
        height: 3459.566006529713,
      },
    },
    layers: ['DEM', '基础影像', '正洞DSM_0415', '正洞DSM_0106'],
  },
  模型对比: {
    viewPnt: {
      Orientation: {
        heading: 6.029992968018423,
        pitch: -0.5629980472882528,
        roll: 6.282323827722298,
      },
      Position: {
        longitude: 101.8793665209581,
        latitude: 29.991989458836958,
        height: 3284.26532382841,
      },
    },
    layers: ['最新深化BIM模型', '最新施工BIM模型'],
  },
  二次对比: {
    viewPnt: {
      Orientation: {
        heading: 6.029992968018423,
        pitch: -0.5629980472882528,
        roll: 6.282323827722298,
      },
      Position: {
        longitude: 101.8793665209581,
        latitude: 29.991989458836958,
        height: 3284.26532382841,
      },
    },
    layers: ['隧道设计模型', '最新深化BIM模型'],
  },
  点云模型: {
    viewPnt: {
      Orientation: {
        heading: 6.029992967978775,
        pitch: -0.5629980475310217,
        roll: 6.282323827796578,
      },
      Position: {
        longitude: 101.8795825,
        latitude: 29.9917739,
        height: 3299.3788529,
      },
    },
    layers: ['点云数据_隧道进口正洞点云', '正洞二衬数据', '衬砌-拱墙', '衬砌-仰拱(底板)'],
  },
  正洞工区: {
    viewPnt: {
      Orientation: {
        heading: 5.848107619933472,
        pitch: -0.5514402480161209,
        roll: 6.281746510019346,
      },
      Position: {
        longitude: 101.88355063024079,
        latitude: 29.988837146640755,
        height: 3459.566006529713,
      },
    },
    layers: ['DEM', '基础影像', '正洞DSM_0415'],
  },
  斜井工区: {
    viewPnt: {
      Orientation: {
        heading: 4.745275002117658,
        pitch: -0.620412507120101,
        roll: 6.279615185059718,
      },
      Position: {
        longitude: 101.83386921099783,
        latitude: 30.04354120794573,
        height: 4216.301997166297,
      },
    },
    layers: ['DEM', '基础影像', '斜井DSM_0106'],
  },
  横洞工区: {
    viewPnt: {
      Orientation: {
        heading: 4.892427943022785,
        pitch: -0.3486747979722955,
        roll: 6.280145998854772,
      },
      Position: {
        longitude: 101.87238799771075,
        latitude: 29.986263433533246,
        height: 3354.321793899783,
      },
    },
    layers: ['DEM', '基础影像', '正洞DSM_0415'],
  },
  地质情况: {
    viewPnt: {
      Orientation: {
        heading: 0.4871284258863344,
        pitch: -0.5581329051046584,
        roll: 0.0016033188427373446,
      },
      Position: {
        longitude: 101.8015396,
        latitude: 29.9678955,
        height: 6820.4074139,
      },
    },
    layers: ['DEM', '基础影像', '地质文字标注', '地质体_剖面1右部分', '地质体_剖面2右部分'],
  },
  工程简介: {
    layers: ['基础影像', '横洞承担任务', '斜井承担任务', '进口承担任务'],
  },
  孪生地质: {
    viewPnt: {
      Orientation: {
        heading: 0.03873192656740532,
        pitch: -0.06926175566427939,
        roll: 0.00019880165571617425,
      },
      Position: {
        longitude: 101.879307,
        latitude: 29.9920413,
        height: 3237.091421,
      },
    },
    layers: ['基础影像', '隧道掌子面', '隧道设计模型', '大地质模型'],
  },
  大机配套: {
    layers: ['基础影像', '智能机械模型'],
  },
  全景漫游: {
    layers: ['DEM', '基础影像', '正洞DSM_0415'],
  },
  掌子面素描: {},
  动态变更: {
    viewPnt: {
      Orientation: {
        heading: 3.471136480942598,
        pitch: -0.5880413457548661,
        roll: 6.282058179354333,
      },
      Position: {
        longitude: 101.879174,
        latitude: 29.9936741,
        height: 3270.3599236,
      },
    },
    layers: [
      '基础影像',
      '衬砌-拱墙',
      '衬砌-仰拱(底板)',
      '初期支护-喷射混凝土(变更后)',
      '洞口-回填',
      '洞口-坡防护',
      '附属-侧沟槽',
      '附属-侧沟槽_盖板',
      '防排水-洞内管沟',
      '防排水-检查井',
      '防排水-接口防排水',
      '防排水-截水天沟',
      '平导支护结构模型_超前支护_大管棚',
      '平导支护结构模型_超前支护_双层超前小导管_变更后',
      '平导支护结构模型_超前支护_中管棚',
      '平导支护结构模型_初期支护_边墙锚杆a',
      '平导支护结构模型_初期支护_边墙锚杆b',
      '平导支护结构模型_初期支护_钢架_变更后部分',
      '平导支护结构模型_初期支护_拱部锚杆a',
      '平导支护结构模型_初期支护_拱部锚杆b',
      '平导支护结构模型_初期支护_系统锚杆a',
      '平导支护结构模型_初期支护_系统锚杆b',
      '围护-抗滑桩',
      '正洞支护结构模型_初期支护_边墙锚杆a',
      '正洞支护结构模型_初期支护_边墙锚杆b',
      '正洞支护结构模型_初期支护_钢架',
      '正洞支护结构模型_初期支护_拱部锚杆a',
      '正洞支护结构模型_初期支护_拱部锚杆b',
      '正洞支护结构模型_初期支护_系统锚杆a',
      '正洞支护结构模型_初期支护_系统锚杆b',
      '正洞支护结构模型_超前支护_大管棚',
    ],
  },
  追溯查询: {
    viewPnt: {
      Orientation: {
        heading: 6.029992967978775,
        pitch: -0.5629980475310217,
        roll: 6.282323827796578,
      },
      Position: {
        longitude: 101.8795825,
        latitude: 29.9917739,
        height: 3299.3788529,
      },
    },
    layers: [
      '衬砌-拱墙',
      '衬砌-仰拱(底板)',
      '初期支护-喷射混凝土(变更后)',
      '洞口-回填',
      '洞口-坡防护',
      '附属-侧沟槽',
      '附属-侧沟槽_盖板',
      '防排水-洞内管沟',
      '防排水-检查井',
      '防排水-接口防排水',
      '防排水-截水天沟',
      '平导支护结构模型_超前支护_大管棚',
      '平导支护结构模型_超前支护_双层超前小导管_变更后',
      '平导支护结构模型_超前支护_中管棚',
      '平导支护结构模型_初期支护_边墙锚杆a',
      '平导支护结构模型_初期支护_边墙锚杆b',
      '平导支护结构模型_初期支护_钢架_变更后部分',
      '平导支护结构模型_初期支护_拱部锚杆a',
      '平导支护结构模型_初期支护_拱部锚杆b',
      '平导支护结构模型_初期支护_系统锚杆a',
      '平导支护结构模型_初期支护_系统锚杆b',
      '围护-抗滑桩',
      '正洞支护结构模型_初期支护_边墙锚杆a',
      '正洞支护结构模型_初期支护_边墙锚杆b',
      '正洞支护结构模型_初期支护_钢架',
      '正洞支护结构模型_初期支护_拱部锚杆a',
      '正洞支护结构模型_初期支护_拱部锚杆b',
      '正洞支护结构模型_初期支护_系统锚杆a',
      '正洞支护结构模型_初期支护_系统锚杆b',
      '正洞支护结构模型_超前支护_大管棚',
    ],
  },
  工程进展: {
    viewPnt: {
      Orientation: {
        heading: 0.03368275026469547,
        pitch: -1.5500211711986496,
        roll: 0,
      },
      Position: {
        longitude: 101.8245006,
        latitude: 30.0309538,
        height: 4748.1615835,
      },
    },
    layers: ['基础影像', '进度'],
  },
  工程重难点: {
    viewPnt: {
      Position: {
        longitude: 101.8811298,
        latitude: 29.9922013,
        height: 3244.6620135,
      },
      Orientation: {
        heading: 4.984336,
        pitch: -0.01612,
        roll: 6.28038,
      },
    },
    viewPnt_: {
      Orientation: {
        heading: 5.3433139,
        pitch: 0.0610314,
        roll: 6.2807519,
      },
      Position: {
        longitude: 101.8288467,
        latitude: 30.0116352,
        height: 3343.662736,
      },
    },
    layers: ['最新施工BIM模型', '辅助坑道斜井洞门', '隧道设计模型'],
  },
};

const DZInfo = {
  ZDClipLine: [
    101.8780173, 29.9930645, 3267.16, 101.8792882, 29.9937276, 3204.25, 101.8811336, 29.99303, 3210.96, 101.8878452, 29.9929649, 3194.1, 101.887532,
    29.989903, 3199.45, 101.8784218, 29.9908171, 3211.6,
  ],
  DZClipLine: [
    101.778577, 30.0360071, 3556.6, 101.7864728, 30.0321497, 3470.37, 101.7908095, 30.0300559, 3468.31, 101.7944573, 30.0282611, 3455.49, 101.8147485,
    30.0183258, 3385.86, 101.8274632, 30.0121154, 3343.86, 101.8432057, 30.0044189, 3299.06, 101.850831, 30.0006779, 3285.78, 101.8524338, 29.9999358,
    3293.72, 101.85941, 29.9973628, 3283.61, 101.8640209, 29.995663, 3272.32, 101.8682741, 29.9945453, 3254.13, 101.87295, 29.9933564, 3208.95,
    101.8788558, 29.992398, 3177.48,
  ],
  WYDistances: [
    {
      color: Cesium.Color.PURPLE,
      distance: 120,
    },
    {
      color: Cesium.Color.ORANGE,
      distance: 203,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 1349.86,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 400,
    },
    {
      color: Cesium.Color.GREEN,
      distance: 520,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 600,
    },
    {
      color: Cesium.Color.GREEN,
      distance: 860,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 400,
    },
    {
      color: Cesium.Color.GREEN,
      distance: 460,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 50,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 250,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 380,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 300,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 500,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 450,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 220,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 380,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 200,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 600,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 200,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 420,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 300,
    },
    {
      color: Cesium.Color.YELLOW,
      distance: 240,
    },
    {
      color: Cesium.Color.PURPLE,
      distance: 340,
    },
  ],
  BXDistances: [
    {
      color: undefined,
      distance: 1058,
    },
    {
      color: new Cesium.Color(0.015686, 0.015686, 0.8),
      distance: 300,
    },
    {
      color: undefined,
      distance: 3554,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 110,
    },
    {
      color: new Cesium.Color(0.015686, 0.015686, 0.8),
      distance: 100,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 90,
    },
    {
      color: undefined,
      distance: 380,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.015686, 0.015686, 0.8),
      distance: 100,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 100,
    },
    {
      color: undefined,
      distance: 1450,
    },
    {
      color: new Cesium.Color(0.015686, 0.015686, 0.8),
      distance: 200,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 430,
    },
    {
      color: new Cesium.Color(0.015686, 0.015686, 0.8),
      distance: 100,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 50,
    },
    {
      color: undefined,
      distance: 600,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 50,
    },
    {
      color: new Cesium.Color(0.015686, 0.015686, 0.8),
      distance: 100,
    },
    {
      color: new Cesium.Color(0, 0.690196, 0.941176),
      distance: 470,
    },
    {
      color: new Cesium.Color(0, 0.439215, 0.752941),
      distance: 300,
    },
    {
      color: undefined,
      distance: 240,
    },
    {
      color: new Cesium.Color(0, 0.439215, 0.752941),
      distance: 340,
    },
  ],
  YBDistances: [
    {
      color: undefined,
      distance: 2073,
    },
    {
      color: new Cesium.Color(0.917647, 0.341176, 0.023529),
      distance: 520,
    },
    {
      color: undefined,
      distance: 600,
    },
    {
      color: new Cesium.Color(0.741176, 0.117647, 0.011764),
      distance: 860,
    },
    {
      color: undefined,
      distance: 400,
    },
    {
      color: new Cesium.Color(0.741176, 0.117647, 0.011764),
      distance: 460,
    },
    {
      color: undefined,
      distance: 1480,
    },
    {
      color: new Cesium.Color(0.741176, 0.117647, 0.011764),
      distance: 500,
    },
    {
      color: undefined,
      distance: 3350,
    },
  ],
  GDWDistances: [
    {
      color: undefined,
      distance: 858,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.211764, 0.635294, 0.223529),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.109803, 0.345098, 0.152941),
      distance: 300,
    },
    {
      color: new Cesium.Color(0.211764, 0.635294, 0.223529),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: undefined,
      distance: 1435,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 460,
    },
    {
      color: undefined,
      distance: 300,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.211764, 0.635294, 0.223529),
      distance: 800,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 200,
    },
    {
      color: new Cesium.Color(0.211764, 0.635294, 0.223529),
      distance: 1100,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: undefined,
      distance: 480,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.211764, 0.635294, 0.223529),
      distance: 540,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: undefined,
      distance: 100,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 200,
    },
    {
      color: undefined,
      distance: 400,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 220,
    },
    {
      color: undefined,
      distance: 470,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: new Cesium.Color(0.211764, 0.635294, 0.223529),
      distance: 300,
    },
    {
      color: new Cesium.Color(0.529411, 0.82745, 0.62745),
      distance: 100,
    },
    {
      color: undefined,
      distance: 480,
    },
  ],
  WSDistances: [
    {
      color: undefined,
      distance: 7263,
    },
    {
      color: new Cesium.Color(0.905882, 0.035294, 0.035294),
      distance: 2980,
    },
  ],
};

const ProjectInfo = {
  ZDXJRoamPos: [
    {
      ViewPoint: {
        Orientation: {
          heading: 4.89242934754995,
          pitch: -0.2543122430678779,
          roll: 6.280234056838523,
        },
        Position: {
          longitude: 101.88951492361484,
          latitude: 29.99043795168517,
          height: 3297.242653109567,
        },
        Rectangle: {
          west: 1.74051105787635,
          south: 0.5230175950134504,
          east: 1.816103959477605,
          north: 0.5553240405474572,
        },
      },
      duration: 3,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 4.892429360842575,
          pitch: -0.2543122337603314,
          roll: 6.280234004001908,
        },
        Position: {
          longitude: 101.88591293366476,
          latitude: 29.991321264926523,
          height: 3297.5269148003354,
        },
        Rectangle: {
          west: 1.740446171983168,
          south: 0.5230329760495589,
          east: 1.8160431122022815,
          north: 0.5553408032999079,
        },
      },
      duration: 10,
      timeout: 1,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 4.892429378067524,
          pitch: -0.2543122216993574,
          roll: 6.280233935534781,
        },
        Position: {
          longitude: 101.88147101984589,
          latitude: 29.992465955754064,
          height: 3297.8952988333485,
        },
        Rectangle: {
          west: 1.7403660291117684,
          south: 0.5230529084150571,
          east: 1.8159682030312232,
          north: 0.5553625261931269,
        },
      },
      duration: 10,
      timeout: 1,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 3.965457445333115,
          pitch: -0.18488444161346873,
          roll: 6.281018999813153,
        },
        Position: {
          longitude: 101.87899329645855,
          latitude: 29.991395093225147,
          height: 3322.908028529515,
        },
        Rectangle: {
          west: 1.7401775370387436,
          south: 0.522204236691393,
          east: 1.8160702062421228,
          north: 0.5554632127194611,
        },
      },
      duration: 3,
      timeout: 0.5,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 4.78843608985783,
          pitch: -0.39316046222170575,
          roll: 6.280051590232464,
        },
        Position: {
          longitude: 101.87244083095526,
          latitude: 29.98602943499559,
          height: 3418.93657977385,
        },
        Rectangle: {
          west: 1.773218887490976,
          south: 0.5213958856967557,
          east: 1.7772417916074492,
          north: 0.5259735970725006,
        },
      },
      duration: 11,
      timeout: 1,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 5.773579892561627,
          pitch: -0.889646558218212,
          roll: 6.28092957950922,
        },
        Position: {
          longitude: 101.88318160583201,
          latitude: 29.982013459525255,
          height: 4569.709044464136,
        },
        Rectangle: {
          west: 1.7769312753958055,
          south: 0.5233423205581053,
          east: 1.7784603017163747,
          north: 0.524515676651135,
        },
      },
      duration: 6,
      timeout: 1,
    },
  ],
  MachineRoamPos: [
    {
      ViewPoint: {
        Orientation: {
          heading: 0.22478698617227444,
          pitch: -0.3012091892784765,
          roll: 0.0006782257946928993,
        },
        Position: {
          longitude: 101.87574572884749,
          latitude: 29.993078981687457,
          height: 3234.416646859652,
        },
        Rectangle: {
          west: 1.7406379980052666,
          south: 0.5241267038067831,
          east: 1.8154963837806113,
          north: 0.5550681986763231,
        },
      },
      duration: 7,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 0.2247869870499999,
          pitch: -0.3012092016350407,
          roll: 0.0006782228361537079,
        },
        Position: {
          longitude: 101.87687530792688,
          latitude: 29.99286354559601,
          height: 3234.3473137713395,
        },
        Rectangle: {
          west: 1.7406582082801663,
          south: 0.5241229298241568,
          east: 1.8155156032539062,
          north: 0.5550641069539994,
        },
      },
      duration: 26,
    },
    {
      ViewPoint: {
        Orientation: {
          heading: 0.2247869880612603,
          pitch: -0.30120921587150407,
          roll: 0.0006782194275070097,
        },
        Position: {
          longitude: 101.87821878197019,
          latitude: 29.992615336967887,
          height: 3234.2674339729197,
        },
        Rectangle: {
          west: 1.7406822270871134,
          south: 0.524118581739216,
          east: 1.8155384805379,
          north: 0.5550593927883612,
        },
      },
      duration: 30,
    },
  ],
  MainPos: {
    All: [
      101.7908095, 30.0300559, 3468.31, 101.7944573, 30.0282611, 3455.49,
      // 上下为斜井对应的左右
      101.8147485, 30.0183258, 3385.86,

      101.8274632, 30.0121154, 3343.86, 101.8432057, 30.0044189, 3299.06, 101.850831, 30.0006779, 3285.78, 101.8535936, 29.9993112, 3299.5,
      101.8564716, 29.9981588, 3286.93,
      // 上下为横洞对应的左右
      101.8592682, 29.9971042, 3291.97, 101.8635043, 29.9957822, 3270.22,

      // 正洞部分
      101.8683402, 29.9946617, 3260.02, 101.8749146, 29.9935199, 3242.08, 101.8780166, 29.9929851, 3228.76,
    ],
    PartA: [
      101.8567295, 29.9978362, 3303.22, 101.8592682, 29.9971042, 3291.97, 101.8635043, 29.9957822, 3270.22, 101.8683402, 29.9946617, 3260.02,
      101.8749146, 29.9935199, 3242.08, 101.8780166, 29.9929851, 3228.76,
    ],
    PartB: [101.8635043, 29.9957822, 3270.22, 101.8683402, 29.9946617, 3260.02, 101.8749146, 29.9935199, 3242.08, 101.8780166, 29.9929851, 3228.76],
  },
  XJPos: {
    PartA: [
      101.7986655, 30.0261573, 3437.45, 101.7988059, 30.0266456, 3438.98, 101.7990212, 30.02694, 3439.79, 101.7993216, 30.0271464, 3443.26,
      101.7997338, 30.027275, 3447.45, 101.8000784, 30.0272975, 3451.37, 101.8003525, 30.0272422, 3453.91, 101.8013421, 30.0269707, 3463.81,
      101.8017386, 30.0268567, 3464.59, 101.8041088, 30.0262229, 3489.03, 101.8068821, 30.025464, 3514.16, 101.8094504, 30.0247704, 3537.05,
      101.8097607, 30.0247162, 3539.26, 101.8099674, 30.0246945, 3539.31, 101.810382, 30.0246904, 3543.37, 101.8107945, 30.0247296, 3547.29,
      101.8113778, 30.0248798, 3553.28, 101.8117421, 30.025032, 3557.23, 101.8122448, 30.0253372, 3563.18, 101.8126405, 30.0256884, 3565.72,
      101.8137168, 30.0269771, 3582.96, 101.8146278, 30.0281024, 3596.76, 101.8164032, 30.0302963, 3629.12, 101.8176146, 30.0317851, 3649.69,
      101.818192, 30.0324996, 3661.4, 101.8192648, 30.0338158, 3679.7, 101.8200364, 30.0347767, 3695.05, 101.8207615, 30.0356465, 3708.7, 101.8215484,
      30.036625, 3721.42, 101.82246, 30.0377509, 3739.78, 101.8231662, 30.0386222, 3750.71, 101.8237864, 30.0393673, 3762.24, 101.825953, 30.0420439,
      3799.75, 101.8273519, 30.0437719, 3827.48,
    ],
    PartB: [101.7986655, 30.0261573, 3437.45, 101.7944573, 30.0282611, 3455.49, 101.7908095, 30.0300559, 3468.31],
    PartC: [101.7986655, 30.0261573, 3437.45, 101.8147485, 30.0183258, 3385.86, 101.8201965, 30.0156909, 3423.29],
  },
  HDPos: {
    PartA: [101.8567295, 29.9978362, 3303.22, 101.8562429, 29.996707, 3282.77, 101.8565507, 29.9961277, 3284.11, 101.8697461, 29.9864917, 3268.74],
    PartB: [101.8567295, 29.9978362, 3303.22, 101.8592682, 29.9971042, 3291.97, 101.8635043, 29.9957822, 3270.22],
    PartC: [
      101.8567295, 29.9978362, 3303.22, 101.8535936, 29.9993112, 3299.5, 101.850831, 30.0006779, 3285.78, 101.8432057, 30.0044189, 3299.06,
      101.8274632, 30.0121154, 3343.86, 101.8201965, 30.0156909, 3423.29,
    ],
  },
};

export { ProjectInfo, MenusInfo, DZInfo };
