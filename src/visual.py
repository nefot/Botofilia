import os
import re
import matplotlib.pyplot as plt
from datetime import datetime


def parse_log_file(file_path):
    timestamps = []
    player_counts = []

    with open(file_path, 'r', encoding='utf-8') as file:
        print(f'Читаем файл: {file_path}')
        for line in file:
            print(f'Строка: {line.strip()}')
            match = re.search(r'\[(.*?)\].*?Онлайн:\s*(\d+)/', line)
            if match:
                timestamp_str, players_online = match.groups()
                print(f'Найдено: {timestamp_str} -> {players_online}')

                timestamp = datetime.fromisoformat(timestamp_str.replace('Z', ''))
                timestamps.append(timestamp)
                player_counts.append(int(players_online))

    return timestamps, player_counts


def plot_data(timestamps, player_counts, output_file):
    plt.figure(figsize=(10, 5))
    plt.plot(timestamps, player_counts, marker='o', linestyle='-', color='b')
    plt.xlabel('Время')
    plt.ylabel('Число игроков')
    plt.title(f'Число игроков онлайн - {output_file}')
    plt.xticks(rotation=45)
    plt.grid()
    plt.savefig(output_file)
    plt.close()


def find_and_process_logs(logs_directory):
    print(f'Папка {logs_directory} найдена, содержимое:', os.listdir(logs_directory))


    for month_folder in sorted(os.listdir(logs_directory)):
        month_path = os.path.join(logs_directory, month_folder)
        if os.path.isdir(month_path):
            print(f'Обнаружена папка месяца: {month_folder}, содержимое:', os.listdir(month_path))

            for day_file in sorted(os.listdir(month_path)):
                file_path = os.path.join(month_path, day_file)
                print(f'Обрабатываем файл: {file_path}')
                if os.path.isfile(file_path):

                    timestamps, player_counts = parse_log_file(file_path)
                    print(f'Файл: {file_path}, timestamps: {timestamps}, player_counts: {player_counts}')


                    output_file = f'{month_folder}-{day_file}.png'
                    plot_data(timestamps, player_counts, output_file)
                    print(f'График сохранен: {output_file}')


logs_directory = 'logs'  # Укажите путь к корневой папке с логами
find_and_process_logs(logs_directory)