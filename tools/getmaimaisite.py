import requests
from bs4 import BeautifulSoup
import json
import re
import json

res = {
    'type': 'FeatureCollection',
    'features': []
}

def getStoreTypeFromName(name):
    if('8' in name):
        return''

def scrape_store_data_to_json(url):
    # 发起请求获取网页内容
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    pref_name = soup.select_one('.content_box > h3 > span').get_text()

    pref_data = {
        'name': pref_name,
        'stores': []
    }
    # 解析商店数据
    store_data = []
    store_list = soup.select('.store_list > li')

    for store in store_list:
        store_name = store.select_one('.store_name').get_text(strip=True)
        store_address = store.select_one('.store_address').get_text(strip=True)
        
        # 从按钮的 onclick 属性中提取地图链接和坐标
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

        # 添加到数据列表
        store_data.append({
            'store_name': store_name,
            'store_address': store_address,
            'store_map_url': store_map_url,
            'lat': lat,
            'lng': lng,
            'store_type': getStoreTypeFromName(store_name)
        })
    pref_data['stores']=store_data
    return pref_data

    

res = []

for i in range(0,47):
  url = "https://location.am-all.net/alm/location?gm=96&lang=en&ct=1000&at="+ str(i)
  store_data = scrape_store_data_to_json(url)
  print(store_data['name'])
  res.append(store_data)

# 保存为 JSON 格式
json_output = json.dumps(res, ensure_ascii=False, indent=4)
with open('store_data.json', 'w', encoding='utf-8') as f:
    f.write(json_output)
