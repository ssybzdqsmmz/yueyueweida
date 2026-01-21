<!--
 * @Date: 2023-03-09 13:29:21
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-13 16:42:45
 * @FilePath: \geoproject2.0\src\views\Login\resource\childrenVue\resourceIntro.vue
-->
<template>
  <div class="main">
    <div class="title">
      <div class="icon" :style="{ '--url': 'url(' + props.title.iconurl + ')' }"></div>
      <div class="title_content">
        <span class="title_name">{{ props.title.name }}</span>
        <span class="title_intro">{{ props.title.intro }}</span>
      </div>
    </div>
    <div class="content">
      <div class="btn_content">
        <label
          v-for="(item, index) in props.btn"
          :key="index"
          :for="props.title.name + '_ck_' + index"
          class="btn"
          :class="activeIndex == index ? 'active' : ''"
          @click="changeIntro(index)"
        >
          <p>{{ item }}</p>
        </label>
      </div>
      <div class="intro">
        <input
          v-for="(item, index) in props.btn"
          :id="props.title.name + '_ck_' + index.toString()"
          :key="index"
          :class="'ck_' + index.toString()"
          type="radio"
          name="tab"
          :checked="index == 0 ? true : false"
        />
        <div class="intro_content">
          <div class="single_intro">
            {{ props.intro.firstIntro }}
          </div>
          <div class="single_intro">
            {{ `系统安装包下载：当前最新版本（18.14.0），发布时间（2023年02月11日）优化了部分体验问题，提升版本稳定性。` }}
            <div class="download">
              <div v-for="(item, index) in props.intro.secondIntro" :key="index" class="download_cell">
                <div>{{ item.name }}</div>
                <div v-if="item.link.length == 2" class="link">
                  <div>
                    <a :href="item.link[0].url">{{ item.link[0].name }}</a>
                  </div>
                  <div>
                    <a :href="item.link[1].url">{{ item.link[1].name }}</a>
                  </div>
                </div>
                <div v-else class="link">
                  <div>
                    <a :href="item.link[0].url">{{ item.link[0].name }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="single_intro">
            <div class="left_intro">{{ props.intro.thirdIntro }}<a class="a_btn" href="">具体安装视频—></a></div>
            <div class="right_image"></div>
          </div>
          <div class="single_intro">
            {{ `系统手册:` }}
            <div class="handbook">
              <div v-for="(item, index) in props.intro.fourthIntro" :key="index" class="handbook_child">
                <img :src="item.imgurl" />
                <span>{{ item.title }}</span>
                <p>{{ item.intro }}</p>
                <a class="a_btn" :href="item.href">{{ item.hrefname }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 定义属性接口类型
interface Props {
  title: {
    name?: string;
    intro?: string;
    iconurl?: string;
  };
  btn: Array<string>;
  intro: {
    firstIntro?: string;
    secondIntro?: Array<{ name: string; link: Array<{ name: string; url: string }> }>;
    thirdIntro?: string;
    fourthIntro?: Array<{ imgurl: string; title: string; intro: string; href: string; hrefname: string }>;
  };
}

const props = withDefaults(defineProps<Props>(), {
  title: () => {
    return {
      name: 'DTBuilder',
      intro: '——提供处理多源数据的工具集——软件',
      iconurl: 'src/assets/images/首页-资源/u365.png',
    };
  },
  btn: () => ['软件配置需求', '系统安装包下载', '系统安装说明', '用户使用手册'],
  intro: () => {
    return {
      firstIntro: `机器配置建议如下：用户实际工作平台，需采用中档以上配置的硬件设备。\n      ① 处理器采用Intel 2.80GHz或以上；\n      ② 内存8GB 或以上；\n      ③ 独立显卡1GB或以上。\n软件需求：\n      客户端软件配置建议PC机客户端选用Microsoft Windows 7/ 8/ 10/等操作系统。`,
      secondIntro: [
        {
          name: 'Windows Installer(.msi)',
          link: [
            { name: '32-bit', url: '' },
            { name: '64-bit', url: '' },
          ],
        },
        {
          name: 'Windows Binary (.zip)',
          link: [
            { name: '32-bit', url: '' },
            { name: '64-bit', url: '' },
          ],
        },
        { name: 'macOS Installer (.pkg)', link: [{ name: '64-bit/ARM64', url: '' }] },
        {
          name: 'macOS Binary (.tar.gz)',
          link: [
            { name: '32-bit', url: '' },
            { name: 'ARM64', url: '' },
          ],
        },
        { name: 'Linux Binaries (x64)', link: [{ name: '64-bit', url: '' }] },
        {
          name: 'Linux Binaries (ARM)',
          link: [
            { name: 'ARMv7', url: '' },
            { name: 'ARM64', url: '' },
          ],
        },
      ],
      thirdIntro: `安装包下载好后，系统安装步骤如下：\n      ① 解压\n      ② 双击压缩包中exe文件\n      ③ 阅读许可协议\n      ④ 明确安装位置\n      ⑤ 输入用户账号密码\n      ⑥ 完成安装`,
      fourthIntro: [
        {
          imgurl: 'src/assets/images/首页-资源/u204.svg',
          title: '数据处理理论：',
          intro: '    您利用的系统直接影响您的工作效率和质量，学习相关理论和参数介绍，能够优化您的操作。',
          href: '',
          hrefname: '具体理论手册—>',
        },
        {
          imgurl: 'src/assets/images/首页-资源/u209.svg',
          title: '数据处理操作步骤：',
          intro: '    您利用的操作直接影响您的工作成果，明确相关处理步骤，能够加快您的操作。',
          href: '',
          hrefname: '具体操作手册—>',
        },
        {
          imgurl: 'src/assets/images/首页-资源/u212.png',
          title: '数据处理操作步骤：',
          intro: '    您利用的系统存在更新可能，更新能够加强系统的处理能力，能够满足您的更多需求。',
          href: '',
          hrefname: '具体更新手册—>',
        },
      ],
    };
  },
});

// const props = withDefaults(defineProps<Props>(), {

let activeIndex = ref(0);
function changeIntro(index) {
  activeIndex.value = index;
}
</script>
<style lang="scss" scoped>
.main {
  width: 1920px;
  height: 710px;

  .title {
    display: flex;
    width: 882px;
    height: 92px;
    margin: 25px;
    background-size: 100% 100%;
    background-image: url('@/assets/images/首页-资源/u362.svg');

    .icon {
      display: inline-block;
      align-self: center;
      width: 75px;
      height: 65px;
      margin-right: 15px;
      margin-left: 15px;

      &::after {
        display: block;
        position: relative;
        top: -50.5px;
        left: 19px;
        width: 37px;
        height: 36px;
        background-size: cover;
        background-image: var(--url);
        content: '';
      }

      &::before {
        display: block;
        width: 75px;
        height: 65px;
        background-size: 100% 100%;
        background-image: url('@/assets/images/首页-资源/u221.png');
        content: '';
        animation: rotation 2s linear infinite;
      }
    }

    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(-360deg);
      }
    }

    .title_content {
      display: inline-block;
      align-self: center;
      vertical-align: super;

      span {
        display: inline-block;
      }

      .title_name {
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
        font-weight: 700;
        font-size: 33px;
      }

      .title_intro {
        font-family: '微软雅黑';
        font-weight: 400;
        font-size: 30px;
      }
    }
  }

  .content {
    display: grid;
    width: 1820px;
    height: 570px;
    margin-left: 50px;
    grid-template-rows: 80px 490px;

    .btn_content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      height: 80px;
      gap: 10px;

      .btn {
        display: flex;
        margin-right: 60px;
        margin-left: 60px;
        color: rgb(12 178 224 / 49.8%);
        font-size: 25px;
        background-color: rgb(11 47 71 / 86.7%);

        p {
          align-self: center;
          margin: 0 auto;
        }

        &:hover {
          color: rgb(40 126 250);
        }
      }

      .active {
        color: #fff;
        background-color: rgb(21 95 166 / 73.7%);

        &:hover {
          color: #fff;
        }
      }
    }

    .intro {
      border: 40px solid #f2f2f2;
      border-right: 70px solid #f2f2f2;
      border-left: 70px solid #f2f2f2;
      overflow: hidden;
      background-color: #f2f2f2;

      input {
        display: none;
      }

      .intro_content {
        position: relative;
        width: 1680px;
        transition: 0.5s;

        .single_intro {
          width: 100%;
          height: 410px;
          line-height: 50px;
          color: #666666;
          font-family: '微软雅黑';
          font-size: 30px;
          font-weight: 400;
          letter-spacing: 1.5px;
          white-space: pre-wrap;
          font-style: normal;
        }
      }
    }
  }

  .download {
    display: grid;
    height: 320px;
    padding: 10px 50px;
    grid-template-rows: repeat(6, 46px);
    gap: 10px;

    .download_cell {
      display: grid;
      height: 46px;
      grid-template-columns: 1fr 2fr;
      gap: 10px;

      div {
        text-align: center;
      }

      .link {
        display: flex;
        height: 46px;
        justify-content: space-around;

        div {
          display: flex;
          width: 100%;
          margin: 0 10px;
          border: 2px solid rgb(170 170 170 / 100%);
          background-color: rgb(255 255 255 / 100%);

          a {
            align-self: center;
            height: 46px;
            margin: 0 auto;
            color: #666666;
            text-decoration: none;
          }
        }
      }
    }
  }

  .left_intro {
    display: inline-block;
    width: 35%;

    .a_btn {
      left: 150px;
      top: 40px;
    }
  }

  .a_btn {
    display: inline-block;
    position: relative;
    width: 190px;
    height: 40px;
    border-radius: 7px;
    line-height: 40px;
    color: #ffffff;
    font-family: '微软雅黑';
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    text-decoration: none;
    background-color: rgb(82 137 189 / 100%);
    font-style: normal;
  }

  .right_image {
    display: inline-block;
    width: 65%;
    height: 100%;
    vertical-align: top;
    background-size: 100% 100%;
    background-image: url('@/assets/images//首页-资源/u188.jpg');
  }

  .handbook {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    height: 370px;

    .handbook_child {
      img {
        display: block;
        width: 97px;
        height: 97px;
        margin: 0 auto;
      }

      span {
        display: block;
        margin: 0 auto;
        line-height: 50px;
        font-size: 30px;
        font-weight: 400;
        text-align: center;
      }

      p {
        display: block;
        width: 70%;
        margin: 0 auto;
        line-height: 30px;
        font-size: 20px;
        text-align: left;
      }

      .a_btn {
        display: block;
        margin: 40px auto;
      }
    }
  }

  .ck_0:checked ~ .intro_content {
    top: 0;
  }

  .ck_1:checked ~ .intro_content {
    top: -410px;
  }

  .ck_2:checked ~ .intro_content {
    top: -820px;
  }

  .ck_3:checked ~ .intro_content {
    top: -1230px;
  }
}
</style>
