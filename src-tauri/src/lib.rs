use once_cell::sync::Lazy;
use reqwest::{Client, Response};
use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::io;
use std::sync::Mutex;

#[derive(Serialize)]
struct ChatMessage<'a> {
    role: &'a str,
    content: &'a str,
}

#[derive(Serialize)]
struct OllamaChatRequest<'a> {
    model: &'a str,
    messages: Vec<ChatMessage<'a>>,
    stream: bool,
}

#[derive(Deserialize)]
struct OllamaChatResponse {
    message: ChatMessageOwned,
}

#[derive(Deserialize)]
struct ChatMessageOwned {
    role: String,
    content: String,
}

static ChatHistory: Lazy<Mutex<Vec<&str>>> = Lazy::new(|| Mutex::new(vec![]));

#[tauri::command]
fn debug() -> Result<(), String> {
    let conn = Connection::open("mydb.sqlite").map_err(|e| e.to_string())?;
    println!("Starting database");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS items (
             id    INTEGER PRIMARY KEY AUTOINCREMENT,
             name  TEXT NOT NULL
         )",
        [],
    )
    .map_err(|e| e.to_string())?;

    add_item(&conn, "Third item").map_err(|e| e.to_string())?;
    println!("Item added");
    Ok(())
}

fn add_item(conn: &Connection, name: &str) -> rusqlite::Result<()> {
    conn.execute("INSERT INTO items (name) VALUES (?1)", params![name])?;
    Ok(())
}

fn add_message(message: &str) {
    let mut chat_history = ChatHistory.lock().unwrap();
    //chat_history.push(message.to_string());
}

fn get_text_file() -> io::Result<String> {
    let file_path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/text_files/system_instructions.txt"
    );

    let contents = fs::read_to_string(file_path);

    return contents;
}

#[tauri::command]
async fn send_prompt(prompt: &str) -> Result<String, String> {
    let client = Client::new();

    let system_instruction: String =
        get_text_file().map_err(|err| format!("Failed to read system instructions: {}", err))?;

    let req: OllamaChatRequest<'_> = OllamaChatRequest {
        model: "mistral",
        messages: vec![
            ChatMessage {
                role: "system",
                content: &system_instruction,
            },
            ChatMessage {
                role: "user",
                content: prompt,
            },
        ],
        stream: false,
    };

    println!("Sending chat request...");

    let resp: Response = client
        .post("http://localhost:11434/api/chat")
        .json(&req)
        .send()
        .await
        .map_err(|err| format!("Request failed: {}", err))?;

    let ollama_resp: OllamaChatResponse = resp
        .json()
        .await
        .map_err(|err| format!("Failed to parse response: {}", err))?;

    println!("Response received.");

    Ok(ollama_resp.message.content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_prompt, debug])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
