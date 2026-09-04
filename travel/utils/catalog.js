/**
 * 稳定景点目录。首页、详情、搜索、主题筛选共用同一套 id，
 * 避免每次请求随机生成导致详情对不上、收藏后丢失。
 */

const IMG = {
	gugong: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
	changcheng: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
	yiheyuan: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
	tiantan: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
	xihu: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
	huangshan: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
	jiuzhai: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
	zhangjiajie: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
	lijiang: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
	dalian: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
	sanya: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
	chengdu: 'https://images.unsplash.com/photo-1528164340695-76941c4f2adb?w=800&q=80',
	xian: 'https://images.unsplash.com/photo-1528164340695-76941c4f2adb?w=800&q=80',
	shanghai: 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800&q=80',
	forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
	canyon: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80',
	lake: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&q=80',
	mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
}

export const THEME_FILTERS = {
	文化之旅: ['历史文化', '世界遗产', '历史遗迹'],
	自然探秘: ['自然风光', '摄影圣地'],
	周末逃离: ['热门推荐', '情侣约会', '亲子首选']
}

export const SPOT_CATALOG = [
	{
		id: 1,
		title: '故宫博物院',
		subtitle: '紫禁城六百年',
		description: '明清两代皇宫，世界现存规模最大、保存最完整的木质结构古建筑群。红墙黄瓦之间，能看见中轴对称的礼制秩序，也适合慢慢走完三大殿和珍宝馆。',
		images: [IMG.gugong, IMG.yiheyuan, IMG.tiantan],
		location: {
			province: '北京市',
			city: '北京市',
			district: '东城区',
			address: '北京市东城区景山前街4号',
			latitude: 39.9163,
			longitude: 116.3972
		},
		rating: '4.9',
		reviewCount: 128900,
		price: 60,
		originalPrice: 80,
		sold: 23560,
		tags: ['5A景区', '世界遗产', '历史文化'],
		theme: '文化之旅',
		openTime: '08:30-17:00（周一闭馆）',
		recommendedDuration: '3-5小时',
		phone: '010-85007421',
		features: '讲解服务 / 文物展陈 / 文创店',
		distance: '2.3km',
		suitable: '亲子 / 文化爱好者 / 团队'
	},
	{
		id: 2,
		title: '八达岭长城',
		subtitle: '不到长城非好汉',
		description: '明长城中保存最好、最具代表性的一段。登城远眺群山连绵，城墙随山势起伏。建议避开节假日高峰，选择北一楼到北八楼一段体验最完整。',
		images: [IMG.changcheng, IMG.mountain, IMG.forest],
		location: {
			province: '北京市',
			city: '北京市',
			district: '延庆区',
			address: '北京市延庆区G6京藏高速58号出口',
			latitude: 40.3598,
			longitude: 116.0200
		},
		rating: '4.8',
		reviewCount: 98600,
		price: 40,
		originalPrice: 45,
		sold: 18900,
		tags: ['5A景区', '世界遗产', '必去打卡'],
		theme: '文化之旅',
		openTime: '06:30-19:00',
		recommendedDuration: '3-4小时',
		phone: '010-69121226',
		features: '索道 / 滑车 / 讲解服务',
		distance: '15.6km',
		suitable: '亲子 / 情侣 / 团队'
	},
	{
		id: 3,
		title: '颐和园',
		subtitle: '皇家园林典范',
		description: '以昆明湖、万寿山为基址，借西山玉泉山之景，是中国古典园林的集大成者。沿长廊走到石舫，再乘船看十七孔桥，半天刚刚好。',
		images: [IMG.yiheyuan, IMG.lake, IMG.gugong],
		location: {
			province: '北京市',
			city: '北京市',
			district: '海淀区',
			address: '北京市海淀区新建宫门路19号',
			latitude: 39.9999,
			longitude: 116.2755
		},
		rating: '4.7',
		reviewCount: 76500,
		price: 30,
		originalPrice: 40,
		sold: 15200,
		tags: ['5A景区', '历史文化', '皇家园林'],
		theme: '文化之旅',
		openTime: '06:30-18:00',
		recommendedDuration: '3-4小时',
		phone: '010-62881144',
		features: '游船 / 讲解 / 停车场',
		distance: '8.2km',
		suitable: '亲子 / 情侣 / 摄影'
	},
	{
		id: 4,
		title: '天坛公园',
		subtitle: '祈年殿的天光',
		description: '明清皇帝祭天祈谷的场所。圆形祈年殿与丹陛桥构成庄严轴线，晨练的老人和柏树林让这里比故宫更松弛。',
		images: [IMG.tiantan, IMG.gugong, IMG.yiheyuan],
		location: {
			province: '北京市',
			city: '北京市',
			district: '东城区',
			address: '北京市东城区天坛路甲1号',
			latitude: 39.8822,
			longitude: 116.4066
		},
		rating: '4.7',
		reviewCount: 54200,
		price: 15,
		originalPrice: 20,
		sold: 9800,
		tags: ['世界遗产', '历史文化', '亲子首选'],
		theme: '文化之旅',
		openTime: '06:00-22:00（景点8:00-17:00）',
		recommendedDuration: '2-3小时',
		phone: '010-67028866',
		features: '公园免费区 / 联票 / 讲解',
		distance: '4.5km',
		suitable: '亲子 / 晨练 / 摄影'
	},
	{
		id: 5,
		title: '西湖风景区',
		subtitle: '淡妆浓抹总相宜',
		description: '断桥、苏堤、雷峰塔与三潭印月构成最经典的江南画面。建议租一辆自行车环湖，傍晚在湖滨看落日把湖面染成金色。',
		images: [IMG.xihu, IMG.lake, IMG.dalian],
		location: {
			province: '浙江省',
			city: '杭州市',
			district: '西湖区',
			address: '杭州市西湖区龙井路1号',
			latitude: 30.2420,
			longitude: 120.1480
		},
		rating: '4.9',
		reviewCount: 210300,
		price: 0,
		originalPrice: null,
		sold: 56000,
		tags: ['5A景区', '世界遗产', '自然风光'],
		theme: '自然探秘',
		openTime: '全天开放',
		recommendedDuration: '半天-1天',
		phone: '0571-87179617',
		features: '免费开放 / 游船 / 骑行',
		distance: '3.1km',
		suitable: '情侣 / 亲子 / 摄影'
	},
	{
		id: 6,
		title: '黄山风景区',
		subtitle: '奇松怪石云海',
		description: '黄山以奇松、怪石、云海、温泉四绝闻名。建议住一晚山上，赶日出和云海。西海大峡谷的栈道是近年最值得走的一段。',
		images: [IMG.huangshan, IMG.mountain, IMG.forest],
		location: {
			province: '安徽省',
			city: '黄山市',
			district: '黄山区',
			address: '黄山市黄山区汤口镇',
			latitude: 30.1398,
			longitude: 118.1670
		},
		rating: '4.8',
		reviewCount: 87300,
		price: 190,
		originalPrice: 230,
		sold: 12400,
		tags: ['5A景区', '世界遗产', '摄影圣地'],
		theme: '自然探秘',
		openTime: '06:00-17:30',
		recommendedDuration: '1-2天',
		phone: '0559-5561111',
		features: '索道 / 山顶住宿 / 温泉',
		distance: '68km',
		suitable: '登山 / 摄影 / 情侣'
	},
	{
		id: 7,
		title: '九寨沟',
		subtitle: '彩池与雪山',
		description: '层层叠叠的钙华彩池、瀑布和原始森林。五花海、五彩池在晴天最通透。景区大，建议坐观光车并预留一整天。',
		images: [IMG.jiuzhai, IMG.lake, IMG.canyon],
		location: {
			province: '四川省',
			city: '阿坝藏族羌族自治州',
			district: '九寨沟县',
			address: '阿坝州九寨沟县漳扎镇',
			latitude: 33.2600,
			longitude: 103.9180
		},
		rating: '4.9',
		reviewCount: 65400,
		price: 169,
		originalPrice: 190,
		sold: 8900,
		tags: ['5A景区', '世界遗产', '自然风光'],
		theme: '自然探秘',
		openTime: '08:00-17:00',
		recommendedDuration: '1天',
		phone: '0837-7739753',
		features: '观光车 / 栈道 / 高原防护',
		distance: '430km',
		suitable: '摄影 / 自然爱好者'
	},
	{
		id: 8,
		title: '张家界国家森林公园',
		subtitle: '石英砂岩峰林',
		description: '袁家界、天子山的石峰是阿凡达悬浮山的原型。建议两日：一天金鞭溪+袁家界，一天天子山+十里画廊。',
		images: [IMG.zhangjiajie, IMG.canyon, IMG.mountain],
		location: {
			province: '湖南省',
			city: '张家界市',
			district: '武陵源区',
			address: '张家界市武陵源区公园路',
			latitude: 29.3250,
			longitude: 110.4360
		},
		rating: '4.8',
		reviewCount: 72100,
		price: 225,
		originalPrice: 248,
		sold: 10300,
		tags: ['5A景区', '世界遗产', '摄影圣地'],
		theme: '自然探秘',
		openTime: '07:00-18:00',
		recommendedDuration: '2天',
		phone: '0744-5712189',
		features: '百龙天梯 / 观光车 / 索道',
		distance: '32km',
		suitable: '摄影 / 情侣 / 团队'
	},
	{
		id: 9,
		title: '丽江古城',
		subtitle: '茶马古道上的四方街',
		description: '纳西族聚居的世界文化遗产。白天走石板路看流水，晚上在四方街听民谣。建议住古城内，早起人少时最好拍。',
		images: [IMG.lijiang, IMG.chengdu, IMG.xihu],
		location: {
			province: '云南省',
			city: '丽江市',
			district: '古城区',
			address: '丽江市古城区大研古城',
			latitude: 26.8721,
			longitude: 100.2330
		},
		rating: '4.6',
		reviewCount: 99800,
		price: 50,
		originalPrice: 50,
		sold: 18700,
		tags: ['世界遗产', '历史文化', '情侣约会'],
		theme: '文化之旅',
		openTime: '全天开放',
		recommendedDuration: '1-2天',
		phone: '0888-5111118',
		features: '古城维护费 / 酒吧街 / 民居客栈',
		distance: '1.2km',
		suitable: '情侣 / 文艺 / 摄影'
	},
	{
		id: 10,
		title: '大理古城',
		subtitle: '风花雪月',
		description: '苍山洱海之间的白族古城。从南门骑车到才村码头看洱海，再回洋人街吃饵块，是很舒服的周末节奏。',
		images: [IMG.lijiang, IMG.xihu, IMG.lake],
		location: {
			province: '云南省',
			city: '大理市',
			district: '大理镇',
			address: '大理市大理镇复兴路',
			latitude: 25.6936,
			longitude: 100.1628
		},
		rating: '4.6',
		reviewCount: 54300,
		price: 0,
		originalPrice: null,
		sold: 14200,
		tags: ['历史文化', '情侣约会', '热门推荐'],
		theme: '周末逃离',
		openTime: '全天开放',
		recommendedDuration: '1天',
		phone: '0872-2670293',
		features: '免费 / 骑行 / 民宿',
		distance: '12km',
		suitable: '情侣 / 骑行 / 周末'
	},
	{
		id: 11,
		title: '外滩',
		subtitle: '万国建筑与浦东天际线',
		description: '黄浦江西岸的万国建筑博览群，对面是陆家嘴三件套。傍晚到夜景亮灯是最佳时段，沿江步道适合慢慢走。',
		images: [IMG.shanghai, IMG.dalian, IMG.chengdu],
		location: {
			province: '上海市',
			city: '上海市',
			district: '黄浦区',
			address: '上海市黄浦区中山东一路',
			latitude: 31.2400,
			longitude: 121.4900
		},
		rating: '4.8',
		reviewCount: 156000,
		price: 0,
		originalPrice: null,
		sold: 89000,
		tags: ['热门推荐', '情侣约会', '摄影圣地'],
		theme: '周末逃离',
		openTime: '全天开放',
		recommendedDuration: '1-2小时',
		phone: '021-63215533',
		features: '免费 / 夜景 / 江景步道',
		distance: '1.8km',
		suitable: '情侣 / 夜游 / 摄影'
	},
	{
		id: 12,
		title: '豫园',
		subtitle: '江南古典园林',
		description: '明代私人园林，亭台楼阁与太湖石叠山精巧。旁边是城隍庙小吃街，逛园子再吃生煎，很适合半日安排。',
		images: [IMG.chengdu, IMG.yiheyuan, IMG.xihu],
		location: {
			province: '上海市',
			city: '上海市',
			district: '黄浦区',
			address: '上海市黄浦区福佑路168号',
			latitude: 31.2272,
			longitude: 121.4920
		},
		rating: '4.6',
		reviewCount: 43200,
		price: 40,
		originalPrice: 40,
		sold: 7600,
		tags: ['历史文化', '亲子首选', '热门推荐'],
		theme: '周末逃离',
		openTime: '08:30-17:00',
		recommendedDuration: '1-2小时',
		phone: '021-63260830',
		features: '园林 / 城隍庙 / 小吃',
		distance: '2.4km',
		suitable: '亲子 / 周末 / 美食'
	},
	{
		id: 13,
		title: '兵马俑博物馆',
		subtitle: '地下军团',
		description: '秦始皇陵兵马俑一、二、三号坑。一号坑的军阵最震撼，建议请讲解或租语音导览，否则只是看一排陶俑。',
		images: [IMG.xian, IMG.gugong, IMG.chengdu],
		location: {
			province: '陕西省',
			city: '西安市',
			district: '临潼区',
			address: '西安市临潼区秦始皇帝陵博物院',
			latitude: 34.3848,
			longitude: 109.2730
		},
		rating: '4.8',
		reviewCount: 112400,
		price: 120,
		originalPrice: 120,
		sold: 19800,
		tags: ['5A景区', '世界遗产', '历史文化'],
		theme: '文化之旅',
		openTime: '08:30-18:00',
		recommendedDuration: '3-4小时',
		phone: '029-81399127',
		features: '讲解 / 直通车 / 文创',
		distance: '35km',
		suitable: '亲子 / 历史爱好者'
	},
	{
		id: 14,
		title: '大雁塔·大唐不夜城',
		subtitle: '盛唐夜景',
		description: '白天登大雁塔看长安城，晚上走不夜城看《梦回大唐》和音乐喷泉。是西安最轻松的夜游线路。',
		images: [IMG.xian, IMG.shanghai, IMG.gugong],
		location: {
			province: '陕西省',
			city: '西安市',
			district: '雁塔区',
			address: '西安市雁塔区慈恩路',
			latitude: 34.2184,
			longitude: 108.9640
		},
		rating: '4.7',
		reviewCount: 87600,
		price: 50,
		originalPrice: 50,
		sold: 22100,
		tags: ['历史文化', '热门推荐', '情侣约会'],
		theme: '周末逃离',
		openTime: '08:00-22:00',
		recommendedDuration: '3-4小时',
		phone: '029-85527958',
		features: '登塔 / 夜景 / 步行街',
		distance: '6.8km',
		suitable: '情侣 / 夜游 / 亲子'
	},
	{
		id: 15,
		title: '宽窄巷子',
		subtitle: '成都最有味道的街巷',
		description: '宽巷子宜慢走喝茶，窄巷子多精品店，井巷子吃小吃。配一碗茶和三大炮，就是很成都的下午。',
		images: [IMG.chengdu, IMG.lijiang, IMG.xihu],
		location: {
			province: '四川省',
			city: '成都市',
			district: '青羊区',
			address: '成都市青羊区长顺上街',
			latitude: 30.6704,
			longitude: 104.0540
		},
		rating: '4.5',
		reviewCount: 76800,
		price: 0,
		originalPrice: null,
		sold: 34500,
		tags: ['热门推荐', '美食', '情侣约会'],
		theme: '周末逃离',
		openTime: '全天开放',
		recommendedDuration: '2-3小时',
		phone: '028-86621980',
		features: '免费 / 小吃 / 茶馆',
		distance: '2.0km',
		suitable: '美食 / 情侣 / 周末'
	},
	{
		id: 16,
		title: '都江堰景区',
		subtitle: '两千年仍在工作的水利',
		description: '李冰父子修建的分水鱼嘴、飞沙堰、宝瓶口至今仍在灌溉成都平原。走完安澜索桥再上二王庙，工程史比想象中好看。',
		images: [IMG.chengdu, IMG.canyon, IMG.forest],
		location: {
			province: '四川省',
			city: '成都市',
			district: '都江堰市',
			address: '成都市都江堰市公园路',
			latitude: 31.0034,
			longitude: 103.6190
		},
		rating: '4.7',
		reviewCount: 45600,
		price: 80,
		originalPrice: 90,
		sold: 6700,
		tags: ['世界遗产', '历史文化', '5A景区'],
		theme: '文化之旅',
		openTime: '08:00-18:00',
		recommendedDuration: '3-4小时',
		phone: '028-87133355',
		features: '讲解 / 索桥 / 二王庙',
		distance: '56km',
		suitable: '亲子 / 文化 / 团队'
	},
	{
		id: 17,
		title: '亚龙湾',
		subtitle: '热带海湾',
		description: '三亚沙质细软、海水能见度高的海湾。上午游泳，下午在沙滩发呆，傍晚看落日。适合把节奏放得很慢。',
		images: [IMG.sanya, IMG.dalian, IMG.xihu],
		location: {
			province: '海南省',
			city: '三亚市',
			district: '吉阳区',
			address: '三亚市吉阳区亚龙湾国家旅游度假区',
			latitude: 18.2140,
			longitude: 109.6500
		},
		rating: '4.7',
		reviewCount: 38900,
		price: 0,
		originalPrice: null,
		sold: 15600,
		tags: ['自然风光', '情侣约会', '热门推荐'],
		theme: '自然探秘',
		openTime: '全天开放',
		recommendedDuration: '半天',
		phone: '0898-88568888',
		features: '沙滩 / 潜水 / 度假酒店',
		distance: '25km',
		suitable: '情侣 / 亲子 / 度假'
	},
	{
		id: 18,
		title: '青岛栈桥',
		subtitle: '回澜阁与海边啤酒',
		description: '青岛的城市名片。从栈桥走到回澜阁，再沿海岸线去鲁迅公园和小鱼山，一天就能把老城区海边走完。',
		images: [IMG.dalian, IMG.sanya, IMG.shanghai],
		location: {
			province: '山东省',
			city: '青岛市',
			district: '市南区',
			address: '青岛市市南区太平路12号',
			latitude: 36.0610,
			longitude: 120.3220
		},
		rating: '4.6',
		reviewCount: 51200,
		price: 0,
		originalPrice: null,
		sold: 19800,
		tags: ['热门推荐', '情侣约会', '亲子首选'],
		theme: '周末逃离',
		openTime: '全天开放',
		recommendedDuration: '1-2小时',
		phone: '0532-82875480',
		features: '免费 / 海边 / 老城',
		distance: '1.5km',
		suitable: '情侣 / 亲子 / 周末'
	},
	{
		id: 19,
		title: '鼓浪屿',
		subtitle: '万国建筑与钢琴岛',
		description: '没有机动车的小岛，日光岩可以俯瞰厦门岛。建议住一晚，早起走菽庄花园和海边小巷，避开白天的邮轮客流。',
		images: [IMG.dalian, IMG.lijiang, IMG.xihu],
		location: {
			province: '福建省',
			city: '厦门市',
			district: '思明区',
			address: '厦门市思明区鼓浪屿',
			latitude: 24.4478,
			longitude: 118.0660
		},
		rating: '4.6',
		reviewCount: 83400,
		price: 0,
		originalPrice: null,
		sold: 26700,
		tags: ['世界遗产', '情侣约会', '历史文化'],
		theme: '文化之旅',
		openTime: '全天开放（轮渡时段运营）',
		recommendedDuration: '1天',
		phone: '0592-2065661',
		features: '轮渡 / 步行 / 民宿',
		distance: '4.0km',
		suitable: '情侣 / 文艺 / 摄影'
	},
	{
		id: 20,
		title: '乌镇西栅',
		subtitle: '夜泊水乡',
		description: '西栅保留了完整的水乡夜景，坐手摇船穿过石桥，两岸灯火倒映在水里。比东栅更适合过夜。',
		images: [IMG.xihu, IMG.lijiang, IMG.chengdu],
		location: {
			province: '浙江省',
			city: '嘉兴市',
			district: '桐乡市',
			address: '嘉兴市桐乡市乌镇西栅景区',
			latitude: 30.7430,
			longitude: 120.4880
		},
		rating: '4.7',
		reviewCount: 67800,
		price: 150,
		originalPrice: 190,
		sold: 9400,
		tags: ['5A景区', '历史文化', '情侣约会'],
		theme: '文化之旅',
		openTime: '08:00-22:00',
		recommendedDuration: '半天-1天',
		phone: '0573-88731088',
		features: '夜景 / 游船 / 住宿',
		distance: '80km',
		suitable: '情侣 / 摄影 / 周末'
	},
	{
		id: 21,
		title: '什刹海',
		subtitle: '后海的烟火气',
		description: '荷花、酒吧街、胡同和冰场随季节变化。夏天坐船，冬天看冰场，平时钻烟袋斜街吃烤串，是北京最生活的水面。',
		images: [IMG.yiheyuan, IMG.lake, IMG.chengdu],
		location: {
			province: '北京市',
			city: '北京市',
			district: '西城区',
			address: '北京市西城区什刹海街道',
			latitude: 39.9405,
			longitude: 116.3860
		},
		rating: '4.5',
		reviewCount: 42100,
		price: 0,
		originalPrice: null,
		sold: 17800,
		tags: ['热门推荐', '情侣约会', '亲子首选'],
		theme: '周末逃离',
		openTime: '全天开放',
		recommendedDuration: '2-3小时',
		phone: '010-66123336',
		features: '免费 / 胡同 / 酒吧街',
		distance: '3.6km',
		suitable: '情侣 / 夜游 / 周末'
	},
	{
		id: 22,
		title: '圆明园遗址公园',
		subtitle: '残垣与福海',
		description: '西洋楼遗址提醒历史，福海和芍药园又很安静。春天海棠、秋天银杏，适合不想赶热门故宫的半天。',
		images: [IMG.yiheyuan, IMG.forest, IMG.lake],
		location: {
			province: '北京市',
			city: '北京市',
			district: '海淀区',
			address: '北京市海淀区清华西路28号',
			latitude: 40.0080,
			longitude: 116.2980
		},
		rating: '4.6',
		reviewCount: 38900,
		price: 10,
		originalPrice: 10,
		sold: 5400,
		tags: ['历史遗迹', '历史文化', '亲子首选'],
		theme: '文化之旅',
		openTime: '07:00-19:00',
		recommendedDuration: '2-4小时',
		phone: '010-62543673',
		features: '遗址 / 公园 / 讲解',
		distance: '9.1km',
		suitable: '亲子 / 散步 / 摄影'
	},
	{
		id: 23,
		title: '灵隐寺',
		subtitle: '飞来峰与香火',
		description: '西湖边最有分量的寺院。飞来峰石窟造像值得细看，再进寺里听钟。建议早到，避开旅行团。',
		images: [IMG.forest, IMG.xihu, IMG.chengdu],
		location: {
			province: '浙江省',
			city: '杭州市',
			district: '西湖区',
			address: '杭州市西湖区灵隐路法云弄1号',
			latitude: 30.2428,
			longitude: 120.1010
		},
		rating: '4.7',
		reviewCount: 51200,
		price: 75,
		originalPrice: 75,
		sold: 8900,
		tags: ['历史文化', '摄影圣地', '热门推荐'],
		theme: '文化之旅',
		openTime: '07:00-18:00',
		recommendedDuration: '2-3小时',
		phone: '0571-87968665',
		features: '飞来峰 / 寺院 / 素斋',
		distance: '7.4km',
		suitable: '文化 / 摄影 / 亲子'
	},
	{
		id: 24,
		title: '稻城亚丁',
		subtitle: '三座神山',
		description: '仙乃日、央迈勇、夏诺多吉三座雪峰环抱。高原反应需要适应，建议先在稻城住一晚再进长线路。秋天彩林最盛。',
		images: [IMG.huangshan, IMG.jiuzhai, IMG.mountain],
		location: {
			province: '四川省',
			city: '甘孜藏族自治州',
			district: '稻城县',
			address: '甘孜州稻城县香格里拉镇',
			latitude: 28.4400,
			longitude: 100.3480
		},
		rating: '4.9',
		reviewCount: 29800,
		price: 146,
		originalPrice: 150,
		sold: 4200,
		tags: ['自然风光', '摄影圣地', '5A景区'],
		theme: '自然探秘',
		openTime: '07:00-18:00',
		recommendedDuration: '2-3天',
		phone: '0836-5728666',
		features: '观光车 / 高原 / 徒步',
		distance: '780km',
		suitable: '摄影 / 徒步 / 深度游'
	}
]

