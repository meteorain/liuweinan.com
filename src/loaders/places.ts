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
        longitude: 116.405285,
        latitude: 39.904989
    },
    // 南昌，济南，石家庄，广州，深圳，长沙，武汉，郑州，西安，哈尔滨，合肥，青岛
    {
        name: 'London',
        location: '英国伦敦',
        longitude: -0.118092,
        latitude: 51.509865
    },
    {
        name: 'Paris',
        location: '法国巴黎',
        longitude: 2.349014,
        latitude: 48.864716
    },
    {
        name: 'Bamako',
        location: '马里巴马科',
        longitude: -7.971547,
        latitude: 12.635898
    },
    {
        name: '广州',
        location: '广东省广州市',
        longitude: 113.280637,
        latitude: 23.125178
    },
    {
        name: '深圳',
        location: '广东省深圳市',
        longitude: 114.085947,
        latitude: 22.547
    },
    {
        name: '长沙',
        location: '湖南省长沙市',
        longitude: 112.982279,
        latitude: 28.19409
    },
    {
        name: '武汉',
        location: '湖北省武汉市',
        longitude: 114.298572,
        latitude: 30.584355
    },
    {
        name: '郑州',
        location: '河南省郑州市',
        longitude: 113.665412,
        latitude: 34.757975
    },
    {
        name: '西安',
        location: '陕西省西安市',
        longitude: 108.948024,
        latitude: 34.263161
    },
    {
        name: '哈尔滨',
        location: '黑龙江省哈尔滨市',
        longitude: 126.5358,
        latitude: 45.80216
    },
    {
        name: '合肥',
        location: '安徽省合肥市',
        longitude: 117.227219,
        latitude: 31.820587
    },
    {
        name : '青岛',
        location: '山东省青岛市',
        longitude: 120.38264,
        latitude: 36.067082
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

