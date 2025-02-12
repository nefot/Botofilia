from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time

# Настройки для Selenium
chrome_driver_path = "путь/к/вашему/chromedriver"  # Укажите путь к chromedriver
service = Service(chrome_driver_path)
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Запуск в фоновом режиме (без открытия браузера)

# Инициализация драйвера
driver = webdriver.Chrome(service=service, options=options)

# URL страницы
url = "https://minecraft-statistic.net/ru/server/birchcraft/top/"
driver.get(url)

# Ожидание загрузки страницы
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "pagination")))


# Функция для парсинга данных на текущей странице
def parse_current_page():
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    table = soup.find('table', class_='table table-striped table-condensed table-hover')
    players = []

    for row in table.find_all('tr')[1:]:  # Пропускаем заголовок
        columns = row.find_all('td')
        rank = columns[0].text.strip()
        nickname = columns[2].text.strip()
        last_played = columns[3].text.strip()
        playtime = columns[4].text.strip()

        players.append({
            'rank'       : rank,
            'nickname'   : nickname,
            'last_played': last_played,
            'playtime'   : playtime
        })

    return players


# Список для хранения всех данных
all_players = []

# Основной цикл для перебора вкладок
while True:
    # Парсим текущую страницу
    current_players = parse_current_page()
    all_players.extend(current_players)

    # Находим кнопку "Следующая"
    pagination = driver.find_element(By.CLASS_NAME, "pagination")
    next_button = pagination.find_element(By.XPATH, ".//li/a[text()='»']")

    # Проверяем, активна ли кнопка "Следующая"
    if "disabled" in next_button.get_attribute("class"):
        break  # Если кнопка неактивна, завершаем цикл

    # Нажимаем на кнопку "Следующая"
    next_button.click()

    # Ожидание загрузки новой страницы
    time.sleep(2)  # Даем время для загрузки данных
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "pagination")))

# Закрываем браузер
driver.quit()

# Выводим результат
for player in all_players:
    print(player)

print(f"Всего собрано данных: {len(all_players)}")