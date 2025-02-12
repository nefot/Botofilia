import json

import requests
from bs4 import BeautifulSoup

# Базовый URL
base_url = "https://minecraft-statistic.net/ru/server/birchcraft/top/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

players = []
page_offset = 0  # Начинаем с 0

while True:
    url = f"{base_url}{page_offset}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Ошибка при запросе страницы {url}: {response.status_code}")
        break

    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='table table-striped table-condensed table-hover')

    if not table:
        print("Данные закончились, парсинг завершен.")
        break

    rows = table.find_all('tr')[1:]  # Пропускаем заголовок
    if not rows:
        print("На этой странице больше нет данных.")
        break

    for row in rows:
        columns = row.find_all('td')

        rank = columns[0].text.strip()
        nickname = columns[2].text.strip()
        last_played = columns[3].text.strip()
        playtime = columns[4].text.strip()
        player_url = columns[2].find('a')['href']  # Получаем ссылку на профиль игрока

        # Переход на страницу игрока
        player_response = requests.get(player_url, headers=headers)
        if player_response.status_code != 200:
            print(f"Ошибка при запросе профиля {player_url}: {player_response.status_code}")
            continue

        player_soup = BeautifulSoup(player_response.text, 'html.parser')

        # Извлекаем данные со страницы игрока с проверкой наличия элементов

        last_played = str(player_soup.find('td', string='Последний раз играл(а):').find_next_sibling('td').text)
        start_date = str(player_soup.find('td', string='Дата старта статистики:').find_next_sibling('td').text)
        total_time = str(player_soup.find('div', string='Общее время').find_previous('h3').text)
        visited = str(player_soup.find('div', string='Посетил(а)').find_previous('h3').text)
        avg_per_day = str(player_soup.find('div', string='Ср. за день').find_previous('h3').text)
        account_type = str(player_soup.find('div', string='Тип аккаунта').find_previous('small').text)

        # account_type = account_type.text.strip() if account_type else "N/A"

        # Извлекаем список посещённых серверов
        server_addresses = []
        servers_section = player_soup.find('div', id='player-servers')
        if servers_section:
            server_items = servers_section.find_all('div', class_='player-servers servers-list-item lv-item media')
            for server in server_items:
                ip_tag = server.find('li', class_='copy-ip')
                if ip_tag:
                    server_address = ip_tag['data-clipboard-text']
                    server_addresses.append(server_address)

        players.append({
            'rank'            : rank,
            'nickname'        : nickname,
            'last_played'     : last_played,
            'playtime'        : playtime,
            'total_time'      : total_time,
            'servers_visited' : visited,
            'account_type'    : account_type,
            'avg_per_day'     : avg_per_day,
            'start_date'      : start_date,
            'server_addresses': server_addresses
        })

    print(f"Спарсено {len(players)} игроков. Переход на следующую страницу...")
    page_offset += 30
# Сохранение данных в JSON
with open("players.json", "w", encoding="utf-8") as f:
    json.dump(players, f, ensure_ascii=False, indent=4)

# Вывод результата
print("Данные сохранены в players.json")
