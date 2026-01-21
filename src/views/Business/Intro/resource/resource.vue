<!--
 * @Date: 2023-03-08 20:25:51
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-13 16:49:37
 * @FilePath: \geoproject2.0\src\views\Login\resource\resource.vue
-->

<template>
  <div>
    <ul v-infinite-scroll="lazyLoading">
      <li>
        <back-ground>
          <component :is="Desc" />
        </back-ground>
      </li>
      <li>
        <back-ground>
          <component :is="Anchor" :title="anchorProps.title" :btn="anchorProps.btn" @go-anchor="goAnchor" />
        </back-ground>
      </li>
      <li v-if="count > 0">
        <back-ground id="系统安装资源">
          <component :is="ResourceIntro" />
        </back-ground>
      </li>
      <li v-if="count > 1">
        <back-ground>
          <component :is="ResourceIntro" :title="introProps.DTserver.title" />
        </back-ground>
      </li>
      <li v-if="count > 2">
        <back-ground>
          <component :is="ResourceIntro" :title="introProps.DTGlobe.title" />
        </back-ground>
      </li>
      <li v-if="count > 3">
        <back-ground>
          <component :is="ResourceIntro" :title="introProps.App.title" />
        </back-ground>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import BackGround from '../background.vue';
import Desc from './childrenVue/Desc.vue';
import Anchor from '../Anchor.vue';
import ResourceIntro from './childrenVue/resourceIntro.vue';
import { ref } from 'vue';

const anchorProps = {
  title: '平台各系统资源体系',
  btn: {
    left: {
      title: '基础支持资源',
      btn: ['系统安装资源', '系统下载资源', '设备配置需求'],
    },
    right: {
      title: '应用服务资源',
      btn: '用户使用手册',
    },
  },
};

const introProps = {
  DTserver: {
    title: {
      name: 'DTServer',
      intro: '——提供多源数据服务发布与管理——平台',
      iconurl: 'src/assets/images/首页-资源/u318.png',
    },
    btn: ['软件配置需求', '系统安装包下载', '系统安装说明', '用户使用手册'],
    intro: {
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
    },
  },
  DTGlobe: {
    title: {
      name: 'DTGlobe',
      intro: '——海量地理地质信息服务化应用——PC平台',
      iconurl: 'src/assets/images/首页-资源/u270.png',
    },
    btn: ['软件配置需求', '系统安装包下载', '系统安装说明', '用户使用手册'],
    intro: {
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
    },
  },
  App: {
    title: {
      name: 'xxxxxx',
      intro: '——海量地理地质信息服务化应用——移动端平台',
      iconurl: 'src/assets/images/首页-资源/u222.png',
    },
    btn: ['软件配置需求', '系统安装包下载', '系统安装说明', '用户使用手册'],
    intro: {
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
    },
  },
};
//锚点定位
function goAnchor(target) {
  document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
}
//懒加载
const count = ref(0);
const lazyLoading = () => {
  if (count.value < 4) {
    count.value += 1;
  }
};
</script>
