/*
 * @Author: YangYuhan 861896230u@qq.com
 * @Date: 2023-03-04 09:40:31
 * @LastEditors: fuwei 2567873016@qq.com
 * @LastEditTime: 2025-06-04 12:00:00
 * @FilePath: \Geology-v3\src\router\index.ts
 * @Description: 路由
 */

import { createRouter, createWebHashHistory } from 'vue-router';
import WEventBus from '@/views/SceneManagement/Layout/Tools/WEventBus';
import { ElLoading } from 'element-plus';

const eventBus = new WEventBus();
const routerHistory = createWebHashHistory();
const router = createRouter({
	history: routerHistory,
	routes: [
		{
			path: '/',
			redirect: '/entry',
			meta: {
				keepAlive: true,
			},
		},
		{
			path: '/intro',
			component: () => import('@/views/Business/Intro/Index.vue'),
			meta: {
				keepAlive: false,
			},
		},
		{
			path: '/entry',
			component: () => import('@/views/Business/Entry/Entry.vue'),
			meta: {
				keepAlive: false,
			},
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/Business/login/Login.vue'),
			meta: {
				keepAlive: false,
			},
		},
		{
			path: '/home',
			component: () => import('../views/Home.vue'),
			meta: {
				keepAlive: true,
			},
			children: [
				{
					path: '3Dscene',
					name: '3Dscene',
					component: () => import('../views/SceneManagement/3Dscene.vue'),
					meta: {
						keepAlive: true,
					},
					children: [
						{
							path: 'kdtunnel',
							name: 'KDTunnel',
							component: () => import('../views/SceneManagement/KDTunnel/index.vue'),
							meta: {
								keepAlive: true,
							},
						},
						{
							path: 'fullline',
							name: 'FullLine',
							component: () => import('../views/SceneManagement/FullLine/index.vue'),
							meta: {
								keepAlive: true,
							},
						},
						{
							path: 'kdtunnelout',
							name: 'KDTunnelOut',
							component: () => import('../views/SceneManagement/KDTunnelOut/index.vue'),
							meta: {
								keepAlive: true,
							},
						},
						{
							path: 'geologyModel',
							name: 'geologyModel',
							component: () => import('../views/SceneManagement/GeologyModel/index.vue'),
							meta: {
								keepAlive: false,
							},
						},
						{
							path: 'fullLine',
							name: 'fullLine',
							component: () => import('../views/SceneManagement/FullLine/index.vue'),
							meta: {
								keepAlive: false,
							},
						},
						{
							path: 'tunnel',
							name: 'tunnel',
							component: () => import('../views/SceneManagement/TunnelDisaster/index.vue'),
							meta: {
								keepAlive: false,
							},
						},
						{
							path: 'gqgeomodel',
							name: 'Gqgeomodel',
							component: () => import('../views/SceneManagement/EngineerGeoModel/index.vue'),
							meta: {
								keepAlive: false,
							},
						},
						{
							path: 'csfgeomodel',
							name: 'Csfgeomodel',
							component: () => import('../views/SceneManagement/ConstructionSurfaceGeoModel/index.vue'),
							meta: {
								keepAlive: false,
							},
						},
						{
							path: 'application',
							name: 'application',
							component: () => import('../views/SceneManagement/ApplicationSupport/index.vue'),
							meta: {
								keepAlive: false,
							},
						},
					],
				},
				{
					path: 'nodecontrol',
					name: 'NodeController',
					component: () => import('../components/NodeController/NodeController.vue'),
					meta: {
						keepAlive: true,
					},
				},
			],
		},
	],
});

const allowUrls = ['/login', '/register', '/', '/intro'];

router.beforeEach((to, from, next) => {
	ElLoading.service({
		fullscreen: true,
		text: '路由切换中',
		background: 'rgba(0,0,0,0.2)',
	});
	eventBus.emit('changeRouter');
	// 登录和注册页面直接放行
	if (allowUrls.indexOf(to.path) >= 0) {
		next();
	} else {
		if (
			from.path.startsWith('/home') ||
			from.path.startsWith('/entrance') ||
			from.path.startsWith('/sourceCenter') ||
			from.path.startsWith('/sceneManagement')
		) {
			// 从系统界面跳入
			next();
		} else {
			next();
			// 验证用户是否具有登陆权限
			// const promise = cookieVerify();
			// promise
			//   .then((data) => {
			//     // @ts-ignore
			//     if (data == 'CookieValid' || data == 'SessionCreated') {
			//       next();
			//     } else {
			//       const callback = () => {
			//         next('/login');
			//       };
			//       ElMessage({
			//         message: '您还未登录，请先登录',
			//         type: 'error',
			//         duration: 1000,
			//         onClose: callback,
			//       });
			//     }
			//   })
			//   .catch((err) => {
			//     ElMessage.error('无法连接到服务器');
			//   });
		}
	}
});

router.afterEach((to, from) => {
	let elloading = ElLoading.service({
		fullscreen: true,
	});
	elloading.close();
});

export default router;
