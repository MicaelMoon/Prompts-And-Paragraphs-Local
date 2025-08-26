use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct OllamaRequest<'a> {
    model: &'a str,
    prompt: &'a str,
    stream: bool,
}

#[derive(Deserialize)]
struct OllamaResponse {
    response: String,
}

#[tauri::command]
async fn send_prompt(prompt: &str) -> Result<String, String> {
    let client = Client::new();

    let req = OllamaRequest {
        model: "mistral",
        prompt: &prompt,
        stream: false,
    };
    println!("In method");
    let resp = client
        .post("http://localhost:11434/api/generate")
        .json(&req)
        .send()
        .await
        .map_err(|err| format!("Request failed: {}", err))?;

    println!("resp client set");

    let ollama_resp: OllamaResponse = resp
        .json()
        .await
        .map_err(|err| format!("Failed to parse response: {}", err))?;

    println!("ollama_resp set");

    Ok(ollama_resp.response)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_prompt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
