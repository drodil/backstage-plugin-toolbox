use image::load_from_memory;
use pixo::jpeg::JpegOptions;
use pixo::png::PngOptions;
use pixo::resize::{ResizeAlgorithm, ResizeOptions, resize};
use pixo::{ColorType, jpeg, png};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init_hook() {
    console_error_panic_hook::set_once();
}
/*
#[wasm_bindgen]
pub fn convert_to_jpeg(data: &[u8], quality: u8) -> Result<Vec<u8>, JsValue> {
    // Decoder
    let img = load_from_memory(data)
        .map_err(|e| JsValue::from_str(&format!("Bild konnte nicht geladen werden: {}", e)))?;

    // Bildbearbeitung hier:



    // BUffer bauen
    let mut buffer = Vec::new();
    let mut cursor = Cursor::new(&mut buffer);


    //Encoder
    ok(buffer)
}
*/
#[wasm_bindgen]
pub fn pixo_compress(input_data: &[u8], qual: u8, imgType: &str) -> Result<Vec<u8>, JsValue> {
    let img = load_from_memory(input_data)
        .map_err(|e| JsValue::from_str(&format!("Bild konnte net gelesen werden: {}", e)))?;

    let rgb_img = img.into_rgb8();

    let w = rgb_img.width();
    let h = rgb_img.height();
    let pixels = rgb_img.into_raw(); // Das gibt uns den reinen Vec<u8> (R,G,B,R,G,B...) denke mal das sieht so aus: (255, 123, 534 .....)

    /*
    bei neuen code:

    . ./setup-dev.sh
    yarn install
    yarn dev

    */

    // Switch Marke (match)
    let output = match imgType {
        "png" => {
            web_sys::console::log_1(&"Verarbeite PNG.....".into());
            let mut qual = qual;
            if (qual < 10) {
                qual = 10;
            }
            qual = qual / 10;
            let pixo_opts = PngOptions::builder(w, h)
                .color_type(ColorType::Rgb)
                .compression_level(qual) // warum ändern devs das so???
                .build(); // ? 
            png::encode(&pixels, &pixo_opts)
                .map_err(|e| JsValue::from_str(&format!("Pixo Encoding Fehlr: {:?}", e)))?
        }
        "jpeg" => {
            let pixo_opts = JpegOptions::builder(w, h)
                .color_type(ColorType::Rgb)
                .quality(qual)
                .build();
            jpeg::encode(&pixels, &pixo_opts)
                .map_err(|e| JsValue::from_str(&format!("Pixo Encoding Fehler: {:?}", e)))?
        }

        // default ist einfach jpeg
        _ => {
            let pixo_opts = JpegOptions::builder(w, h)
                .color_type(ColorType::Rgb)
                .quality(qual)
                .build();
            jpeg::encode(&pixels, &pixo_opts)
                .map_err(|e| JsValue::from_str(&format!("Pixo Encoding Fehler: {:?}", e)))?
        }
    };

    Ok(output)
}

#[wasm_bindgen]
pub fn pixo_resize(input_data: &[u8], dst_width: u32, dst_height: u32) -> Result<Vec<u8>, JsValue> {
    let img = load_from_memory(input_data)
        .map_err(|e| JsValue::from_str(&format!("Bild konnte net gelesen werden: {}", e)))?;

    let rgb_img = img.into_rgb8();

    let w = rgb_img.width();
    let h = rgb_img.height();
    let pixels = rgb_img.into_raw();

    // do the resize with options+
    let options = ResizeOptions::builder(w, h)
        .dst(dst_width, dst_height)
        .color_type(ColorType::Rgb)
        .algorithm(ResizeAlgorithm::Lanczos3)
        .build();
    let resized_pixels = resize(&pixels, &options)
        .map_err(|e| JsValue::from_str(&format!("Resize interner Fehler: {:?}", e)))?;

    let jpeg_opts = JpegOptions::builder(dst_width, dst_height)
        .color_type(ColorType::Rgb)
        .quality(85) 
        .build();

    let final_output = jpeg::encode(&resized_pixels, &jpeg_opts)
        .map_err(|e| JsValue::from_str(&format!("Pixo Encoding Fehler nach Resize: {:?}", e)))?;

    Ok(final_output)
}