export function cloneSpot(spot) {
	return JSON.parse(JSON.stringify(spot))
}

export function getSpotById(id) {
	const numId = Number(id)
	const spot = SPOT_CATALOG.find((item) => item.id === numId)
	return spot ? cloneSpot(spot) : null
}

export function getThemeCount(themeName) {
	const tags = THEME_FILTERS[themeName] || [themeName]
	return SPOT_CATALOG.filter((spot) =>
		spot.theme === themeName || spot.tags.some((tag) => tags.includes(tag))
	).length
}

export function filterSpots({ keyword = '', theme = '', city = '' } = {}) {
	const kw = String(keyword || '').trim().toLowerCase()
	const themeTags = THEME_FILTERS[theme] || []

	return SPOT_CATALOG.filter((spot) => {
		if (theme) {
			const matched = spot.theme === theme || spot.tags.some((tag) => themeTags.includes(tag))
			if (!matched) return false
		}
		if (city) {
			const loc = `${spot.location.city}${spot.location.province}${spot.location.district}`
			if (!loc.includes(city)) return false
		}
		if (kw) {
			const hay = `${spot.title}${spot.subtitle}${spot.location.city}${spot.location.address}${(spot.tags || []).join('')}`.toLowerCase()
			if (!hay.includes(kw)) return false
		}
		return true
	}).map(cloneSpot)
}

export function paginateSpots(list, page = 1, pageSize = 10) {
	const start = (page - 1) * pageSize
	return {
		list: list.slice(start, start + pageSize),
		total: list.length,
		page,
		pageSize,
		totalPages: Math.max(1, Math.ceil(list.length / pageSize))
	}
}

export function formatLocation(spot) {
	if (!spot) return ''
	if (typeof spot.location === 'string') return spot.location
	return spot.location?.address || `${spot.location?.city || ''}${spot.location?.district || ''}`
}

export function toCardItem(spot) {
	return {
		id: spot.id,
		title: spot.title,
		rating: spot.rating,
		price: spot.price,
		originalPrice: spot.originalPrice,
		distance: spot.distance,
		location: formatLocation(spot),
		tag: spot.tags?.[0] || '',
		tags: spot.tags || [],
		img: spot.images?.[0] || '',
		image: spot.images?.[0] || '',
		sold: spot.sold,
		latitude: spot.location?.latitude,
		longitude: spot.location?.longitude
	}
}
