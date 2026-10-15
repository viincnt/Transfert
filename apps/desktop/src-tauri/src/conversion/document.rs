use pulldown_cmark::{html, Options, Parser};

/// Text-oriented documents. No browser, external processes or network access.
pub fn convert(bytes: &[u8], source: &str, target: &str) -> Result<Vec<u8>, String> {
    let text = std::str::from_utf8(bytes)
        .map_err(|_| "Document must be UTF-8 encoded".to_string())?
        .trim_start_matches('\u{feff}');
    if !["txt", "md", "html"].contains(&source) || !["txt", "md", "html"].contains(&target) {
        return Err("Unsupported document format".into());
    }
    if source == target {
        return Err("Choose a format different from the source".into());
    }
    let body = match source {
        "html" => text.to_owned(),
        "md" => {
            let mut body = String::new();
            html::push_html(&mut body, Parser::new_ext(text, Options::all()));
            body
        }
        _ => format!("<pre>{}</pre>", escape(text)),
    };
    let result = match target {
        "html" => format!(
            "<!doctype html><html><head><meta charset=\"utf-8\"></head><body>{body}</body></html>"
        ),
        "md" => html2md::parse_html(&body),
        "txt" => html2text::from_read(body.as_bytes(), 100).map_err(|error| error.to_string())?,
        _ => unreachable!(),
    };
    Ok(result.into_bytes())
}

fn escape(text: &str) -> String {
    text.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn markdown_preserves_unicode_links_and_headings() {
        let bytes = convert(
            "# Olá 世界\n\n[Site](https://example.com)".as_bytes(),
            "md",
            "html",
        )
        .unwrap();
        let html = String::from_utf8(bytes).unwrap();
        assert!(html.contains("<h1>Olá 世界</h1>"));
        assert!(html.contains("href=\"https://example.com\""));
        let markdown = String::from_utf8(convert(html.as_bytes(), "html", "md").unwrap()).unwrap();
        assert!(markdown.contains("Olá 世界"));
        assert!(markdown.contains("https://example.com"));
    }

    #[test]
    fn plain_text_is_escaped_and_round_trips() {
        let input = "Olá <b> & mundo\nnext line";
        let html = convert(input.as_bytes(), "txt", "html").unwrap();
        assert!(String::from_utf8_lossy(&html).contains("&lt;b&gt; &amp;"));
        let text = convert(&html, "html", "txt").unwrap();
        assert_eq!(String::from_utf8(text).unwrap().trim(), input);
    }

    #[test]
    fn rejects_binary_unknown_and_same_formats() {
        assert!(convert(&[0xff], "txt", "html").is_err());
        assert!(convert(b"text", "docx", "txt").is_err());
        assert!(convert(b"text", "txt", "pdf").is_err());
        assert!(convert(b"text", "txt", "txt").is_err());
    }
}
