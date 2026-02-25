import {API_SECRET, API_URL} from "astro:env/server";

interface Place {
    name: string;
    location?: string;
    longitude: number;
    latitude: number;
}

const places: Place[] = [
    {
        name: 'Scottsdale',
        location: '美国斯科茨代爾',
        longitude: -111.90002,
        latitude: 33.55384
    },
    {
        name: 'Los Angeles',
        location: '美国洛杉矶',
        longitude: -118.24923,
        latitude: 34.05632
    },
    {
        name: 'Las Vegas',
        location: '美国拉斯维加斯',
        longitude: -115.17294,
        latitude: 36.11284
    },
    {
        name: 'New York',
        location: '美国纽约',
        longitude: -74.00206,
        latitude: 40.71372
    },
    {
        name: 'Boracay',
        location: '菲律宾长滩岛',
        longitude: 121.92405,
        latitude: 11.96307
    },
    {
        name: 'London',
        location: '英国伦敦',
        longitude: -0.12946,
        latitude: 51.48864
    },
    {
        name: 'Basingstoke',
        location: '英国贝辛斯托克',
        longitude: -1.09433,
        latitude: 51.26761
    },
    {
        name: 'Reading',
        location: '英国雷丁',
        longitude: -0.97151,
        latitude: 51.45843
    },
    {
        name: 'Bath',
        location: '英国巴斯',
        longitude: -2.31242,
        latitude: 51.37999
    },
    {
        name: 'Isle of Wight',
        location: '英国怀特岛',
        longitude: -1.19519,
        latitude: 50.70012
    },
    {
        name: 'Manchester',
        location: '英国曼彻斯特',
        longitude: -2.24341,
        latitude: 53.48709
    },
    {
        name: 'Birmingham',
        location: '英国伯明翰',
        longitude: -1.63415,
        latitude: 52.53184,

    },
    {
        name: 'Edinburgh',
        location: '英国爱丁堡',
        longitude: -3.18783,
        latitude: 55.95464
    },
    {
        name: 'Paris',
        location: '法国巴黎',
        longitude: 2.47008,
        latitude: 48.90679
    },
    {
        name: 'Paris',
        location: '法国巴黎',
        longitude: 2.47008,
        latitude: 48.90679
    },
    {
        name: 'Lyon',
        location: '法国里昂',
        longitude: 4.83753,
        latitude: 45.76750
    },
    {
        name: 'Marseille',
        location: '法国马赛',
        longitude: 5.37583,
        latitude: 43.30122
    },
    {
        name: 'Nice',
        location: '法国尼斯',
        longitude: 7.25481,
        latitude: 43.71696
    },
    {
        name: 'Praha',
        location: '捷克布拉格',
        longitude: 14.28454,
        latitude: 50.06072
    },
    {
        name: 'Budapest',
        location: '匈牙利布达佩斯',
        longitude: 19.10108,
        latitude: 47.50851
    },
    {
        name: 'Αθήνα',
        location: '希腊雅典',
        longitude: 23.72924,
        latitude: 37.98817
    },
    {
        name: 'Milano',
        location: '意大利米兰',
        longitude: 9.18145,
        latitude: 45.46791
    },
    {
        name: 'Lago di Como',
        location: '意大利科莫湖',
        longitude: 9.28635,
        latitude: 46.01491
    },
    {
        name: 'Roma',
        location: '意大利罗马',
        longitude: 12.478028,
        latitude: 41.904779
    },
    {
        name: 'București',
        location: '罗马尼亚布加勒斯特',
        longitude: 26.16234,
        latitude: 44.44676
    },
    {
        name: 'Sibiu',
        location: '罗马尼亚锡比乌',
        longitude: 24.13177,
        latitude: 45.80909
    },
    {
        name: 'الرياض',
        location: '沙特阿拉伯利雅得',
        longitude: 47.25550,
        latitude: 24.75175
    },
    {
        name: 'دبي',
        location: '阿联酋迪拜',
        longitude: 55.39528,
        latitude: 25.25981
    },
    {
        name: 'Bamako',
        location: '马里巴马科',
        longitude: -7.34111,
        latitude: 12.67196
    },
    {
        name: 'Niamey',
        location: '尼日尔尼亚美',
        longitude: 2.20798,
        latitude: 13.58501
    },
    {
        name: 'إنجامينا',
        location: '乍得恩贾梅纳',
        longitude: 15.18325,
        latitude: 12.14322
    },
    {
        name: 'الدار البيضاء',
        location: '摩洛哥卡萨布兰卡',
        longitude: -7.59326,
        latitude: 33.58219
    },
    {
        name: '鹤岗',
        location: '黑龙江省鹤岗市',
        longitude: 130.26795,
        latitude: 47.28251

    },
    {
        name: '哈尔滨',
        location: '黑龙江省哈尔滨市',
        longitude: 126.62726,
        latitude: 45.77052
    },
    {
        name: '沈阳',
        location: '辽宁省沈阳市',
        longitude: 123.45580,
        latitude: 41.79753
    },
    {
        name: '北京市',
        location: '北京市',
        longitude: 116.39725,
        latitude: 39.90876
    },
    {
        name: '青岛',
        location: '山东省青岛市',
        longitude: 120.31920,
        latitude: 36.06211
    },
    {
        name: '南京',
        location: '江苏省南京市',
        longitude: 118.85342,
        latitude: 32.02525
    },
    {
        name: '武汉',
        location: '湖北武汉市',
        longitude: 114.31501,
        latitude: 30.57649
    },
    {
        name: '长沙',
        location: '湖南省长沙市',
        longitude: 112.92841,
        latitude: 28.21493
    },
    {
        name: '重庆',
        location: '重庆市',
        longitude: 106.57705,
        latitude: 29.55727
    },
    {
        name: '成都',
        location: '四川省成都市',
        longitude: 104.06584,
        latitude: 30.65754
    },
    {
        name: '乐山',
        location: '四川省乐山市',
        longitude: 103.76763,
        latitude: 29.55071
    },
    {
        name: '泸州',
        location: '四川省泸州市',
        longitude: 105.44295,
        latitude: 28.86776
    },
    {
        name: '阆中',
        location: '四川省阆中市',
        longitude: 105.97098,
        latitude: 31.57491
    },
    {
        name: '九寨沟',
        location: '四川省九寨沟',
        longitude: 103.91916,
        latitude: 33.26715
    },
    {
        name: '稻城',
        location: '四川省甘孜稻城',
        longitude: 100.34512  ,
        latitude: 28.46213
    },
    {
        name: '昆明',
        location: '云南省昆明市',
        longitude: 102.70752,
        latitude: 25.04128
    },
    {
        name: '大理',
        location: '云南省大理市',
        longitude: 100.16246,
        latitude: 25.69060
    },
    {
        name: '丽江',
        location: '云南省丽江市',
        longitude: 100.23396,
        latitude: 26.87212
    },
    {
        name: '香格里拉',
        location: '云南省迪庆',
        longitude: 99.70560,
        latitude: 27.81048
    },
    {
        name: '拉萨',
        location: '西藏省拉萨市',
        longitude: 91.11911,
        latitude: 29.65464
    },
    {
        name: '西双版纳',
        location: '云南省西双版纳',
        longitude: 100.81942,
        latitude: 22.00799
    },
    {
        name: '深圳',
        location: '广东省深圳市',
        longitude: 114.07692,
        latitude: 22.65500
    },
    {
        name: '厦门',
        location: '福建省厦门市',
        longitude: 118.06635,
        latitude: 24.44685
    },
    {
        name: '兴义',
        location: '贵州省兴义市',
        longitude: 104.91758,
        latitude: 25.00090
    },
    {
        name: '汕尾',
        location: '广东省汕头尾',
        longitude: 115.29379,
        latitude: 22.79301
    },
    {
        name: '汕头',
        location: '广东省汕头市',
        longitude: 116.70807,
        latitude: 23.35924
    },
    {
        name: '三亚',
        location: '海南省三亚市',
        longitude: 109.50303,
        latitude: 18.21544
    },
    {
        name: '都昌',
        location: '江西省都昌县',
        longitude: 116.34925,
        latitude: 29.26343
    },
    {
        name: '南昌',
        location: '江西省南昌市',
        longitude: 115.88871,
        latitude: 28.59012
    },
    {
        name: '常德',
        location: '湖南省常德市',
        longitude: 111.67970,
        latitude: 29.01317
    }
]


export function placesLoader(): any {
    // const url = `${API_URL}/places`;
    //
    // const places = fetch(url, {
    //     headers: {
    //         'Authorization': `Bearer ${API_SECRET}`
    //     }
    // }).then(res => res.json());


    return {
        name: "places-loader",
        load: async () => {
            return places
        },
    };
}

