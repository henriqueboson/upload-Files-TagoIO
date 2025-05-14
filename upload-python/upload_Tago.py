import os
import requests
import tkinter as tk
import base64
import mimetypes
from tkinter import filedialog
from dotenv import load_dotenv

# Carrega o token do .env
load_dotenv()
TAGO_TOKEN = os.getenv("TAGO_TOKEN")

def escolher_arquivo():
    root = tk.Tk()
    root.withdraw()
    return filedialog.askopenfilename(title="Selecione o arquivo para enviar à TagoIO")

def upload_file_to_tago(file_path):
    if not TAGO_TOKEN:
        print("Token não encontrado no .env (TAGO_TOKEN)")
        return

    if not file_path or not os.path.isfile(file_path):
        print("Caminho inválido ou nenhum arquivo selecionado.")
        return

    url = "https://api.tago.io/files"
    file_name = os.path.basename(file_path)

    # Lê o arquivo e codifica em Base64
    with open(file_path, "rb") as f:
        base64_content = base64.b64encode(f.read()).decode("utf-8")

    # Detecta o tipo MIME do arquivo
    content_type, _ = mimetypes.guess_type(file_path)

    # Payload no formato esperado pela TagoIO
    payload = {
        "filename": file_name,
        "file": base64_content,  # <-- Sem prefixo tipo "data:image/*;base64,"
        "content_type": content_type or "application/octet-stream",
    }

    headers = {
        "Content-Type": "application/json",
        "Account-Token": TAGO_TOKEN
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.ok:
        try:
            response_json = response.json()
            result = response_json.get("result")
            
            if isinstance(result, dict):
                print("Upload realizado com sucesso!")
                print("Nome:", result.get("filename"))
                print("URL:", result.get("url"))
            else:
                print("Upload parece ter sido feito, mas o formato da resposta não é o esperado:")
                print(response_json)
        except Exception as e:
            print("Erro ao interpretar resposta da TagoIO.")
            print(response.text)
            print("Erro:", e)
    else:
        print(f"Erro ao enviar: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    caminho = escolher_arquivo()
    upload_file_to_tago(caminho)
