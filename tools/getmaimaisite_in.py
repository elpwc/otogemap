import requests, json, csv, re, time, random
from bs4 import BeautifulSoup

res = {
    'type': 'FeatureCollection',
    'features': []
}

def getStoreTypeFromName(name):
    typelist = { 'ＧｉＧＯ': 'gigo',
                'GiGO': 'gigo',
                'タイトー': 'taito',
                'ｎａｍｃｏ': 'namco',
                'namco': 'namco',
                'ラウンドワン': 'r1',
                'アドアーズ': 'adores',
                'ウェアハウス': 'warehouse',
                'レジャーランド': 'rejaland',
                'キャッツアイ': 'catseye',
                'ソユーゲーム': 'soyu',
                'SOYUGameField': 'soyu',
                'ＰＡＬＯ': 'palo',
                'ＢＩＧＢＡＮＧ': 'bigbang',
                '楽市楽座': 'rakuichi',
                'シルクハット': 'silk',
                'プラサカプコン': 'plaza',
                'Ｇ−ＳＴＡＧＥ': 'gstage',
                'ふぇすたらんど': 'festaland',
                'ＦＥＳＴＡ': 'festa',
                'Ｇ−ｐａｌａ': 'gpala',
                'ＦＥＳＴＡ': 'festa',
                'アピナ': 'apina',
                'アミパラ': 'amipara',
                'アミュージアム': 'amuseum',
                'ゲームランド': 'gameland',
                'サープラ': 'sapura',
                'アミュージアム': 'amuseum',
                'テクモピア': 'tekumopia',
                'パスカランド': 'pasukaland',
                'ハローズガーデン': 'harozugaden',
                'プラサカプコン': 'purasakapukon',
                'モーリーファンタジー': 'morifantaji',
                'ユーズランド': 'yuzuland',

                }
    for key, value in typelist.items():
        if(key in name):
            return value
    return ''

def get_business_time(url):
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    start_h = -1
    start_m = -1
    end_h = -1
    end_m = -1

    info_list = soup.select('.info_list > li')
    if(len(info_list) > 1):
        time = info_list[1].get_text(strip=True)
        times = time.split('： ')[1]
        if(times == '24hrs'):
            start_h = 0
            start_m = 0
            end_h = 24
            end_m = 0
        else:
            times = times.split('～')
            if(':' in times[0]):
                start_time = times[0].split(':')
                start_h = int(start_time[0]) 
                start_m = int(start_time[1])
            if(':' in times[1]):
                end_time = times[1].split(':')
                end_h = int(end_time[0]) 
                end_m = int(end_time[1])
    return start_h, start_m, end_h, end_m

def get_stores_data_of_one_pref(url, if_in_a_pref_structure, country):
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    pref_name = soup.select_one('.content_box > h3 > span').get_text()

    pref_data = {
        'name': pref_name,
        'stores': []
    }
    
    store_data = []
    store_list = soup.select('.store_list > li')

    i = 0
    for store in store_list:
        i+=1
        store_name = store.select_one('.store_name').get_text(strip=True)
        store_address = store.select_one('.store_address').get_text(strip=True)
        
        map_button = store.select_one('.store_bt_google_map_en')
        if map_button:
            onclick_attr = map_button['onclick']
            match = re.search(r"//maps\.google\.com/maps\?q=([^@]+)@([-\d.]+),([-\d.]+)", onclick_attr)
            if match:
                store_map_url = f"https://maps.google.com/maps?q={match.group(1)}@{match.group(2)},{match.group(3)}"
                lat = float(match.group(2))
                lng = float(match.group(3))
            else:
                store_map_url = ""
                lat = lng = None
        else:
            store_map_url = ""
            lat = lng = None



        if((lat == None) or (lng == None)):
            # https://console.cloud.google.com/google/maps-apis/credentials?utm_source=Docs_CreateAPIKey&utm_content=Docs_geocoding-backend&hl=zh-cn&_gl=1*fwkblg*_ga*MTM2NzQ5NjczNS4xNzM5MzU0NDAw*_ga_NRWSTWS78N*MTczOTM1NDQwMC4xLjEuMTczOTM1NTY1My4wLjAuMA..&inv=1&invt=AbpXTQ&project=silent-unison-450710-e2
            googlekey = 'AIzaSyDo-M5tnogfwwjaZmFCjLHbujEW3DXlFAc'
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={store_name}&key="+googlekey
            geocode_response = requests.get(geocode_url)
            geocode_data = geocode_response.json()
            if geocode_data['status'] == 'OK':
                lat = geocode_data['results'][0]['geometry']['location']['lat']
                lng = geocode_data['results'][0]['geometry']['location']['lng']
                if(store_map_url == ''):
                    store_map_url = 'https://maps.google.com/maps?q=' + store_name + '@' + str(lat) + ',' + str(lng)


        detail_button = store.select_one('.bt_details_en')
        if detail_button:
            # location.href='shop?gm=96&astep=0&sid=20896&lang=en'; return false;
            onclick_attr = detail_button['onclick']
            match = re.search(r"sid=(.*?)&lang", onclick_attr)
            if match:
                store_id = match.group(1)
                business_hours_start, business_minute_start, business_hours_end, business_minute_end = get_business_time('https://location.am-all.net/alm/shop?gm=96&sid='+store_id+'&lang=en')
            else:
                business_hours_start = -1
                business_minute_start = -1
                business_hours_end = -1
                business_minute_end = -1

        else:
            business_hours_start = -1
            business_minute_start = -1
            business_hours_end = -1
            business_minute_end = -1


        print(str(i)+'/'+str(len(store_list)))
        store_data.append({
            'name': store_name,
            'name_en':store_name,
            'address': store_address,
            'address_en': store_address,
            'mapURL': store_map_url,
            'lat': lat,
            'lng': lng,
            'type': '',
            'adminlv1': country,
            'adminlv2': '',
            'adminlv3': '',
            'adminlv4': '',
            'adminlv5': '',
            'arcade_amount': -1,
            'business_hours_start': business_hours_start,
            'business_minute_start': business_minute_start,
            'business_hours_end': business_hours_end,
            'business_minute_end': business_minute_end
        })
    if(if_in_a_pref_structure):
        pref_data['stores']=store_data
        return pref_data
    else:
        return store_data

    

res = []
rres = []

areas = ['Taiwan','Hong Kong', 'Singapore','Malaysia','Korea','Thailand','Indonesia', 'Macau','USA','Philippines','Viet Nam','Australia','Myanmar','New Zealand','Cambodia']

for i in range(1001,1016):
  if(i == 1009 or i == 1015): continue
  url = "https://location.am-all.net/alm/location?gm=98&lang=en&ct="+ str(i)
  pref_data = get_stores_data_of_one_pref(url, True, areas[i-1001])
  print(pref_data['name'])
  res.append(pref_data)
  rres += pref_data['stores']
  time.sleep(int(random.random()*5))


# with open('./tools/data.csv','w',encoding='utf-8') as f:
#     writer = csv.DictWriter(f, fieldnames=rres[0].keys())
#     writer.writeheader()
#     writer.writerows(rres)


# json_output = json.dumps(res, ensure_ascii=False, indent=4)
# with open('./tools/store_data_in_pref.json', 'w', encoding='utf-8') as f:
#     f.write(json_output)

json_output = json.dumps(rres, ensure_ascii=False, indent=4)
with open('./tools/store_data_maimai_in.json', 'w', encoding='utf-8') as f:
    f.write(json_output)
