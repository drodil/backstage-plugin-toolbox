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

#[wasm_bindgen]
pub fn pixo_compress(input_data: &[u8], qual: u8, img_type: &str) -> Result<Vec<u8>, JsValue> {
    let img = load_from_memory(input_data)
        .map_err(|e| JsValue::from_str(&format!("Bild konnte net gelesen werden: {}", e)))?;

    let rgb_img = img.into_rgb8();

    let w = rgb_img.width();
    let h = rgb_img.height();
    let pixels = rgb_img.into_raw();

    let output = match img_type {
        "png" => {
            web_sys::console::log_1(&"Verarbeite PNG.....".into());
            let mut qual = qual;
            if qual < 10 {
                qual = 10;
            }
            qual = qual / 10;
            let pixo_opts = PngOptions::builder(w, h)
                .color_type(ColorType::Rgb)
                .compression_level(qual)
                .build();
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
pub fn pixo_resize(
    input_data: &[u8],
    resize_algorithm: &str,
    img_type: &str,
    dst_width: u32,
    dst_height: u32,
) -> Result<Vec<u8>, JsValue> {
    let img = load_from_memory(input_data)
        .map_err(|e| JsValue::from_str(&format!("Bild konnte net gelesen werden: {}", e)))?;

    let rgb_img = img.into_rgb8();

    let w = rgb_img.width();
    let h = rgb_img.height();
    let pixels = rgb_img.into_raw();

    let algorithm_enum = match resize_algorithm {
        "lanczos3" => ResizeAlgorithm::Lanczos3,
        "bilinear" => ResizeAlgorithm::Bilinear,
        "nearest" => ResizeAlgorithm::Nearest,
        _ => ResizeAlgorithm::Lanczos3,
    };

    let options = ResizeOptions::builder(w, h)
        .dst(dst_width, dst_height)
        .color_type(ColorType::Rgb)
        .algorithm(algorithm_enum)
        .build();

    web_sys::console::log_1(&format!("Ausgewählter Algorithmus: {}", resize_algorithm).into());

    let resized_pixels = resize(&pixels, &options)
        .map_err(|e| JsValue::from_str(&format!("Resize interner Fehler: {:?}", e)))?;

        let final_output;
    if img_type == "png" {

        let pixo_opts = PngOptions::builder(w, h)
            .color_type(ColorType::Rgb)
            .compression_level(6)
            .build();

        final_output = png::encode(&pixels, &pixo_opts)
            .map_err(|e| JsValue::from_str(&format!("Pixo Encoding Fehlr: {:?}", e)))?;
    } else {
        let jpeg_opts = JpegOptions::builder(dst_width, dst_height)
            .color_type(ColorType::Rgb)
            .quality(85)
            .build();

        final_output = jpeg::encode(&resized_pixels, &jpeg_opts).map_err(|e| {
            JsValue::from_str(&format!("Pixo Encoding Fehler nach Resize: {:?}", e))
        })?;
    }

    Ok(final_output)
}
